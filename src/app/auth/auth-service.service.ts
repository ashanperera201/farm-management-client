import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serviceUrl!: string;

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<any> {
    this.serviceUrl = '';
    return this.http.get(this.serviceUrl);
  }

  loginUser(user: any): Observable<any> {
    this.serviceUrl = '';
    return this.http.post(this.serviceUrl, user);
  }

  registerUser(userData: any): Observable<any> {
    this.serviceUrl = '';
    return this.http.post(this.serviceUrl, userData)
  }
}
