import { EventEmitter, Injectable } from '@angular/core'
import { ImagenProducto } from 'src/app/class/imagenProducto/imagen-producto';
import { ItemCarrito } from '../../class/itemCarrito/item-carrito';
import { Producto } from '../../class/producto/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  public changeCart$: EventEmitter<boolean> = new EventEmitter()//Observable
  public changeFavorite$: EventEmitter<boolean> = new EventEmitter()//Observable

  constructor() { }

  getCarrito(){
    let cart = localStorage.getItem('shopping-cart')
    return cart ? JSON.parse(cart) : []
  }


  addToCart(producto: Producto){
    let carrito: ItemCarrito[] = this.getCarrito()
    let index: number | null | undefined = producto.id ? this.getIndex(producto.id) : null

    let item: ItemCarrito = index !== null && index !== undefined && index >= 0 ? carrito[index] : new ItemCarrito()
    item.cantidad += 1

    if(index === null || index === undefined || index === -1){
      item.categoria = producto.categoria.nombre
      let imagen: ImagenProducto = producto.imagenes.reduce((img, i) => i.imagen_principal ? i : img)
      item.imagen = imagen.source_image
      producto.impuestos.forEach( i => item.impuestos += i.porcentaje )
      item.marca = producto.marca.nombre

      //Precio sin impuestos
      item.precio = producto.precios.length > 0 ? producto.precios[0].precio : producto.precio_venta_normal

      //Total impuestos
      item.monto_impuestos = Math.round(item.precio * (item.impuestos / 100))

      //precio con impuestos
      item.precio_venta = item.precio + item.monto_impuestos

      item.nombre = producto.nombre
      item.precio_venta_normal = producto.precio_venta_normal
      if(producto.id)item.producto_id = producto.id
      item.stock = producto.stock
      item.str_precio = `$ ${item.precio}`
      item.unidad = producto.unidad.nombre
    }
    this.setCarrito(item)
  }


  removeFromCart(idProducto: number){
    let carrito: ItemCarrito[] = this.getCarrito()
    let index = this.getIndex(idProducto)

    if(index !== null && index !== undefined && index !== -1){
      if(carrito[index].cantidad > 1){
        carrito[index].cantidad--
      }else{
        carrito.splice(index,1)
      }
      localStorage.setItem('shopping-cart',JSON.stringify(carrito))
      this.changeCart$.emit(true)
    }
  }


  //Actualiza el carrito de compras
  setCarrito(itemCarrito: ItemCarrito){
    let carrito: ItemCarrito[] = this.getCarrito()
    let index: number = this.getIndex(itemCarrito.producto_id)

    if(index < 0){
      carrito.push(itemCarrito)
    }else{
      carrito[index] = itemCarrito
    }

    localStorage.setItem('shopping-cart',JSON.stringify(carrito))
    this.changeCart$.emit(true)
  }


  vaciarCarrito(){
    localStorage.removeItem('shopping-cart')
    this.changeCart$.emit(true)
  }


  //Busca si el producto ya se encuentra en el carrito y debuelve su posición
  //dentro de la matriz de productos
  getIndex(idProducto: number): number{
    let carrito: ItemCarrito[] = this.getCarrito()
    let res: number = -1
    carrito.forEach((i, index) => {if(i.producto_id === idProducto) res = index})
    return res
  }


  getContarProductos(){
    let cart: ItemCarrito[] = this.getCarrito()
    let cantProductos = 0
    cart.forEach(p => cantProductos += p.cantidad)
    return cantProductos
  }


  setFavorites(idProd: number){
    let strFavCart: string | null = localStorage.getItem('favorite-cart')
    let favCart: number[] = strFavCart ? JSON.parse(strFavCart) : []

    let index: number = favCart.indexOf(idProd)
    if(index >= 0){
      favCart.splice(index, 1)
    }else{
      favCart.push(idProd)
    }
    localStorage.setItem('favorite-cart', JSON.stringify(favCart))
    return this.changeFavorite$.emit(true)
  }

  getFavorites(){
    let strFavCart: string | null = localStorage.getItem('favorite-cart')
    return strFavCart ? JSON.parse(strFavCart) : []
  }


}

