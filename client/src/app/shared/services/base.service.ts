import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../interfaces";

@Injectable({
    providedIn: 'root'
})
export class BaseService {
 
    constructor (private http: HttpClient) {}

    getUsers(): Observable <User[]> {
        return this.http.get<User[]>('/api/users')
    }

}