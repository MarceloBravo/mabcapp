import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from '../constantes/constantes.service';
import { Marca } from '../../class/marca/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private url: string = 'marcas'

  constructor(
    private http: HttpClient,
    private constantes: ConstantesService
  ) { }

  getAll(){
    return this.http.get(`${this.constantes.endPoint}${this.url}/get/all`,{headers: this.constantes.header()});
  }

  getHome(){
    return this.http.get(`${this.constantes.endPoint}${this.url}/get/home`,{headers: this.constantes.header()});
  }

  list(pag: number){
    return this.http.get(`${this.constantes.endPoint}${this.url}/pag/${pag}`,{headers: this.constantes.header()});

  }

  find(id: number){
    return this.http.get(`${this.constantes.endPoint}${this.url}/${id}`,{headers: this.constantes.header()});
  }

  insert(marca: Marca){
    return this.http.post(`${this.constantes.endPoint}${this.url}`, marca,{headers: this.constantes.header()});
  }

  update(marca: Marca){
    return this.http.put(`${this.constantes.endPoint}${this.url}/${marca.id}`, marca,{headers: this.constantes.header()});
  }

  delete(id: number){
    return this.http.delete(`${this.constantes.endPoint}${this.url}/${id}`,{headers: this.constantes.header()});
  }

  filter(texto: string, pag: number){
    return this.http.get(`${this.constantes.endPoint}${this.url}/filtrar/${texto}/${pag}`,{headers: this.constantes.header()});
  }

}
