import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApplicationModel } from '../models/application-model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchApplications(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }

  saveApplication(applicationData: ApplicationModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, applicationData)
  }

  deleteApplications(applicationData: ApplicationModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, applicationData)
  }
}
