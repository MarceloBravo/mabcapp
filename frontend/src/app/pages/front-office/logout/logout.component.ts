import { Component, OnInit } from '@angular/core';
import { LoginClientesService } from 'src/app/services/loginClientes/login-clientes.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit(): void {
  }



  logout(){

  }
}
