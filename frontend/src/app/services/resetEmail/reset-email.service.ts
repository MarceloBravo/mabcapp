import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { Tienda } from '../../class/tienda/tienda';
import { User } from '../../class/User/user';

@Injectable({
  providedIn: 'root'
})
export class ResetEmailService {
  private url: string = 'reset_password'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService
  ) { }

  resetEmail(data: {usuario: User, tienda: Tienda, url: string, title: string}){
    return this.http.post(this._const.endPoint + this.url, data, {headers: this._const.header()})
  }
}
