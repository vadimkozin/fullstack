import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { User } from "../interfaces";

@Injectable({
    providedIn: 'root'// ангуляр сам зарегистрирует этот сервис в корневом модуле
})
export class AuthService {

    private token = null

    constructor (private http: HttpClient) {

    }

    register(user: User): Observable<{token: string}> {
        return this.http.post<{token: string}>('/api/auth/register', user)


    }

    login(user: User): Observable<{token: string}> {
        return this.http.post<{token: string}>('/api/auth/login', user)
            .pipe(
                tap(({token}) => {
                    localStorage.setItem('auth-token', token)
                    this.setToken(token)
                    }
                )
            )
    }

    setToken(token: string) {
        this.token = token
    }

    getToken(): string {
        return this.token
    }

    isAuthenticated(): boolean {
        return <boolean>this.token
    }

    logout() {
        this.setToken(null)
        localStorage.clear()
    }

}
