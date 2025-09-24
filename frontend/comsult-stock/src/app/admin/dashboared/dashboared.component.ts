import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboared',
  templateUrl: './dashboared.component.html',
  styleUrls: ['./dashboared.component.scss']
})
export class DashboaredComponent implements OnInit, OnDestroy {
  // Données du dashboard
  generalStats: any = {};
  metriques: any = {};
  ventesParMois: any[] = [];
  topArticles: any[] = [];
  stocksParArticle: any[] = [];
  lotsExpirationProches: any[] = [];
  evolutionChiffreAffaire: any[] = [];
  ventesParSociete: any[] = [];
  alertesStock: any[] = [];
  prixMoyensArticles: any[] = [];
  performancesVendeurs: any[] = [];
  resumeComplet: any = {};
  
  // États de chargement
  isLoading = true;
  isAuthenticated = false;
  showDemoData = false;
  connectionError = false;
  private routerSubscription: Subscription = new Subscription();
  loadingStates = {
    stats: true,
    metriques: true,
    ventes: true,
    articles: true,
    stocks: true,
    lots: true,
    chiffre: true,
    societes: true,
    alertes: true,
    prix: true,
    vendeurs: true,
    resume: true
  };

  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService, // public pour l'utiliser dans le template
    private router: Router
  ) {}

  ngOnInit() {
    // S'abonner aux changements de navigation pour détecter les retours après connexion
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthenticationAndLoad();
      });

    // Vérification initiale
    this.checkAuthenticationAndLoad();
  }

  ngOnDestroy() {
    // Désabonnement pour éviter les fuites mémoire
    this.routerSubscription.unsubscribe();
  }

    checkAuthenticationAndLoad() {
    // Re-vérifier l'authentification à chaque fois
    this.isAuthenticated = this.authService.isAuthenticated();
    
    // Debug info
    const vendeurToken = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    const userType = this.authService.getUserType();
    
    console.log('=== DEBUG AUTHENTIFICATION ===');
    console.log('Authentifié:', this.isAuthenticated ? 'Connecté' : 'Non connecté');
    console.log('Token vendeur présent:', !!vendeurToken);
    console.log('Token admin présent:', !!adminToken);
    console.log('Type utilisateur:', userType);
    console.log('==========================');
    
    if (!this.isAuthenticated) {
      console.warn('Utilisateur non authentifié - affichage des données de démonstration');
      this.showDemoData = true;
      this.connectionError = false;
      this.loadDemoData();
    } else {
      console.log('Utilisateur authentifié - chargement des vraies données');
      this.showDemoData = false;
      this.connectionError = false;
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    this.isLoading = true;
    this.connectionError = false;
    
    // Charger les statistiques générales
    this.dashboardService.getGeneralStats().subscribe({
      next: (data) => {
        // Mapper les données de l'API vers le format attendu par le template
        this.generalStats = {
          chiffreAffaires: data.chiffreAffaireMensuel || 0,
          nombreVentes: data.totalVentes || 0,
          stockTotal: data.totalStock || 0,
          societesActives: data.totalSocietes || 0,
          totalSocietes: data.totalSocietes || 0,
          totalArticles: data.totalArticles || 0,
          totalLots: data.totalLots || 0,
          totalVendeurs: data.totalVendeurs || 0,
          croissanceCA: 0, // À calculer si nécessaire
          nouvelles: 0 // À calculer si nécessaire
        };
        console.log('Stats générales mappées:', this.generalStats);
        this.loadingStates.stats = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats générales:', error);
        if (error.status === 401) {
          this.handleAuthError();
          return;
        }
        this.handleConnectionError();
        // Données par défaut en cas d'erreur
        this.generalStats = this.getDefaultGeneralStats();
        this.loadingStates.stats = false;
      }
    });

    // Charger les métriques
    this.dashboardService.getMetriques().subscribe({
      next: (data) => {
        this.metriques = data;
        this.loadingStates.metriques = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des KPI:', error);
        if (error.status === 401) return;
        // Utiliser les données par défaut en cas d'erreur serveur
        this.generalStats = this.getDefaultGeneralStats();
        this.loadingStates.stats = false;
      }
    });

    // Charger les ventes par mois
    this.dashboardService.getVentesParMois().subscribe({
      next: (data) => {
        this.ventesParMois = data;
        this.loadingStates.ventes = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ventes:', error);
        if (error.status === 401) return;
        // Utiliser les données par défaut en cas d'erreur serveur
        this.ventesParMois = this.getDefaultVentesParMois();
        this.loadingStates.ventes = false;
      }
    });

    // Charger les top articles vendus
    this.dashboardService.getTopArticlesVendus().subscribe({
      next: (data) => {
        // Mapper les données de l'API vers le format attendu par le template
        this.topArticles = data.map((item: any, index: number) => ({
          nom: item.article || `Article ${index + 1}`, // Nom de l'article
          quantiteVendue: item.quantiteVendue || 0,
          chiffreAffaires: item.chiffreAffaire || 0, // Note: sans "s" dans l'API
          tendance: 0, // À calculer si nécessaire
          nombreVentes: item.nombreVentes || 0
        }));
        console.log('Top articles mappés:', this.topArticles);
        this.loadingStates.articles = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        if (error.status === 401) return;
        // Données par défaut pour demo
        this.topArticles = this.getDefaultTopArticles();
        this.loadingStates.articles = false;
      }
    });

    // Charger les stocks par article
    this.dashboardService.getStocksParArticle().subscribe({
      next: (data) => {
        this.stocksParArticle = data;
        this.loadingStates.stocks = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stocks:', error);
        if (error.status === 401) return;
        // Utiliser les données par défaut en cas d'erreur serveur
        this.stocksParArticle = this.getDefaultStocksParArticle();
        this.loadingStates.stocks = false;
      }
    });

    // Charger les lots d'expiration proches
    this.dashboardService.getLotsExpirationProches().subscribe({
      next: (data) => {
        // Mapper les données du backend vers le format attendu par le template
        this.lotsExpirationProches = data.map((lot: any) => ({
          id: lot.Id || lot.id,
          numeroLot: lot.NumLot || lot.numLot || lot.numeroLot,
          nomArticle: lot.ArticleNom || lot.articleNom || lot.nomArticle,
          quantiteDisponible: lot.QuantiteDisponible || lot.quantiteDisponible,
          dateExpiration: lot.DateExpiration || lot.dateExpiration,
          joursRestants: lot.JoursRestants || lot.joursRestants
        }));
        this.loadingStates.lots = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des lots:', error);
        if (error.status === 401) return;
        // Données par défaut pour demo
        this.lotsExpirationProches = this.getDefaultLotsExpiration();
        this.loadingStates.lots = false;
      }
    });

    // Charger l'évolution du chiffre d'affaire
    this.dashboardService.getEvolutionChiffreAffaire().subscribe({
      next: (data) => {
        this.evolutionChiffreAffaire = data;
        this.loadingStates.chiffre = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du chiffre d\'affaire:', error);
        if (error.status === 401) return;
        // Utiliser les données par défaut en cas d'erreur serveur
        this.evolutionChiffreAffaire = this.getDefaultEvolutionChiffreAffaire();
        this.loadingStates.chiffre = false;
      }
    });

    // Charger les ventes par société
    this.dashboardService.getVentesParSociete().subscribe({
      next: (data) => {
        this.ventesParSociete = data;
        this.loadingStates.societes = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ventes par société:', error);
        if (error.status === 401) return;
        this.ventesParSociete = [];
        this.loadingStates.societes = false;
      }
    });

    // Charger les alertes stock
    this.dashboardService.getAlertsStock().subscribe({
      next: (data) => {
        // Mapper les données du backend vers le format attendu par le template
        this.alertesStock = data.map((alerte: any) => ({
          nomArticle: alerte.ArticleNom || alerte.articleNom || alerte.nomArticle,
          description: alerte.Statut || alerte.statut || alerte.description || 'Stock critique',
          quantiteRestante: alerte.QuantiteActuelle || alerte.quantiteActuelle || alerte.quantiteRestante || 0
        }));
        this.loadingStates.alertes = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des alertes:', error);
        if (error.status === 401) return;
        // Données par défaut pour demo
        this.alertesStock = this.getDefaultAlertes();
        this.loadingStates.alertes = false;
      }
    });

    // Charger les prix moyens articles
    this.dashboardService.getPrixMoyensArticles().subscribe({
      next: (data) => {
        this.prixMoyensArticles = data;
        this.loadingStates.prix = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prix moyens:', error);
        if (error.status === 401) return;
        this.prixMoyensArticles = [];
        this.loadingStates.prix = false;
      }
    });

    // Charger les performances vendeurs
    this.dashboardService.getPerformancesVendeurs().subscribe({
      next: (data) => {
        this.performancesVendeurs = data;
        this.loadingStates.vendeurs = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des performances:', error);
        if (error.status === 401) return;
        // Données par défaut pour demo
        this.performancesVendeurs = this.getDefaultPerformances();
        this.loadingStates.vendeurs = false;
      }
    });

    // Charger le résumé complet
    this.dashboardService.getResumeComplet().subscribe({
      next: (data) => {
        this.resumeComplet = data;
        this.loadingStates.resume = false;
        this.checkAllDataLoaded();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du résumé:', error);
        if (error.status === 401) return;
        this.resumeComplet = {};
        this.loadingStates.resume = false;
        this.checkAllDataLoaded();
      }
    });
  }

  loadDemoData() {
    console.log('Chargement des données de démonstration...');
    
    // Simuler un délai de chargement
    setTimeout(() => {
      this.generalStats = this.getDefaultGeneralStats();
      this.topArticles = this.getDefaultTopArticles();
      this.lotsExpirationProches = this.getDefaultLotsExpiration();
      this.alertesStock = this.getDefaultAlertes();
      this.performancesVendeurs = this.getDefaultPerformances();
      this.evolutionChiffreAffaire = this.getDefaultEvolutionChiffreAffaire();
      this.ventesParMois = this.getDefaultVentesParMois();
      this.stocksParArticle = this.getDefaultStocksParArticle();
      
      // Marquer tous les états de chargement comme terminés
      Object.keys(this.loadingStates).forEach(key => {
        this.loadingStates[key as keyof typeof this.loadingStates] = false;
      });
      
      this.isLoading = false;
    }, 1000);
  }

  private handleAuthError() {
    console.warn('Erreur d\'authentification - redirection vers la page de connexion');
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  private handleConnectionError() {
    this.connectionError = true;
    this.showDemoData = true;
  }

  private getDefaultGeneralStats() {
    return {
      chiffreAffaires: 125000,
      croissanceCA: 12.5,
      nombreVentes: 248,
      nouvelles: 45,
      stockTotal: 1250,
      societesActives: 15,
      totalSocietes: 18
    };
  }

  private getDefaultTopArticles() {
    return [
      { nom: 'Article Premium A', quantiteVendue: 145, chiffreAffaires: 15400, croissance: 8.2 },
      { nom: 'Produit Bestseller B', quantiteVendue: 132, chiffreAffaires: 12800, croissance: 12.5 },
      { nom: 'Item Populaire C', quantiteVendue: 98, chiffreAffaires: 9200, croissance: -2.1 },
      { nom: 'Service Excellence D', quantiteVendue: 87, chiffreAffaires: 8700, croissance: 15.3 },
      { nom: 'Produit Innovation E', quantiteVendue: 76, chiffreAffaires: 7600, croissance: 25.8 }
    ];
  }

  private getDefaultAlertes() {
    return [
      {
        nomArticle: 'Article Critique A',
        description: 'Stock en rupture imminente',
        quantiteRestante: 5
      },
      {
        nomArticle: 'Produit Essentiel B',
        description: 'Niveau de stock très bas',
        quantiteRestante: 12
      },
      {
        nomArticle: 'Composant Vital C',
        description: 'Réapprovisionnement urgent',
        quantiteRestante: 3
      }
    ];
  }

  private getDefaultPerformances() {
    return [
      {
        nom: 'Marie Dubois',
        email: 'marie.dubois@example.com',
        nombreVentes: 89,
        chiffreAffaires: 45200,
        performance: 92
      },
      {
        nom: 'Jean Martin',
        email: 'jean.martin@example.com',
        nombreVentes: 76,
        chiffreAffaires: 38900,
        performance: 85
      },
      {
        nom: 'Sophie Bernard',
        email: 'sophie.bernard@example.com',
        nombreVentes: 65,
        chiffreAffaires: 32500,
        performance: 78
      },
      {
        nom: 'Pierre Durand',
        email: 'pierre.durand@example.com',
        nombreVentes: 58,
        chiffreAffaires: 29100,
        performance: 72
      }
    ];
  }

  private getDefaultEvolutionChiffreAffaire() {
    return [
      { mois: 'Jan', valeur: 95000, croissance: 8.2 },
      { mois: 'Fév', valeur: 102000, croissance: 7.4 },
      { mois: 'Mar', valeur: 118000, croissance: 15.7 },
      { mois: 'Avr', valeur: 125000, croissance: 5.9 },
      { mois: 'Mai', valeur: 132000, croissance: 5.6 },
      { mois: 'Juin', valeur: 128000, croissance: -3.0 }
    ];
  }

  private getDefaultVentesParMois() {
    return [
      { mois: 'Jan', nombre: 45, montant: 95000 },
      { mois: 'Fév', nombre: 52, montant: 102000 },
      { mois: 'Mar', nombre: 68, montant: 118000 },
      { mois: 'Avr', nombre: 72, montant: 125000 },
      { mois: 'Mai', nombre: 78, montant: 132000 },
      { mois: 'Juin', nombre: 75, montant: 128000 }
    ];
  }

  checkAllDataLoaded() {
    this.isLoading = Object.values(this.loadingStates).some(state => state);
  }

  refreshData() {
    // Re-vérifier l'authentification avant de rafraîchir
    this.checkAuthenticationAndLoad();
  }

  // Méthodes utilitaires pour l'affichage
  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  formatCurrency(value: number | undefined | null): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0,00 €';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

  formatPercentage(value: number | undefined | null): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.0%';
    }
    return `${value.toFixed(1)}%`;
  }

  private getDefaultStocksParArticle() {
    return [
      {
        Article: 'Produit A',
        QuantiteStock: 150,
        NombreLots: 3,
        ValeurStock: 2250.00
      },
      {
        Article: 'Produit B',
        QuantiteStock: 75,
        NombreLots: 2,
        ValeurStock: 1125.00
      },
      {
        Article: 'Produit C',
        QuantiteStock: 200,
        NombreLots: 4,
        ValeurStock: 3000.00
      },
      {
        Article: 'Produit D',
        QuantiteStock: 50,
        NombreLots: 1,
        ValeurStock: 750.00
      },
      {
        Article: 'Produit E',
        QuantiteStock: 120,
        NombreLots: 2,
        ValeurStock: 1800.00
      }
    ];
  }

  private getDefaultLotsExpiration() {
    return [
      {
        id: 1,
        numeroLot: 'LOT001',
        nomArticle: 'Produit A',
        quantiteDisponible: 25,
        dateExpiration: '2025-10-15',
        joursRestants: 24
      },
      {
        id: 2,
        numeroLot: 'LOT002', 
        nomArticle: 'Produit B',
        quantiteDisponible: 15,
        dateExpiration: '2025-10-20',
        joursRestants: 29
      }
    ];
  }

  private getDefaultVentesParSociete() {
    return [
      {
        Societe: 'Société Alpha',
        NombreVentes: 45,
        QuantiteVendue: 320,
        ChiffreAffaire: 15750.00,
        PourcentageCA: 35.2
      },
      {
        Societe: 'Société Beta',
        NombreVentes: 32,
        QuantiteVendue: 280,
        ChiffreAffaire: 12400.00,
        PourcentageCA: 27.8
      },
      {
        Societe: 'Société Gamma',
        NombreVentes: 28,
        QuantiteVendue: 190,
        ChiffreAffaire: 8950.00,
        PourcentageCA: 20.0
      },
      {
        Societe: 'Société Delta',
        NombreVentes: 15,
        QuantiteVendue: 120,
        ChiffreAffaire: 7500.00,
        PourcentageCA: 17.0
      }
    ];
  }

  private getDefaultPrixMoyens() {
    return [
      {
        Article: 'Produit Premium',
        PrixMoyen: 45.50,
        PrixMin: 40.00,
        PrixMax: 50.00,
        NombreLots: 5
      },
      {
        Article: 'Produit Standard',
        PrixMoyen: 25.75,
        PrixMin: 22.00,
        PrixMax: 30.00,
        NombreLots: 8
      },
      {
        Article: 'Produit Économique',
        PrixMoyen: 15.25,
        PrixMin: 12.00,
        PrixMax: 18.00,
        NombreLots: 6
      }
    ];
  }

  private getDefaultPerformancesVendeurs() {
    return [
      {
        Id: 1,
        Nom: 'maleki',
        Email: 'malek@example.com',
        NombreVentes: 0,
        ChiffreAffaire: 0.0,
        DateCreation: '2025-01-15'
      },
      {
        Id: 2,
        Nom: 'Malek JENDOUBI',
        Email: 'john.doe@star.com.tn',
        NombreVentes: 0,
        ChiffreAffaire: 0.0,
        DateCreation: '2025-02-01'
      },
      {
        Id: 3,
        Nom: 'JENDOUBI',
        Email: 'malek.jendoubi@esprit.tn',
        NombreVentes: 0,
        ChiffreAffaire: 0.0,
        DateCreation: '2025-02-10'
      }
    ];
  }

  private getDefaultMetriquesClés() {
    return {
      VentesAujourdhui: 12,
      CAaujourdhui: 1250.00,
      VentesMoisActuel: 145,
      CAMoisActuel: 28750.00,
      EvolutionVentesMois: 8.5,
      EvolutionCAMois: 12.3,
      AlertesStockCritique: 4,
      LotsProchesExpiration: 2
    };
  }

  // Méthode pour forcer la connexion (à utiliser dans le template)
  goToLogin() {
    this.router.navigate(['/admin/login']);
  }
}
