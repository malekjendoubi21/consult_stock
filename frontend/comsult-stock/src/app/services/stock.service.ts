import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stock {
  id?: number;
  societeId: number;
  codeBarre: string;
  numLot: string;
  qteDispo: number;
  prixTTC: number;
  dateExpiration?: string;
  societeNom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://localhost:7131/api/Stocks';

  constructor(private http: HttpClient) {}

  // --- Réutilisable: headers JWT ---
  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken'); // 🔹 même token que pour profile
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) };
  }

  // GET: tous les stocks (admin)
  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl, this.getAuthHeaders());
  }

  // GET: stock par ID (admin)
  getById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // GET: stocks par société (admin)
  getBySocieteId(societeId: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/societe/${societeId}`, this.getAuthHeaders());
  }

  // GET: consultation stock par société (public)
  getStockConsultation(societeId: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/consultation/societe/${societeId}`);
  }

  // POST: créer un stock (admin)
  create(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock, this.getAuthHeaders());
  }

  // PUT: mettre à jour un stock (admin)
  update(id: number, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${id}`, stock, this.getAuthHeaders());
  }

  // DELETE: supprimer un stock (admin)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
