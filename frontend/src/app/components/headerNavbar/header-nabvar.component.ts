import { Component, EventEmitter, HostBinding, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/class/User/user';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';
import { LoginService } from '../../services/login/login.service';
import { ConstantesService } from '../../services/constantes/constantes.service';
import { userInfo } from 'os';
import { PersonalizarService } from '../../services/personalizar/personalizar.service';

@Component({
  selector: 'app-header-nabvar',
  templateUrl: './header-nabvar.component.html',
  styleUrls: [
    './header-nabvar.component.css',
    '../../../assets/css/style.css',
  ],
  encapsulation: ViewEncapsulation.None //Permite que la etiqueta del componente de angular no sea considerada en el dom
})
export class HeaderNabvarComponent implements OnInit {
  @HostBinding('style') style = 'display: contents';
  @Output() showLeftMenu = new EventEmitter<boolean>()
  public showProfileMenu: boolean = false
  public leftMenuIsVisible: boolean = true
  public srcAvatar: string = ''
  public nombreUsuario: string = ''


  constructor(
    private _scriptService: ScriptServicesService,
    private _login: LoginService,
    private _const: ConstantesService,
  ) {
    let user: User | null = this._login.getUsuarioLogueado()
    this.updateAvatarPicture(user)
  }

  ngOnInit(): void {
    this._login.activeUserChange$.subscribe((res: User) => {
      this.updateAvatarPicture(res)
    })
    this.loadScripts()
  }

  private updateAvatarPicture(user: User | null)
  {
      this.srcAvatar = (user && user.foto) ? this._const.storageImages + user.foto : this._const.srcDefault
      this.nombreUsuario = user ? user.name : 'Desconocido...'
  }

  private loadScripts(){
    this._scriptService.load([
    ]
    )
  }

  public showHideProfileMenu(){
    this.showProfileMenu = !this.showProfileMenu
  }

  public showHideLeftMenu(){
    this.leftMenuIsVisible = !this.leftMenuIsVisible
    this.showLeftMenu.emit(this.leftMenuIsVisible)
  }
}
