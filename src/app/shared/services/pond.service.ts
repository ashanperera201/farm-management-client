import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { pondModel } from '../models/pond-model';

@Injectable({
  providedIn: 'root'
})
export class PondService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchPonds(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }

  savePond(pondData: pondModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, pondData)
  }

  deletePonds(pondData: pondModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, pondData)
  }
}
