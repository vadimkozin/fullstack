import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OwerviewPage, AnalyticsPage } from "../interfaces";

@Injectable({
    providedIn : 'root'
})
export class AnalyticsService  {
    constructor(private http: HttpClient) {}

    getOverview(): Observable<OwerviewPage> {
        return this.http.get<OwerviewPage>('/api/analytics/overview')
    }

    getAnalytics(): Observable<AnalyticsPage> {
        return this.http.get<AnalyticsPage>('/api/analytics/analytics')
    }
}