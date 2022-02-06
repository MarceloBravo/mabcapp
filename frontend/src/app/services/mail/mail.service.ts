import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(
    private http: HttpClient,
    private _const: ConstantesService,
    ) { }

  sesendMail(data: any){
    return this.http.post(`${this._const.endPoint}sendmail`, data, {headers: this._const.header()})
  }

}
