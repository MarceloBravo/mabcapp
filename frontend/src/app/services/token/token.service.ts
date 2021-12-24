import { Injectable } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private nombreToken: string = 'mabc-admin-token'

  constructor(
    private _sharedService: SharedService
  ) { }

  registerToken(token: string, remember: boolean, nombreToken?: string){
    if(nombreToken){
      this.nombreToken = nombreToken
      this._sharedService.globalRememberClient = remember;
    }else{
      this._sharedService.globalRememberUser = remember;
    }

    if(remember){
      localStorage.setItem(this.nombreToken, token);
    }else{
      sessionStorage.setItem(this.nombreToken, token);
    }
  }

  getToken(){
    if(this.nombreToken === 'mabc-admin-token'){
      return this.getTokenUser()
    }else{
      return this.getTokenClient()
    }
  }

  private getTokenUser(){
    if(this._sharedService.globalRememberUser){
      return localStorage.getItem(this.nombreToken);
    }else{
      return sessionStorage.getItem(this.nombreToken);
    }
  }

  private getTokenClient(){
    if(this._sharedService.globalRememberClient){
      return localStorage.getItem(this.nombreToken);
    }else{
      return sessionStorage.getItem(this.nombreToken);
    }
  }

  deteToken(){
    if(this.nombreToken === 'mabc-admin-token'){
      this.deleteTokenUser()
    }else{
      this.deleteTokenClient()
    }
  }

  private deleteTokenUser(){
    if(this._sharedService.globalRememberUser){
      localStorage.removeItem(this.nombreToken);
    }else{
      sessionStorage.removeItem(this.nombreToken);
    }
  }

  private deleteTokenClient(){
    if(this._sharedService.globalRememberUser){
      localStorage.removeItem(this.nombreToken);
    }else{
      sessionStorage.removeItem(this.nombreToken);
    }
  }
}
