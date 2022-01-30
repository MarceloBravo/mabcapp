import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../../services/catalogo/catalogo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { ItemCarrito } from '../../class/itemCarrito/item-carrito';
import { ConfigTiendaService } from '../../services/configTienda/config-tienda.service';
import { Tienda } from '../../class/tienda/tienda';
import { LoginClientesService } from '../../services/loginClientes/login-clientes.service';
import { CategoriasService } from '../../services/categorias/categorias.service';
import { Categoria } from '../../class/Categoria/categoria';

@Component({
  selector: 'app-fo-header-navbar',
  templateUrl: './fo-header-navbar.component.html',
  styleUrls: ['./fo-header-navbar.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class FoHeaderNavbarComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'
  private ruta: string = ''
  textoFiltro: string = ''
  carrito: ItemCarrito[] = []
  tienda: Tienda = new Tienda()
  cantProductos: number = 0
  className: string = ''
  nombre_cliente: string = ''
  ocultarNombre: boolean = false
  categorias: Categoria[] = []

  constructor(
    private _catalogoService: CatalogoService,
    private activatedRoute: ActivatedRoute,
    private _carritoService: CarritoService,
    private _configTiendaService: ConfigTiendaService,
    private _loginClienteService: LoginClientesService,
    private _categoriasService: CategoriasService,
    private router: Router

  ) {
    this.carrito = this._carritoService.getCarrito()
    this.cantProductos = this._carritoService.getContarProductos()
    this.obtenerDatosCliente()
  }

  ngOnInit(): void {

    this.obtenerDatosCarrito()

    this.obtenerRutaActual()

    this.obtenerDatosTienda()

    this.obtenerDatosCliente()

    this.obtenerCategorias()

  }


  private obtenerDatosCarrito(){
    this._carritoService.changeCart$.subscribe((res: any) => {
      this.carrito = this._carritoService.getCarrito()
      this.cantProductos = this._carritoService.getContarProductos()
     })
  }


  private obtenerRutaActual(){
    this.activatedRoute.url.subscribe(res => {
      console.log('isRedirectToHome', res)
      if(res[0]){
        this.ruta = res[0].path
      }
    })
  }


  private obtenerDatosTienda(){
    this._configTiendaService.get().subscribe((res: any) => {
      this.tienda = res
    }, error => {
      console.log('error', error)
    })
  }


  private obtenerDatosCliente(){
    this._loginClienteService.activeUserChange$.subscribe((res: any) => {
      console.log('CAMBIO CLIENTE ******************')
      let cliente = this._loginClienteService.getClienteLogueado()
      if(cliente && cliente.id){
        this.nombre_cliente = cliente.nombres + ' ' + cliente.apellido1
      }
    }, error =>{
      console.log('error', error)
    })
  }


  private obtenerCategorias(){
    this._categoriasService.getAll().subscribe((res: any) => {
      this.categorias = res
    }, error => {
      console.log(error)
    })
  }

  changeTextoFiltro(texto: string){
    this._catalogoService.setTextoFiltro(texto)
    if(this.ruta !== 'catalogo'){
      this.router.navigate(['catalogo'])
    }
  }

  ocultaNombre(){
    this.ocultarNombre = true
    console.log('ocultar')
  }

  muestraNombre(){
    this.ocultarNombre = false
    console.log('mostrar')
  }

  tieneCategorias(cat: Categoria):boolean{
    return cat?.subcategorias.length > 0
  }

}
