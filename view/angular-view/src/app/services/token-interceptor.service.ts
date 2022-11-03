import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import {AuthService} from './auth.service'


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: any, next: any) {
    const token = this.authService.getToken();
    let tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token?.access}`
      }
    });
    if (token) {
      return next.handle(tokenizeReq)
    }
    return next.handle(req);
  }

}