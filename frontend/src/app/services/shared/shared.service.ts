import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  globalRemenberUser: boolean = false;
  globalURL: string = 'http://127.0.0.1:8000/api/'

  constructor(private _tokenService: TokenService) { }

  header(){
    return new HttpHeaders({
      'Content-type':'application/json',
      'Authorization': `Bearer ${this._tokenService.getToken()}`
    })
  }
}
