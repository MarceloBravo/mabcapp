import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Marca } from 'src/app/class/marca/marca';
import { Paginacion } from 'src/app/class/paginacion/paginacion';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MarcasService } from '../../../../services/marcas/marcas.service';

@Component({
  selector: 'app-marca-form',
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.css']
})
export class MarcaFormComponent implements OnInit {
  public showSpinner: boolean = false;
  public messageDialog: string = '¿Desea grabar el registro?';
  public mostrarModal: boolean = false;
  public tipoModal: string = 'grabar';
  public tituloModal: string = 'Grabar'
  private menu: Marca = new Marca();
  public form: FormGroup = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl(),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl(),
  });
  public id: any = null;

  constructor(
    private _marcasService: MarcasService,
    private _toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private _sharedServices: SharedService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this._toastService.clearToast();
    let id: any = this.activatedRoute.snapshot.paramMap.get('id');
    if(id !== null){
      this.id = parseInt(id);
      this.buscar();
    }else{
      this.initForm();
    }
  }

  ngOnInit(): void {
  }

  private initForm(){
    this.form = this.fb.group({
      id: [this.menu.id,[Validators.min(0)]],
      nombre: [this.menu.nombre,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      created_at: this.menu.created_at,
      updated_at: this.menu.updated_at,
      deleted_at: this.menu.deleted_at,
    });
  }


  private buscar(){
    this.showSpinner = true;
    this._marcasService.find(this.id).subscribe(
      (res: any)=>{
      console.log(res)
      this.cargarDatos(res);
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._sharedServices.handlerError(error);
    })
  }

  private cargarDatos(res: any){
    this.menu = res;
    this.initForm();
  }


  modalGrabar(){
    this.mostrarModal = true;
    this.messageDialog = '¿Desea grabar el registro?';
    this.tipoModal = 'grabar';
    this.tituloModal = this.id ? 'Actualizar' : 'Grabar';
  }

  modalEliminar(){
    this.mostrarModal = true;
    this.tipoModal = 'eliminar'
    this.messageDialog = '¿Desea eliminar el registro?';
    this.tituloModal = 'Eliminar';
  }

  aceptarModal(e: any){
    this.mostrarModal = false
    if(this.tipoModal === 'grabar' || this.tipoModal === 'confirmar cambios'){
      if(this.form.invalid){
        this.showSpinner = !this._sharedServices.handlerError({message: 'Existen datos incompletos o no válidos.'});
      }else{
        this.grabar();
      }
    }else{
      this.eliminar();
    }
  }

  cancelarModal(e: any){
    this.mostrarModal = false;
    if(this.tipoModal === 'confirmar cambios'){
      this.router.navigate(['/admin/marcas'])
    }
    this.tipoModal = ''
    this.messageDialog = '';
  }

  cancelar() {
    if(this.detectarCambios()){
      //Se han detectado cambios sin guardar
      this.messageDialog = 'Existen cambios sin guardar. ¿Desea guardar los cambios?';
      this.mostrarModal = true;
      this.tipoModal = 'confirmar cambios';
    }else{
      this.mostrarModal = false
      //No se han detectado cambios, se redirige al listado de roles
      this.router.navigate(['/admin/marcas']);
    }
  }

  private detectarCambios(){
    if(this.form.dirty ){
      let arrDiferencias = Object.keys(this.form.value).filter(k => this.form.get(k)?.value !== (<any>this.menu)[k]);
      return arrDiferencias.length > 0;
    }else{
      return false
    }
  }

  private grabar(){
    this.cancelarModal(null);
    if(this.id !== null){
      this.actualizar();
    }else{
      this.insertar();
    }
  }

  private insertar(){
    this.showSpinner = true;
    this._marcasService.insert(this.form.value).subscribe(
      (res: any)=>{
        if(this._sharedServices.handlerSucces(res, '/admin/marcas'))this.mostrarModal = false;
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

  private actualizar(){
    this.showSpinner = true;
    this._marcasService.update(this.form.value).subscribe(
      (res: any)=>{
        if(this._sharedServices.handlerSucces(res, '/admin/marcas'))this.mostrarModal = false;
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

  private eliminar(){
    this.showSpinner = true;
    this._marcasService.delete(this.id).subscribe(
      (res: any)=>{
        if(this._sharedServices.handlerSucces(res, '/admin/marcas'))this.mostrarModal = false;
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }
}
