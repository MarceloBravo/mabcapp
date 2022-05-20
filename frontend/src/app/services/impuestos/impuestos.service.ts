import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';
import { Impuesto } from '../../class/impuesto/impuesto';

@Injectable({
  providedIn: 'root'
})
export class ImpuestosService {
  private url: string = 'impuestos';

  constructor(
    private http: HttpClient,
    private constantes: ConstantesService) { }

  list(pag: number){
    return this.http.get(`${this.constantes.endPoint}${this.url}/pag/${pag}`,{headers: this.constantes.header()});
  }

  getAll(){
    return this.http.get(`${this.constantes.endPoint}${this.url}/get/all`,{headers: this.constantes.header()});
  }

  find(id: number){
    return this.http.get(`${this.constantes.endPoint}${this.url}/${id}`,{headers: this.constantes.header()});
  }

  insert(impuesto: Impuesto){
    return this.http.post(`${this.constantes.endPoint}${this.url}`, impuesto, {headers: this.constantes.header()});
  }

  update(impuesto: Impuesto){
    return this.http.put(`${this.constantes.endPoint}${this.url}/${impuesto.id}`, impuesto, {headers: this.constantes.header()});
  }

  delete(id: number){
    return this.http.delete(`${this.constantes.endPoint}${this.url}/${id}`, {headers: this.constantes.header()});
  }

  filter(texto: string, pag: number){
    texto = texto.split('/').join(this.constantes.caracterComodinBusqueda)
    return this.http.get(`${this.constantes.endPoint}${this.url}/filter/${texto}/${pag}`, {headers: this.constantes.header()});
  }
}
