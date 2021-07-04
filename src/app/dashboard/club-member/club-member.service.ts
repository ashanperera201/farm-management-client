import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubMemberService {

  serviceUrl!: string;
  constructor(private http: HttpClient) { }

  fetchClubMembers(): Observable<any> {
    this.serviceUrl = '';
    return this.http.get(this.serviceUrl);
  }

  saveClubMember(userData: any): Observable<any> {
    this.serviceUrl = '';
    return this.http.post(this.serviceUrl, userData)
  }
}
