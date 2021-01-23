import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: [
    './grid.component.css',
    '../../../assets/css/app.css',
  ]
})
export class GridComponent implements OnInit {
  @Input() registros: any[] = []
  @Input() cabeceras: Object[] = []
  @Input() columnasVisibles: string[] = []
  @Input() titulo: string = ''
  @Input() urlEditar: string = 'edit';
  @Input() urlNuevo: string = 'nuevo';
  @Input() mostrarNuevo: boolean = true;
  @Input() mostrarEditar: boolean = true;
  @Input() mostrarEliminar: boolean = true;
  @Output() idEliminar: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  eliminar(id: number){
    this.idEliminar.emit(id);
  }

  formatDate(dato: any){
    let parseDate = Date.parse(dato);
    if(isNaN(dato) && !isNaN(parseDate)){
      //Retorna la fecha con formato dd/mm/yyyy
      return dato.toLocaleString().toString().substr(0,10).split('-').reverse().join('/');
    }else{
      //Retorna el dato recibido
      return dato;
    }
  }

  getColNames(obj: object){
    let arrKeyNames = Object.keys(obj);
    if(arrKeyNames.indexOf('id') !== undefined){
      arrKeyNames.splice(arrKeyNames.indexOf('id'),1);
    }
    return arrKeyNames;
  }

}
