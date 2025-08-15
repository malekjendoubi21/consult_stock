import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  errorMessage: string = '';

  constructor(private authService: AuthService , private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger le profil.';
      }
    });
  }
  logout() {
    localStorage.removeItem('token'); // Supprimer le token
    this.router.navigate(['/auth']); // Rediriger vers la page de connexion
  }
}
