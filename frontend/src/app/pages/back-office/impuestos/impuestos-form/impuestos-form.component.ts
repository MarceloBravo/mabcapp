import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpuestosService } from 'src/app/services/impuestos/impuestos.service';
import { SharedService } from '../../../../services/shared/shared.service';

@Component({
  selector: 'app-impuestos-form',
  templateUrl: './impuestos-form.component.html',
  styleUrls: ['./impuestos-form.component.css']
})
export class ImpuestosFormComponent implements OnInit {
  public showSpinner: boolean = false;
  public tituloModal: string = 'Grabar';
  public messageDialog: string =  '';
  public mostrarModal: boolean = false;
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    sigla: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]),
    porcentaje: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    created_at: new FormControl(null),
    updated_at: new FormControl(null),
    deleted_at: new FormControl(null),
  });
  public id: number | null = null;


  constructor(
    private activatedRouter: ActivatedRoute,
    private _impuestoService: ImpuestosService,
    private _sharedService: SharedService,
    private router: Router,
  ) {
    let id = this.activatedRouter.snapshot.paramMap.get('id')
    if(id){
      this.cargarDatos(parseInt(id));
    }
   }

  ngOnInit(): void {
  }


  private cargarDatos(id: number){
    this._impuestoService.find(id).subscribe(res => {
      this.form.patchValue(res)
    }, error => {
      this._sharedService.handlerError(error);
    })
  }


  cancelarModal(e: any){
    this.mostrarModal = false
  }


  aceptarModal(e: any){
    this.showSpinner = true
    if(this.tituloModal === 'Grabar'){
      if(!this.form.value.id){
        this.ingresarNuevoRegistro()
      }else{
        this.actualizarRegistro()
      }      
    }else{
      this.eliminarRegistro()
    }
  }


  private ingresarNuevoRegistro(){
    this._impuestoService.insert(this.form.value).subscribe((res: any) => {
      this.successResult(res)
    }, error => {
      this._sharedService.handlerError(error);
    })
  }


  private actualizarRegistro(){
    this._impuestoService.update(this.form.value).subscribe((res: any) => {
      this.successResult(res)
    }, error => {
      this._sharedService.handlerError(error);
    })
  }


  private eliminarRegistro(){
    this._impuestoService.delete(this.form.value.id).subscribe((res: any) => {
      this.successResult(res)
    }, error => {
      this._sharedService.handlerError(error);
    })
  }


  private successResult(res: any){
    this._sharedService.handlerSucces(res, '/admin/impuestos')
    this.mostrarModal = false
    this.showSpinner = false
  }


  cancelar(){
    if(this.form.dirty){
      this.mostrarModal = true
      this.messageDialog = "¿Desea grabar los cambios?"
      this.tituloModal = "Grabar"
    }else{
      this.router.navigate(['/admin/impuestos'])
    }
  }


  modalEliminar(){
    this.mostrarModal = true
    this.tituloModal = "Eliminar"
    this.messageDialog = "¿Desea eliminar el registro?"
  }


  modalGrabar(){
    this.mostrarModal = true
    this.tituloModal = "Grabar"
    this.messageDialog = "¿Desea grabar el registro?"
  }

}
