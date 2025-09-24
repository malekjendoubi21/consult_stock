import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface RegisterVendeurDto {
  nom: string;
  email: string;
  password: string;
}

interface LoginVendeurDto {
  email: string;
  password: string;
}

interface UpdateProfileDto {
  nom: string;
  email: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7131/api/Auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterVendeurDto): Observable<any> {
    // Utiliser l'endpoint Auth du backend
    console.log('Données d\'inscription envoyées:', data);
    
    // S'assurer que les propriétés correspondent au DTO backend (Pascal Case)
    const registerData = {
      Nom: data.nom,
      Email: data.email,
      Password: data.password
    };
    
    console.log('Données formatées pour le backend:', registerData);
    
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  login(data: LoginVendeurDto): Observable<{ token: string }> {
    // Utiliser l'endpoint Auth du backend
    console.log('Données envoyées au backend:', data);
    
    // S'assurer que les propriétés correspondent au DTO backend (Pascal Case)
    const loginData = {
      Email: data.email,
      Password: data.password
    };
    
    console.log('Données formatées pour le backend:', loginData);
    
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, loginData);
  }

  getProfile(): Observable<any> {
    const userType = this.getUserType();
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('Aucun token trouvé'));
    }
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    if (userType === 'admin') {
      // Pour les admins, utiliser l'endpoint des administrateurs
      return this.http.get(`https://localhost:7131/api/Administrateurs/profile`, { headers });
    } else if (userType === 'vendeur') {
      // Pour les vendeurs, utiliser l'endpoint Auth/profile
      return this.http.get(`${this.apiUrl}/profile`, { headers });
    } else {
      return throwError(() => new Error('Type d\'utilisateur non reconnu'));
    }
  }

  // Alias pour getCurrentUser (utilisé dans le profil)
  getCurrentUser(): Observable<any> {
    return this.getProfile();
  }

  updateProfile(data: UpdateProfileDto): Observable<any> {
    const userType = this.getUserType();
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('Aucun token trouvé'));
    }
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    if (userType === 'admin') {
      // Pour les admins, utiliser l'endpoint des administrateurs
      return this.http.put(`https://localhost:7131/api/Administrateurs/profile`, data, { headers });
    } else if (userType === 'vendeur') {
      // Utiliser le vrai endpoint Auth/profile
      return this.http.put(`${this.apiUrl}/profile`, data, { headers });
    } else {
      return throwError(() => new Error('Type d\'utilisateur non reconnu'));
    }
  }

  changePassword(data: ChangePasswordDto): Observable<any> {
    const userType = this.getUserType();
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('Aucun token trouvé'));
    }
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    if (userType === 'admin') {
      // Pour les admins, utiliser l'endpoint des administrateurs
      return this.http.put(`https://localhost:7131/api/Administrateurs/change-password`, data, { headers });
    } else if (userType === 'vendeur') {
      // Utiliser le vrai endpoint Auth/change-password
      return this.http.put(`${this.apiUrl}/change-password`, data, { headers });
    } else {
      return throwError(() => new Error('Type d\'utilisateur non reconnu'));
    }
  }

  // Nouvelle méthode pour vérifier le mot de passe actuel
  verifyPassword(password: string): Observable<any> {
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('Aucun token trouvé'));
    }
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    return this.http.post(`${this.apiUrl}/verify-password`, JSON.stringify(password), { headers });
  }

  // Nouvelle méthode pour supprimer le profil
  deleteProfile(): Observable<any> {
    const userType = this.getUserType();
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('Aucun token trouvé'));
    }
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    if (userType === 'admin') {
      // Pour les admins, utiliser l'endpoint des administrateurs
      return this.http.delete(`https://localhost:7131/api/Administrateurs/profile`, { headers });
    } else if (userType === 'vendeur') {
      // Utiliser l'endpoint Auth/profile avec DELETE
      return this.http.delete(`${this.apiUrl}/profile`, { headers });
    } else {
      return throwError(() => new Error('Type d\'utilisateur non reconnu'));
    }
  }

  // Méthode pour mot de passe oublié
  forgotPassword(email: string): Observable<any> {
    const forgotData = {
      Email: email
    };
    return this.http.post(`${this.apiUrl}/forgot-password`, forgotData);
  }

  // Méthode pour réinitialiser le mot de passe
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    const resetData = {
      Email: data.email,
      ResetCode: data.resetCode,
      NewPassword: data.newPassword
    };
    return this.http.post(`${this.apiUrl}/reset-password`, resetData);
  }

  logout(): void {
    // Supprimer les deux types de tokens
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
  }

  // Nouvelle méthode pour détecter le type d'utilisateur
  getUserType(): 'admin' | 'vendeur' | null {
    if (localStorage.getItem('adminToken')) {
      return 'admin';
    } else if (localStorage.getItem('token')) {
      return 'vendeur';
    }
    return null;
  }

  // Méthode pour vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.getUserType() === 'admin';
  }

  isAuthenticated(): boolean {
    // Vérifier les deux types de tokens (vendeur et admin)
    const vendeurToken = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    return !!(vendeurToken || adminToken);
  }

  getToken(): string | null {
    // Retourner le token disponible (vendeur ou admin)
    return localStorage.getItem('token') || localStorage.getItem('adminToken');
  }
}
