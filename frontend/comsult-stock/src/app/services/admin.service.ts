import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Administrateur {
  id?: number;
  nom: string;
  login: string;
  motDePasse: string;
}

export interface LoginAdminDto {
  login: string;
  motDePasse: string;
}
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7131/api/Administrateurs';

  constructor(private http: HttpClient) {}

  // --- REGISTER ---
  register(data: Administrateur): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // --- LOGIN ---
  login(data: LoginAdminDto): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  // --- PROFILE ---
  getProfile(): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  // --- CRUD ADMIN ---
  getAll(): Observable<Administrateur[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Administrateur[]>(this.apiUrl, { headers });
  }

  getById(id: number): Observable<Administrateur> {
    const headers = this.getAuthHeaders();
    return this.http.get<Administrateur>(`${this.apiUrl}/${id}`, { headers });
  }

  update(id: number, data: Administrateur): Observable<Administrateur> {
    const headers = this.getAuthHeaders();
    return this.http.put<Administrateur>(`${this.apiUrl}/${id}`, data, { headers });
  }

  delete(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // --- GESTION TOKEN ---
  saveToken(token: string): void {
    localStorage.setItem('adminToken', token);
  }

  logout(): void {
    localStorage.removeItem('adminToken');
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
