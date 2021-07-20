import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PercentageFeed } from '../models/percentage-feed-modal';

@Injectable({
  providedIn: 'root'
})
export class PercentageFeedingService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchPercentageFeedings(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/PercentageFeeding-management/details`;
    return this.http.get(url);
  }

  fetchPercentageFeedingDataById(pfId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/PercentageFeeding-management/${pfId}`;
    return this.http.get(url);
  }

  savePercentageFeeding(percentageFeedingData: PercentageFeed): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/PercentageFeeding-management/create`;
    return this.http.post(url, percentageFeedingData)
  }

  updatePercentageFeeding(percentageFeedingData: PercentageFeed): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/PercentageFeeding-management/update`;
    return this.http.put(url, percentageFeedingData)
  }

  deletePercentageFeeding(percentageFeedingData: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/PercentageFeeding-management/delete`;
    return this.http.post(url, percentageFeedingData)
  }
}
