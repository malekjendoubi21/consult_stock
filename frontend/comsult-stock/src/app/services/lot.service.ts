import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lot {
  id?: number;
  articleId: number;
  quantiteDisponible: number;
  articleCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private apiUrl = 'https://localhost:7131/api/Lots'; // 🔹 URL backend

  constructor(private http: HttpClient) {}

  // --- Réutilisable: headers JWT ---
  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken'); // 🔹 même token que pour profile
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) };
  }

  // GET: tous les lots
  getAll(): Observable<Lot[]> {
    return this.http.get<Lot[]>(this.apiUrl, this.getAuthHeaders());
  }

  // GET: un lot par ID
  getById(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // GET: lots par articleId
  getByArticleId(articleId: number): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.apiUrl}/article/${articleId}`, this.getAuthHeaders());
  }

  // POST: créer un lot
  create(lot: Lot): Observable<Lot> {
    return this.http.post<Lot>(this.apiUrl, lot, this.getAuthHeaders());
  }

  // PUT: mettre à jour un lot complet
  update(id: number, lot: Lot): Observable<Lot> {
    return this.http.put<Lot>(`${this.apiUrl}/${id}`, lot, this.getAuthHeaders());
  }

  // DELETE: supprimer un lot
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // PATCH: mettre à jour seulement la quantité
  updateQuantite(id: number, nouvelleQuantite: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/quantite`, { quantiteDisponible: nouvelleQuantite }, this.getAuthHeaders());
  }
}