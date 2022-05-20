import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { SubCategoria } from '../../class/subCategoria/sub-categoria';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriasService {
  private url: string = 'sub_categorias'

  constructor(
    private http: HttpClient,
    private _constService: ConstantesService
  ) { }

  getAll(){
    return this.http.get(`${this._constService.endPoint}${this.url}/get/all`,{headers: this._constService.header()});
  }

  getAllByCategoria(idCategoria: number){
    return this.http.get(`${this._constService.endPoint}${this.url}/get/all/${idCategoria}`,{headers: this._constService.header()});
  }

  list(pag: number = 0){
    return this.http.get(`${this._constService.endPoint}${this.url}/pag/${pag}`,{headers: this._constService.header()});
  }

  find(id: number){
    return this.http.get(`${this._constService.endPoint}${this.url}/${id}`, {headers: this._constService.header()});
  }

  insert(SubCategoria: SubCategoria){
    return this.http.post(`${this._constService.endPoint}${this.url}`, SubCategoria, {headers: this._constService.header()});
  }

  update(SubCategoria: SubCategoria){
    return this.http.put(`${this._constService.endPoint}${this.url}/${SubCategoria.id}`, SubCategoria, {headers: this._constService.header()});
  }

  delete(id: number){
    return this.http.delete(`${this._constService.endPoint}${this.url}/${id}`, {headers: this._constService.header()});
  }

  filter(texto: string, pag: number = 0){
    texto = texto.split('/').join(this._constService.caracterComodinBusqueda)
    return this.http.get(`${this._constService.endPoint}${this.url}/filter/${texto}/${pag}`,{headers: this._constService.header()});
  }
}
