import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthService } from "../Services/auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{

    constructor(private _authService:AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this._authService.user.pipe(
            take(1),
            exhaustMap((user)=>{
                console.log('Interceptor: ',user)
                if(!user){
                    return next.handle(req)
                }
                const modifiedreq= req.clone({
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedreq);
            })
            )
            
    }

}