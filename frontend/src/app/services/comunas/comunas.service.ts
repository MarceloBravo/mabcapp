import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class ComunasService {

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  listar(){
    return this.http.get(`${this._const.apiDigitalGob}comunas`)
  }

  //Listado de las Comunas pertenecientes a una provincia
  listarComunasProvincias(codProvincia: string){
    return this.http.get(`${this._const.apiDigitalGob}provincias/${codProvincia}/comunas`)
  }
}
