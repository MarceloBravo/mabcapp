import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ConstantesService } from '../constantes/constantes.service';
import { SharedService } from '../shared/shared.service';
import { TokenService } from '../token/token.service';
import { Cliente } from '../../class/cliente/cliente';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginClientesService {
  private endPoint = 'auth';
  private header: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  public activeUserChange$: EventEmitter<Cliente> = new EventEmitter<Cliente>()  //Observable

  constructor(
    private httpClient: HttpClient,
    private _sharedServices: SharedService,
    private _tokenService: TokenService,
    public _const: ConstantesService,
  ) { }

  login(loginForm: FormGroup){
    let remember: boolean = <boolean><unknown>loginForm.value['remember'];
    this._sharedServices.globalRememberClient = remember;
    return this.httpClient.post(this._const.endPoint + this.endPoint + '/clientes_login', loginForm.value, {headers: this.header});
  }

  validaToken(token: string){
    if(token !== ""){
      let tokenArr = token.split('.');
      if(tokenArr.length > 1){
        const decodeToken = JSON.parse(atob(tokenArr[1]));
        return decodeToken.iss === this._const.endPoint + this.endPoint  + '/clientes_login'
      }
    }
    return false
  }

  registrarToken(token: string, remember: boolean){
    this._tokenService.registerToken(token, remember, 'mabc-client-token');
  }

  isLoggedIn(){
    return this._tokenService.getToken() !== null;
  }

  logOut(){
    let header = this._const.header();
    //this.borrarCredencialesCliente();
    return this.httpClient.post(
            `${this._const.endPoint}${this.endPoint}/clientes_logout`,
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

  setCredencialesCliente(cliente: Cliente)
  {
    sessionStorage.setItem('client', JSON.stringify(cliente))
    this.activeUserChange$.emit(cliente)
  }

  getClienteLogueado():Cliente|null
  {
    let usuario = sessionStorage.getItem('client')
    return usuario ? JSON.parse(usuario) : null
  }


  borrarCredencialesCliente(){
    sessionStorage.removeItem('client');
    this._tokenService.deteToken()
    return this.activeUserChange$.emit(undefined)
    //sessionStorage.removeItem('mabc-client-token');
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
