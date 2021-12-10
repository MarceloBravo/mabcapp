import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-config-tienda',
  templateUrl: './config-tienda.component.html',
  styleUrls: ['./config-tienda.component.css']
})
export class ConfigTiendaComponent implements OnInit {
  public titulo: string = 'Configuración de la Tienda'
  public isOpen1: boolean = false
  public isOpen2: boolean = false
  public isOpen3: boolean = false

  
  
  constructor() {
  }

  ngOnInit(): void {
  }

  
}
