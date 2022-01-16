import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private url: string = 'ventas'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService,
  ) { }

  list(pag: number){
    return this.http.get(`${this._const.endPoint + this.url}/pag/${pag}`,{headers: this._const.header()})
  }

  getCliente(idVenta: number){
    return this.http.get(`${this._const.endPoint + this.url}/cliente/${idVenta}`, {headers: this._const.header()})
  }

  insert(infoVenta: any){
    return this.http.post(`${this._const.endPoint + this.url}`,infoVenta,{headers: this._const.header()} )
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint + this.url}/${id}`, {headers: this._const.header()})
  }
}
