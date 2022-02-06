import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  listar(){
    return this.http.get(`${this._const.apiDigitalGob}provincias`)
  }

  //Retorna una provincia en particular
  buscar(codigo: string){
    return this.http.get(`${this._const.apiDigitalGob}provincias/${codigo}`)
  }

  //Listado de las Provincias pertenecientes a una Región
  listarProvinciasRegion(codRegion: string){
    //console.log('listarProvinciasRegion',`${this._const.apiDigitalGob}regiones/${codRegion}/provincias`)
    return this.http.get(`${this._const.apiDigitalGob}regiones/${codRegion}/provincias`)
  }

  //Debuelve una provincia perteneciente a una región específica
  buscarProvinciaRegion(codRegion: string, codProvincia: string){
    return this.http.get(`${this._const.apiDigitalGob}regiones/${codRegion}/provincias/${codProvincia}`)
  }
}
