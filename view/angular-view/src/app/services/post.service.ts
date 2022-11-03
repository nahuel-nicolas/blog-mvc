import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { post_api_url } from '../settings';
import { MessageService } from './message.service';
import { ErrorHandlerService } from './handle-error.service';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  /** GET posts from the server */
  getPosts(): Observable<Post[]> {
    console.log('nba')
    console.log(post_api_url)
    return this.http.get<Post[]>(post_api_url)
      .pipe(
        tap(_ => this.messageService.log('fetched posts')),
        catchError(this.errorHandlerService.handler<Post[]>('getPosts', []))
      );
  }

  /** GET post by id. Will 404 if id not found */
  getPost(id: number): Observable<Post> {
    const url = `${post_api_url}/${id}`;
    return this.http.get<Post>(url).pipe(
      tap(_ => this.messageService.log(`fetched post id=${id}`)),
      catchError(this.errorHandlerService.handler<Post>(`getPost id=${id}`))
    );
  }

  // /** GET post by id. Return `undefined` when id not found */
  // getPostNo404<Data>(id: number): Observable<Post> {
  //   const url = `${this.postesUrl}/?id=${id}`;
  //   return this.http.get<Post[]>(url)
  //     .pipe(
  //       map(postes => postes[0]), // returns a {0|1} element array
  //       tap(h => {
  //         const outcome = h ? 'fetched' : 'did not find';
  //         this.log(`${outcome} post id=${id}`);
  //       }),
  //       catchError(this.handleError<Post>(`getPost id=${id}`))
  //     );
  // }

  // /* GET postes whose name contains search term */
  // searchPostes(term: string): Observable<Post[]> {
  //   if (!term.trim()) {
  //     // if not search term, return empty post array.
  //     return of([]);
  //   }
  //   return this.http.get<Post[]>(`${this.postesUrl}/?name=${term}`).pipe(
  //     tap(x => x.length ?
  //        this.log(`found postes matching "${term}"`) :
  //        this.log(`no postes matching "${term}"`)),
  //     catchError(this.handleError<Post[]>('searchPostes', []))
  //   );
  // }

  //////// Save methods //////////

  /** POST: add a new post to the server */
  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(post_api_url, post, this.httpOptions).pipe(
      tap((newPost: Post) => this.messageService.log(`added post w/ id=${newPost._id}`)),
      catchError(this.errorHandlerService.handler<Post>('addPost'))
    );
  }

  /** DELETE: delete the post from the server */
  deletePost(id: number): Observable<Post> {
    const url = `${post_api_url}/${id}`;

    return this.http.delete<Post>(url, this.httpOptions).pipe(
      tap(_ => this.messageService.log(`deleted post id=${id}`)),
      catchError(this.errorHandlerService.handler<Post>('deletePost'))
    );
  }

  /** PUT: update the post on the server */
  updatePost(post: Post): Observable<any> {
    return this.http.put(post_api_url, post, this.httpOptions).pipe(
      tap(_ => this.messageService.log(`updated post id=${post._id}`)),
      catchError(this.errorHandlerService.handler<any>('updatePost'))
    );
  }
}
