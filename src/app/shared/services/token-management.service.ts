import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

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

  getDecodedUserToken = (): any => {
    const token = this.getItem();
    if (token) {
      return jwt_decode(token.toString());
    }
    return "";
  }

  getTokenExpirationDate = (): Date | null => {
    const tokenResult: any = this.getDecodedUserToken();

    if (tokenResult.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(tokenResult.exp);
    return date;
  }

  isTokenExpired = (token?: string): boolean => {
    const date = this.getTokenExpirationDate();
    if (date) {
      return !(date.valueOf() > new Date().valueOf());
    }
    return false;
  }

}
