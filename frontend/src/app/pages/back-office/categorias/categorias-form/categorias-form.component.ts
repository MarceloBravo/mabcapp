import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Categoria } from '../../../../class/Categoria/categoria';
import { SharedService } from '../../../../services/shared/shared.service';
import { HttpParams } from '@angular/common/http';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-categorias-form',
  templateUrl: './categorias-form.component.html',
  styleUrls: ['./categorias-form.component.css']
})
export class CategoriasFormComponent implements OnInit {
  public showSpinner: boolean = false;
  public tituloModal: string = '';
  public mensajeModal: string = '';
  public mostrarModal: boolean = false;
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    created_at: new FormControl(null),
    updated_at: new FormControl(null),
    deleted_at: new FormControl(null),
  })
  private url: string = 'admin/categorias'


  constructor(
    private _categoriasService: CategoriasService,
    private _sharedService: SharedService,
    private _toastService: ToastService,
    private activatedRoute: ActivatedRoute,
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

  }


  aceptarModal(e: any){
    if(this.tituloModal !== 'Eliminar'){
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
      this.tituloModal = 'Cambios sin guardar'
      this.mensajeModal = `¿Desea guardar los cambios?`
      this.mostrarModal = true
    }else{
      this.router.navigate([this.url])
    }
  }

  modalEliminar(){
    this.tituloModal = 'Eliminar'
    this.mensajeModal = '¿Desea eliminar el registro?'
    this.mostrarModal = true
  }


  modalGrabar(){
    this.tituloModal = this.form.dirty ? 'Grabar' : 'Actualizar'
    this.mensajeModal = `¿Desea ${this.form.dirty ? 'grabar' : 'actualizar'} los datos del registro?`
    this.mostrarModal = true
  }
}
