import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class VisitasService {
  private url: string = 'visitas'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  get(){
    return this.http.get(this._const.endPoint + this.url, {headers: this._const.header()})
  }

  registrarVisita(){
    return this.http.put(this._const.endPoint + this.url,null, {headers: this._const.header()})
  }

  registrarVisitaEnStorage(){
    sessionStorage.setItem('visits', '1')
  }

  checkearVisitaEnStorage(): Boolean
  {
    return sessionStorage.getItem('visits') ? true : false
  }
}
