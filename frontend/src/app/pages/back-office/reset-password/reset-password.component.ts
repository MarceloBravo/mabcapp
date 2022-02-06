import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { ToastService } from '../../../services/toast/toast.service';
import { User } from '../../../class/User/user';
import { ConstantesService } from '../../../services/constantes/constantes.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private id: number | null = null
  avatar: string = ''
  user: User = new User()
  mensaje: string = ''
  tipoMensaje: string = ''

  constructor(
    private _userService: UsuariosService,
    private _toastService: ToastService,
    private _const: ConstantesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.id = parseInt(id)
      this.buscarUsuario()
    }
  }

  private buscarUsuario(){
    if(this.id){
      this._userService.findWithoutRols(this.id).subscribe((res: any) => {
        if(res.id){
          this.user = res
          this.avatar = this.user.foto ? this._const.storageImages + this.user.foto : this._const.srcDefault
        }else{
          this.router.navigate(['/page_error'])
        }
      }, error => {
        this.tipoMensaje = 'danger'
        this.mensaje = error.message + ' ID USUARIO:' + this.id
      })
    }
  }


  resetPassword(pwd: string, confirmPwd: string){
    if(this.confirmarContraseña(pwd, confirmPwd) && this.id){
      this.actualizarPassword(this.id, pwd);
    }
  }


  private actualizarPassword(id: number, pwd: string){
    this._userService.updatePassword(id, pwd).subscribe((res: any) => {
      this.tipoMensaje = res.tipoMensaje
      this.mensaje = res.mensaje

    }, error => {
      this.tipoMensaje = 'danger'
      this.mensaje = error.message
    })
  }


  private confirmarContraseña(pwd: string, confirmPwd: string): boolean{
    if(pwd !== confirmPwd){
      this._toastService.showErrorMessage('La contraseña y la confirmación de contraseña no coinciden')
    }
    return pwd === confirmPwd
  }



}
