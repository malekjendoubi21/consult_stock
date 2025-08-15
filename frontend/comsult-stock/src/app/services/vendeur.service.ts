import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendeur {
  id?: number;
  nom: string;
  email: string;
  passwordHash?: string; // utilisé lors de la création/modification
}

@Injectable({
  providedIn: 'root'
})
export class VendeurService {
  private apiUrl = 'https://localhost:7131/api/Vendeurs'; // URL de ton contrôleur .NET

  constructor(private http: HttpClient) {}

  // --- GET ALL ---
  getAll(): Observable<Vendeur[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Vendeur[]>(this.apiUrl, { headers });
  }

  // --- GET BY ID ---
  getById(id: number): Observable<Vendeur> {
    const headers = this.getAuthHeaders();
    return this.http.get<Vendeur>(`${this.apiUrl}/${id}`, { headers });
  }

  // --- CREATE ---
  create(vendeur: Vendeur): Observable<Vendeur> {
    const headers = this.getAuthHeaders();
    return this.http.post<Vendeur>(this.apiUrl, vendeur, { headers });
  }

  // --- UPDATE ---
  update(id: number, vendeur: Vendeur): Observable<Vendeur> {
    const headers = this.getAuthHeaders();
    return this.http.put<Vendeur>(`${this.apiUrl}/${id}`, vendeur, { headers });
  }

  // --- DELETE ---
  delete(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // --- GESTION TOKEN (si backoffice sécurisé) ---
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken'); // ou 'token' si vendeur connecté
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
