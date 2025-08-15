import { Component, OnInit } from '@angular/core';
import { ArticleService, Article } from '../../services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  selectedArticle: Article | null = null;
  currentArticle: Article = this.getEmptyArticle();
  
  // Variables pour gérer l'affichage des cards
  showAddCard = false;
  showEditCard = false;
  showDetailCard = false;
  
  // Variable pour gérer le mode édition
  isEditMode = false;

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.loadArticles();
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

  // Afficher la card d'ajout
  showAdd(): void {
    this.currentArticle = this.getEmptyArticle();
    this.isEditMode = false;
    this.showAddCard = true;
    this.showEditCard = false;
    this.showDetailCard = false;
  }

  // Afficher la card de modification
  showEdit(article: Article): void {
    this.currentArticle = { ...article };
    this.isEditMode = true;
    this.showAddCard = false;
    this.showEditCard = true;
    this.showDetailCard = false;
  }

  // Afficher la card de détail
  showDetail(article: Article): void {
    this.selectedArticle = article;
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = true;
  }

  // Masquer toutes les cards
  hideAllCards(): void {
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = false;
    this.selectedArticle = null;
    this.currentArticle = this.getEmptyArticle();
  }

  // Sauvegarder (ajout ou modification)
  saveArticle(): void {
    if (this.isEditMode && this.currentArticle.id) {
      // Mode modification
      this.articleService.update(this.currentArticle.id, this.currentArticle).subscribe({
        next: (data) => {
          console.log('Article modifié avec succès');
          this.loadArticles();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
        }
      });
    } else {
      // Mode ajout
      this.articleService.create(this.currentArticle).subscribe({
        next: (data) => {
          console.log('Article créé avec succès');
          this.loadArticles();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }

  // Supprimer un article
  deleteArticle(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articleService.delete(id).subscribe({
        next: () => {
          console.log('Article supprimé avec succès');
          this.loadArticles();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  // Obtenir un article vide pour les formulaires
  private getEmptyArticle(): Article {
    return {
      nom: '',
      codeArticle: '',
      prixTTC: 0,
      prixHT: 0
    };
  }
}
