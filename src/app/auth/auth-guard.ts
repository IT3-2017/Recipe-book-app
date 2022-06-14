import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

import { AuthService } from '../services/auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean> {
    return this.store.select('auth').pipe(
    //return this.authService.user.pipe( *
      take(1), //ovaj Observable moze da vrati vise usera a nama samo treba poslednji pa koristimo take opertor da vrati trenutnog user-a
      map( stateData =>{ //isto dodato za ngrx
        return stateData.user;
      }), 
      map((user) => {
        const isAuth = !!user; // vraca false za null ili undefined a za dobijen objekat vraca true
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
