import { Component, OnInit } from '@angular/core';
import { LotService, Lot } from '../../services/lot.service';
import { ArticleService, Article } from '../../services/article.service';

@Component({
  selector: 'app-lots',
  templateUrl: './lots.component.html',
  styleUrls: ['./lots.component.css']
})
export class LotsComponent implements OnInit {
  lots: Lot[] = [];
  articles: Article[] = [];
  selectedLot: Lot | null = null;
  currentLot: Lot = this.getEmptyLot();
  
  // Variables pour gérer l'affichage des cards
  showAddCard = false;
  showEditCard = false;
  showDetailCard = false;
  
  // Variable pour gérer le mode édition
  isEditMode = false;

  constructor(
    private lotService: LotService,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.loadLots();
    this.loadArticles();
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

  // Charger tous les articles pour le dropdown
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

  // Afficher la card d'ajout
  showAdd(): void {
    this.currentLot = this.getEmptyLot();
    this.isEditMode = false;
    this.showAddCard = true;
    this.showEditCard = false;
    this.showDetailCard = false;
  }

  // Afficher la card de modification
  showEdit(lot: Lot): void {
    this.currentLot = { ...lot };
    this.isEditMode = true;
    this.showAddCard = false;
    this.showEditCard = true;
    this.showDetailCard = false;
  }

  // Afficher la card de détail
  showDetail(lot: Lot): void {
    this.selectedLot = lot;
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = true;
  }

  // Masquer toutes les cards
  hideAllCards(): void {
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = false;
    this.selectedLot = null;
    this.currentLot = this.getEmptyLot();
  }

  // Sauvegarder (ajout ou modification)
  saveLot(): void {
    if (this.isEditMode && this.currentLot.id) {
      // Mode modification
      this.lotService.update(this.currentLot.id, this.currentLot).subscribe({
        next: (data) => {
          console.log('Lot modifié avec succès');
          this.loadLots();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
        }
      });
    } else {
      // Mode ajout
      this.lotService.create(this.currentLot).subscribe({
        next: (data) => {
          console.log('Lot créé avec succès');
          this.loadLots();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }

  // Supprimer un lot
  deleteLot(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
      this.lotService.delete(id).subscribe({
        next: () => {
          console.log('Lot supprimé avec succès');
          this.loadLots();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  // Obtenir le nom de l'article par ID
  getArticleName(articleId: number): string {
    const article = this.articles.find(a => a.id === articleId);
    return article ? article.nom : 'Article inconnu';
  }

  // Obtenir un lot vide pour les formulaires
  private getEmptyLot(): Lot {
    return {
      articleId: 0,
      quantiteDisponible: 0,
      articleCode: ''
    };
  }
}
