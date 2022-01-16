import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UnidadesService } from '../../../../services/unidades/unidades.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-unidad-form',
  templateUrl: './unidad-form.component.html',
  styleUrls: ['./unidad-form.component.css']
})
export class UnidadFormComponent implements OnInit {
  public showSpinner: boolean = false
  public titulo: string = 'Unidades'
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    nombre_plural: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    created_at: new FormControl(null),
    updated_at: new FormControl(null),
    deleted_at: new FormControl(null)
  })
  public id: number | null = null
  private accion: string | null = null
  private url: string = 'admin/unidades'

  constructor(
    private _UnidadesService: UnidadesService,
    private _sharedService: SharedService,
    private _modalService: ModalDialogService,
    private _toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.id = parseInt(id);
      this.buscarRegistro();
    }
  }

  ngOnInit(): void {
  }

  private buscarRegistro(){
    if(this.id){
      this.showSpinner = true
      this._UnidadesService.find(this.id).subscribe(res => {
        this.form.patchValue(res)
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  modalGrabar(){
      let mensaje = this.id ? '¿Desea actualizar el registro' : '¿Desea grabar el registro?'
      let titulo = this.id ? 'Actualizar unidad' : 'Ingresar unidad'
      this._modalService.mostrarModalDialog(mensaje, titulo, 'Grabar')
      this.accion = 'grabar'
  }

  modalEliminar(){
    this._modalService.mostrarModalDialog('¿Desea eliminar el registro?', 'Eliminar unidad','Eliminar')
    this.accion = 'eliminar'
  }

  aceptarModal(res: any){
    if(res){
      if(this.accion === 'grabar' || this.accion === 'salir'){
          if(this.id){
            this.actualizar()
          }else{
            this.insertar()
          }
      }else{
        this.eliminar()
      }
    }
  }


  private actualizar(){
    this.showSpinner = true
    this._UnidadesService.update(this.form.value).subscribe((res: any) => {

      this.showSpinner = false
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.router.navigate([this.url])
      }else{
        this._toastService.showErrorMessage(res['mensaje'])
      }

    }, error => {
      this._sharedService.handlerError(error)
    })
  }

  private insertar(){
    this.showSpinner = true
    this._UnidadesService.insert(this.form.value).subscribe((res: any) => {

      this.showSpinner = false
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.router.navigate([this.url])
      }else{
        this._toastService.showErrorMessage(res['mensaje'])
      }

    }, error => {
      this._sharedService.handlerError(error)
    })
  }

  private eliminar(){
    if(this.id){
      this.showSpinner = true
      this._UnidadesService.delete(this.id).subscribe((res: any) => {

        this.showSpinner = false
        if(res['tipoMensaje'] === 'success'){
          this._toastService.showSuccessMessage(res['mensaje'])
          this.router.navigate([this.url])
        }else{
          this._toastService.showErrorMessage(res['mensaje'])
        }

      }, error => {
        this._sharedService.handlerError(error)
      })
    }
  }

  cancelarModal(){
    if(this.accion === 'salir'){
      this.router.navigate([this.url])
    }
    this.accion = null
  }

  cancelar(){
    this.accion = 'salir'
    if(this.form.dirty){
      this._modalService.mostrarModalDialog('Se detectaron cambios sin guardar. ¿Desea grabar los cambios?', 'Grabar cambios','Grabar y salir','Salir')
      this.accion = 'salir'
    }else{
      this.router.navigate([this.url])
    }
  }
}
