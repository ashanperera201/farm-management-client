import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenManagementService } from './token-management.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  private userDetails!: any;
  private userId!: string;

  constructor(private tokenManagementService: TokenManagementService, private router: Router) { }

  setUserDetails = (userDetails: any) => {
    this.userDetails = userDetails;
  }

  setUserId = (userId: string) => {
    localStorage.removeItem('userId')
    this.userId = userId;
    localStorage.setItem('userId', this.userId);
  }

  getUserRoles = (): string[] => {
    let roles: string[] = [];
    if (this.userDetails) {
      roles = this.userDetails.roles.map((x: any) => x.roleCode);
    }
    return roles;
  }

  getLoggedUserId = () => {
    const userIdRef = localStorage.getItem('userId');
    return userIdRef ?  userIdRef : 'e5038865-ee47-480a-8535-a7e8fe6fdd6f';
  }

  isUserLoggedIn = (): boolean => {
    return !!this.tokenManagementService.getItem();
  }

  signOut = () => {
    this.tokenManagementService.removeTokenItem();
    this.router.navigate(['/auth'])
  }

}
