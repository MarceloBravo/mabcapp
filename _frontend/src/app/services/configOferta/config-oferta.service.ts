import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { OfertaPrincipal } from 'src/app/class/ofertaPrincipal/oferta-principal';

@Injectable({
  providedIn: 'root'
})
export class ConfigOfertaService {
  private url: string = 'oferta_principal_home'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  get(){
    return this.http.get(this._const.endPoint + this.url, {headers: this._const.header()});
  }

  insert(data: OfertaPrincipal){
    return this.http.post(this._const.endPoint + this.url, data, {headers: this._const.header()});
  }

  update(data: OfertaPrincipal){
    return this.http.put(`${this._const.endPoint}${this.url}/${data.id}`, data, {headers: this._const.header()});
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint}${this.url}/${id}`, {headers: this._const.header()});
  }

}
