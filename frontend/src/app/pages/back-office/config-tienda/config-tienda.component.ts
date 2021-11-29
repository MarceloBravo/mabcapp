import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigTiendaService } from '../../../services/configTienda/config-tienda.service';
import { ToastService } from '../../../services/toast/toast.service';
import { SharedService } from '../../../services/shared/shared.service';
import { AccordionComponent } from 'ngx-bootstrap/accordion';
import { Tienda } from 'src/app/class/tienda/tienda';
import { ModalDialogService } from '../../../services/modalDialog/modal-dialog.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-config-tienda',
  templateUrl: './config-tienda.component.html',
  styleUrls: ['./config-tienda.component.css']
})
export class ConfigTiendaComponent implements OnInit {
  public showSpinner: boolean = false
  public titulo: string = 'Configuración de la Tienda'
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre_tienda: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    fono_venta: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
    email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(150)]),
    direccion: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(255)]),
  })
  public formImages: FormGroup = new FormGroup({})
  public id: number | null = null
  private tienda: Tienda = new Tienda()
  public isOpen1: boolean = false
  public isOpen2: boolean = false
  private accion: string | null = ''

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

  /* ********************** DATOS TIENDA - ACCORDION1 ************************ */
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
    this.isOpen1 = false
    this.form.patchValue(this.tienda)
  }

  grabarTienda(){
    this._modalService.mostrarModalDialog('¿Desea actualizar los datos de la tienda?','Actualizar datos tienda','Actualizar')
    this.accion = 'grabarTienda'
  }
  /* ********************** FIN DATOS TIENDA - ACCORDION1 ************************ */
}
