import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {
  private url: string = 'precios'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  list(page: number){
    return this.http.get(`${this._const.endPoint}${this.url}/pag/${page}`,{headers: this._const.header()})
  }

  filter(texto: string, page: number){
    texto = texto.split('/').join(this._const.caracterComodinBusqueda)
    return this.http.get(`${this._const.endPoint}${this.url}/filter/${texto}/${page}`,{headers: this._const.header()})
  }

  save(data: any){
    return this.http.post(`${this._const.endPoint}${this.url}`, data, {headers: this._const.header()})
  }

  delete(id: number){
    return this.http.delete(`${this._const.endPoint}${this.url}/${id}`,{headers: this._const.header()})
  }

  precioConImpuestos(precio: number, impuestos: number[]): number{
    let promedio = (impuestos && impuestos.length > 0) ? impuestos.reduce((tot, i) => tot +=i) : 0
    return Math.round(precio + (precio * promedio / 100))
  }

  strFormatearPrecio(precio: number, signo: string = '$'): string{
    return precio ? `${signo} ${precio.toLocaleString('de-DE')}` : '$ 0'
  }

}
