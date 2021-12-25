import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/class/cliente/cliente';
import { LoginClientesService } from 'src/app/services/loginClientes/login-clientes.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-identificacion-cliente',
  templateUrl: './identificacion-cliente.component.html',
  styleUrls: ['./identificacion-cliente.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class IdentificacionClienteComponent implements OnInit {
  showSpinner: boolean = false
  titulo: string = 'Datos del cliente'
  showToast: boolean = false
  formLogin: FormGroup = new FormGroup({
    email: new FormControl(null,[Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    remember: new FormControl(false)
  })

  formCliente: FormGroup = new FormGroup({
    id: new FormControl(null),
    rut: new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(13)]),
    nombres: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    apellido1: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    apellido2: new FormControl(null, [Validators.minLength(2), Validators.maxLength(50)]),
    fono: new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(200)]),
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
    this._loginClienteService.login(this.formLogin).subscribe((res: any) => {
      if(res.status !== 200){
        if(this._loginClienteService.validaToken(res['access_token'])){
          this._loginClienteService.registrarToken(res['access_token'], this.formLogin.value['remember']);
          this._loginClienteService.setCredencialesCliente(res['user'])
          this.router.navigate(['/datos_despacho'])
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

  continuarCompra(){
    this._loginClienteService.setCredencialesCliente(this.formCliente.value)
    this.router.navigate(["/datos_despacho"])
  }
}
