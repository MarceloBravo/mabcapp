import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-errors',
  templateUrl: './input-errors.component.html',
  styleUrls: ['./input-errors.component.css']
})
export class InputErrorsComponent implements OnInit {
  @Input() control: AbstractControl | null = null;
  @Input() mensajes: any = {}

  constructor() { }

  ngOnInit(): void {

  }

  errorMesage(keyError: string){
    let mensaje = keyError === 'required' ? 'El campo es obligatorio' :
                   (keyError === 'minlength' ? 'El texto ingresado es muy corto' :
                    (keyError === 'maxlength' ? 'El texto ingresado es muy largo' : 'El valor ingresado no es válido'))

    if(this.mensajes[keyError]){
      mensaje = this.mensajes[keyError]
    }
    return mensaje
  }


  getErrors(control: AbstractControl){
    return control.errors ?  Object.keys(control.errors) : []
  }
}
