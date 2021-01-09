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
import { ToastsComponent } from './components/toasts/toasts.component'; //Necesario para usar formGroup y formControl

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainMenuComponent,
    HeaderNabvarComponent,
    MainComponent,
    ToastComponent,
    ToastsComponent
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
