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
  dateExpiration?: Date;
  articleId?: number;
  lotId?: number;
}

export interface StockConsultationDto {
  id: number;
  codeBarre: string;
  numLot: string;
  qteDispo: number;
  prixTTC: number;
  societeNom: string;
  dateExpiration?: Date;
}

export interface CreateStockDto {
  societeId: number;
  articleId: number;
  lotId: number;
  codeBarre: string;
  numLot: string;
  qteDispo: number;
}

export interface UpdateStockDto {
  societeId: number;
  articleId: number;
  lotId: number;
  codeBarre: string;
  numLot: string;
  qteDispo: number;
  prixTTC: number;
  dateExpiration?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://localhost:7131/api/Stocks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
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
  getStockConsultation(societeId: number): Observable<StockConsultationDto[]> {
    return this.http.get<StockConsultationDto[]>(`${this.apiUrl}/consultation/societe/${societeId}`);
  }

  // GET: données de debug (public)
  getDebugData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/debug/data`);
  }

  // GET: articles disponibles (admin)
  getAvailableArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/articles`, this.getAuthHeaders());
  }

  // GET: lots disponibles (admin)
  getAvailableLots(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lots`, this.getAuthHeaders());
  }

  // GET: sociétés disponibles (admin)
  getAvailableSocietes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/societes`, this.getAuthHeaders());
  }

  // Validation: vérifier si un article existe
  validateArticleExists(articleId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate/article/${articleId}`, this.getAuthHeaders());
  }

  // Validation: vérifier si un lot existe
  validateLotExists(lotId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate/lot/${lotId}`, this.getAuthHeaders());
  }

  // POST: créer un stock (admin)
  create(stock: CreateStockDto): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock, this.getAuthHeaders());
  }

  // PUT: mettre à jour un stock (admin)
  update(id: number, stock: UpdateStockDto): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${id}`, stock, this.getAuthHeaders());
  }

  // DELETE: supprimer un stock (admin)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
