import { Injectable } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private _sharedService: SharedService
  ) { }

  registerToken(token: string){
    if(this._sharedService.globalRemenberUser){
      sessionStorage.setItem('mabc-token', token);
    }else{
      localStorage.setItem('mabc-token', token);
    }
  }

  getToken(){
    if(this._sharedService.globalRemenberUser){
      return localStorage.getItem('mabc-token');
    }else{
      return sessionStorage.getItem('mabc-token');
    }
  }

  deteToken(){
    if(this._sharedService.globalRemenberUser){
      localStorage.removeItem('mabc-token');
    }else{
      sessionStorage.removeItem('mabc-token');
    }
  }
}
