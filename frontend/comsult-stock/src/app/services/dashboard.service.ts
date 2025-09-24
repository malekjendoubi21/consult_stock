import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'https://localhost:7131/api/dashboard'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  getGeneralStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/stats/general`);
  }

  getMetriques(): Observable<any> {
    return this.http.get(`${this.API_URL}/metriques`);
  }

  getVentesParMois(): Observable<any> {
    return this.http.get(`${this.API_URL}/ventes/par-mois`);
  }

  getVentesParPeriode(periode: string): Observable<any> {
    return this.http.get(`${this.API_URL}/ventes/par-periode?periode=${periode}`);
  }

  getTopArticlesVendus(): Observable<any> {
    return this.http.get(`${this.API_URL}/articles/top-vendus`);
  }

  getStocksParArticle(): Observable<any> {
    return this.http.get(`${this.API_URL}/stocks/par-article`);
  }

  getLotsExpirationProches(): Observable<any> {
    return this.http.get(`${this.API_URL}/lots/expiration-proches`);
  }

  getEvolutionChiffreAffaire(): Observable<any> {
    return this.http.get(`${this.API_URL}/chiffre-affaire/evolution`);
  }

  getVentesParSociete(): Observable<any> {
    return this.http.get(`${this.API_URL}/ventes/par-societe`);
  }

  getAlertsStock(): Observable<any> {
    return this.http.get(`${this.API_URL}/alertes/stock`);
  }

  getPrixMoyensArticles(): Observable<any> {
    return this.http.get(`${this.API_URL}/articles/prix-moyens`);
  }

  getPerformancesVendeurs(): Observable<any> {
    return this.http.get(`${this.API_URL}/vendeurs/performances`);
  }

  getResumeComplet(): Observable<any> {
    return this.http.get(`${this.API_URL}/resume-complet`);
  }
}
