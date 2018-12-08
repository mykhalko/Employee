import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = '/api/token-auth';
  private refreshTokenUrl = '/api/token-refresh';
  private currentAuthSubject: BehaviorSubject<Auth>;
  public currentAuth: Observable<Auth>;

  constructor (private http: HttpClient ) {
    this.currentAuthSubject = new BehaviorSubject<Auth>(
      JSON.parse(localStorage.getItem('currentAuth')));
    this.currentAuth = this.currentAuthSubject.asObservable();
    this.setUpForDebug();
  }

  public get currentAuthValue(): Auth {
    return this.currentAuthSubject.value;
  }

  login (username: string, password: string) {
    return this.http.post<any>(this.authUrl, {username, password})
      .pipe(map(body => {
        if ( body && body.token ) {
          const token_parts = body.token.split('.');
          const decoded_data = JSON.parse(window.atob(token_parts[1]));
          const auth: Auth = {
            username: decoded_data.username,
            token_expiration: new Date(decoded_data.exp * 1000),
            token: body.token
          };
          localStorage.setItem('currentAuth', JSON.stringify(auth));
          this.currentAuthSubject.next(auth);
          return body;
        }
      }));
  }

  logout () {
    localStorage.removeItem('currentAuth');
    this.currentAuthSubject.next(null);
  }

  private setUpForDebug() {
    const domain = 'http://localhost:8000';
    this.authUrl = domain + this.authUrl;
    this.refreshTokenUrl = domain + this.refreshTokenUrl;
  }
}
