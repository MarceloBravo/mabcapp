import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-identificacion-cliente',
  templateUrl: './identificacion-cliente.component.html',
  styleUrls: ['./identificacion-cliente.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class IdentificacionClienteComponent implements OnInit {
  showSpinner: boolean = false
  titulo: string = 'Datos del cliente'

  constructor() { }

  ngOnInit(): void {
  }

}
