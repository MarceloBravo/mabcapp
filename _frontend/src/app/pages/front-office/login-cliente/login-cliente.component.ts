import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginClientesService } from '../../../services/loginClientes/login-clientes.service';
import { SharedService } from '../../../services/shared/shared.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-login-cliente',
  templateUrl: './login-cliente.component.html',
  styleUrls: ['./login-cliente.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class LoginClienteComponent implements OnInit {
  showSpinner: boolean = false
  showToast: boolean = false
  titulo: string = 'Login'
  form: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
    remember: new FormControl(false)
  })


  constructor(
    private _loginClienteService: LoginClientesService,
    private _sharedServices: SharedService,
    private _toastService: ToastService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.showSpinner = true
    this._loginClienteService.login(this.form).subscribe((res: any) => {
      if(res.status !== 200){
        if(this._loginClienteService.validaToken(res['access_token'])){
          this._loginClienteService.registrarToken(res['access_token'], this.form.value['remember']);
          this._loginClienteService.setCredencialesCliente(res['user'])
          this.router.navigate(['/']);
        }
        this._toastService.clearToast();
      } else{
        this.showToast = true;
      }
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedServices.handlerError(error)
    })
  }
}
