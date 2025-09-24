import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendeur {
  id?: number;
  nom: string;
  email: string;
  role?: string;
  passwordHash?: string;
}

export interface CreateVendeurDto {
  nom: string;
  email: string;
  password: string;
}

export interface UpdateVendeurDto {
  nom: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendeurService {
  private apiUrl = 'https://localhost:7131/api/Vendeurs';
  private backofficeApiUrl = 'https://localhost:7131/api/backoffice/vendeurs';

  constructor(private http: HttpClient) {}

  // === VENDEURS FRONTOFFICE (public) ===
  getAll(): Observable<Vendeur[]> {
    return this.http.get<Vendeur[]>(this.apiUrl);
  }

  getById(id: number): Observable<Vendeur> {
    return this.http.get<Vendeur>(`${this.apiUrl}/${id}`);
  }

  create(vendeur: Vendeur): Observable<Vendeur> {
    return this.http.post<Vendeur>(this.apiUrl, vendeur);
  }

  update(id: number, vendeur: Vendeur): Observable<Vendeur> {
    return this.http.put<Vendeur>(`${this.apiUrl}/${id}`, vendeur);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // === VENDEURS BACKOFFICE (admin only) ===
  getAllBackoffice(): Observable<Vendeur[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Vendeur[]>(this.backofficeApiUrl, { headers });
  }

  getByIdBackoffice(id: number): Observable<Vendeur> {
    const headers = this.getAuthHeaders();
    return this.http.get<Vendeur>(`${this.backofficeApiUrl}/${id}`, { headers });
  }

  createBackoffice(vendeur: CreateVendeurDto): Observable<Vendeur> {
    const headers = this.getAuthHeaders();
    return this.http.post<Vendeur>(this.backofficeApiUrl, vendeur, { headers });
  }

  updateBackoffice(id: number, vendeur: UpdateVendeurDto): Observable<Vendeur> {
    const headers = this.getAuthHeaders();
    return this.http.put<Vendeur>(`${this.backofficeApiUrl}/${id}`, vendeur, { headers });
  }

  deleteBackoffice(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.backofficeApiUrl}/${id}`, { headers });
  }

  searchBackoffice(term: string = ""): Observable<Vendeur[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Vendeur[]>(`${this.backofficeApiUrl}/search?term=${term}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
