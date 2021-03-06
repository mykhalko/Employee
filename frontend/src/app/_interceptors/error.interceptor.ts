import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../_services';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor (private authService: AuthService) { }

  intercept (request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    return handler.handle(request).pipe(catchError(err => {
      if ( err.status === 401 ) {
        this.authService.logout();
        location.reload(true);
      }

      const error = err.error || err.statusText;
      return throwError(error);
    }));
  }
}
