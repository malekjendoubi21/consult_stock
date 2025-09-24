import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketDto {
  id: number;
  codeBarre: string;
  dateCreation: Date;
  venteId: number;
  article: string;
  societe: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7131/api/Tickets';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) };
  }

  // GET: récupérer tous les tickets (admin)
  getAll(): Observable<TicketDto[]> {
    return this.http.get<TicketDto[]>(this.apiUrl, this.getAuthHeaders());
  }

  // GET: récupérer un ticket par ID (public)
  getById(id: number): Observable<TicketDto> {
    return this.http.get<TicketDto>(`${this.apiUrl}/${id}`);
  }

  // GET: récupérer un ticket par code-barre (public)
  getByCodeBarre(codeBarre: string): Observable<TicketDto> {
    return this.http.get<TicketDto>(`${this.apiUrl}/barcode/${codeBarre}`);
  }

  // GET: récupérer le PDF d'un ticket (public)
  getTicketPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  // POST: générer un code-barre (public)
  generateBarcode(): Observable<{ codeBarre: string }> {
    return this.http.post<{ codeBarre: string }>(`${this.apiUrl}/generate`, {});
  }
}
