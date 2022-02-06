import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';
import { Talla } from '../../class/talla/talla';

@Injectable({
  providedIn: 'root'
})
export class TallasService {
  private url = 'tallas'

  constructor(
    private _constantes: ConstantesService,
    private http: HttpClient
    ) { }


  getAll(){
    return this.http.get(`${this._constantes.endPoint}${this.url}/get/all`,{headers: this._constantes.header()});
  }

  getBySubCategory(id: number){
    return this.http.get(`${this._constantes.endPoint}${this.url}/get/all/${id}`,{headers: this._constantes.header()});
  }

  list(pag: number){
    return this.http.get(`${this._constantes.endPoint}${this.url}/pag/${pag}`,{headers: this._constantes.header()});
  }

  filter(textoBuscado: string, pag: number){
    return this.http.get(`${this._constantes.endPoint}${this.url}/filter/${textoBuscado}/${pag}`,{headers: this._constantes.header()});
  }

  find(id: number){
    return this.http.get(`${this._constantes.endPoint}${this.url}/${id}`,{headers: this._constantes.header()});
  }

  insert(talla: Talla){
    return this.http.post(`${this._constantes.endPoint}${this.url}`, talla, {headers: this._constantes.header()})
  }

  update(talla: Talla){
    return this.http.put(`${this._constantes.endPoint}${this.url}/${talla.id}`, talla, {headers: this._constantes.header()})
  }

  delete(id: number){
    return this.http.delete(`${this._constantes.endPoint}${this.url}/${id}`, {headers: this._constantes.header()})
 }
}
