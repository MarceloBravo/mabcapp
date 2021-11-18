import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../../class/cliente/cliente';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private url: string = 'clientes'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
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

  insert(cliente: Cliente){
    return this.http.post(`${this._const.endPoint}${this.url}`, cliente, {headers: this._const.header()});
  }

  update(cliente: Cliente){
    return this.http.put(`${this._const.endPoint}${this.url}/${cliente.id}`, cliente, {headers: this._const.header()});
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint}${this.url}/${id}`, {headers: this._const.header()});
  }

}
