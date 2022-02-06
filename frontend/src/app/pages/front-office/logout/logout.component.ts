import { Component, OnInit } from '@angular/core';
import { LoginClientesService } from 'src/app/services/loginClientes/login-clientes.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class LogoutComponent implements OnInit {
  showSpinner: boolean = false
  titulo: string = 'Logout'

  constructor(
    private _loginClienteService: LoginClientesService,
    private _sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }



  logout(){
    this._loginClienteService.logOut().subscribe(res => {
      this._loginClienteService.borrarCredencialesCliente()
      this.router.navigate(['/home'])
    }, error =>{
      console.log(error)
      this._sharedService.handlerError(error)
    })
  }
}
