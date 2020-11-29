import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { TokenService } from '../token/token.service';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private endPoint = 'login';
  private header: HttpHeaders = new HttpHeaders({'Content-type': 'application-json'});

  constructor(
    private httpClient: HttpClient,
    private _sharedServices: SharedService,
    private _tokenService: TokenService
  ) { }

  login(loginForm: FormGroup){
    this._sharedServices.globalRemenberUser = loginForm['remenber'];
    return this.httpClient.post(this._sharedServices.globalURL + this.endPoint, loginForm, {headers: this.header});
  }

  validaToken(token: string){
    if(token !== ""){
      let tokenArr = token.split('.');
      if(tokenArr.length > 1){
        const decodeToken = JSON.parse(atob(tokenArr[1]));
        return decodeToken.iss === this._sharedServices.globalURL + this.endPoint
      }
      return false
    }
  }

  isLoggedIn(){
    return this._tokenService.getToken() !== null;
  }

  logOut(){
    return this.httpClient.post(`${this._sharedServices.globalURL}${this.endPoint}/logout`, {},{headers: this._sharedServices.header()});
  }

  refreshToken(){
    return this.httpClient.post(`${this._sharedServices.globalURL}${this.endPoint}/refresh`,{},{headers: this._sharedServices.header()});
  }
}
