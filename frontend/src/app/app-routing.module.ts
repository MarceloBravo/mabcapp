import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/back-office/home/home.component';
import { LoginComponent } from  './pages/back-office/login/login.component';
import { MainComponent } from './pages/back-office/main/main.component';
import { RolesGridComponent } from './pages/back-office/roles/roles-grid/roles-grid.component';
import { RolesFormComponent } from './pages/back-office/roles/roles-form/roles-form.component';
import { UsuariosGridComponent } from './pages/back-office/usuarios/usuarios-grid/usuarios-grid.component';
import { UsuariosFormComponent } from './pages/back-office/usuarios/usuarios-form/usuarios-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: MainComponent ,
    children: [
      { path: 'roles', component: RolesGridComponent },
      { path: 'roles/nuevo', component: RolesFormComponent },
      { path: 'roles/edit/:id', component: RolesFormComponent },

      { path: 'usuarios', component: UsuariosGridComponent},
      { path: 'usuarios/nuevo', component: UsuariosFormComponent },
      { path: 'usuarios/edit/:id', component: UsuariosFormComponent },
    ]
},
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
