import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/back-office/login/login.component';
import { ReactiveFormsModule } from '@angular/forms'; //Necesario para usar formGroup y formControl
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
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UsuariosGridComponent } from './pages/back-office/usuarios/usuarios-grid/usuarios-grid.component';
import { UsuariosFormComponent } from './pages/back-office/usuarios/usuarios-form/usuarios-form.component';
import { GridComponent } from './components/grid/grid.component';
import { MenusGridComponent } from './pages/back-office/menus/menus-grid/menus-grid.component';
import { MenusFormComponent } from './pages/back-office/menus/menus-form/menus-form.component';
import { PantallasGridComponent } from './pages/back-office/pantallas/pantallas-grid/pantallas-grid.component';
import { PantallasFormComponent } from './pages/back-office/pantallas/pantallas-form/pantallas-form.component';
import { PermisosFormComponent } from './pages/back-office/permisos/permisos-form/permisos-form.component';
import { FormsModule } from '@angular/forms';
import { SubMenuComponent } from './components/subMenu/sub-menu/sub-menu.component';
import { ImageUploadModule } from 'angular2-image-upload';
import { FormButtonsComponent } from './components/form-buttons/form-buttons.component';
import { PersonalizarComponent } from './pages/back-office/personalizar/personalizar.component';
import { PerfilComponent } from './pages/back-office/perfil/perfil.component';
import { LoguedGuard } from './guards/logued.guard';
import { FoCarouselComponent } from './components/fo-carousel/fo-carousel.component';
import { FoFooterComponent } from './components/fo-footer/fo-footer.component';
import { FoHeaderNavbarComponent } from './components/fo-header-navbar/fo-header-navbar.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { MainTiendaComponent } from './pages/front-office/main-tienda/main-tienda.component';
import { HomeTiendaComponent } from './pages/front-office/home-tienda/home-tienda.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MarcasGridComponent } from './pages/back-office/marcas/marcas-grid/marcas-grid.component';
import { MarcaFormComponent } from './pages/back-office/marcas/marca-form/marca-form.component';
import { ImpuestosGridComponent } from './pages/back-office/impuestos/impuestos-grid/impuestos-grid.component';
import { ImpuestosFormComponent } from './pages/back-office/impuestos/impuestos-form/impuestos-form.component';
import { InputErrorsComponent } from './components/input-errors/input-errors.component';
import { CategoriasGridComponent } from './pages/back-office/categorias/categorias-grid/categorias-grid.component';
import { CategoriasFormComponent } from './pages/back-office/categorias/categorias-form/categorias-form.component';
import { InfoSessionComponent } from './components/info-session/info-session.component';
import { SubCategoriasGridComponent } from './pages/back-office/subCategorias/sub-categorias-grid/sub-categorias-grid.component';
import { SubCategoriasFormComponent } from './pages/back-office/subCategorias/sub-categorias-form/sub-categorias-form.component';
import { UnidadFormComponent } from './pages/back-office/unidad/unidad-form/unidad-form.component';
import { UnidadGridComponent } from './pages/back-office/unidad/unidad-grid/unidad-grid.component';
import { ClientesGridComponent } from './pages/back-office/clientes/clientes-grid/clientes-grid.component';
import { ClientesFormComponent } from './pages/back-office/clientes/clientes-form/clientes-form.component';
import { ProductosGridComponent } from './pages/back-office/productos/productos-grid/productos-grid.component';
import { ProductosFormComponent } from './pages/back-office/productos/productos-form/productos-form.component';
import { PreciosComponent } from './pages/back-office/precios/precios.component';
import { ConfigTiendaComponent } from './pages/back-office/config-tienda/config-tienda.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormDatosTiendaComponent } from './pages/back-office/config-tienda/form-datos-tienda/form-datos-tienda.component';
import { SeccionesHomeGridComponent } from './pages/back-office/seccionesHome/secciones-home-grid/secciones-home-grid.component';
import { SeccionesHomeFormComponent } from './pages/back-office/seccionesHome/secciones-home-form/secciones-home-form.component';
import { MarquesinaComponent } from './components/marquesina/marquesina.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { FormConfigMarquesinaHomeComponent } from './pages/back-office/config-tienda/form-config-marquesina-home/form-config-marquesina-home/form-config-marquesina-home.component';
import { FormConfigOfertaPrincipalComponent } from './pages/back-office/config-tienda/form-config-oferta-principal/form-config-oferta-principal/form-config-oferta-principal.component';
import { CatalogoComponent } from './pages/front-office/catalogo/catalogo.component';
import { CardProductoComponent } from './components/card-producto/card-producto.component';
import { DetalleProductoComponent } from './pages/front-office/detalle-producto/detalle-producto.component';
import { TallasGridComponent } from './pages/back-office/tallas/tallas-grid/tallas-grid.component';
import { TallasFormComponent } from './pages/back-office/tallas/tallas-form/tallas-form.component';
import { LoginClienteComponent } from './pages/front-office/login-cliente/login-cliente.component';
import { RegistroClienteComponent } from './pages/front-office/registro-cliente/registro-cliente.component';
import { LogoutComponent } from './pages/front-office/logout/logout.component';
import { IdentificacionClienteComponent } from './pages/front-office/identificacion-cliente/identificacion-cliente.component';
import { TituloComponent } from './components/titulo/titulo.component';
import { DatosDespachoComponent } from './pages/front-office/datos-despacho/datos-despacho.component';
//import { CustomValidatorsComponent } from './validators/custom-validators/custom-validators.component';

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
    SpinnerComponent,
    UsuariosGridComponent,
    UsuariosFormComponent,
    GridComponent,
    MenusGridComponent,
    MenusFormComponent,
    PantallasGridComponent,
    PantallasFormComponent,
    PermisosFormComponent,
    SubMenuComponent,
    FormButtonsComponent,
    PersonalizarComponent,
    PerfilComponent,
    FoCarouselComponent,
    FoHeaderNavbarComponent,
    ShoppingCartComponent,
    FoFooterComponent,
    MainTiendaComponent,
    HomeTiendaComponent,
    MarcasGridComponent,
    MarcaFormComponent,
    ImpuestosGridComponent,
    ImpuestosFormComponent,
    InputErrorsComponent,
    CategoriasGridComponent,
    CategoriasFormComponent,
    InfoSessionComponent,
    SubCategoriasGridComponent,
    SubCategoriasFormComponent,
    UnidadFormComponent,
    UnidadGridComponent,
    ClientesGridComponent,
    ClientesFormComponent,
    ProductosGridComponent,
    ProductosFormComponent,
    PreciosComponent,
    ConfigTiendaComponent,
    FormDatosTiendaComponent,
    SeccionesHomeGridComponent,
    SeccionesHomeFormComponent,
    MarquesinaComponent,
    CarouselComponent,
    FormConfigMarquesinaHomeComponent,
    FormConfigOfertaPrincipalComponent,
    CatalogoComponent,
    CardProductoComponent,
    DetalleProductoComponent,
    TallasGridComponent,
    TallasFormComponent,
    LoginClienteComponent,
    RegistroClienteComponent,
    LogoutComponent,
    IdentificacionClienteComponent,
    TituloComponent,
    DatosDespachoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadModule.forRoot(),
    IvyCarouselModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),

  ],
  providers: [LoguedGuard],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
