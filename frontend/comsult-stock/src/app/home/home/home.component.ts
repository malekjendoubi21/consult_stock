import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocieteService, Societe } from '../../services/societe.service';
import { ArticleService, ArticleSelectDto } from '../../services/article.service';
import { StockService } from '../../services/stock.service';
import { LotService, LotSelectDto } from '../../services/lot.service';
import { VenteService, VenteArticleDto, VenteCreatedResponseDto } from '../../services/vente.service';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';

// Using ArticleSelectDto from the service instead of local interface
type Article = ArticleSelectDto;

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
  articleCode: string; // Ajout pour le VenteArticleDto
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
  
  // Menu mobile
  mobileMenuOpen: boolean = false;
  
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
        // Ne pas rediriger vers l'auth si c'est juste un problème d'endpoint
        // Créer un profil par défaut temporaire
        this.vendeurProfile = {
          id: 0,
          nom: 'Vendeur',
          email: 'vendeur@email.com'
        };
        console.log('Profil par défaut utilisé en raison de l\'erreur API');
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

  // Charger les articles avec stock pour la société sélectionnée
  loadArticles(): void {
    if (!this.selectedSociete) return;
    
    this.articleService.getArticlesWithStockBySociete(this.selectedSociete.id!).subscribe({
      next: (articles: ArticleSelectDto[]) => {
        this.articles = articles;
        this.filteredArticles = [...this.articles];
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des articles avec stock:', error);
        // Fallback avec des données fictives
        this.articles = [
          { id: 1, nom: 'Article A', codeArticle: 'ART001', prixTTC: 25.99, prixHT: 21.66 },
          { id: 2, nom: 'Article B', codeArticle: 'ART002', prixTTC: 26.50, prixHT: 22.08 },
          { id: 3, nom: 'Article C', codeArticle: 'ART003', prixTTC: 24.99, prixHT: 20.83 }
        ];
        this.filteredArticles = [...this.articles];
      }
    });
  }

  // Rechercher des articles
  searchArticles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredArticles = [...this.articles];
      return;
    }

    this.filteredArticles = this.articles.filter(article =>
      article.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      article.codeArticle.toLowerCase().includes(this.searchTerm.toLowerCase())
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

    // Utiliser la méthode getLotsForSelect du service
    this.lotService.getLotsForSelect(articleId).subscribe({
      next: (lots: LotSelectDto[]) => {
        // Convertir LotSelectDto en format Lot pour compatibilité
        const lotsFormated = lots.map((lot: LotSelectDto) => ({
          id: lot.id,
          numero: lot.numLot,
          quantiteDisponible: lot.quantiteDisponible,
          prixTTC: lot.prixUnitaire,
          dateExpiration: lot.dateExpiration ? new Date(lot.dateExpiration) : undefined,
          articleId: lot.articleId
        }));

        this.stockDetails = {
          article: this.selectedArticle!,
          lots: lotsFormated
        };
        
        console.log('Lots chargés avec succès:', lotsFormated);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du stock avec getLotsForSelect:', error);
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
        articleCode: this.selectedArticle!.codeArticle, // Ajout du code article
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

    if (!this.selectedSociete) {
      alert('Aucune société sélectionnée !');
      return;
    }

    // Appeler l'API vendreArticle pour chaque item du panier
    const ventesPromises = this.panier.map(item => {
      const venteDto: VenteArticleDto = {
        societeId: this.selectedSociete!.id!,
        codeArticle: item.articleCode,
        numLot: item.lotNumero,
        quantite: item.quantite,
        imprimerTicket: false, // On gère l'impression séparément
        dateVente: new Date(), // Date actuelle
        prixUnitaireFourni: item.prixUnitaire // Prix du panier (optionnel)
      };

      return this.venteService.vendreArticle(venteDto).toPromise();
    });

    // Exécuter toutes les ventes en parallèle
    Promise.all(ventesPromises)
      .then((responses: (VenteCreatedResponseDto | undefined)[]) => {
        // Filtrer les réponses non undefined
        const validResponses = responses.filter(r => r !== undefined) as VenteCreatedResponseDto[];
        
        console.log('Toutes les ventes ont été enregistrées avec succès:', validResponses);
        
        // Créer et afficher le ticket après succès de toutes les ventes
        this.creerTicketApresVente(validResponses);
        
        alert('Vente finalisée avec succès !');
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement des ventes:', error);
        alert('Erreur lors de la finalisation de la vente. Veuillez réessayer.');
      });
  }

  // Créer le ticket après succès des ventes avec les données du backend
  private creerTicketApresVente(responses: VenteCreatedResponseDto[]): void {
    // Utiliser les données réelles du backend pour le montant total
    const montantTotal = responses.reduce((total, response) => total + response.prixTotal, 0);
    
    // Créer les items du ticket avec les données du backend
    const ticketItems: VenteItem[] = responses.map(response => ({
      articleId: 0, // Non disponible dans la réponse
      articleNom: response.article,
      articleCode: '', // Non disponible dans la réponse  
      lotId: 0, // Non disponible dans la réponse
      lotNumero: response.lot,
      quantite: response.qteVendu,
      prixUnitaire: response.prixUnitaire,
      sousTotal: response.prixTotal
    }));
    
    // Générer le ticket avec les données réelles
    const nouveauTicket: Ticket = {
      id: this.generateTicketId(),
      vendeurNom: this.vendeurProfile?.nom || 'Vendeur',
      societeNom: responses[0]?.societeNom || this.selectedSociete?.nom || 'Société',
      dateVente: new Date(responses[0]?.date || new Date()),
      montantTotal: montantTotal,
      items: ticketItems
    };

    this.tickets.push(nouveauTicket);
    
    // Afficher le ticket généré
    this.selectedTicket = nouveauTicket;
    this.showTicketModal = true;
    
    // Vider le panier après succès
    this.panier = [];
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
    this.mobileMenuOpen = false; // Fermer le menu mobile si ouvert
  }

  // Toggle menu mobile
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Aller au profil
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
