import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../actions/auth.actions';

import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from '../auth/user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  //user = new BehaviorSubject<User>(null);* //slicno obicnom Subject samo sto vraca poslednju vrednost eventa iako se mozda nisamo pretplatili na emitovanje
  private tokenExpirationTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

/*   signUp(email: string, password: string) { //bez ngrx
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErorr),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErorr),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  } */

  logout() {
    //this.user.next(null); *
    this.store.dispatch(new AuthActions.Logout());

    localStorage.removeItem('user');
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }
    this.tokenExpirationTimeout = null;
    //this.router.navigate(['/auth']);*
  }

 /*  autoLogin() { OVO JE BEZ NGRX
    const dataUser: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('user'));
    const loadedUser = new User(
      dataUser.email,
      dataUser.id,
      dataUser._token,
      new Date(dataUser._tokenExpirationDate)
    );

    if (loadedUser.token) {
      //this.user.next(loadedUser); *
      this.store.dispatch(
        new AuthActions.AuthenticateSuccess({
          email: dataUser.email,
          id: dataUser.id,
          token: dataUser._token,
          expirationDate: new Date(dataUser._tokenExpirationDate)
        })
      );
      const expirationDuration =
        new Date(dataUser._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  } */

  autoLogout(expirationDuration: number) {
    //ocekuje koliko milisekundi jos traje token i automatski treba da obrise podatke kada istekne vazenje tokena
    this.tokenExpirationTimeout = setTimeout(() => {
      //this.logout(); *
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
      this.tokenExpirationTimeout = null;
    }
  }

/*   private handleErorr(errorRes: HttpErrorResponse) { //*bez ngrx
    let errorMessage = 'Unknown error occured!';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists in database!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password! Please enter the right password!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage =
          'This email does not exist! Please enter existing email!';
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    localStorage.setItem('user', JSON.stringify(user));
    //this.user.next(user); * //svuda gde napravimo/dobijemo novog usera moramo da merimo vreme => svuda gde se EMITUJE novi user
    this.store.dispatch(
      new AuthActions.AuthenticateSuccess({
        email: email,
        id: id,
        token: token,
        expirationDate: expirationDate,
        redirect:false
      })
    );
    this.autoLogout(expiresIn * 1000); //kako bismo znali kada ce prestati da vazi token i automatski ga izlogovati
  } */
}
