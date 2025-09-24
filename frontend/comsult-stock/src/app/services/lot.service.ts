import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lot {
  id?: number;
  numLot: string;
  quantiteDisponible: number;
  dateExpiration?: Date;
  prixUnitaire: number;
  articleId: number;
}

export interface LotSelectDto {
  id: number;
  numLot: string;
  quantiteDisponible: number;
  dateExpiration?: Date;
  prixUnitaire: number;
  articleId: number;
  articleName: string;
}

export interface CreateLotDto {
  articleId: number;
  numLot: string;
  quantiteDisponible: number;
  dateExpiration?: Date;
  prixUnitaire: number;
}

export interface UpdateLotDto {
  articleId: number;
  numLot: string;
  quantiteDisponible: number;
  dateExpiration?: Date;
  prixUnitaire: number;
}

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private apiUrl = 'https://localhost:7131/api/Lots';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) };
  }

  getAll(): Observable<Lot[]> {
    return this.http.get<Lot[]>(this.apiUrl, this.getAuthHeaders());
  }

  getById(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  getByArticleId(articleId: number): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.apiUrl}/article/${articleId}`, this.getAuthHeaders());
  }

  getLotsForSelect(articleId: number): Observable<LotSelectDto[]> {
    return this.http.get<LotSelectDto[]>(`${this.apiUrl}/select/article/${articleId}`, this.getAuthHeaders());
  }

  create(lot: CreateLotDto): Observable<Lot> {
    return this.http.post<Lot>(this.apiUrl, lot, this.getAuthHeaders());
  }

  update(id: number, lot: UpdateLotDto): Observable<Lot> {
    return this.http.put<Lot>(`${this.apiUrl}/${id}`, lot, this.getAuthHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  updateQuantite(id: number, nouvelleQuantite: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/quantite`, nouvelleQuantite, this.getAuthHeaders());
  }
}