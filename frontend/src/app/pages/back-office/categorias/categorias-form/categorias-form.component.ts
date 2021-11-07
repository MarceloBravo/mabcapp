import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../services/shared/shared.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-categorias-form',
  templateUrl: './categorias-form.component.html',
  styleUrls: ['./categorias-form.component.css']
})
export class CategoriasFormComponent implements OnInit {
  public showSpinner: boolean = false;
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    created_at: new FormControl(null),
    updated_at: new FormControl(null),
    deleted_at: new FormControl(null),
  })
  private url: string = 'admin/categorias'
  private accion: string = ''


  constructor(
    private _categoriasService: CategoriasService,
    private _sharedService: SharedService,
    private _toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private _modalDialogService: ModalDialogService,
    private router: Router
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.buscarRegistro(parseInt(id))
    }
  }

  ngOnInit(): void {
  }


  private buscarRegistro(id: number){
    this.showSpinner = true
    this._categoriasService.find(id).subscribe(res => {
      if(res){
      this.form.patchValue(res)
      }else{
        this._toastService.showErrorMessage('Registro no encontrado o no existe.', 'No encontrado')
        this.router.navigate([this.url])
      }
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  cancelarModal(e: any){
    if(this.accion === 'volver'){
      this.router.navigate([this.url])
    }
  }


  aceptarModal(e: any){
    if(this.accion !== 'eliminar'){
      if(this.form.value.id){
        this.actualizarRegistro()
      }else{
        this.insertarRegistro()
      }
    }else{
      if(this.form.value.id){
        this.eliminarRegistro()
      }else{
       this._toastService.showErrorMessage('No se recibió el código del registro a eliminar','No se pudo eliminar el registro');
      }
    }
  }

  private insertarRegistro(){
    this.showSpinner = true
    this._categoriasService.insert(this.form.value).subscribe((res: any) => {
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = !this._sharedService.handlerError(error)
    })
  }


  private actualizarRegistro(){
    this.showSpinner = true
    this._categoriasService.update(this.form.value).subscribe((res: any) => {
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = !this._sharedService.handlerError(error)
    })
  }


  private eliminarRegistro(){
    this.showSpinner = true
    this._categoriasService.delete(this.form.value.id).subscribe((res: any) => {
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = !this._sharedService.handlerError(error)
    })
  }


  //Click en el botón cancelar del formulario
  cancelarFormulario(){
    if(this.form.dirty){
      this._modalDialogService.mostrarModalDialog('¿Desea guardar los cambios?','Cambios sin guardar')
      this.accion = 'volver'
    }else{
      this.router.navigate([this.url])
    }
  }

  modalEliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar')
    this.accion = 'eliminar'
  }


  modalGrabar(){
    this._modalDialogService.mostrarModalDialog(`¿Desea ${this.form.dirty ? 'grabar' : 'actualizar'} los datos del registro?`, this.form.dirty ? 'Grabar' : 'Actualizar')
    this.accion = 'grabar'
  }
}
