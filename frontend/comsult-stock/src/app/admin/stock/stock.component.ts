import { Component, OnInit } from '@angular/core';
import { StockService, Stock } from '../../services/stock.service';
import { SocieteService, Societe } from '../../services/societe.service';
import { ArticleService } from '../../services/article.service';
import { LotService } from '../../services/lot.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stocks: Stock[] = [];
  societes: Societe[] = [];
  articles: any[] = [];
  lots: any[] = [];
  selectedStock: Stock | null = null;
  currentStock: Stock = this.getEmptyStock();
  
  // Variables pour gérer l'affichage des cards
  showAddCard = false;
  showEditCard = false;
  showDetailCard = false;
  
  // Variable pour gérer le mode édition
  isEditMode = false;

  constructor(
    private stockService: StockService,
    private societeService: SocieteService,
    private articleService: ArticleService,
    private lotService: LotService
  ) { }

  ngOnInit(): void {
    // Test de connectivité d'abord
    this.testConnectivity();
    this.loadStocks();
    this.loadSocietes();
    this.loadArticles();
    this.loadLots();
  }

  // Test de connectivité avec la route debug
  testConnectivity(): void {
    this.stockService.getDebugData().subscribe({
      next: (data) => {
        console.log('Connectivité OK - Données de debug:', data);
      },
      error: (error) => {
        console.error('Erreur de connectivité:', error);
      }
    });
  }

  // Charger tous les stocks
  loadStocks(): void {
    this.stockService.getAll().subscribe({
      next: (data) => {
        this.stocks = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stocks:', error);
      }
    });
  }

  // Charger toutes les sociétés pour le dropdown
  loadSocietes(): void {
    this.societeService.getAll().subscribe({
      next: (data) => {
        this.societes = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sociétés:', error);
      }
    });
  }

  // Charger tous les articles
  loadArticles(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
      }
    });
  }

  // Charger tous les lots
  loadLots(): void {
    this.lotService.getAll().subscribe({
      next: (data) => {
        this.lots = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des lots:', error);
      }
    });
  }

  // Afficher la card d'ajout
  showAdd(): void {
    this.currentStock = this.getEmptyStock();
    this.isEditMode = false;
    this.showAddCard = true;
    this.showEditCard = false;
    this.showDetailCard = false;
  }

  // Afficher la card de modification
  showEdit(stock: Stock): void {
    this.currentStock = { ...stock };
    this.isEditMode = true;
    this.showAddCard = false;
    this.showEditCard = true;
    this.showDetailCard = false;
  }

  // Afficher la card de détail
  showDetail(stock: Stock): void {
    this.selectedStock = stock;
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = true;
  }

  // Masquer toutes les cards
  hideAllCards(): void {
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = false;
    this.selectedStock = null;
    this.currentStock = this.getEmptyStock();
  }

  // Sauvegarder (ajout ou modification)
  saveStock(): void {
    // Validation des champs requis
    if (!this.currentStock.articleId || this.currentStock.articleId === 0) {
      alert('Veuillez sélectionner un article');
      return;
    }
    if (!this.currentStock.lotId || this.currentStock.lotId === 0) {
      alert('Veuillez sélectionner un lot');
      return;
    }
    if (!this.currentStock.societeId || this.currentStock.societeId === 0) {
      alert('Veuillez sélectionner une société');
      return;
    }

    if (this.isEditMode && this.currentStock.id) {
      // Mode modification - créer un DTO avec les champs requis
      const updateDto = {
        societeId: this.currentStock.societeId,
        articleId: this.currentStock.articleId,
        lotId: this.currentStock.lotId,
        codeBarre: this.currentStock.codeBarre,
        numLot: this.currentStock.numLot,
        qteDispo: this.currentStock.qteDispo,
        prixTTC: this.currentStock.prixTTC,
        dateExpiration: this.currentStock.dateExpiration
      };
      this.stockService.update(this.currentStock.id, updateDto).subscribe({
        next: (data) => {
          console.log('Stock modifié avec succès');
          this.loadStocks();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
        }
      });
    } else {
      // Mode ajout - créer un DTO avec les champs requis
      const createDto = {
        societeId: this.currentStock.societeId,
        articleId: this.currentStock.articleId,
        lotId: this.currentStock.lotId,
        codeBarre: this.currentStock.codeBarre,
        numLot: this.currentStock.numLot,
        qteDispo: this.currentStock.qteDispo
      };
      this.stockService.create(createDto).subscribe({
        next: (data) => {
          console.log('Stock créé avec succès');
          this.loadStocks();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }

  // Supprimer un stock
  deleteStock(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stock ?')) {
      this.stockService.delete(id).subscribe({
        next: () => {
          console.log('Stock supprimé avec succès');
          this.loadStocks();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  // Obtenir le nom de la société par ID
  getSocieteNom(societeId: number): string {
    const societe = this.societes.find(s => s.id === societeId);
    return societe ? societe.nom : 'Société inconnue';
  }

  // Obtenir un stock vide pour les formulaires
  private getEmptyStock(): Stock {
    return {
      societeId: 0,
      articleId: 0,
      lotId: 0,
      codeBarre: '',
      numLot: '',
      qteDispo: 0,
      prixTTC: 0,
      dateExpiration: undefined
    };
  }
}
