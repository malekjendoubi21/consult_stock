import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vérifier d'abord le token admin, puis le token vendeur
    const adminToken = localStorage.getItem('adminToken');
    const vendeurToken = localStorage.getItem('token');
    const token = adminToken || vendeurToken;
    
    if (token) {
      console.log('Interceptor token trouvé:', token ? 'OUI' : 'NON', 'Type:', adminToken ? 'admin' : 'vendeur', 'URL:', req.url);

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    console.log('Interceptor: Aucun token trouvé pour', req.url);
    return next.handle(req);
  }
}
