import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.scss']
})
export class ProfileAdminComponent implements  OnInit {
  profile: any = {};
  isEditing = false;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.adminService.getProfile().subscribe({
      next: (res) => (this.profile = res),
      error: (err) => console.error(err)
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveProfile() {
    this.adminService.update(this.profile.id, this.profile).subscribe({
      next: () => {
        this.isEditing = false;
        Swal.fire('Succès', 'Profil mis à jour avec succès', 'success');
      },
      error: (err) => Swal.fire('Erreur', 'Impossible de mettre à jour le profil', 'error')
    });
  }

  deleteAccount() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.delete(this.profile.id).subscribe({
          next: () => {
            Swal.fire('Supprimé', 'Votre compte a été supprimé', 'success');
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          },
          error: () => Swal.fire('Erreur', 'Impossible de supprimer le compte', 'error')
        });
      }
    });
  }
}
