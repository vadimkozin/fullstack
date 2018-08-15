import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterseptor implements HttpInterceptor {

    constructor(private auth: AuthService, 
                private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.isAuthenticated()) {
            req = req.clone({
                setHeaders: {
                    Authorization: this.auth.getToken()
                }
            })
        }
        // идея в том, что мы не заканчиваем запрос, а продолжаем цепочку стримов в rxjs
        return next.handle(req).pipe(
           catchError(
               (error: HttpErrorResponse) => this.handleAuthError(error)
           )
        )
    }

    private handleAuthError(error: HttpErrorResponse): Observable<any> {
        if (error.status === 401) { // 401=Не авторизован (не имеет токен или токен неверный )
            this.router.navigate(['/login'], {
                queryParams: {
                    sessionFailed: true
                }
            })
        }
        
        return throwError(error)    // создаёт Observable ошибку из ошибки error
    }
}