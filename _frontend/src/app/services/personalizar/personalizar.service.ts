import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { Personalizar } from '../../class/personalizar/personalizar';

@Injectable({
  providedIn: 'root'
})
export class PersonalizarService {
  private url: string = 'configuracion'
  public changeNombreApp$: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    private http: HttpClient,
    private _const: ConstantesService,
  ) { }

  getConfig(){
    return this.http.get(`${this._const.endPoint}${this.url}`)
  }

  saveConfig(data: Personalizar){
    this.changeNombreApp$.emit(data.nombre_app)
    return this.http.post(`${this._const.endPoint}${this.url}`, data, {headers: this._const.header()});
  }
}
