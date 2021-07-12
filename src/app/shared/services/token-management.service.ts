import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenManagementService {

  constructor() { }

  storeToken = (token: string) => {
    localStorage.setItem('access_token', token);
  }

  getItem = () => {
    return localStorage.getItem('access_token');
  }

  removeTokenItem = () => { 
    localStorage.removeItem('access_token');
  }

}
