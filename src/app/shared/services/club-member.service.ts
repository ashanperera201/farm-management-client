import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clubMemberModel } from '../models/club-member-model';

@Injectable({
  providedIn: 'root'
})
export class ClubMemberService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchClubMembers(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.get(url);
  }

  saveClubMember(clubMemberData: clubMemberModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.post(url, clubMemberData)
  }

  
  deleteClubMember(memberIds: number): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/`;
    return this.http.delete(url)
  }
}
