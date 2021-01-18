import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/back-office/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/back-office/home/home.component';
import { MainMenuComponent } from './components/mainMenu/main-menu.component';
import { HeaderNabvarComponent } from './components/headerNavbar/header-nabvar.component';
import { MainComponent } from './pages/back-office/main/main.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { RolesGridComponent } from './pages/back-office/roles/roles-grid/roles-grid.component';
import { PaginacionComponent } from './components/paginacion/paginacion/paginacion.component';
import { RolesFormComponent } from './pages/back-office/roles/roles-form/roles-form.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { SpinnerComponent } from './components/spinner/spinner.component'; //Necesario para usar formGroup y formControl

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainMenuComponent,
    HeaderNabvarComponent,
    MainComponent,
    ToastComponent,
    ToastsComponent,
    RolesGridComponent,
    PaginacionComponent,
    RolesFormComponent,
    ModalDialogComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
