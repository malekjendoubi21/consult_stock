// login.component.ts
import { Component } from '@angular/core';
import { AdminService, LoginAdminDto } from '../../services/admin.service';  // ajuste le chemin
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData: LoginAdminDto = {
    login: '',
    motDePasse: ''
  };

  constructor(private adminService: AdminService, private router: Router) {}

  onLogin() {
    this.adminService.login(this.loginData).subscribe({
      next: (res) => {
        // Sauvegarder token
        this.adminService.saveToken(res.token);
        // Rediriger vers page protégée
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        alert(err.error.message || 'Erreur de connexion');
      }
    });
  }
}
