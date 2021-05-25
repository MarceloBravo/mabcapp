import { Injectable, EventEmitter } from '@angular/core';
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
  public activeUserChange$: EventEmitter<User> = new EventEmitter<User>()  //Observable
  public rolesUserChange$: EventEmitter<Rol[]> = new EventEmitter<Rol[]>()  //Observable

  constructor(
    private httpClient: HttpClient,
    private _sharedServices: SharedService,
    private _tokenService: TokenService
  ) { }

  login(loginForm: FormGroup){
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
    this.borrarCredencialesUsuario();
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
    sessionStorage.removeItem('roles');
  }
}
