import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { FoCatalogoParams } from 'src/app/class/fo-catalogo-params/fo-catalogo-params';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private url: string = 'catalogo'
  public textoFiltro: string = ''

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  get(pag: number, params: FoCatalogoParams){
    console.log('catalogo',params)
    return this.http.post(`${this._const.endPoint + this.url}/pag/${pag}`, params, {headers: this._const.header()});
  }

  filter(texto: string, pag: number, params: FoCatalogoParams){
    return this.http.post(`${this._const.endPoint + this.url}/filter/${texto}/${pag}`, params, {headers: this._const.header()});
  }

  minMaxPrice(){
    return this.http.get(`${this._const.endPoint + this.url}/precio-min-max`,{headers: this._const.header()});
  }
}
