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
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Données de login:', this.loginData);
    
    this.adminService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login réussi, réponse:', res);
        
        // Sauvegarder token
        this.adminService.saveToken(res.token);
        console.log('Token sauvé sous adminToken');
        
        // Vérifier que le token a bien été sauvé
        const savedToken = localStorage.getItem('adminToken');
        console.log('Token récupéré après sauvegarde:', savedToken ? 'OUI' : 'NON');
        
        // Rediriger vers page protégée
        console.log('Tentative de redirection vers /admin/dashboard');
        this.router.navigate(['/admin/dashboard']).then(success => {
          if (success) {
            console.log('Redirection réussie vers /admin/dashboard');
          } else {
            console.error('Échec de la redirection vers /admin/dashboard');
          }
        }).catch(error => {
          console.error('Erreur lors de la redirection:', error);
        });
      },
      error: (err) => {
        console.error('Erreur de login:', err);
        alert(err.error.message || 'Erreur de connexion');
      }
    });
  }
}
