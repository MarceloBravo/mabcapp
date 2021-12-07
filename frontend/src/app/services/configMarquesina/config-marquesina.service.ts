import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigMarquesinaService {
  private url: string = 'imagenes_marquesina'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  getAll(){
    return this.http.get(this._const.endPoint + this.url,{headers: this._const.header()})
  }

  getImages(){  //No requiere login
    return this.http.get(this._const.endPoint + this.url + '/imagenes',{headers: this._const.header()})
  }

  save(data: any){
    return this.http.post(`${this._const.endPoint + this.url}`, data, {headers: this._const.header()})
  }

}
