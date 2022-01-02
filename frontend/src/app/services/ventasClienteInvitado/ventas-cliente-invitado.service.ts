import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { Cliente } from 'src/app/class/cliente/cliente';

@Injectable({
  providedIn: 'root'
})
export class VentasClienteInvitadoService {
  private url: string = 'ventas_cliente_invitado'

  constructor(
    private http: HttpClient,
    private _const: ConstantesService,
  ) { }

  insert(data: any){
    return this.http.post(this._const.endPoint + this.url, data, {headers: this._const.header()})
  }
}
