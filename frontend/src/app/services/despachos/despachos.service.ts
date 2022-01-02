import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { Despacho } from '../../class/despachos/despacho';

@Injectable({
  providedIn: 'root'
})
export class DespachosService {
  url: string = 'despachos'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService,
  ) { }

  list(page: number){
    return this.http.get(`${this._const.endPoint}${this.url}/pag/${page}`, {headers: this._const.header()});
  }

  getAll(){
    return this.http.get(`${this._const.endPoint}${this.url}/get/all`, {headers: this._const.header()});
  }

  filter(texto: string, page: number){
    return this.http.get(`${this._const.endPoint}${this.url}/filter/${texto}/${page}`, {headers: this._const.header()});
  }

  find(id: number){
    return this.http.get(`${this._const.endPoint}${this.url}/${id}`, {headers: this._const.header()});
  }

  insert(despacho: Despacho){
    return this.http.post(`${this._const.endPoint}${this.url}`, despacho, {headers: this._const.header()});
  }

  update(despacho: Despacho){
    return this.http.put(`${this._const.endPoint}${this.url}/${despacho.id}`, despacho, {headers: this._const.header()});
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint}${this.url}/${id}`, {headers: this._const.header()});
  }
}
