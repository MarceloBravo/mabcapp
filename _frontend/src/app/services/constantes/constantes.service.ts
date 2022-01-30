import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantesService {
  public endPoint = "http://localhost:8000/api/"  //Ruta local de las peticiones al backend
  public storageImages = "http://localhost:8000/storage/" //Ruta de almnacenamiento de las imágenes en el backend
  //public endPoint = "http://192.168.43.118:3000/api/" //Ruta pública de las peticiones al backend
  //public storageImages = "http://192.168.43.118:3000/storage/" //Ruta de almnacenamiento de las imágenes en el backend
  public srcDefault: string = '/assets/images/users/user.png'
  public noImage: string = '/assets/front-office/img/bg-img/no_image.png'
  public apiDigitalGob: string = 'https://apis.digital.gob.cl/dpa/'

  constructor(private _tokenService: TokenService) { }

  //Cabecera para las peticiones estándar (GET, POST, PUT, DELETE)
  public header(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._tokenService.getToken()}`
    });
  }


  //Cabecera de las peticiones para los envíos de imágenes
  public headerAttachFile(){
    return new HttpHeaders({
      'Authorization': `Bearer ${this._tokenService.getToken()}`
    });
  }

  public meses: any = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
  }

}
