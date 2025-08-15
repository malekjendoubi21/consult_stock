import { Component, OnInit } from '@angular/core';
import { SocieteService, Societe } from '../../services/societe.service';

@Component({
  selector: 'app-societes',
  templateUrl: './societes.component.html',
  styleUrls: ['./societes.component.scss']
})
export class SocietesComponent implements OnInit {
  societes: Societe[] = [];
  selectedSociete: Societe | null = null;
  currentSociete: Societe = this.getEmptySociete();
  
  // Variables pour gérer l'affichage des cards
  showAddCard = false;
  showEditCard = false;
  showDetailCard = false;
  
  // Variable pour gérer le mode édition
  isEditMode = false;

  constructor(private societeService: SocieteService) { }

  ngOnInit(): void {
    this.loadSocietes();
  }

  // Charger toutes les sociétés
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

  // Afficher la card d'ajout
  showAdd(): void {
    this.currentSociete = this.getEmptySociete();
    this.isEditMode = false;
    this.showAddCard = true;
    this.showEditCard = false;
    this.showDetailCard = false;
  }

  // Afficher la card de modification
  showEdit(societe: Societe): void {
    this.currentSociete = { ...societe };
    this.isEditMode = true;
    this.showAddCard = false;
    this.showEditCard = true;
    this.showDetailCard = false;
  }

  // Afficher la card de détail
  showDetail(societe: Societe): void {
    this.selectedSociete = societe;
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = true;
  }

  // Masquer toutes les cards
  hideAllCards(): void {
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = false;
    this.selectedSociete = null;
    this.currentSociete = this.getEmptySociete();
  }

  // Sauvegarder (ajout ou modification)
  saveSociete(): void {
    if (this.isEditMode && this.currentSociete.id) {
      // Mode modification
      this.societeService.update(this.currentSociete.id, this.currentSociete).subscribe({
        next: (data) => {
          console.log('Société modifiée avec succès');
          this.loadSocietes();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
        }
      });
    } else {
      // Mode ajout
      this.societeService.create(this.currentSociete).subscribe({
        next: (data) => {
          console.log('Société créée avec succès');
          this.loadSocietes();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }

  }

  // Supprimer une société
  deleteSociete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette société ?')) {
      this.societeService.delete(id).subscribe({
        next: () => {
          console.log('Société supprimée avec succès');
          this.loadSocietes();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  // Obtenir une société vide pour les formulaires
  private getEmptySociete(): Societe {
    return {
      nom: '',
      adresse: ''
    };
  }
}
