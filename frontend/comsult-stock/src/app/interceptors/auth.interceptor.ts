import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Récupère ton JWT
    if (token) {
        console.log('Interceptor token:', token, 'URL:', req.url); // <-- debug

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
        
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
