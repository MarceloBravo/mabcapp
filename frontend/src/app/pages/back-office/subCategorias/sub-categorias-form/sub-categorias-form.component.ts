import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { SubCategoriasService } from '../../../../services/subCategorias/sub-categorias.service';
import { Categoria } from '../../../../class/Categoria/categoria';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-sub-categorias-form',
  templateUrl: './sub-categorias-form.component.html',
  styleUrls: ['./sub-categorias-form.component.css']
})
export class SubCategoriasFormComponent implements OnInit {
  public showSpinner: boolean = false
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    categoria_id: new FormControl(null, [Validators.required]),
    created_at: new FormControl(null),
    updated_at: new FormControl(null),
    deleted_at: new FormControl(null),
  })
  public categorias: Categoria[] = []
  private url: string = '/admin/sub_categorias'
  private accion: string = ''

  constructor(
    private _subCategoriasService: SubCategoriasService,
    private _categoriasService: CategoriasService,
    private _toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _modalDialogService: ModalDialogService,
    private router: Router
  ) {
    this.cargarCategorias();
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.buscarRegistro(parseInt(id))
    }
  }

  ngOnInit(): void {
  }

  private cargarCategorias(){
    this.showSpinner = true
    this._categoriasService.getAll().subscribe((res: any) => {
      this.categorias = res
      this.showSpinner = false
    }, error => {
      this._sharedService.handlerError(error)
      this.showSpinner = false
    })
  }

  private buscarRegistro(id: number){
    this.showSpinner = true
    this._subCategoriasService.find(id).subscribe(res => {
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


  aceptarModal(e: boolean){
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



  cancelarModal(){
    if(this.accion === 'volver'){
      this.router.navigate([this.url])
    }
  }


  private insertarRegistro(){
    this.showSpinner = true
    this._subCategoriasService.insert(this.form.value).subscribe((res: any) => {
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = !this._sharedService.handlerError(error)
    })
  }


  private actualizarRegistro(){
    this.showSpinner = true
    this._subCategoriasService.update(this.form.value).subscribe((res: any) => {
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = !this._sharedService.handlerError(error)
    })
  }


  private eliminarRegistro(){
    this.showSpinner = true
    this._subCategoriasService.delete(this.form.value.id).subscribe((res: any) => {
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = !this._sharedService.handlerError(error)
    })
  }


  cancelarFormulario(){
    if(this.form.dirty){
      this._modalDialogService.mostrarModalDialog(`¿Desea guardar los cambios?`, 'Cambios sin guardar')
      this.accion = 'volver'
    }else{
      this.router.navigate([this.url])
    }
  }

  modalEliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?', 'Eliminar')
    this.accion = 'eliminar'
  }

  modalGrabar(){
    this._modalDialogService.mostrarModalDialog(`¿Desea ${this.form.dirty ? 'grabar' : 'actualizar'} los datos del registro?`, this.form.dirty ? 'Grabar' : 'Actualizar')
    this.accion = 'grabar'
  }
}
