import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthIntercepterService implements HttpInterceptor{

    constructor(private authService: AuthService, private store: Store<fromApp.AppState>){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(
        //return this.authService.user.pipe(*
            take(1),
            map(authState => {
                return authState.user;
            }), //dodato za ngrx
            exhaustMap(user => {
                if(!user){
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token!)
                })
                return next.handle(modifiedReq);
            }));
        
    }

}