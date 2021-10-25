import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../class/User/user';
import { Rol } from 'src/app/class/rol/rol';
import { TokenService } from '../token/token.service';
import { ToastService } from '../toast/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public globalRememberUser: boolean = false;
  public globalURL: string = 'http://127.0.0.1:8000/api/';
  public user: User = new User();
  public roles!: Rol[];

  constructor(
    private _toastService: ToastService,
    private router: Router
  ) { }

  header(token: string){
    return new HttpHeaders({
      'Content-type':'application/json',
      'Authorization': `Bearer ${token}`
    })
  }

  getCurrentDate(){
    let date = new Date();
    return `${(date.getDate() < 10 ? '0' : '')}${date.getDate()}/${((date.getMonth() + 1) < 10 ? '0' : '')}${(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  formatDate(fecha: any){
    return fecha.toLocaleString().toString().substr(0,10).split('-').reverse().join('/');
  }


  public handlerSucces(res: any, url: string): boolean{
    if(res['status'] === 'Token is Expired'){
      this.router.navigate(['/']);
      return false;
    }else{
      if(res.tipoMensaje == 'success'){
        this._toastService.showSuccessMessage(res.mensaje);
        this.router.navigate([url]);
      }else{
        let keys = Object.keys(res.errores);
        let errores: string = keys.map(k => res.errores[k]).join('');
        this._toastService.showErrorMessage(res.mensaje + ': ' + errores);
      }
      return true;
      //this.showSpinner = false;
    }
  }

  public handlerError(error: any): boolean{
    console.log(error);
    //this.showSpinner = false;
    this._toastService.showErrorMessage(error.message, 'Error');
    return true;
  }

}
