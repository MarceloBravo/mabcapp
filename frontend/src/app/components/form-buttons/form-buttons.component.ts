import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PermisosService } from '../../services/permisos/permisos.service';
import { Router } from '@angular/router'
import { LoginService } from '../../services/login/login.service';
import { Rol } from 'src/app/class/rol/rol';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-form-buttons',
  templateUrl: './form-buttons.component.html',
  styleUrls: ['./form-buttons.component.css']
})
export class FormButtonsComponent implements OnInit {
  @Input() id: number | null = null
  @Input() formValid: boolean = false
  @Output() eventCancelar: EventEmitter<boolean> = new EventEmitter()
  @Output() eventGrabar: EventEmitter<boolean> = new EventEmitter()
  @Output() eventEliminar: EventEmitter<boolean> = new EventEmitter()
  public eliminar: boolean = false
  public crear: boolean = false
  public modificar: boolean = false

  constructor(
    private _permisosService: PermisosService,
    private _login: LoginService,
    private _toast: ToastService,
    private router: Router
  ) {
    let roles: Rol[] = this._login.getRolesUsuarioLogueado()  //Obteniendo los roles del usuario desde la SesionStorage
    if(roles){
        let rolesUsuario = roles.map(r => r.id)
        let url = this.router.url.split('/')[2] //Obteniendo la url de la ruta asociada a la pantalla actual
        this.obtenerPermisos(rolesUsuario, url)
    }else{
      this._toast.showErrorMessage('El usuario no posee datos de ingreso y debe loguearse nuevamente.')
      this.router.navigate(['/'])
    }

  }

  private obtenerPermisos(roles: number[], url: string)
  {
    this._permisosService.getRolPermissions(roles, url).subscribe((res: any) => {
      res.forEach((p: any) => {
        if(p.crear)this.crear = true
        if(p.modificar)this.modificar = true
        if(p.eliminar)this.eliminar = true
      })
    },error=>{
      console.log('ERROR',error)
      this._toast.showErrorMessage('Ocurrió un error al consultar los permisos: ' + error.message)
    })
  }

  ngOnInit(): void {
  }

  cancelar(){
    return this.eventCancelar.emit(true)
  }


  modalEliminar(){
    return this.eventGrabar.emit(true)
  }

  modalGrabar(){
    return this.eventGrabar.emit(true)
  }
}
