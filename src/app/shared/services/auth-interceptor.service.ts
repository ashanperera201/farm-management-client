import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenManagementService } from './token-management.service';
import { LoggedUserService } from './logged-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private tokenManagementService: TokenManagementService, private router: Router, private loggedUserService: LoggedUserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = this.tokenManagementService.getItem();
    const isExpired: boolean = this.tokenManagementService.isTokenExpired();
    const userId: any = this.loggedUserService.getLoggedUserId();
    if (token) {
      if (isExpired) {
        this.router.navigate(['/auth'])
      } else {
        let headers = new HttpHeaders();
        headers.append('Authorization', `Bearer ${token}`);
        headers.append('x-user', '')
        headers.append('x-client', '')
        headers.append('x-country', '')

        request = request.clone({
          headers: request.headers
            .set('Authorization', `Bearer ${token}`)
            //TODO : NEEDS TO GET THESE FROM LOG USER SERVICE.
            .set('x-user', userId)
            .set('x-client', `ashan`)
            .set('x-country', `ashan`)
        });
      }
    } else {
      request = request.clone({
        headers: request.headers
          //TODO : NEEDS TO GET THESE FROM LOG USER SERVICE.
          .set('x-client', userId)
          .set('x-country', `ashan`),
      });
    }
    return next.handle(request);
  }

}
