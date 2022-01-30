import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoguedGuard implements CanActivate, CanActivateChild {

  constructor(
    private _loginService: LoginService,
    private router: Router
  ){}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this._loginService.getUsuarioLogueado()){
      this.router.navigate(['/'])
      return false
    }
    return true;
  }

  canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this._loginService.getUsuarioLogueado()){
      this.router.navigate(['/'])
      return false
    }
    return true;
  }

}
