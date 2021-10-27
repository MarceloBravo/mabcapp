import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from  './pages/back-office/login/login.component';
import { MainComponent } from './pages/back-office/main/main.component';
import { RolesGridComponent } from './pages/back-office/roles/roles-grid/roles-grid.component';
import { RolesFormComponent } from './pages/back-office/roles/roles-form/roles-form.component';
import { UsuariosGridComponent } from './pages/back-office/usuarios/usuarios-grid/usuarios-grid.component';
import { UsuariosFormComponent } from './pages/back-office/usuarios/usuarios-form/usuarios-form.component';
import { MenusGridComponent } from './pages/back-office/menus/menus-grid/menus-grid.component';
import { MenusFormComponent } from './pages/back-office/menus/menus-form/menus-form.component';
import { PantallasGridComponent } from './pages/back-office/pantallas/pantallas-grid/pantallas-grid.component';
import { PantallasFormComponent } from './pages/back-office/pantallas/pantallas-form/pantallas-form.component';
import { PermisosFormComponent } from './pages/back-office/permisos/permisos-form/permisos-form.component';
import { PersonalizarComponent } from './pages/back-office/personalizar/personalizar.component';
import { PerfilComponent } from './pages/back-office/perfil/perfil.component';
import { LoguedGuard } from './guards/logued.guard';
import { MainTiendaComponent } from './pages/front-office/main-tienda/main-tienda.component';
import { HomeTiendaComponent } from './pages/front-office/home-tienda/home-tienda.component';
import { MarcaFormComponent } from './pages/back-office/marcas/marca-form/marca-form.component';
import { MarcasGridComponent } from './pages/back-office/marcas/marcas-grid/marcas-grid.component';
import { HomeComponent } from './pages/back-office/home/home.component';
import { ImpuestosGridComponent } from './pages/back-office/impuestos/impuestos-grid/impuestos-grid.component';
import { ImpuestosFormComponent } from './pages/back-office/impuestos/impuestos-form/impuestos-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: MainComponent ,
    canActivateChild: [LoguedGuard],
    children: [
      { path: '', component: HomeComponent},
      { path: 'roles', component: RolesGridComponent },
      { path: 'roles/nuevo', component: RolesFormComponent },
      { path: 'roles/edit/:id', component: RolesFormComponent },

      { path: 'usuarios', component: UsuariosGridComponent},
      { path: 'usuarios/nuevo', component: UsuariosFormComponent },
      { path: 'usuarios/edit/:id', component: UsuariosFormComponent },
      { path: 'perfil', component: PerfilComponent},

      { path: 'menus', component: MenusGridComponent},
      { path: 'menus/nuevo', component: MenusFormComponent },
      { path: 'menus/edit/:id', component: MenusFormComponent },

      { path: 'pantallas', component: PantallasGridComponent},
      { path: 'pantallas/nuevo', component: PantallasFormComponent },
      { path: 'pantallas/edit/:id', component: PantallasFormComponent },

      { path: 'permisos', component: PermisosFormComponent },

      { path: 'personalizar', component: PersonalizarComponent },

      { path: 'marcas', component: MarcasGridComponent},
      { path: 'marcas/nuevo', component: MarcaFormComponent },
      { path: 'marcas/edit/:id', component: MarcaFormComponent },

      { path: 'impuestos', component: ImpuestosGridComponent },
      { path: 'impuestos/nuevo', component: ImpuestosFormComponent },
      { path: 'impuestos/edit/:id', component: ImpuestosFormComponent },

    ]
},

{ path: '', component: MainTiendaComponent,
    children: [
      { path: '', component: HomeTiendaComponent },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
