import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vente {
  id?: number;
  societeId: number;
  article: string;
  lot: string;
  qteVendu: number;
  date: Date;
  prixUnitaire: number;
  prixTotal: number;
  articleId?: number;
  lotId?: number;
}

export interface VenteArticleDto {
  societeId: number;
  codeArticle: string;
  numLot: string;
  quantite: number;
  imprimerTicket: boolean;
  dateVente?: Date; // Optionnel - si null, le backend utilise DateTime.Now
  prixUnitaireFourni?: number; // Optionnel - sera récupéré du lot si non fourni
}

export interface VenteCreatedResponseDto {
  id: number;
  societeId: number;
  societeNom: string;
  article: string;
  lot: string;
  qteVendu: number;
  date: Date;
  prixUnitaire: number;
  prixTotal: number;
  ticketImprime: boolean;
  tickets: TicketDto[];
}

export interface TicketDto {
  // Structure à définir selon les besoins
  id: string;
  contenu: string;
  dateCreation: Date;
}

export interface UpdateVenteArticleDto {
  societeId: number;
  codeArticle: string;
  numLot: string;
  quantite: number;
  prixUnitaireFourni?: number;
  dateVente?: Date;
}

export interface CreateVenteDto {
  societeId: number;
  article: string;
  lot: string;
  qteVendu: number;
  date: Date;
}

export interface UpdateVenteDto {
  societeId: number;
  article: string;
  lot: string;
  qteVendu: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class VenteService {
  private apiUrl = 'https://localhost:7131/api/Ventes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
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
  create(vente: CreateVenteDto): Observable<Vente> {
    return this.http.post<Vente>(this.apiUrl, vente, this.getAuthHeaders());
  }

  // PUT: mettre à jour une vente (admin)
  update(id: number, vente: UpdateVenteDto): Observable<Vente> {
    return this.http.put<Vente>(`${this.apiUrl}/${id}`, vente, this.getAuthHeaders());
  }

  // DELETE: supprimer une vente (admin)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // POST: vendre un article (vendeur/public) - AllowAnonymous dans le backend
  vendreArticle(dto: VenteArticleDto): Observable<VenteCreatedResponseDto> {
    return this.http.post<VenteCreatedResponseDto>(`${this.apiUrl}/article`, dto);
  }

  // PUT: mettre à jour une vente avec le nouveau DTO
  updateVenteArticle(id: number, dto: UpdateVenteArticleDto): Observable<VenteCreatedResponseDto> {
    return this.http.put<VenteCreatedResponseDto>(`${this.apiUrl}/article/${id}`, dto);
  }
}
