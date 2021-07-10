import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { feedBandModel } from '../models/feed-brand-model';

@Injectable({
  providedIn: 'root'
})
export class FeedBrandService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchFeedBands(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }

  saveFeedBand(feedBandData: feedBandModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, feedBandData)
  }

  deleteFeedBands(feedBandData: feedBandModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, feedBandData)
  }
}