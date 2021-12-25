import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../../services/catalogo/catalogo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { ItemCarrito } from '../../class/itemCarrito/item-carrito';
import { ConfigTiendaService } from '../../services/configTienda/config-tienda.service';
import { Tienda } from '../../class/tienda/tienda';
import { LoginClientesService } from '../../services/loginClientes/login-clientes.service';
import { Cliente } from '../../class/cliente/cliente';

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

  constructor(
    private _catalogoService: CatalogoService,
    private activatedRoute: ActivatedRoute,
    private _carritoService: CarritoService,
    private _configTiendaService: ConfigTiendaService,
    private _loginClienteService: LoginClientesService,
    private router: Router

  ) {
    this.carrito = this._carritoService.getCarrito()
    this.cantProductos = this._carritoService.getContarProductos()
    this.obtenerDatosCliente()
  }

  ngOnInit(): void {
    this._carritoService.changeCart$.subscribe((res: any) => {
     this.carrito = this._carritoService.getCarrito()
     this.cantProductos = this._carritoService.getContarProductos()
    })

    this.activatedRoute.url.subscribe(res => {
      if(res[0]){
        this.ruta = res[0].path
      }
    })

    this._configTiendaService.get().subscribe((res: any) => {
      this.tienda = res
    }, error => {
      console.log('error', error)
    })

    this._loginClienteService.activeUserChange$.subscribe((res: any) => {
      this.obtenerDatosCliente()
    }, error =>{
      console.log('error', error)
    })
  }

  private obtenerDatosCliente(){
    let cliente = this._loginClienteService.getClienteLogueado()
    if(cliente && cliente.id){
      this.nombre_cliente = cliente.nombres + ' ' + cliente.apellido1
    }
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
}
