import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenManagementService } from './token-management.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  constructor(private tokenManagementService: TokenManagementService, private router: Router) { }

  isUserLoggedIn = (): boolean => {
    return !!this.tokenManagementService.getItem();
  }

  signOut = () => {
    this.tokenManagementService.removeTokenItem();
    this.router.navigate(['/auth'])
  }

}
