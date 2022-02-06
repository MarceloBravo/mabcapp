import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/class/login/login';
import { LoginService } from 'src/app/services/login/login.service';
import { SharedService } from '../../../services/shared/shared.service';
import { ScriptServicesService } from '../../../services/scriptServices/script-services.service';
import { ToastService } from '../../../services/toast/toast.service';
import { PersonalizarService } from '../../../services/personalizar/personalizar.service';
import { Title } from '@angular/platform-browser';
import { ResetEmailService } from '../../../services/resetEmail/reset-email.service';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { User } from '../../../class/User/user';
import { Tienda } from '../../../class/tienda/tienda';
import { ConfigTiendaService } from '../../../services/configTienda/config-tienda.service';
import { isArray } from 'util';
import { ConstantesService } from '../../../services/constantes/constantes.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
  ]
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    password: new FormControl(),
    email: new FormControl(),
    remember: new FormControl()
  })
  public showToast: boolean = false
  public nombreApp: string = ''
  private usuario: User | null = null
  private tienda: Tienda | null = null


  constructor(
    private _loginService: LoginService,
    private _shared: SharedService,
    private fb: FormBuilder,
    private router: Router,
    private _scriptService: ScriptServicesService,
    private toastService: ToastService,
    private _configService: PersonalizarService,
    private title: Title,
    private resetEmail: ResetEmailService,
    private user: UsuariosService,
    private configTienda: ConfigTiendaService,
    private _const: ConstantesService

  ) {
    this._scriptService.load([
      '//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js',
      '//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js',
      '//code.jquery.com/jquery-1.11.1.min.js'
      ]);
    this.initForm();
    this.getTituloApp();
   }

  ngOnInit(): void {
  }

  private initForm(){
    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      email:['',[Validators.required, Validators.email]],
      remember:false
    })
  }

  private getTituloApp(){
    this._configService.getConfig().subscribe((res: any) => {
      this.title.setTitle(res[0].nombre_app);
      this.nombreApp = res[0].nombre_app
    }, error => {
      console.log(error)
      this.title.setTitle('...');
    })
  }

  login(){
    this._loginService.login(this.loginForm).subscribe(
      (res: any) => {
        if(res.status !== 200){
          if(this._loginService.validaToken(res['access_token'])){
            this._loginService.registrarToken(res['access_token'], this.loginForm.value['remember']);
            //this._shared.user = res['user'];
            //this._shared.roles = res['roles'];
            this._loginService.setCredencialesUsuario(res['user'], res['roles'])
            this.router.navigate(['/admin']);
          }
          this.toastService.clearToast();
        } else{
          this.showToast = true;
        }
    },error=>{
      console.log(error)
      this.toastService.showErrorMessage(error.status !== 401 ? error.message : 'Usuario y/o contraseña no validos', 'Error!!')

    });
  }


  async rememberPassword(email: HTMLInputElement){
    if(email.value.length > 0){
      this.usuario = await this.buscarUsuario(email.value)
      this.tienda = await this.obtenerDatosTienda()

        this.restaurarContraseña()

    }else{
      this.toastService.showErrorMessage('Debe ingresar su correo electrónico en el cuadro de texto de email')
    }
  }


  private buscarUsuario(email: string): Promise<any>{
    return new Promise((resolve, reject) =>{
      this.user.findByEmail(email).subscribe((res: any) => {
        return resolve(res)
      }, error =>{
        this.toastService.showErrorMessage(error)
        return reject(null)
      })
    })

  }


  private obtenerDatosTienda(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.configTienda.get().subscribe(res => {
        return resolve(res)
      }, error => {
        this.toastService.showErrorMessage(error)
        return reject(null)
      })
    })

  }


  private restaurarContraseña(){
    if(this.usuario && this.tienda){

      let url = document.URL.split(this.router.url)[0] + '/reset-password/' + this.usuario.id
      let data = {usuario: this.usuario, tienda: this.tienda, url ,title: 'Restaurar contraseña'}
      this.resetEmail.resetEmail(data).subscribe((res: any) => {
        if(res.tipoMensaje === 'danger'){
          this.toastService.showErrorMessage(res.mensaje)
        }else{
          this.toastService.showSuccessMessage('Te hemos enviado un email con instrucciones para restablecer tu contraseña')
        }
      }, error=> {
        this.toastService.showErrorMessage(error.message)
      })

    }else{

      let mensaje: string  = !this.usuario ? 'El usuario no fue encontrado o no existe. ' : ''
      mensaje += !this.tienda ? 'La información de la tienda no fue encontrada.' : ''
      this.toastService.showErrorMessage(mensaje)

    }
  }
}
