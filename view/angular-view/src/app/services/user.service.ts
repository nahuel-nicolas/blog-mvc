import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { api_url } from '../settings';
import { MessageService } from './message.service';
import { ErrorHandlerService } from './handle-error.service';
import { User } from '../interfaces/user.interface';
import { Users } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user_api_url = api_url + 'authentication/user/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  /** GET users from the server */
  getUsers(): Observable<Users> {
    return this.http.get<Users>(this.user_api_url)
      .pipe(
        tap(_ => this.messageService.log('fetched users')),
        catchError(this.errorHandlerService.handler<Users>('getUsers', {}))
      );
  }

  /** GET user by id. Will 404 if id not found */
  getUser(id: String): Observable<User> {
    const url = this.user_api_url + id + '/';
    return this.http.get<User>(url).pipe(
      tap(_ => this.messageService.log(`fetched user id=${id}`)),
      catchError(this.errorHandlerService.handler<User>(`getUser id=${id}`))
    );
  }

  /** POST: add a new user to the server */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.user_api_url, user, this.httpOptions).pipe(
      tap((newUser: User) => this.messageService.log(`added user w/ id=${newUser.id}`)),
      catchError(this.errorHandlerService.handler<User>('addUser'))
    );
  }

  /** DELETE: delete the user from the server */
  deleteUser(id: number): Observable<User> {
    const url = `${this.user_api_url}/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.messageService.log(`deleted user id=${id}`)),
      catchError(this.errorHandlerService.handler<User>('deleteUser'))
    );
  }

  /** PUT: update the user on the server */
  updateUser(user: User): Observable<any> {
    return this.http.put(this.user_api_url, user, this.httpOptions).pipe(
      tap(_ => this.messageService.log(`updated user id=${user.id}`)),
      catchError(this.errorHandlerService.handler<any>('updateUser'))
    );
  }
}
