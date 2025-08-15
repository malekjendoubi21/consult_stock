import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocieteService, Societe } from '../../services/societe.service';
import { ArticleService } from '../../services/article.service';
import { StockService } from '../../services/stock.service';
import { LotService } from '../../services/lot.service';
import { VenteService } from '../../services/vente.service';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';

interface Article {
  id: number;
  nom: string;
  code: string;
  description?: string;
  stock?: number;
  prix?: number;
}

interface Lot {
  id: number;
  numero: string;
  quantiteDisponible: number;
  prixTTC: number;
  dateExpiration?: Date;
  articleId: number;
}

interface Stock {
  article: Article;
  lots: Lot[];
}

interface VenteItem {
  articleId: number;
  articleNom: string;
  lotId: number;
  lotNumero: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
}

interface Ticket {
  id: string;
  vendeurNom: string;
  societeNom: string;
  dateVente: Date;
  montantTotal: number;
  items: VenteItem[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Données utilisateur
  vendeurProfile: any = null;
  
  // Gestion des sociétés
  societes: Societe[] = [];
  selectedSociete: Societe | null = null;
  societeSelectionnee: Societe | null = null;
  
  // Recherche d'articles
  searchTerm: string = '';
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  
  // Consultation du stock
  selectedArticle: Article | null = null;
  stockDetails: Stock | null = null;
  
  // Gestion des ventes
  panier: VenteItem[] = [];
  showVenteModal: boolean = false;
  
  // États d'affichage
  activeView: 'societes' | 'recherche' | 'stock' | 'vente' | 'tickets' = 'societes';
  
  // Tickets générés
  tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  showTicketModal: boolean = false;

  constructor(
    private authService: AuthService,
    private societeService: SocieteService,
    private articleService: ArticleService,
    private stockService: StockService,
    private lotService: LotService,
    private venteService: VenteService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVendeurProfile();
    this.loadSocietes();
    // Charger les tickets sauvegardés
    // this.tickets = this.ticketService.chargerTickets(); // TODO: décommenter quand le service sera prêt
  }

  // Charger le profil du vendeur connecté
  loadVendeurProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.vendeurProfile = profile;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.router.navigate(['/auth']);
      }
    });
  }

  // Charger la liste des sociétés
  loadSocietes(): void {
    this.societeService.getAll().subscribe({
      next: (societes) => {
        this.societes = societes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sociétés:', error);
      }
    });
  }

  // Sélectionner une société
  selectSociete(societe: Societe): void {
    this.selectedSociete = societe;
    this.societeSelectionnee = societe;
    this.activeView = 'recherche';
    this.loadArticles();
  }

  // Charger les articles (utilise l'API réelle)
  loadArticles(): void {
    if (!this.selectedSociete) return;
    
    // Pour l'instant, utilisons des données fictives car l'API peut ne pas être prête
    this.articles = [
      { id: 1, nom: 'Article A', code: 'ART001', description: 'Description article A' },
      { id: 2, nom: 'Article B', code: 'ART002', description: 'Description article B' },
      { id: 3, nom: 'Article C', code: 'ART003', description: 'Description article C' }
    ];
    this.filteredArticles = [...this.articles];

    // TODO: Décommenter quand l'API sera prête
    /*
    this.articleService.getBySociete(this.selectedSociete.id!).subscribe({
      next: (articles: any) => {
        this.articles = articles;
        this.filteredArticles = [...this.articles];
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des articles:', error);
        // Fallback avec des données fictives
        this.articles = [
          { id: 1, nom: 'Article A', code: 'ART001', description: 'Description article A' },
          { id: 2, nom: 'Article B', code: 'ART002', description: 'Description article B' },
          { id: 3, nom: 'Article C', code: 'ART003', description: 'Description article C' }
        ];
        this.filteredArticles = [...this.articles];
      }
    });
    */
  }

  // Rechercher des articles
  searchArticles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredArticles = [...this.articles];
      return;
    }

    this.filteredArticles = this.articles.filter(article =>
      article.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      article.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Consulter le stock d'un article
  consulterStock(article: Article): void {
    this.selectedArticle = article;
    this.activeView = 'stock';
    this.loadStockDetails(article.id);
  }

  // Charger les détails du stock (lots) - utilise l'API réelle
  loadStockDetails(articleId: number): void {
    if (!this.selectedSociete) return;

    // Pour l'instant, utilisons des données fictives
    const lots = [
      { id: 1, numero: 'LOT001', quantiteDisponible: 50, prixTTC: 25.99, dateExpiration: new Date('2024-12-31'), articleId },
      { id: 2, numero: 'LOT002', quantiteDisponible: 30, prixTTC: 26.50, dateExpiration: new Date('2025-06-30'), articleId },
      { id: 3, numero: 'LOT003', quantiteDisponible: 75, prixTTC: 24.99, dateExpiration: new Date('2025-03-15'), articleId }
    ];

    this.stockDetails = {
      article: this.selectedArticle!,
      lots: lots
    };

    // TODO: Décommenter quand l'API sera prête
    /*
    this.lotService.getByArticleId(articleId).subscribe({
      next: (lots: any) => {
        this.stockDetails = {
          article: this.selectedArticle!,
          lots: lots
        };
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du stock:', error);
        // Fallback avec des données fictives
        const lots = [
          { id: 1, numero: 'LOT001', quantiteDisponible: 50, prixTTC: 25.99, dateExpiration: new Date('2024-12-31'), articleId },
          { id: 2, numero: 'LOT002', quantiteDisponible: 30, prixTTC: 26.50, dateExpiration: new Date('2025-06-30'), articleId },
          { id: 3, numero: 'LOT003', quantiteDisponible: 75, prixTTC: 24.99, dateExpiration: new Date('2025-03-15'), articleId }
        ];

        this.stockDetails = {
          article: this.selectedArticle!,
          lots: lots
        };
      }
    });
    */
  }

  // Ajouter un article au panier
  ajouterAuPanier(lot: any, quantite: any): void {
    const qte = parseInt(quantite);
    if (qte <= 0 || qte > lot.quantiteDisponible) {
      alert('Quantité invalide !');
      return;
    }

    const existingItem = this.panier.find(item => item.lotId === lot.id);
    
    if (existingItem) {
      existingItem.quantite += qte;
      existingItem.sousTotal = existingItem.quantite * existingItem.prixUnitaire;
    } else {
      const newItem: VenteItem = {
        articleId: this.selectedArticle!.id,
        articleNom: this.selectedArticle!.nom,
        lotId: lot.id,
        lotNumero: lot.numero,
        quantite: qte,
        prixUnitaire: lot.prixTTC,
        sousTotal: qte * lot.prixTTC
      };
      this.panier.push(newItem);
    }

    // Mettre à jour la quantité disponible du lot
    lot.quantiteDisponible -= qte;
  }

  // Afficher la vue vente
  afficherVente(): void {
    this.activeView = 'vente';
  }

  // Finaliser la vente et générer un ticket
  finaliserVente(): void {
    if (this.panier.length === 0) {
      alert('Le panier est vide !');
      return;
    }

    const montantTotal = this.panier.reduce((total, item) => total + item.sousTotal, 0);
    
    // Générer le ticket manuellement pour l'instant
    const nouveauTicket: Ticket = {
      id: this.generateTicketId(),
      vendeurNom: this.vendeurProfile?.nom || 'Vendeur',
      societeNom: this.selectedSociete?.nom || 'Société',
      dateVente: new Date(),
      montantTotal: montantTotal,
      items: [...this.panier]
    };

    this.tickets.push(nouveauTicket);
    this.panier = []; // Vider le panier
    
    // Afficher le ticket généré
    this.selectedTicket = nouveauTicket;
    this.showTicketModal = true;
    
    alert('Vente finalisée avec succès !');

    // TODO: Envoyer la vente à l'API backend et utiliser le service ticket
  }

  // Générer un ID unique pour le ticket
  generateTicketId(): string {
    return 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  // Imprimer un ticket
  imprimerTicket(ticket: Ticket): void {
    // TODO: Utiliser le service ticket pour l'impression
    // this.ticketService.imprimerTicket(ticket);
    
    // Pour l'instant, utiliser la fonction print basique du navigateur
    window.print();
  }

  // Calculer le total du panier
  getTotalPanier(): number {
    return this.panier.reduce((total, item) => total + item.sousTotal, 0);
  }

  // Vérifier si une date est expirée
  isDateExpired(date: Date | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    const expirationDate = new Date(date);
    return expirationDate < today;
  }

  // Obtenir la classe CSS pour la date d'expiration
  getDateClass(date: Date | undefined): string {
    return this.isDateExpired(date) ? 'text-red-600' : 'text-gray-900';
  }

  // Obtenir une couleur aléatoire pour les cartes de société
  getRandomColor(index: number): string {
    const colors = ['blue', 'purple', 'green', 'indigo', 'pink', 'teal', 'orange', 'red'];
    return colors[index % colors.length];
  }

  // Générer un email fictif pour une société
  getSocieteEmail(societe: Societe): string {
    const cleanName = societe.nom.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    return `contact@${cleanName}.com`;
  }

  // Obtenir le gradient CSS pour une carte
  getGradientClass(index: number): string {
    const color = this.getRandomColor(index);
    return `from-${color}-400 to-${color}-600`;
  }

  // Afficher les tickets
  afficherTickets(): void {
    this.activeView = 'tickets';
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  // Retour au menu principal
  retourMenu(): void {
    this.activeView = 'societes';
    this.selectedSociete = null;
    this.selectedArticle = null;
    this.stockDetails = null;
    this.searchTerm = '';
  }
}
