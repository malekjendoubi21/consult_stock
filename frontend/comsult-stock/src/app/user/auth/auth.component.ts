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
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  token: string | null = null;
  errorMessage: string = '';
  isLoginMode = true; // true = login, false = register
  isForgotMode = false; // true = forgot password
  isResetMode = false; // true = reset password
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

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      resetCode: ['', Validators.required],
      newPassword: ['', Validators.required]
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

  onForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (res) => {
          Swal.fire('Succès', 'Un code de réinitialisation a été envoyé à votre adresse email.', 'success');
          this.forgotPasswordForm.reset();
          this.toggleMode('reset');
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi du code.';
          console.error(err);
        }
      });
    }
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          Swal.fire('Succès', 'Mot de passe réinitialisé avec succès.', 'success');
          this.resetPasswordForm.reset();
          this.toggleMode('login');
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la réinitialisation.';
          console.error(err);
        }
      });
    }
  }
  toggleMode(mode: 'login' | 'register' | 'forgot' | 'reset') {
    this.isLoginMode = (mode === 'login');
    this.isForgotMode = (mode === 'forgot');
    this.isResetMode = (mode === 'reset');
    this.errorMessage = '';
    this.successMessage = '';
  }
  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        console.log('Profil :', res);
        alert(`Bienvenue ${res.nom || res.login} (${res.email || 'Utilisateur'})`);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);
        // Ne pas afficher l'erreur pour l'instant, juste procéder à la redirection
        console.log('Profil non chargé, redirection vers l\'accueil...');
        // this.errorMessage = 'Impossible de récupérer le profil.';
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Tentative de connexion avec:', this.loginForm.value);
      
      // Nettoyer tous les tokens avant la nouvelle connexion
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      console.log('Tokens supprimés avant la nouvelle connexion');
      
      // Pour l'instant, créer une connexion temporaire pour tester le système
      const credentials = this.loginForm.value;
      
      // Vérifier si c'est un admin (par exemple, si l'email contient "admin" ou login spécifique)
      if (credentials.email === 'admin@admin.com' || credentials.email.includes('admin')) {
        // Rediriger vers la connexion admin
        this.router.navigate(['/admin/login']);
        return;
      }
      
      // Sinon, essayer la connexion vendeur
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Réponse de connexion:', res);
          this.token = res.token;
          localStorage.setItem('token', this.token);
          
          // Essayer de charger le profil, mais continuer même si ça échoue
          this.loadProfile();

          this.loginForm.reset();

          // Alert SweetAlert2
          Swal.fire({
            title: 'Connexion réussie 🎉',
            text: 'Bienvenue sur votre espace !',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
          
          // Rediriger vers l'accueil
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erreur de connexion:', err);
          console.error('Détails de l\'erreur:', err.error);
          
          let errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          
          if (err.status === 404) {
            errorMessage = 'Endpoint de connexion non trouvé. Vérifiez la configuration du backend.';
          } else if (err.status === 405) {
            errorMessage = 'Méthode non autorisée. L\'endpoint de connexion pourrait être mal configuré.';
          } else if (err.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect.';
          } else if (err.status === 400) {
            // Erreur de validation - afficher le message détaillé du backend
            if (err.error && err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error && err.error.errors) {
              // Si c'est une erreur de validation avec des détails
              const errors = Object.values(err.error.errors).flat();
              errorMessage = `Erreurs de validation: ${errors.join(', ')}`;
            } else {
              errorMessage = 'Données de connexion invalides. Vérifiez votre email et mot de passe.';
            }
          }
          
          this.errorMessage = errorMessage;
        }
      });
    }
  }
}
