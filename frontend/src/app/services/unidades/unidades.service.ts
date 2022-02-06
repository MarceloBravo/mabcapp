import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unidad } from '../../class/Unidad/unidad';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {
  private url: string = 'unidades';

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
    ) { }

  list(pag: number){
    return this.http.get(`${this._const.endPoint}${this.url}/pag/${pag}`,{headers: this._const.header()})
  }

  getAll(){
    return this.http.get(`${this._const.endPoint}${this.url}/get/all`,{headers: this._const.header()})
  }

  filter(texto: string, pag: number){
    return this.http.get(`${this._const.endPoint}${this.url}/filter/${texto}/${pag}`,{headers: this._const.header()})
  }

  find(id: number){
    return this.http.get(`${this._const.endPoint}${this.url}/${id}`,{headers: this._const.header()})
  }

  insert(unidad: Unidad){
    return this.http.post(`${this._const.endPoint}${this.url}`,unidad,{headers: this._const.header()})
  }

  update(unidad: Unidad){
    return this.http.put(`${this._const.endPoint}${this.url}/${unidad.id}`, unidad,{headers: this._const.header()})
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint}${this.url}/${id}`,{headers: this._const.header()})
  }

}
