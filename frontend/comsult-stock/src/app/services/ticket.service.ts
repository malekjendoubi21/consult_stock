import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketDto {
  id: number;
  codeBarre: string;
  dateCreation: string; // ISO string
  venteId: number;
  article: string;
  societe: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7131/api/tickets'; // URL backend

  constructor(private http: HttpClient) {}

  // GET: récupérer tous les tickets (admin)
  getAll(): Observable<TicketDto[]> {
    return this.http.get<TicketDto[]>(this.apiUrl);
  }

  // GET: récupérer un ticket par ID
  getById(id: number): Observable<TicketDto> {
    return this.http.get<TicketDto>(`${this.apiUrl}/${id}`);
  }

  // GET: récupérer un ticket par code-barre
  getByCodeBarre(codeBarre: string): Observable<TicketDto> {
    return this.http.get<TicketDto>(`${this.apiUrl}/barcode/${codeBarre}`);
  }

  // GET: récupérer le PDF d’un ticket
  getTicketPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  // POST: générer un code-barre
  generateBarcode(): Observable<{ codeBarre: string }> {
    return this.http.post<{ codeBarre: string }>(`${this.apiUrl}/generate`, {});
  }
}
