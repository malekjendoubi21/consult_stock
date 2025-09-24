import { Component, OnInit } from '@angular/core';
import { VenteService, Vente } from '../../services/vente.service';
import { SocieteService, Societe } from '../../services/societe.service';

@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.scss']
})
export class VentesComponent implements OnInit {
  ventes: Vente[] = [];
  societes: Societe[] = [];
  selectedVente: Vente | null = null;
  currentVente: Vente = this.getEmptyVente();
  
  // Variables pour gérer l'affichage des cards
  showAddCard = false;
  showEditCard = false;
  showDetailCard = false;
  
  // Variable pour gérer le mode édition
  isEditMode = false;

  constructor(
    private venteService: VenteService,
    private societeService: SocieteService
  ) { }

  ngOnInit(): void {
    this.loadVentes();
    this.loadSocietes();
  }

  // Charger toutes les ventes
  loadVentes(): void {
    this.venteService.getAll().subscribe({
      next: (data) => {
        this.ventes = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ventes:', error);
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

  // Afficher la card d'ajout
  showAdd(): void {
    this.currentVente = this.getEmptyVente();
    this.isEditMode = false;
    this.showAddCard = true;
    this.showEditCard = false;
    this.showDetailCard = false;
  }

  // Afficher la card de modification
  showEdit(vente: Vente): void {
    this.currentVente = { ...vente };
    this.isEditMode = true;
    this.showAddCard = false;
    this.showEditCard = true;
    this.showDetailCard = false;
  }

  // Afficher la card de détail
  showDetail(vente: Vente): void {
    this.selectedVente = vente;
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = true;
  }

  // Masquer toutes les cards
  hideAllCards(): void {
    this.showAddCard = false;
    this.showEditCard = false;
    this.showDetailCard = false;
    this.selectedVente = null;
    this.currentVente = this.getEmptyVente();
  }

  // Sauvegarder (ajout ou modification)
  saveVente(): void {
    if (this.isEditMode && this.currentVente.id) {
      // Mode modification - utiliser UpdateVenteDto
      const updateDto = {
        societeId: this.currentVente.societeId,
        article: this.currentVente.article,
        lot: this.currentVente.lot,
        qteVendu: this.currentVente.qteVendu,
        date: this.currentVente.date
      };
      this.venteService.update(this.currentVente.id, updateDto).subscribe({
        next: (data) => {
          console.log('Vente modifiée avec succès');
          this.loadVentes();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
        }
      });
    } else {
      // Mode ajout - utiliser CreateVenteDto
      const createDto = {
        societeId: this.currentVente.societeId,
        article: this.currentVente.article,
        lot: this.currentVente.lot,
        qteVendu: this.currentVente.qteVendu,
        date: this.currentVente.date
      };
      this.venteService.create(createDto).subscribe({
        next: (data) => {
          console.log('Vente créée avec succès');
          this.loadVentes();
          this.hideAllCards();
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }

  // Supprimer une vente
  deleteVente(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      this.venteService.delete(id).subscribe({
        next: () => {
          console.log('Vente supprimée avec succès');
          this.loadVentes();
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

  // Formater la date pour l'affichage
  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR');
  }

  // Obtenir une vente vide pour les formulaires
  private getEmptyVente(): Vente {
    return {
      societeId: 0,
      article: '',
      lot: '',
      qteVendu: 0,
      date: new Date(), // Date du jour
      prixUnitaire: 0,
      prixTotal: 0
    };
  }
}
