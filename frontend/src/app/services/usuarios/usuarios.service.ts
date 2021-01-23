import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { User } from 'src/app/class/User/user';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url: string = 'usuarios';

  constructor(
    private http: HttpClient,
    private _constantes: ConstantesService,
  ) { }

  getAll(){
    return this.http.get(`${this._constantes.endPoint}${this.url}/get/all`,{headers: this._constantes.header()});
  }

  list(page: number){
    return this.http.get(`${this._constantes.endPoint}${this.url}/pag/${page}`,{headers: this._constantes.header()});
  }

  filter(buscado: string, page: number){
    return this.http.get(`${this._constantes.endPoint}${this.url}/filtrar/${buscado}/${page}`,{headers: this._constantes.header()});
  }

  find(id: number){
    return this.http.get(`${this._constantes.endPoint}${this.url}/${id}`,{headers: this._constantes.header()});
  }

  insert(user: User){
    return this.http.post(`${this._constantes.endPoint}${this.url}`, user, {headers: this._constantes.header()});
  }

  update(id: number, user: User){
    return this.http.put(`${this._constantes.endPoint}${this.url}/${id}`, user, {headers: this._constantes.header()});
  }

  delete(id: number){
    return this.http.delete(`${this._constantes.endPoint}${this.url}/${id}`, {headers: this._constantes.header()});
  }

}
