import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { Tienda } from 'src/app/class/tienda/tienda';

@Injectable({
  providedIn: 'root'
})
export class ConfigTiendaService {
  private url = 'tienda'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  get(){
    return this.http.get(`${this._const.endPoint}${this.url}`, {headers: this._const.header()});
  }

  update(data: Tienda){
    //console.log('update tienda', `${this._const.endPoint}${this.url}/${data.id}`, JSON.stringify(data))
    return this.http.put(`${this._const.endPoint}${this.url}/${data.id}`, data, {headers: this._const.header()});
  }

}
