import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resultado-transaccion',
  templateUrl: './resultado-transaccion.component.html',
  styleUrls: ['./resultado-transaccion.component.css']
})
export class ResultadoTransaccionComponent implements OnInit {
  titulo: string = 'Resultado de la transacción'

  constructor() { }

  ngOnInit(): void {
  }

}
