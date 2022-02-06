import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalDialogService {
  public mostrar: boolean = false
  public mensaje = ''
  public titulo: string = ''
  public textoBtnAceptar: string = 'Aceptar'
  public textoBtnCancelar: string = 'Cancelar'

  constructor() { }

  mostrarModalDialog(mensaje: string, titulo: string = 'Ateción', textoBtnAceptar: string = 'Aceptar', textoBtnCancelar: string = 'Cancelar'){
    this.mostrar = true
    this.mensaje = mensaje
    this.titulo = titulo
    this.textoBtnAceptar = textoBtnAceptar
    this.textoBtnCancelar = textoBtnCancelar
  }

  ocultarModalDialog(){
    this.mostrar = false
    this.mensaje = ''
    this.titulo = 'Atención'
    this.textoBtnAceptar = 'Aceptar'
    this.textoBtnCancelar = 'Cancelar'
  }
}
