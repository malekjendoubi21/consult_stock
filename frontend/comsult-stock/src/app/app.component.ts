import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'consult-stock';

  constructor(private router: Router) {}

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin') && !this.router.url.startsWith('/admin/login');
  }

  isAdminLogin(): boolean {
    return this.router.url.startsWith('/admin/login');
  }
  isAuthRoute(): boolean {
    return this.router.url.startsWith('/admin/login') || this.router.url.startsWith('/auth');
  }

}
