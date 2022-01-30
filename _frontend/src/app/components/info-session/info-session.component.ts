import { Component, HostBinding, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Observable, timer } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-info-session',
  templateUrl: './info-session.component.html',
  styleUrls: ['./info-session.component.css']
})
export class InfoSessionComponent implements OnInit {
  @HostBinding('style') style = 'display: flex';
  public strTiempo: string = ''
  private sessionInfo: any = null
  private obsTimer: Observable<number> = timer(1000, 1000)


  constructor(
    private _loginService: LoginService,
    private _toastService: ToastService,
    private router: Router
  ) {
    this.sessionInfo = this._loginService.getSeesionInfo()
  }


  ngOnInit(): void {
    this.obsTimer.subscribe(currTime => this.calcularTiempo() )
  }


  private calcularTiempo(){
    if(this.sessionInfo){
      let curDate: any = new Date()
      let expireDate: any = new Date(this.sessionInfo.exp * 1000)
      let horas: number = Math.floor(((expireDate - curDate) / 1000) / 3600)
      let min: number = Math.floor(((expireDate - curDate)/ 1000) / 60) % 60
      let sec: number = Math.floor((expireDate - curDate) / 1000) % 60

      this.strTiempo = `${horas}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
      if(curDate > expireDate){
        this._toastService.showWarningMessage('Tu sessión ha expirado.')
        this.router.navigate(['/login'])
        this.sessionInfo = null
      }
    }
  }



}
