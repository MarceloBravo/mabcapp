import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { Grupo } from '../../class/grupos/grupo';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private url: string = 'grupos';

  constructor(
    private http: HttpClient,
    private _constantes: ConstantesService
  ) { }

  getAll() {
    return this.http.get(`${this._constantes.endPoint}${this.url}/get/all`, { headers: this._constantes.header() });
  }

  list(pag: number) {

  }

  find(id: number) {

  }

  insert(grupo: Grupo) {

  }

  update(id: number, grupo: Grupo) {

  }

  delete(id: number) {

  }

  filter(texto: string, pag: number) {

  }

}
