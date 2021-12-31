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
export class ClientesLoginService {
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
    this._sharedServices.globalRememberUser = remember;
    console.log(this._sharedServices.globalURL + this.endPoint + 'cliente_login', loginForm.value)
    debugger
    return this.httpClient.post(this._sharedServices.globalURL + this.endPoint + 'cliente_login', loginForm.value, {headers: this.header});
  }

  validaToken(token: string){
    if(token !== ""){
      let tokenArr = token.split('.');
      if(tokenArr.length > 1){
        const decodeToken = JSON.parse(atob(tokenArr[1]));
        return decodeToken.iss === this._sharedServices.globalURL + this.endPoint  + 'cliente_login'
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
    this.borrarCredencialesCliente();
    return this.httpClient.post(
            `${this._sharedServices.globalURL}${this.endPoint}cliente_login`,
            {},
            {headers: header}
          );
  }

  refreshToken(){
    return this.httpClient.post(
      `${this._sharedServices.globalURL}${this.endPoint}/refresh`,
      {},
      {headers: this._const.header()}
      );
  }

  setCredencialesCliente(cliente: Cliente)
  {
    this.activeUserChange$.emit(cliente)
    sessionStorage.setItem('client', JSON.stringify(cliente))
  }

  getClienteLogueado():Cliente|null
  {
    let usuario = sessionStorage.getItem('client')
    return usuario ? JSON.parse(usuario) : null
  }


  private borrarCredencialesCliente(){
    sessionStorage.removeItem('client');
    this._tokenService.deteToken()
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