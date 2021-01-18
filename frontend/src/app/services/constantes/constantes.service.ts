import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantesService {
  public endPoint = "http://localhost:8000/api/"

  constructor(private _tokenService: TokenService) { }

  public header(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._tokenService.getToken()}`
    });
  }

}
