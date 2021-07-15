import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenManagementService } from '../shared/services/token-management.service';

@Injectable({
    providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

    constructor(private tokenManagementService: TokenManagementService, private router: Router) {
    }

    canActivate(): Observable<boolean> {
        return new Observable(obs => {
            const isAuthenticated = !!this.tokenManagementService.getItem();
            const isExpired: boolean = this.tokenManagementService.isTokenExpired();

            if (isAuthenticated && !isExpired) {
                obs.next(true);
                obs.complete();
            } else {
                this.tokenManagementService.removeTokenItem();
                this.router.navigate(['/auth/login']);
                obs.next(false);
                obs.complete();
            }
        })
    }
}
