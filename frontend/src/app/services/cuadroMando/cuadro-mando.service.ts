import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class CuadroMandoService {
  private url: string = 'cuadro_mando'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService,
  ) { }

  getVentasUltimoMes(){
    return this.http.get(`${this._const.endPoint + this.url}/ventas-ultimo-mes`, {headers: this._const.header()})
  }

  getVentasUltimoAnio(){
    return this.http.get(`${this._const.endPoint + this.url}/ventas-ultimo-anio`, {headers: this._const.header()})
  }

  getUnidadesVendidas(){
    return this.http.get(`${this._const.endPoint + this.url}/unidades-vendidas`, {headers: this._const.header()})
  }

  getUnidadesVendidasMeses(meses: number = 6){
    return this.http.get(`${this._const.endPoint + this.url}/unidades-vendidas-meses/${meses}`, {headers: this._const.header()})
  }

  getDespachosPendientes(){
    return this.http.get(`${this._const.endPoint + this.url}/despachos-pendientes`, {headers: this._const.header()})
  }

  getTipoClienteVenta(){
    return this.http.get(`${this._const.endPoint + this.url}/tipo-cliente-venta`, {headers: this._const.header()})
  }

  getVentasAnuladasUltimoMes(){
    return this.http.get(`${this._const.endPoint + this.url}/ventas-anuladas-ultimo-mes`, {headers: this._const.header()})
  }

  getVentasAnuladasUltimoAnio(){
    return this.http.get(`${this._const.endPoint + this.url}/ventas-anuladas-ultimo-anio`, {headers: this._const.header()})
  }

  getUltimoEnvio(){
    return this.http.get(`${this._const.endPoint + this.url}/ultimo-envio`, {headers: this._const.header()})
  }

  getMasVendidos(mostrar: number = 5){
    return this.http.get(`${this._const.endPoint + this.url}/mas-vendidos/${mostrar}`, {headers: this._const.header()})
  }

  detalleDespachosPendientes(mostrar: number = 5){
    return this.http.get(`${this._const.endPoint + this.url}/detalle-despachos-pendientes/${mostrar}`, {headers: this._const.header()})
  }
}
