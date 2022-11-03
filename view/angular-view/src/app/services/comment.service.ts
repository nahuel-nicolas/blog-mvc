import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { comment_api_url } from '../settings';
import { MessageService } from './message.service';
import { ErrorHandlerService } from './handle-error.service';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  /** GET comments from the server */
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(comment_api_url)
      .pipe(
        tap(_ => this.messageService.log('fetched comments')),
        catchError(this.errorHandlerService.handler<Comment[]>('getComments', []))
      );
  }

  /** GET comment by id. Will 404 if id not found */
  getComment(id: number): Observable<Comment> {
    const url = `${comment_api_url}/${id}`;
    return this.http.get<Comment>(url).pipe(
      tap(_ => this.messageService.log(`fetched comment id=${id}`)),
      catchError(this.errorHandlerService.handler<Comment>(`getComment id=${id}`))
    );
  }

  /** POST: add a new comment to the server */
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(comment_api_url, comment, this.httpOptions).pipe(
      tap((newComment: Comment) => this.messageService.log(`added comment w/ id=${newComment._id}`)),
      catchError(this.errorHandlerService.handler<Comment>('addComment'))
    );
  }

  /** DELETE: delete the comment from the server */
  deleteComment(id: number): Observable<Comment> {
    const url = `${comment_api_url}/${id}`;

    return this.http.delete<Comment>(url, this.httpOptions).pipe(
      tap(_ => this.messageService.log(`deleted comment id=${id}`)),
      catchError(this.errorHandlerService.handler<Comment>('deleteComment'))
    );
  }

  /** PUT: update the comment on the server */
  updateComment(comment: Comment): Observable<any> {
    return this.http.put(comment_api_url, comment, this.httpOptions).pipe(
      tap(_ => this.messageService.log(`updated comment id=${comment._id}`)),
      catchError(this.errorHandlerService.handler<any>('updateComment'))
    );
  }
}
