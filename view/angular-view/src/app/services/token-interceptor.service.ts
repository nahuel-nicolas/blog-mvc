import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import {AuthService} from './auth.service'
import { HttpErrorResponse } from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  refresh = false;

  constructor(
    private authService: AuthService,
  ) { }

  intercept(req: any, next: any) {
    const token = this.authService.getToken();
    if (token) {

      const tokenizeReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.access}`
        }
      });

      return next.handle(tokenizeReq).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.refresh) {
          this.refresh = true;

          return this.authService.getRefreshedToken(token.refresh).pipe(switchMap(newToken => {
            localStorage.setItem('token', JSON.stringify(newToken));

            return next.handle(req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken.access}`
              }
            }));

          }));
        }

        this.refresh = false;
        return throwError(() => err);
      }));
    }
    return next.handle(req);
  }

}