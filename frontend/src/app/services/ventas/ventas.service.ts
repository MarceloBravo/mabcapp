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

  insert(infoVenta: any){
    return this.http.post(`${this._const.endPoint + this.url}`,infoVenta,{headers: this._const.header()} )
  }
}
