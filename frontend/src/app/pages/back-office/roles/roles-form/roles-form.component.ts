import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from '../../../../class/rol/rol';
import { RolesService } from '../../../../services/roles/roles.service';
import { ToastService } from '../../../../services/toast/toast.service';

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
  public mostrarModalGrabar: boolean = false;
  public mostrarModalEliminar: boolean = false;
  public messageDialog: string = '¿Desea grabar el registro?';
  public showSpinner: boolean = false;

  constructor(
    private _rolesService: RolesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _toastService: ToastService,
  ) {
    const urlTree = this.router.url.split('?')[0];
    this.url = urlTree

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('ID',id);
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
        this.rol = res
        this.buildForm()
        console.log(this.rol)
        this.showSpinner = false
      }, error => {
        console.log('ERROR',error)
        this.showSpinner = false
      }
    )
  }

  grabar(){
    this.messageDialog = '¿Desea grabar el registro?';
    this.mostrarModalGrabar = true;
  }

  eliminar(){
    this.mostrarModalEliminar = true;
  }

  cancelar(){
    if(this.id !== null && JSON.stringify(this.form.value) !== JSON.stringify(this.rol)){
      //Se han detectado cambios sin guardar
      this.messageDialog = 'Existen cambios sin guardar. ¿Desea guardar los cambios?';
      this.mostrarModalGrabar = true;
    }else{
      //No se han detectado cambios, se redirige al listado de roles
      this.router.navigate(['/admin/roles']);
    }
  }


  cancelarGrabar(e: any){
    this.mostrarModalGrabar = e;
  }


  cancelarEliminar(e: any){
    this.mostrarModalEliminar = e;
  }


  aceptarGrabar(e: any){
    this.mostrarModalGrabar = false;
    this.showSpinner = true

    this.form.value['updated_at'] = this.getCurrentDate();

    if(this.id !== null){
      this.actualizar();
    }else{
      this.form.value['created_at'] = this.getCurrentDate();
      this.insertar();
    }
  }

  private insertar(){
    this._rolesService.insert(this.form.value).subscribe(
      (res: any)=>{

        if(res['tipoMensaje'] === "success"){
          this._toastService.showSuccessMessage(res['mensage']);
          this.router.navigate(['/admin/roles']);
        }else{
          console.log(res['mensage']);
          this._toastService.showErrorMessage(res['mensage']);
        }
        this.showSpinner = false
      },error=>{
        this._toastService.showErrorMessage(error.message);
        console.log(error);
        this.showSpinner = false
      }
    );
  }

  private actualizar(){
    this._rolesService.update(this.id, this.form.value).subscribe(
      (res: any)=>{
        if(res['tipoMensaje'] === "success"){
          this._toastService.showSuccessMessage(res['mensage']);
          this.router.navigate(['/admin/roles']);
        }
        this.showSpinner = false
      },error=>{
        this._toastService.showErrorMessage(error.message);
        console.log(error);
        this.showSpinner = false
      }
    );
  }


  aceptarEliminar(e: any){
    this.mostrarModalEliminar = false;
    this.showSpinner = true
    this._rolesService.delete(this.id).subscribe(
      (res: any)=>{
        if(res['tipoMensaje'] === "success"){
          debugger
          this._toastService.showSuccessMessage(res['mensage']);
          this.router.navigate(['/admin/roles']);
        }
        this.showSpinner = false
      },error=>{
        this._toastService.showErrorMessage(error.message);
        console.log(error);
        this.showSpinner = false
      }
    );
  }

  private getCurrentDate(){
    let date = new Date();
    return `${(date.getDate() < 10 ? '0' : '')}${date.getDate()}/${((date.getMonth() + 1) < 10 ? '0' : '')}${(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
}
