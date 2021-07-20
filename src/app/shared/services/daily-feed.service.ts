import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DailyFeedModel } from '../models/daily-feed-model';

@Injectable({
  providedIn: 'root'
})
export class DailyFeedService {


  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchDailyFeeds(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/daily-feed-management/details`;
    return this.http.get(url);
  }

  fetchDailyFeedDataById(pfId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/daily-feed-management/${pfId}`;
    return this.http.get(url);
  }

  saveDailyFeed(percentageFeedingData: DailyFeedModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/daily-feed-management/create`;
    return this.http.post(url, percentageFeedingData)
  }

  updateDailyFeed(percentageFeedingData: DailyFeedModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/daily-feed-management/update`;
    return this.http.put(url, percentageFeedingData)
  }

  deleteDailyFeed(dailyFeedIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/daily-feed-management/delete`;
    return this.http.post(url, dailyFeedIds)
  }
}
