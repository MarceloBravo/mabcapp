import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class TransbankService {
  private url: string = 'wp/'

  constructor(
    private _const: ConstantesService,
    private http: HttpClient
  ) { }

  startTransaction(datos: any){
    return this.http.post(`${this._const.endPoint + this.url}iniciar_transaccion`, datos, {responseType: 'text'})
  }

  find(id: number){
    return this.http.get(`${this._const.endPoint + this.url}transaccion/${id}`,{headers: this._const.header()})
  }
/*
  confirmTransaction(datos: any){
    return this.http.post(`${this._const.endPoint + this.url}confirmar_transaccion`, datos, {headers: this._const.header()})
  }
*/

}
