import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class RegionesService {

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  listar(){
    return this.http.get(`${this._const.apiDigitalGob}regiones`)
  }

  buscar(codigo: string){
    return this.http.get(`${this._const.apiDigitalGob}regiones/${codigo}`)
  }
}
