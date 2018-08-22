import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OwerviewPage } from "../interfaces";

@Injectable({
    providedIn : 'root'
})
export class AnalyticsService  {
    constructor(private http: HttpClient) {}

    getOverview(): Observable<OwerviewPage> {
        return this.http.get<OwerviewPage>('/api/analytics/overview')
    }

    getAnalytics() {
        //return this.http.get<Owerview>('/api/analytics/analytics')
    }
}