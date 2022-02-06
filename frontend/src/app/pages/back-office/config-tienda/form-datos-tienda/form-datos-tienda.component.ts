import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tienda } from 'src/app/class/tienda/tienda';
import { ConfigTiendaService } from 'src/app/services/configTienda/config-tienda.service';
import { ModalDialogService } from 'src/app/services/modalDialog/modal-dialog.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-form-datos-tienda',
  templateUrl: './form-datos-tienda.component.html',
  styleUrls: ['./form-datos-tienda.component.css']
})
export class FormDatosTiendaComponent implements OnInit {
  public showSpinner: boolean = false
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre_tienda: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    fono_venta: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
    email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(150)]),
    direccion: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(255)]),
  })
  public id: number | null = null
  private tienda: Tienda = new Tienda()

  private accion: string | null = ''
  @Output() close: EventEmitter<boolean> = new EventEmitter()

  constructor(
    private _tiendaService: ConfigTiendaService,
    private _toastService: ToastService,
    private _sharedService: SharedService,
    private _modalService: ModalDialogService,
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._tiendaService.get().subscribe((res: any) => {
      this.tienda = res
      this.form.patchValue(res)
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  aceptarModal(){
    this.showSpinner = true
    this._tiendaService.update(this.form.value).subscribe((res: any) => {
      this.showSpinner = false
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje']);
        this.tienda = this.form.value
        if(this.accion === 'cancelarTienda'){
          this.cerrarAccordeon1()
        }
      }else{
        this._toastService.showErrorMessage(res['mensaje'])
      }
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  cancelarModal(){
    this.accion = null
  }

  cancelarTienda(){
    if(this.form.dirty){
      this._modalService.mostrarModalDialog('Existen datos sin guardar. ¿Desea grabar los cambios?','Actualizar datos tienda','Actualizar')
      this.accion = 'cancelarTienda'
    }else{
      this.cerrarAccordeon1();
    }
  }

  cerrarAccordeon1(){
    this.close.emit(true)
    this.form.patchValue(this.tienda)
  }

  grabarTienda(){
    this._modalService.mostrarModalDialog('¿Desea actualizar los datos de la tienda?','Actualizar datos tienda','Actualizar')
    this.accion = 'grabarTienda'
  }

}
