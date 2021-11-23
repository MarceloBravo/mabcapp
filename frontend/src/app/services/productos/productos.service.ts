import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { Producto } from '../../class/producto/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private url: string = 'productos'

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

  filter(texto: string, page: number){
    return this.http.get(`${this._const.endPoint}${this.url}/filter/${texto}/${page}`,{headers: this._const.header()});
  }

  find(id: number){
    return this.http.get(`${this._const.endPoint}${this.url}/${id}`,{headers: this._const.header()});
  }

  insert(producto: Producto){
    return this.http.post(`${this._const.endPoint}${this.url}`, producto, {headers: this._const.header()});
  }

  update(producto: Producto){
    return this.http.put<object>(`${this._const.endPoint}${this.url}/${producto.id}`, producto, {headers: this._const.headerAttachFile()});
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint}${this.url}/${id}`, {headers: this._const.header()});
  }
}
