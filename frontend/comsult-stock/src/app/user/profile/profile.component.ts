import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  errorMessage: string = '';
  
  // Contrôle de l'affichage des formulaires
  showEditProfile: boolean = false;
  showChangePassword: boolean = false;
  
  // Modification du profil
  editProfile: any = { nom: '', email: '' };
  isUpdatingProfile: boolean = false;
  
  // Changement de mot de passe
  passwordData: any = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  isChangingPassword: boolean = false;

  // Suppression du profil
  isDeletingProfile: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (userData: any) => {
        this.user = userData;
        // Initialiser le formulaire de modification avec les données actuelles
        this.editProfile = {
          nom: userData.nom || '',
          email: userData.email || ''
        };
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.errorMessage = 'Impossible de charger les informations du profil.';
      }
    });
  }

  updateProfile(): void {
    if (!this.editProfile.nom || !this.editProfile.email) {
      Swal.fire({
        title: 'Erreur de validation',
        text: 'Veuillez remplir tous les champs requis.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.isUpdatingProfile = true;
    this.errorMessage = '';

    // Appel au service pour mettre à jour le profil
    this.authService.updateProfile(this.editProfile).subscribe({
      next: (response: any) => {
        this.user = { ...this.user, ...this.editProfile };
        this.isUpdatingProfile = false;
        this.showEditProfile = false; // Fermer le formulaire
        
        // Afficher l'alerte de succès
        Swal.fire({
          title: 'Profil mis à jour! ✅',
          text: response.message || 'Vos informations ont été modifiées avec succès.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });

        // Si l'email a changé et qu'un nouveau token est fourni
        if (response.newToken && response.emailChanged) {
          localStorage.setItem('token', response.newToken);
          Swal.fire({
            title: 'Email modifié',
            text: 'Votre email a été modifié. Vous devrez utiliser le nouvel email pour vos prochaines connexions.',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Compris'
          });
        }
      },
      error: (error: any) => {
        this.isUpdatingProfile = false;
        let errorMessage = 'Erreur lors de la mise à jour du profil.';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        Swal.fire({
          title: 'Erreur',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        
        console.error('Erreur mise à jour profil:', error);
      }
    });
  }

  resetProfileForm(): void {
    this.editProfile = {
      nom: this.user.nom || '',
      email: this.user.email || ''
    };
    // Fermer le formulaire seulement si appelé depuis le bouton "Annuler"
    this.showEditProfile = false;
  }

  changePassword(): void {
    if (!this.passwordData.currentPassword || 
        !this.passwordData.newPassword || 
        !this.passwordData.confirmPassword) {
      Swal.fire({
        title: 'Erreur de validation',
        text: 'Veuillez remplir tous les champs requis.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      Swal.fire({
        title: 'Erreur de validation',
        text: 'Les mots de passe ne correspondent pas.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validation de la force du mot de passe
    if (this.getPasswordStrengthPercentage() < 50) {
      Swal.fire({
        title: 'Mot de passe faible',
        text: 'Votre mot de passe doit être plus fort. Utilisez au moins 8 caractères avec des majuscules et des chiffres.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.isChangingPassword = true;
    this.errorMessage = '';

    // Préparer les données selon le format attendu par le backend
    const changePasswordData = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
      confirmPassword: this.passwordData.confirmPassword
    };

    // Appel au service pour changer le mot de passe
    this.authService.changePassword(changePasswordData).subscribe({
      next: (response: any) => {
        this.isChangingPassword = false;
        this.resetPasswordForm();
        
        // Afficher l'alerte de succès
        Swal.fire({
          title: 'Mot de passe modifié! 🔒',
          text: response.message || 'Votre mot de passe a été changé avec succès.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      },
      error: (error: any) => {
        this.isChangingPassword = false;
        let errorMessage = 'Erreur lors du changement de mot de passe.';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        Swal.fire({
          title: 'Erreur',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        
        console.error('Erreur changement mot de passe:', error);
      }
    });
  }

  resetPasswordForm(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    // Fermer le formulaire seulement si appelé depuis le bouton "Annuler"
    this.showChangePassword = false;
  }

  // Méthodes pour contrôler l'affichage des formulaires
  toggleEditProfile(): void {
    console.log('toggleEditProfile appelé, état actuel:', this.showEditProfile);
    this.showEditProfile = !this.showEditProfile;
    console.log('toggleEditProfile nouvel état:', this.showEditProfile);
    if (this.showEditProfile) {
      this.showChangePassword = false; // Fermer l'autre formulaire
      // Initialiser le formulaire avec les données actuelles seulement
      this.editProfile = {
        nom: this.user.nom || '',
        email: this.user.email || ''
      };
    }
  }

  toggleChangePassword(): void {
    console.log('toggleChangePassword appelé, état actuel:', this.showChangePassword);
    this.showChangePassword = !this.showChangePassword;
    console.log('toggleChangePassword nouvel état:', this.showChangePassword);
    if (this.showChangePassword) {
      this.showEditProfile = false; // Fermer l'autre formulaire
      // Réinitialiser seulement les données du formulaire
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }

  closeAllForms(): void {
    this.showEditProfile = false;
    this.showChangePassword = false;
  }

  // Méthodes pour évaluer la force du mot de passe
  getPasswordStrengthPercentage(): number {
    const password = this.passwordData.newPassword;
    if (!password) return 0;
    
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    
    return score;
  }

  getPasswordStrengthText(): string {
    const score = this.getPasswordStrengthPercentage();
    if (score < 25) return 'Très faible';
    if (score < 50) return 'Faible';
    if (score < 75) return 'Moyen';
    return 'Fort';
  }

  getPasswordStrengthClass(): string {
    const score = this.getPasswordStrengthPercentage();
    if (score < 25) return 'text-red-600 font-medium';
    if (score < 50) return 'text-orange-600 font-medium';
    if (score < 75) return 'text-yellow-600 font-medium';
    return 'text-green-600 font-medium';
  }

  getPasswordStrengthBarClass(): string {
    const score = this.getPasswordStrengthPercentage();
    if (score < 25) return 'bg-red-500';
    if (score < 50) return 'bg-orange-500';
    if (score < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // Nouvelle méthode pour supprimer le profil
  deleteProfile(): void {
    // Confirmation avant suppression
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action supprimera définitivement votre compte. Cette action est irréversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Demander le mot de passe pour confirmation
        Swal.fire({
          title: 'Confirmez avec votre mot de passe',
          text: 'Pour des raisons de sécurité, veuillez saisir votre mot de passe actuel:',
          input: 'password',
          inputPlaceholder: 'Mot de passe actuel',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Confirmer la suppression',
          cancelButtonText: 'Annuler',
          inputValidator: (value) => {
            if (!value) {
              return 'Vous devez saisir votre mot de passe!';
            }
            return null;
          }
        }).then((passwordResult) => {
          if (passwordResult.isConfirmed && passwordResult.value) {
            this.confirmDeleteProfile(passwordResult.value);
          }
        });
      }
    });
  }

  // Méthode pour confirmer et exécuter la suppression
  private confirmDeleteProfile(password: string): void {
    this.isDeletingProfile = true;

    // D'abord vérifier le mot de passe
    this.authService.verifyPassword(password).subscribe({
      next: (response: any) => {
        if (response.isValid) {
          // Mot de passe correct, procéder à la suppression
          this.executeDeleteProfile();
        } else {
          this.isDeletingProfile = false;
          Swal.fire({
            title: 'Mot de passe incorrect',
            text: 'Le mot de passe saisi est incorrect.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (error: any) => {
        this.isDeletingProfile = false;
        Swal.fire({
          title: 'Erreur',
          text: 'Erreur lors de la vérification du mot de passe.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Méthode pour exécuter la suppression du profil
  private executeDeleteProfile(): void {
    this.authService.deleteProfile().subscribe({
      next: (response: any) => {
        this.isDeletingProfile = false;
        
        Swal.fire({
          title: 'Compte supprimé!',
          text: 'Votre compte a été supprimé avec succès. Vous allez être redirigé.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          // Déconnexion et redirection
          this.authService.logout();
          this.router.navigate(['/auth']);
        });
      },
      error: (error: any) => {
        this.isDeletingProfile = false;
        let errorMessage = 'Erreur lors de la suppression du compte.';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        Swal.fire({
          title: 'Erreur',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Nouvelle méthode pour vérifier le mot de passe actuel
  verifyCurrentPassword(): void {
    if (!this.passwordData.currentPassword) return;

    this.authService.verifyPassword(this.passwordData.currentPassword).subscribe({
      next: (response: any) => {
        if (!response.isValid) {
          Swal.fire({
            title: 'Mot de passe incorrect',
            text: 'Le mot de passe actuel que vous avez saisi est incorrect.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la vérification du mot de passe:', error);
      }
    });
  }
}
