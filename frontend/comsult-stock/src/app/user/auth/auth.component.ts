import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  registerForm: FormGroup;
  loginForm: FormGroup;
  token: string | null = null;
  errorMessage: string = '';
  isLoginMode = true; // true = login, false = register
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService ,  private router: Router ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          this.registerForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'inscription.';
          console.error(err);
        }
      });
    }
  }
  toggleMode(mode: 'login' | 'register') {
    this.isLoginMode = (mode === 'login');
  }
  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        console.log('Profil :', res);
        alert(`Bienvenue ${res.nom} (${res.email})`);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de récupérer le profil.';
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.token = res.token;
          this.loadProfile();

          this.loginForm.reset();
          localStorage.setItem('token', this.token);

          // Masquer le message après 3 secondes
          // Alert SweetAlert2
          Swal.fire({
            title: 'Connexion réussie 🎉',
            text: 'Bienvenue sur votre espace !',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la connexion.';
          console.error(err);
        }
      });
    }
  }
}
