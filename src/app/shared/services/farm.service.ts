import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clubMemberModel } from '../models/club-member-model';
import { farmModel } from '../models/farm-model';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchFarms(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }

  fetchFarmByOwnerId(ownerId: number): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`+ ownerId;
    return this.http.get(url);
  }

  saveFarm(farmData: farmModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, farmData)
  }

  deleteFarms(farmIds: number): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.delete(url)
  }
}
