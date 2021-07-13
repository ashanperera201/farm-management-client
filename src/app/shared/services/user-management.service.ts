import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchUserList(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/get-all`;
    return this.http.get(url);
  }

  fetchRoleList(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/get-all`;
    return this.http.get(url);
  }

  addRole(roleData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/create`;
    return this.http.post(url, roleData)
  }

  addUser(userData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-up`;
    return this.http.post(url, userData)
  }

  fetchUserPermission(userId: number): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/permission/get-all`;
    return this.http.get(url);
  }

  saveUserPermission(permission: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/permission/create`;
    return this.http.post(url, permission);
  }
}
