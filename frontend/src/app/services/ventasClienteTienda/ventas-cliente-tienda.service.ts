import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class VentasClienteTiendaService {
  private url: string = 'ventas_cliente_tienda'

  constructor(
    private http: HttpClient,
    private _constService: ConstantesService,
  ) { }

  insert(cliente_id: number, venta_id: number){
    return this.http.post(`${this._constService.endPoint + this.url}`, {cliente_id, venta_id},{headers: this._constService.header()})
  }

}
