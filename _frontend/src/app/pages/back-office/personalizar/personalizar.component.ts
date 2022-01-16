import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Personalizar } from '../../../class/personalizar/personalizar';
import { PersonalizarService } from '../../../services/personalizar/personalizar.service';
import { ToastService } from '../../../services/toast/toast.service';
import { Router } from '@angular/router';
import { ModalDialogService } from '../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-personalizar',
  templateUrl: './personalizar.component.html',
  styleUrls: ['./personalizar.component.css']
})
export class PersonalizarComponent implements OnInit {
  public mostrarSpinner: boolean = false
  public personalizar: Personalizar = new Personalizar()
  public form: FormGroup = new FormGroup({
    nombre_app: new FormControl()
  })
  private url: string = '/admin'
  private accion: string = ''

  constructor(
    private _configService: PersonalizarService,
    private _toastService: ToastService,
    private _modalDialogService: ModalDialogService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.getData()
   }

  ngOnInit(): void {
  }

  private getData(){
    this._configService.getConfig().subscribe((res: any) => {
      this.personalizar = res[0]
      this.initForm()
    },error => {
      console.log(error)
      this._toastService.showErrorMessage(error.message)
    })
  }

  private initForm(){
    this.form = this.fb.group({
      nombre_app: [this.personalizar.nombre_app, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    })
  }

  //Botón grabar del formulario
  grabar(){
    this._modalDialogService.mostrarModalDialog('¿Desea grabar los datos?','Grabar')
    this.accion = 'grabar'
  }

  //Botón grabar del formulario
  cancelar(){
    if(this.form.dirty && !this.form.invalid){
      this._modalDialogService.mostrarModalDialog('Existen cambios sin guardar. ¿Desea grabar los datos?','Confirmar cambios')
      this.accion = 'volver'
    }else{
      this.router.navigate([this.url])
    }
  }

  aceptarModal(){
    this._configService.saveConfig(this.form.value).subscribe((res: any) => {

      if(res['status'] === 'Token is Expired'){
        this.router.navigate(['/']);
        this._toastService.showErrorMessage('La sessión ha expirado. Ingresa nuevamente a la aplicación')
      }else{
        if(res.tipoMensaje === 'success'){
          this._toastService.showSuccessMessage(res.mensaje)
        }else{
          this._toastService.showErrorMessage(res.mensaje)
        }
        this.router.navigate([this.url])
      }

    }, error => {
      console.log(error)
      this._toastService.showErrorMessage(error.message)
    })
  }


  cancelarModal(){
    if(this.accion === "volver"){
      this.router.navigate([this.url])
    }
  }
}
