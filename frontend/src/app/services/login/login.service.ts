import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { TokenService } from '../token/token.service';
import { FormGroup } from '@angular/forms';
import { User } from '../../class/User/user';
import { Rol } from '../../class/rol/rol';
import { ConstantesService } from '../constantes/constantes.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private endPoint = 'auth/';
  private header: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  public activeUserChange$: EventEmitter<User> = new EventEmitter<User>()  //Observable
  public rolesUserChange$: EventEmitter<Rol[]> = new EventEmitter<Rol[]>()  //Observable

  constructor(
    private httpClient: HttpClient,
    private _sharedServices: SharedService,
    private _tokenService: TokenService,
    public _const: ConstantesService,
  ) { }

  login(loginForm: FormGroup){
    let remember: boolean = <boolean><unknown>loginForm.value['remember'];
    this._sharedServices.globalRememberUser = remember;
    return this.httpClient.post(this._const.endPoint + this.endPoint + 'login', loginForm.value, {headers: this.header});
  }

  validaToken(token: string){
    if(token !== ""){
      let tokenArr = token.split('.');
      if(tokenArr.length > 1){
        const decodeToken = JSON.parse(atob(tokenArr[1]));
        return decodeToken.iss === this._const.endPoint + this.endPoint  + 'login'
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
    let header = this._const.header();
    this.borrarCredencialesUsuario();
    return this.httpClient.post(
            `${this._const.endPoint}${this.endPoint}logout`,
            {},
            {headers: header}
          );
  }

  refreshToken(){
    return this.httpClient.post(
      `${this._const.endPoint}${this.endPoint}/refresh`,
      {},
      {headers: this._const.header()}
      );
  }

  setCredencialesUsuario(user: User, roles: Rol[])
  {
    this.activeUserChange$.emit(user)
    this.rolesUserChange$.emit(roles)
    sessionStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('roles', JSON.stringify(roles))
  }

  getUsuarioLogueado():User|null
  {
    let usuario = sessionStorage.getItem('user')
    return usuario ? JSON.parse(usuario) : null
  }

  getRolesUsuarioLogueado()
  {
    let roles = sessionStorage.getItem('roles');
    return roles ? JSON.parse(roles) : null
  }

  private borrarCredencialesUsuario(){
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('mabc-admin-token');
    sessionStorage.removeItem('roles');
  }

  public getSeesionInfo(){
    let token: any = this._tokenService.getToken();
    if(token){
      let tokenArr = token.split('.');
      if(tokenArr.length > 1){
        const decodeToken = JSON.parse(atob(tokenArr[1]));
        return decodeToken;
      }
    }
    return null
  }
}
