import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Societe {
  id?: number;
  nom: string;
  adresse: string;
}

export interface CreateSocieteDto {
  nom: string;
  adresse: string;
}

export interface UpdateSocieteDto {
  nom: string;
  adresse: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocieteService {
  private apiUrl = 'https://localhost:7131/api/Societes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) };
  }

  // GET: toutes les sociétés (AllowAnonymous dans le backend)
  getAll(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.apiUrl);
  }

  // GET: par ID (auth requis)
  getById(id: number): Observable<Societe> {
    return this.http.get<Societe>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // POST: créer une société (admin)
  create(societe: CreateSocieteDto): Observable<Societe> {
    return this.http.post<Societe>(this.apiUrl, societe, this.getAuthHeaders());
  }

  // PUT: mettre à jour une société (admin)
  update(id: number, societe: UpdateSocieteDto): Observable<Societe> {
    return this.http.put<Societe>(`${this.apiUrl}/${id}`, societe, this.getAuthHeaders());
  }

  // DELETE: supprimer une société (admin)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
