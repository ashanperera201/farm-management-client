import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  serviceUrl!: string;
  constructor(private http: HttpClient) { }

  getUserList(): Observable<any> {
    this.serviceUrl = '';
    return this.http.get(this.serviceUrl);
  }

  getRoleList(): Observable<any> {
    this.serviceUrl = '';
    return this.http.get(this.serviceUrl);
  }

  addUser(userData: any): Observable<any> {
    this.serviceUrl = '';
    return this.http.post(this.serviceUrl, userData)
  }

  addRole(roleData: any): Observable<any> {
    this.serviceUrl = '';
    return this.http.post(this.serviceUrl, roleData)
  }

  getUserPermission(userId : number): Observable<any> {
    this.serviceUrl = '';
    return this.http.get(this.serviceUrl);
  }
}
