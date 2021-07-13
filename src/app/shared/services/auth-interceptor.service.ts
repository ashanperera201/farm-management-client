import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenManagementService } from './token-management.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private tokenManagementService: TokenManagementService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = this.tokenManagementService.getItem();
    if (token) {

      let headers = new HttpHeaders();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('x-user', '')
      headers.append('x-client', '')
      headers.append('x-country', '')

      request = request.clone({
        headers: request.headers
          .set('Authorization', `Bearer ${token}`)
          //TODO : NEEDS TO GET THESE FROM LOG USER SERVICE.
          .set('x-user', `ashan`)
          .set('x-client', `ashan`)
          .set('x-country', `ashan`),
        // setHeaders: {
        //   Authorization: `Bearer ${token}`
        // }
      });
    }
    return next.handle(request);
  }

}
