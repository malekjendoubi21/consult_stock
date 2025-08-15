import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Societe {
  id?: number;
  nom: string;
  adresse: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocieteService {
  private apiUrl = 'https://localhost:7131/api/Societes';

  constructor(private http: HttpClient) {}

  // --- Réutilisable: headers JWT ---
  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken'); // 🔹 même token que pour profile
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) };
  }

  // GET: toutes les sociétés (pas besoin d'auth)
  getAll(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.apiUrl);
  }

  // GET: par ID (auth requis)
  getById(id: number): Observable<Societe> {
    return this.http.get<Societe>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // POST: créer une société (admin)
 create(societe: Societe): Observable<Societe> {
  return this.http.post<Societe>(this.apiUrl, societe, this.getAuthHeaders());
}

  // PUT: mettre à jour une société (admin)
  update(id: number, societe: Societe): Observable<Societe> {
    return this.http.put<Societe>(`${this.apiUrl}/${id}`, societe, this.getAuthHeaders());
  }

  // DELETE: supprimer une société (admin)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
