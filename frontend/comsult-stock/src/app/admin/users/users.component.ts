import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { VendeurService, Vendeur } from '../../services/vendeur.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  admins: any[] = [];
  vendeurs: Vendeur[] = [];

  // Formulaires et affichages
  showAdminForm = false;
  showVendeurForm = false;
  editingAdmin: any = null;
  editingVendeur: Vendeur | null = null;

  newAdmin = { nom: '', login: '', motDePasse: '' };
  newVendeur: Vendeur = { nom: '', email: '', passwordHash: '' };

  constructor(
    private adminService: AdminService,
    private vendeurService: VendeurService
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadVendeurs();
  }

  // --- ADMIN CRUD ---
  loadAdmins() {
    this.adminService.getAll().subscribe({
      next: (data) => (this.admins = data),
      error: (err) => console.error('Erreur chargement admins:', err)
    });
  }

  addAdmin() {
    this.adminService.register(this.newAdmin).subscribe({
      next: () => {
        this.loadAdmins();
        this.showAdminForm = false;
        this.newAdmin = { nom: '', login: '', motDePasse: '' };
      },
      error: (err) => console.error('Erreur ajout admin:', err)
    });
  }

  editAdmin(admin: any) {
    this.editingAdmin = { ...admin };
  }

  updateAdmin() {
    this.adminService.update(this.editingAdmin.id, this.editingAdmin).subscribe({
      next: () => {
        this.loadAdmins();
        this.editingAdmin = null;
      },
      error: (err) => console.error('Erreur maj admin:', err)
    });
  }

  deleteAdmin(id: number) {
    if (confirm('Voulez-vous supprimer cet admin ?')) {
      this.adminService.delete(id).subscribe(() => this.loadAdmins());
    }
  }

  // --- VENDEUR CRUD ---
  loadVendeurs() {
    this.vendeurService.getAll().subscribe({
      next: (data) => (this.vendeurs = data),
      error: (err) => console.error('Erreur chargement vendeurs:', err)
    });
  }

  addVendeur() {
    this.vendeurService.create(this.newVendeur).subscribe({
      next: () => {
        this.loadVendeurs();
        this.showVendeurForm = false;
        this.newVendeur = { nom: '', email: '', passwordHash: '' };
      },
      error: (err) => console.error('Erreur ajout vendeur:', err)
    });
  }

  editVendeur(vendeur: Vendeur) {
    this.editingVendeur = { ...vendeur };
  }

  updateVendeur() {
    if (!this.editingVendeur?.id) return;
    this.vendeurService.update(this.editingVendeur.id, this.editingVendeur).subscribe({
      next: () => {
        this.loadVendeurs();
        this.editingVendeur = null;
      },
      error: (err) => console.error('Erreur maj vendeur:', err)
    });
  }

  deleteVendeur(id: number) {
    if (confirm('Voulez-vous supprimer ce vendeur ?')) {
      this.vendeurService.delete(id).subscribe(() => this.loadVendeurs());
    }
  }
}
