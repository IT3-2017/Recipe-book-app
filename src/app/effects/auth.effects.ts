import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../auth/user.model';
import { AuthService } from '../services/auth.service';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('user', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    id: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
};
const handleError = (errorRes: any) => {
  let errorMessage = 'Unknown error occured!';

  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage)); //ne smemo da bacimo gresku vec vracamo Observable preko OF opertora
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists in database!';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid password! Please enter the right password!';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist! Please enter existing email!';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffect {
  @Effect()
  authSignUp = this.actions.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signUpAction: AuthActions.SignUpStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            environment.firebaseAPIKey,
          {
            email: signUpAction.payload.email,
            password: signUpAction.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            this.authService.autoLogout(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            ); //of operater vraca observable koji nema gresku
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions.pipe(
    //ovo vraca observable na koji ce sam ngrx da vodi racuna o pretplati
    ofType(AuthActions.LOGIN_START), //na koji tip akcije ili efekta hocemo da reagujemo i u ovaj pipe nastavljamo ako je prepoznata ta akcija kao pozvana (koje akcije startuju ovaj efekat, moguce je unos niza akcija ne samo jedne)
    switchMap((authData: AuthActions.LoginStart) => {
      //switch vraca oni observable
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
            environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) => {
            this.authService.autoLogout(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            ); //of operater vraca observable koji nema gresku
          }),
          catchError((errorRes) => {
            return handleError(errorRes); //ne smemo da bacimo gresku vec vracamo Observable preko OF opertora
          })
        ); //map izvrsavamo ako nema greske a drugi operator hvata gresku
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authRedirectState: AuthActions.AuthenticateSuccess) => {
      if(authRedirectState.payload.redirect){
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({ dispatch: false })
  autoLogin = this.actions.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const dataUser: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: Date;
      } = JSON.parse(localStorage.getItem('user'));

      if (!dataUser) {
        return { type: 'Dummy' };
      }

      const loadedUser = new User(
        dataUser.email,
        dataUser.id,
        dataUser._token,
        new Date(dataUser._tokenExpirationDate)
      );

      if (loadedUser.token) {
        const expirationDuration =
          new Date(dataUser._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.autoLogout(expirationDuration);
        //this.user.next(loadedUser); *
        return new AuthActions.AuthenticateSuccess({
          email: dataUser.email,
          id: dataUser.id,
          token: dataUser._token,
          expirationDate: new Date(dataUser._tokenExpirationDate),
          redirect: false
        });

        // this.autoLogout(expirationDuration);*
      }
      return { type: 'Dummy' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('user');
      this.router.navigate(['/auth']);
    })
  );
  constructor(
    private actions: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
