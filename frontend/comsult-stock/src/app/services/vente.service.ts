import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vente {
  id?: number;
  societeId: number;
  article: string;
  lot: string;
  qteVendu: number;
  date: string;
  prixUnitaire?: number;
  prixTotal?: number;
}

export interface VenteArticleDto {
  societeId: number;
  codeArticle: string;
  numLot: string;
  quantite: number;
  imprimerTicket: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VenteService {
  private apiUrl = 'https://localhost:7131/api/Ventes';

  constructor(private http: HttpClient) {}

  // --- Réutilisable: headers JWT ---
  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken'); // 🔹 même token que pour profile
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) };
  }

  // GET: toutes les ventes (admin)
  getAll(): Observable<Vente[]> {
    return this.http.get<Vente[]>(this.apiUrl, this.getAuthHeaders());
  }

  // GET: vente par ID (admin)
  getById(id: number): Observable<Vente> {
    return this.http.get<Vente>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // GET: ventes par société (admin)
  getBySocieteId(societeId: number): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}/societe/${societeId}`, this.getAuthHeaders());
  }

  // POST: créer une vente (admin)
  create(vente: Vente): Observable<Vente> {
    return this.http.post<Vente>(this.apiUrl, vente, this.getAuthHeaders());
  }

  // PUT: mettre à jour une vente (admin)
  update(id: number, vente: Vente): Observable<Vente> {
    return this.http.put<Vente>(`${this.apiUrl}/${id}`, vente, this.getAuthHeaders());
  }

  // DELETE: supprimer une vente (admin)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // POST: vendre un article (vendeur/public)
  vendreArticle(dto: VenteArticleDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/article`, dto);
  }
}
