import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface PageInfo {
  title: string;
  description: string;
}

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {
  currentRoute = '';

  private pageInfo: { [key: string]: PageInfo } = {
    '/admin/dashboard': { title: 'Tableau de bord', description: 'Vue d\'ensemble de votre activité' },
    '/admin/articles': { title: 'Gestion des Articles', description: 'Gérer le catalogue d\'articles' },
    '/admin/lots': { title: 'Gestion des Lots', description: 'Gérer les lots de produits' },
    '/admin/stock': { title: 'Gestion du Stock', description: 'Suivre et gérer les stocks' },
    '/admin/ventes': { title: 'Gestion des Ventes', description: 'Historique et suivi des ventes' },
    '/admin/societes': { title: 'Gestion des Sociétés', description: 'Gérer les entreprises partenaires' },
    '/admin/users': { title: 'Gestion des Utilisateurs', description: 'Administration des comptes utilisateurs' },
    '/admin/profile': { title: 'Profil Administrateur', description: 'Gérer votre profil admin' }
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentRoute = (event as NavigationEnd).urlAfterRedirects;
    });

    // Initialiser la route actuelle
    this.currentRoute = this.router.url;
  }

  getCurrentPageTitle(): string {
    return this.pageInfo[this.currentRoute]?.title || 'Administration';
  }

  getCurrentPageDescription(): string {
    return this.pageInfo[this.currentRoute]?.description || 'Panneau d\'administration';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }
}
