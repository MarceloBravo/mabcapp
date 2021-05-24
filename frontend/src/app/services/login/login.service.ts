import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { TokenService } from '../token/token.service';
import { FormGroup } from '@angular/forms';
import { User } from '../../class/User/user';
import { Rol } from '../../class/rol/rol';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private endPoint = 'auth/login';
  private header: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(
    private httpClient: HttpClient,
    private _sharedServices: SharedService,
    private _tokenService: TokenService
  ) { }

  login(loginForm: FormGroup){
    //console.log(loginForm.value)
    let remember: boolean = <boolean><unknown>loginForm.value['remember'];
    this._sharedServices.globalRememberUser = remember;
    return this.httpClient.post(this._sharedServices.globalURL + this.endPoint, loginForm.value, {headers: this.header});
  }

  validaToken(token: string){
    if(token !== ""){
      let tokenArr = token.split('.');
      if(tokenArr.length > 1){
        const decodeToken = JSON.parse(atob(tokenArr[1]));
        return decodeToken.iss === this._sharedServices.globalURL + this.endPoint
      }
    }
    return false
  }

  registrarToken(token: string, remember: boolean){
    this._tokenService.registerToken(token, remember);
  }

  isLoggedIn(){
    return this._tokenService.getToken() !== null;
  }

  logOut(){
    let token: any = this._tokenService.getToken();
    return this.httpClient.post(
            `${this._sharedServices.globalURL}${this.endPoint}/logout`,
            {},
            {headers: this._sharedServices.header(<string><unknown>token)}
          );
  }

  refreshToken(){
    let token: any = this._tokenService.getToken();
    return this.httpClient.post(
      `${this._sharedServices.globalURL}${this.endPoint}/refresh`,
      {},
      {headers: this._sharedServices.header(<string><unknown>token)}
      );
  }

  setCredencialesUsuario(user: User, roles: Rol[])
  {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('roles', JSON.stringify(roles))
  }

  getUsuarioLogueado():User|null
  {
    let usuario = localStorage.getItem('user')
    return usuario ? JSON.parse(usuario) : null
  }

  getRolesUsuarioLogueado()
  {
    let roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : null
  }
}
