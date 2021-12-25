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
import { CategoriasGridComponent } from './pages/back-office/categorias/categorias-grid/categorias-grid.component';
import { CategoriasFormComponent } from './pages/back-office/categorias/categorias-form/categorias-form.component';
import { SubCategoriasGridComponent } from './pages/back-office/subCategorias/sub-categorias-grid/sub-categorias-grid.component';
import { SubCategoriasFormComponent } from './pages/back-office/subCategorias/sub-categorias-form/sub-categorias-form.component';
import { UnidadGridComponent } from './pages/back-office/unidad/unidad-grid/unidad-grid.component';
import { UnidadFormComponent } from './pages/back-office/unidad/unidad-form/unidad-form.component';
import { ClientesGridComponent } from './pages/back-office/clientes/clientes-grid/clientes-grid.component';
import { ClientesFormComponent } from './pages/back-office/clientes/clientes-form/clientes-form.component';
import { ProductosGridComponent } from './pages/back-office/productos/productos-grid/productos-grid.component';
import { ProductosFormComponent } from './pages/back-office/productos/productos-form/productos-form.component';
import { PreciosComponent } from './pages/back-office/precios/precios.component';
import { ConfigTiendaComponent } from './pages/back-office/config-tienda/config-tienda.component';
import { SeccionesHomeGridComponent } from './pages/back-office/seccionesHome/secciones-home-grid/secciones-home-grid.component';
import { SeccionesHomeFormComponent } from './pages/back-office/seccionesHome/secciones-home-form/secciones-home-form.component';
import { CatalogoComponent } from './pages/front-office/catalogo/catalogo.component';
import { DetalleProductoComponent } from './pages/front-office/detalle-producto/detalle-producto.component';
import { TallasGridComponent } from './pages/back-office/tallas/tallas-grid/tallas-grid.component';
import { TallasFormComponent } from './pages/back-office/tallas/tallas-form/tallas-form.component';
import { LoginClienteComponent } from './pages/front-office/login-cliente/login-cliente.component';
import { RegistroClienteComponent } from './pages/front-office/registro-cliente/registro-cliente.component';
import { LogoutComponent } from './pages/front-office/logout/logout.component';
import { IdentificacionClienteComponent } from './pages/front-office/identificacion-cliente/identificacion-cliente.component';
import { DatosDespachoComponent } from './pages/front-office/datos-despacho/datos-despacho.component';

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

      { path: 'categorias', component: CategoriasGridComponent },
      { path: 'categorias/nuevo', component: CategoriasFormComponent },
      { path: 'categorias/edit/:id', component: CategoriasFormComponent },

      { path: 'sub_categorias', component: SubCategoriasGridComponent },
      { path: 'sub_categorias/nuevo', component: SubCategoriasFormComponent },
      { path: 'sub_categorias/edit/:id', component: SubCategoriasFormComponent },

      { path: 'unidades', component: UnidadGridComponent },
      { path: 'unidades/nuevo', component: UnidadFormComponent },
      { path: 'unidades/edit/:id', component: UnidadFormComponent },

      { path: 'clientes', component: ClientesGridComponent },
      { path: 'clientes/nuevo', component: ClientesFormComponent },
      { path: 'clientes/edit/:id', component: ClientesFormComponent },

      { path: 'productos', component: ProductosGridComponent },
      { path: 'productos/nuevo', component: ProductosFormComponent },
      { path: 'productos/edit/:id', component: ProductosFormComponent },

      { path: 'precios', component: PreciosComponent },

      { path: 'configuracion_tienda', component: ConfigTiendaComponent },

      { path: 'secciones_home', component: SeccionesHomeGridComponent },
      { path: 'secciones_home/nuevo', component: SeccionesHomeFormComponent },
      { path: 'secciones_home/edit/:id', component: SeccionesHomeFormComponent },

      { path: 'tallas', component: TallasGridComponent },
      { path: 'tallas/nuevo', component: TallasFormComponent },
      { path: 'tallas/edit/:id', component: TallasFormComponent },

    ]
},

{ path: '', component: MainTiendaComponent,
    children: [
      { path: '', component: HomeTiendaComponent },
      { path: 'catalogo', component: CatalogoComponent },
      { path: 'detalle_producto/:id', component: DetalleProductoComponent },
      { path: 'login_cliente', component: LoginClienteComponent },
      { path: 'registro_cliente', component: RegistroClienteComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'identificacion_cliente', component: IdentificacionClienteComponent },
      { path: 'datos_despacho', component: DatosDespachoComponent },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
