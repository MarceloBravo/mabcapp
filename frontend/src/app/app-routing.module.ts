import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/back-office/home/home.component';
import { LoginComponent } from  './pages/back-office/login/login.component';
import { MainComponent } from './pages/back-office/main/main.component';
import { RolesGridComponent } from './pages/back-office/roles/roles-grid/roles-grid.component';
import { RolesFormComponent } from './pages/back-office/roles/roles-form/roles-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: MainComponent ,
    children: [
      { path: 'roles', component: RolesGridComponent },
      { path: 'roles/nuevo', component: RolesFormComponent },
      { path: 'roles/edit/:id', component: RolesFormComponent },
    ]
},
  //{ path: 'home', component: HomeComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
