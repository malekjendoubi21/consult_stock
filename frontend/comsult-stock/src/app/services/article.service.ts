import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Article {
  id?: number;
  nom: string;
  codeArticle: string;
  prixTTC: number;
  prixHT: number;
}

export interface ArticleSelectDto {
  id: number;
  nom: string;
  codeArticle: string;
  prixTTC: number;
  prixHT: number;
}

export interface CreateArticleDto {
  nom: string;
  codeArticle: string;
  prixTTC: number;
  prixHT: number;
}

export interface UpdateArticleDto {
  nom: string;
  codeArticle: string;
  prixTTC: number;
  prixHT: number;
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

  search(term: string = ""): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/search?term=${term}`);
  }

  getByCode(code: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/code/${code}`);
  }

  getBySociete(societeId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/societe/${societeId}`);
  }

  getArticlesForSelect(): Observable<ArticleSelectDto[]> {
    return this.http.get<ArticleSelectDto[]>(`${this.apiUrl}/select`);
  }

  getArticlesWithStockBySociete(societeId: number): Observable<ArticleSelectDto[]> {
    return this.http.get<ArticleSelectDto[]>(`${this.apiUrl}/select/societe/${societeId}`);
  }

// --- CRUD ---
  create(article: CreateArticleDto): Observable<Article> {
    const headers = this.getAuthHeaders();
    return this.http.post<Article>(this.apiUrl, article, headers);
  }

  update(id: number, article: UpdateArticleDto): Observable<Article> {
    const headers = this.getAuthHeaders();
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article, headers);
  }

  delete(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, headers);
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('adminToken'); // Pour les opérations admin
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }
}
