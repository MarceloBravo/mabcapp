import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { SeccionHome } from '../../class/seccionHome/seccion-home';

@Injectable({
  providedIn: 'root'
})
export class SeccionesHomeService {
  private url: string = 'secciones_home'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  list(page: number){
    return this.http.get(`${this._const.endPoint}${this.url}/pag/${page}`,{headers: this._const.header()});
  }

  getAll(){
    return this.http.get(`${this._const.endPoint}${this.url}/get/all`, {headers: this._const.header()});
  }

  getSeccionesHome(){
    return this.http.get(`${this._const.endPoint}${this.url}/secciones/home`, {headers: this._const.header()});
  }

  filter(texto: string, page: number){
    texto = texto.split('/').join(this._const.caracterComodinBusqueda)
    return this.http.get(`${this._const.endPoint}${this.url}/filter/${texto}/${page}`,{headers: this._const.header()});
  }

  find(id: number){
    return this.http.get(`${this._const.endPoint}${this.url}/${id}`,{headers: this._const.header()});
  }

  insert(seccion: SeccionHome){
    return this.http.post(`${this._const.endPoint}${this.url}`, seccion, {headers: this._const.header()});
  }

  update(seccion: SeccionHome){
    return this.http.put<object>(`${this._const.endPoint}${this.url}/${seccion.id}`, seccion, {headers: this._const.headerAttachFile()});
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint}${this.url}/${id}`, {headers: this._const.header()});
  }
}
