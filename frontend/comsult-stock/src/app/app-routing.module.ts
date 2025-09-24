import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './user/auth/auth.component';
import {ProfileComponent} from "./user/profile/profile.component";
import {HomeComponent} from "./home/home/home.component";
import {LoginComponent} from "./admin/login/login.component";
import {UsersComponent} from "./admin/users/users.component";
import {DashboaredComponent} from "./admin/dashboared/dashboared.component";
import {ProfileAdminComponent} from "./admin/profile-admin/profile-admin.component";
import { ArticlesComponent } from './admin/articles/articles.component';
import { LotsComponent } from './admin/lots/lots.component';
import { SocietesComponent } from './admin/societes/societes.component';
import { StockComponent } from './admin/stock/stock.component';
import { VentesComponent } from './admin/ventes/ventes.component';

const routes: Routes = [

  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: HomeComponent },


  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/dashboard', component: DashboaredComponent },
  { path: 'admin/profile', component: ProfileAdminComponent },
  { path: 'admin/articles', component: ArticlesComponent },
  { path: 'admin/lots', component: LotsComponent },
  { path: 'admin/societes', component: SocietesComponent },
  { path: 'admin/stock', component: StockComponent },
  { path: 'admin/ventes', component: VentesComponent },




  { path: '**', redirectTo: 'auth' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
