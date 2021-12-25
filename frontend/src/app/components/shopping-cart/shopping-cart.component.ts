import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito/carrito.service';
import { ItemCarrito } from '../../class/itemCarrito/item-carrito';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { Cliente } from 'src/app/class/cliente/cliente';
import { LoginClientesService } from 'src/app/services/loginClientes/login-clientes.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class ShoppingCartComponent implements OnInit {
  public sourceImage: string = ''
  carrito: ItemCarrito[] = []
  subTotal: number = 0
  despacho: number = 0
  descuento: number = 0
  impuestos: number = 0
  total: number = 0
  cantProductos: number = 0
  cliente: Cliente | null = null

  constructor(
    private _carritoService: CarritoService,
    private _loginClienteService: LoginClientesService,
    private _const: ConstantesService,
  ) {
    this.obtenerDatosCarrito()
    this.obtenerDatosCliente()
    this.sourceImage = this._const.storageImages
    this.cantProductos = this._carritoService.getContarProductos()
  }

  ngOnInit(): void {
    this._loginClienteService.activeUserChange$.subscribe((res: any) => {
      this.obtenerDatosCliente()
    } )
    this._carritoService.changeCart$.subscribe((res: any) => {
      this.obtenerDatosCarrito()
      this.cantProductos = this._carritoService.getContarProductos()
    })
  }

  private obtenerDatosCliente(){
    this.cliente = this._loginClienteService.getClienteLogueado()
  }

  private obtenerDatosCarrito(){
    this.subTotal = 0
    this.descuento = 0
    this.impuestos = 0
    this.total = 0

    this.carrito = this._carritoService.getCarrito()
    this.carrito.forEach( i =>
      {
        this.subTotal += (i.precio * i.cantidad)
        if(i.precio_venta_normal > i.precio)this.descuento += (i.precio_venta_normal - i.precio) * i.cantidad
        this.impuestos += Math.round(i.precio * (i.impuestos / 100 * i.cantidad))
      })
      this.total = this.subTotal + this.despacho + this.impuestos
  }

  suma(tot: number, num: number){
    return tot + num
  }

  quitarProducto(prod: ItemCarrito){
    this._carritoService.removeFromCart(prod.producto_id)
  }

}
