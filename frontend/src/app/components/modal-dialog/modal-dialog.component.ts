import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { ModalDialogService } from 'src/app/services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {
  @Output() cerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() aceptar: EventEmitter<boolean> = new EventEmitter();

  constructor(public _modalDialogService: ModalDialogService) { }

  ngOnInit(): void {
  }

  btnCancelar(){
    this.resetValues()
    this.cerrar.emit(false);
  }

  btnAceptar(){
    this.resetValues()
    this.aceptar.emit(true);
  }

  private resetValues(){
    this._modalDialogService.ocultarModalDialog()
  }

}
