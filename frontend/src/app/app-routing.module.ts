import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/back-office/home/home.component';
import { LoginComponent } from  './pages/back-office/login/login.component';
import { MainComponent } from './pages/back-office/main/main.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: MainComponent },
  //{ path: 'home', component: HomeComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
