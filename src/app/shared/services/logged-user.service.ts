import { Injectable } from '@angular/core';
import { TokenManagementService } from './token-management.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  constructor(private tokenManagementService: TokenManagementService) { }

  isUserLoggedIn = (): boolean => {
    return !!this.tokenManagementService.getItem();
  }

}
