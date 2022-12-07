import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { register_user_api_url, login_user_and_get_token_api_url, refresh_token_api_url } from '../settings';
import { Token } from '../interfaces/token.interface';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  signUpUser(user: User): Observable<User> {
    return this.http.post<User>(register_user_api_url, user);
  }

  signInUser(user: User): Observable<Token> {
    return this.http.post<Token>(login_user_and_get_token_api_url, user);
  }

  getRefreshedToken(refresh: String): Observable<Token> {
    return this.http.post<Token>(refresh_token_api_url, {refresh});
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  getTokenData(): string | null {
    const tokenData = localStorage.getItem('token');
    return tokenData === 'undefined' ? null : tokenData;
  }

  getToken(): Token | null {
    const tokenData = this.getTokenData();
    return tokenData ? JSON.parse(tokenData) : null;
  }

  getUserId(): string | null {
    const tokenData = this.getTokenData();
    if (tokenData) {
      const jwt_object: any = jwt_decode(tokenData);
      return jwt_object.user_id;
    }
    return null;
  }

}
