import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Article {
  id?: number;
  nom: string;
  code?: string; // Alias pour codeArticle
  codeArticle: string;
  prixTTC: number;
  prixHT: number;
  prix?: number; // Alias pour prixTTC
  description?: string;
  stock?: number; // Quantité en stock (peut être calculée depuis les lots)
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'https://localhost:7131/api/Articles';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  search(term: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/search?term=${term}`);
  }

  getByCode(code: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/code/${code}`);
  }

  getBySociete(societeId: number): Observable<Article[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Article[]>(`${this.apiUrl}/societe/${societeId}`, headers);
  }

// --- CRUD ---
  create(article: Article): Observable<Article> {
    const token = localStorage.getItem('adminToken'); // même clé que pour profile
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Article>(this.apiUrl, article, { headers });
  }

  update(id: number, article: Article): Observable<Article> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article, { headers });
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
  const token = localStorage.getItem('token'); // ou sessionStorage selon ton projet
  return {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    })
  };
}
}
