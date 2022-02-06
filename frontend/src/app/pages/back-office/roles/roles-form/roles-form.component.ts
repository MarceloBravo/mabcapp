import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from '../../../../class/rol/rol';
import { RolesService } from '../../../../services/roles/roles.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.css']
})
export class RolesFormComponent implements OnInit {
  public rol: Rol = new Rol();
  public form: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    description: new FormControl(),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl(),
  });
  public id: any = null;
  public url: string = '';
  public showSpinner: boolean = false;
  private accion: string = 'grabar';
  private gridUrl: string = '/admin/roles'

  constructor(
    private _rolesService: RolesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _toastService: ToastService,
    private _sharedServices: SharedService,
    private _modalDialogService: ModalDialogService,
    private _shared: SharedService,
  ) {
    this._toastService.clearToast();
    const urlTree = this.router.url.split('?')[0];
    this.url = urlTree

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id != undefined){
      this.id = id
      this.buscarRol();
    }else{
      this.buildForm()
    }
  }

  ngOnInit(): void {
  }


  private buildForm(){
    this.form = this.fb.group({
      id: [this.rol.id],
      name: [this.rol.name,[Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      description: [this.rol.description, [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      created_at: [this.rol.created_at],
      updated_at: [this.rol.updated_at],
      deleted_at: [this.rol.deleted_at],
    })
  }


  private buscarRol(){
    this.showSpinner = true
    this._rolesService.find(this.id).subscribe(
      (res: any) => {
        if(res['status'] === 'Token is Expired'){
          this.router.navigate(['/']);
        }else{
          this.rol = res
          this.buildForm()
          console.log(this.rol)
          this.showSpinner = false
        }
      }, error => {
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

  modalGrabar(){
    this._modalDialogService.mostrarModalDialog('¿Desea grabar el registro?','Grabar')
    this.accion = 'grabar';
  }

  modalEliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar')
    this.accion = 'eliminar';
  }


  cancelar(){
    if(this.form.dirty){
      //Se han detectado cambios sin guardar
      this._modalDialogService.mostrarModalDialog('Existen cambios sin guardar. ¿Desea grabar los cambios?','Confirmar cambios')
      this.accion = 'volver';
    }else{
      //No se han detectado cambios, se redirige al listado de roles
      this.router.navigate([this.gridUrl]);
    }
  }


  aceptarModal(e: any){
    if(this.accion !== 'eliminar'){
      this.grabar();
    }else{
      this.eliminar();
    }
  }


  cancelarModal(){
    if(this.accion === 'volver'){
      this.router.navigate([this.gridUrl])
    }
  }

  private grabar(){
    this.showSpinner = true
    this.form.value['updated_at'] = this._shared.getCurrentDate();
    if(this.id !== null){
      this.actualizar();
    }else{
      this.form.value['created_at'] = this._shared.getCurrentDate();
      this.insertar();
    }
  }

  private insertar(){
    this._rolesService.insert(this.form.value).subscribe(
      (res: any)=>{
        this._sharedServices.handlerSucces(res, this.gridUrl)
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    );
  }

  private actualizar(){
    this._rolesService.update(this.id, this.form.value).subscribe(
      (res: any)=>{
        this._sharedServices.handlerSucces(res, this.gridUrl)
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    );
  }


  private eliminar(){
    this.showSpinner = true
    this._rolesService.delete(this.id).subscribe(
      (res: any)=>{
        this._sharedServices.handlerSucces(res, this.gridUrl)
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    );
  }

}
