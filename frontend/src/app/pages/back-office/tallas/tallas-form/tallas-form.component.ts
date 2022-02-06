import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TallasService } from '../../../../services/tallas/tallas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { SubCategoriasService } from '../../../../services/subCategorias/sub-categorias.service';
import { SubCategoria } from '../../../../class/subCategoria/sub-categoria';

@Component({
  selector: 'app-tallas-form',
  templateUrl: './tallas-form.component.html',
  styleUrls: ['./tallas-form.component.css']
})
export class TallasFormComponent implements OnInit {
  showSpinner: boolean = false
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    talla: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
    sub_categoria_id: new FormControl(null, [Validators.required]),
    created_at: new FormControl(null),
    updated_at: new FormControl(null),
    deleted_at: new FormControl(null),
  })
  id: number | null = null
  subCategorias: SubCategoria[] = []
  titulo: string = 'Talla'
  private accion: string = ''


  constructor(
    private _tallasService: TallasService,
    private _sharedService: SharedService,
    private _modalService: ModalDialogService,
    private _subCategoriasService: SubCategoriasService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }


  ngOnInit(): void {
    this.obtenerSubCategorias()
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.id = parseInt(id)
      this.buscar()
    }
  }

  private obtenerSubCategorias(){
    this.showSpinner = true
    this._subCategoriasService.getAll().subscribe((res: any) => {
      this.showSpinner = false
      this.subCategorias = res
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private buscar(){
    if(this.id){
      this.showSpinner = true
      this._tallasService.find(this.id).subscribe((res: any) => {
        this.showSpinner = false
        this.form.patchValue(res)
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      } )
    }
  }


  aceptarModal(e: any){
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

  private insertar(){
    this.showSpinner = true
    this._tallasService.insert(this.form.value).subscribe((res: any) => {
      this.showSpinner = false
      this._sharedService.handlerSucces(res, '/admin/tallas')
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private actualizar(){
    this.showSpinner = true
    this._tallasService.update(this.form.value).subscribe((res: any) => {
      this.showSpinner = false
      this._sharedService.handlerSucces(res, '/admin/tallas')
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private eliminar(){
    if(this.id){
      this.showSpinner = true
      this._tallasService.delete(this.id).subscribe((res: any) => {
        this.showSpinner = false
        this._sharedService.handlerSucces(res, '/admin/tallas')
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }


  cancelarModal(){
    if(this.accion === 'salir'){
      this.router.navigate(['/admin/tallas'])
    }
  }


  cancelar(){
    if(!this.form.valid){
      this._modalService.mostrarModalDialog('Existen cambios sin guardar. ¿Desea grabar los cambios?',this.id ? 'Nuevo' : 'Actualizar', 'Grabar')
      this.accion = 'salir'
    }else{
      this.router.navigate(['/admin/tallas'])
    }
  }


  modalGrabar(){
    this._modalService.mostrarModalDialog('¿Desea grabar el registro?', this.id ? 'Nuevo' : 'Actualizar','Grabar')
    this.accion = 'grabar'
  }


  modalEliminar(){
    this._modalService.mostrarModalDialog('¿Desea eliminar el registro','Eliminar talla','Eliminar')
    this.accion = 'eliminar'
  }
}
