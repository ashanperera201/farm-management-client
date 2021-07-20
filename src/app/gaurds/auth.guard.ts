import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenManagementService } from '../shared/services/token-management.service';
import { UserManagementService } from '../shared/services/user-management.service';
import { Store } from '@ngrx/store';
import { AppState, setUserInformation } from '../redux'

@Injectable({
    providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

    constructor(
        private tokenManagementService: TokenManagementService,
        private router: Router,
        private store: Store<AppState>,
        private userManagementService: UserManagementService) {
    }

    canActivate(): Observable<boolean> {
        return new Observable(obs => {
            const userId = this.tokenManagementService.getUserId();
            if (userId) {
                this.proceedUserAuth(obs, userId);
            } else {
                this.router.navigate(['/auth/login']);
                obs.next(false);
                obs.complete();
            }
        })
    }

    proceedUserAuth = (obs: any, userId: string) => {
        const isAuthenticated = !!this.tokenManagementService.getItem();
        const isExpired: boolean = this.tokenManagementService.isTokenExpired();

        if (isAuthenticated && !isExpired) {
            this.userManagementService.fetchUser(userId).subscribe((userResult: any) => {
                if (userResult && userResult.validity) {
                    const userDetails: any = userResult.result[0];
                    this.store.dispatch(setUserInformation(userDetails));
                    obs.next(true);
                    obs.complete();
                }
            }, () => {
                console.log("Failed load user.");
                obs.next(false);
                obs.error();
                obs.complete();
            });
        } else {
            this.tokenManagementService.removeTokenItem();
            this.router.navigate(['/auth/login']);
            obs.next(false);
            obs.complete();
        }
    }
}
