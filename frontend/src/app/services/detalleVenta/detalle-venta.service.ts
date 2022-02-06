import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { ItemCarrito } from '../../class/itemCarrito/item-carrito';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  private url: string = 'detalle_ventas'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService,
  ) { }

  detalle(idVenta: number, pag: number){
    return this.http.get(`${this._const.endPoint + this.url}/${idVenta}/${pag}`,{headers: this._const.header()})
  }

  actualizarStockVendidos(carrito: ItemCarrito[]){
    return this.http.post(`${this._const.endPoint + this.url}/update_stock`, carrito, {headers: this._const.header()})
  }
}
