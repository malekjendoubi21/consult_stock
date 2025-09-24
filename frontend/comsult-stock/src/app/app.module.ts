import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './user/auth/auth.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './user/profile/profile.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { FooterComponent } from './home/footer/footer.component';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './admin/login/login.component';
import { UsersComponent } from './admin/users/users.component';
import { DashboaredComponent } from './admin/dashboared/dashboared.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { ProfileAdminComponent } from './admin/profile-admin/profile-admin.component';
import { ArticlesComponent } from './admin/articles/articles.component';
import { LotsComponent } from './admin/lots/lots.component';
import { SocietesComponent } from './admin/societes/societes.component';
import { StockComponent } from './admin/stock/stock.component';
import { TicketsComponent } from './admin/tickets/tickets.component';
import { VentesComponent } from './admin/ventes/ventes.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    DashboaredComponent,
    AdminNavbarComponent,
    ProfileAdminComponent,
    ArticlesComponent,
    LotsComponent,
    SocietesComponent,
    StockComponent,
    TicketsComponent,
    VentesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
