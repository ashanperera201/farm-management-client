import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  getUserList(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }

  getRoleList(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }

  addUser(userData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, userData)
  }

  addRole(roleData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, roleData)
  }

  getUserPermission(userId : number): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }
  
  saveUserPermission(permission : any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, permission);
  }
}
