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

  constructor(
    private _loginService: LoginService,
    private _shared: SharedService,
    private fb: FormBuilder,
    private router: Router,
    private _scriptService: ScriptServicesService,
    private toastService: ToastService,
    private _configService: PersonalizarService,
    private title: Title
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
        console.log(res);
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
}
