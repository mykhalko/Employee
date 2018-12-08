import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor ( private authService: AuthService ) {}

  intercept (request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    const currentAuth = this.authService.currentAuthValue;
    if ( currentAuth && currentAuth.token ) {
      request = request.clone({
        setHeaders: {
          Authorization: 'JWT ' + currentAuth.token
        }
      });
    }
    return handler.handle(request);
  }
}
