import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { loginUserModel, userModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/get-all`;
    return this.http.get(url);
  }

  authenticateUser(user: loginUserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-in`;
    return this.http.post(url, user);
  }

  registerUser(userData: userModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-up`;
    return this.http.post(url, userData)
  }

  resetPassword(userData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/change-password`;
    return this.http.post(url, userData)
  }
}
