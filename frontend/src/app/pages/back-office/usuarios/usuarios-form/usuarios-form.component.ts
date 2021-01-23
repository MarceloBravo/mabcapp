import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { User } from '../../../../class/User/user';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../services/roles/roles.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { Rol } from '../../../../class/rol/rol';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit {
  public showSpinner: boolean = false;
  public mostrarModalGrabar: boolean = false;
  public messageDialog: string = '';
  public mostrarModalEliminar: boolean = false;
  public url: string = '';
  private usuario: User = new User();
  public roles: Rol[] = [];
  public form: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    a_paterno: new FormControl(),
    a_materno: new FormControl(),
    email: new FormControl(),
    direccion: new FormControl(),
    password: new FormControl(),
    confirm_password: new FormControl(),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl(),
    roles: new FormControl(),
  });
  private id: any = null;


  constructor(
    private _userServices: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _rolesService: RolesService,
    private router: Router,
    private _shared: SharedService,
    private _toastService: ToastService,
  ) {
    this._toastService.clearToast();
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarRoles();
    if(id){
      this.id = parseInt(id);
      this.buscar();
    }else{
      this.iniciarForm();
    }
  }

  ngOnInit(): void {
  }


  private iniciarForm(){
    this.form = this.fb.group({
      id: [this.usuario.id,[Validators.min(1)]],
      name: [this.usuario.name,[Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      a_paterno: [this.usuario.a_paterno,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      a_materno: [this.usuario.a_materno,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: [this.usuario.email,[Validators.required, Validators.email, Validators.maxLength(150)]],
      direccion: [this.usuario.direccion,[Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      password: [this.usuario.password,[Validators.minLength(6), Validators.maxLength(20)]],
      confirm_password: [this.usuario.confirm_password,[, Validators.minLength(6), Validators.maxLength(20)]],
      roles: [this.usuario.roles,[Validators.required]],
      created_at: this.usuario.created_at,
      updated_at: this.usuario.updated_at,
      deleted_at: this.usuario.deleted_at
    });
  }


  private buscar(){
    this.showSpinner = true;
    this._userServices.find(this.id).subscribe((res: any)=>{
      if(res['status'] === 'Token is Expired'){
        this.router.navigate(['/']);
      }else{
        this.cargarDatos(res);
        this.showSpinner = false;
      }
    },error => {
      console.log(error);
      this.showSpinner = false;
    });
  }

  private cargarDatos(res: any){
    console.log(res);
    this.usuario = res;
    this.iniciarForm();
  }

  private cargarRoles(){
    this._rolesService.getAll().subscribe((res: any)=>{
      console.log('Roles',res);
      this.roles = res;
    }, error => {
      console.log(error);
    });
  }

  cancelar(){
    if(this.id !== null && JSON.stringify(this.form.value) !== JSON.stringify(this.usuario)){
      //Se han detectado cambios sin guardar
      this.messageDialog = 'Existen cambios sin guardar. ¿Desea guardar los cambios?';
      this.mostrarModalGrabar = true;
    }else{
      //No se han detectado cambios, se redirige al listado de roles
      this.router.navigate(['/admin/usuarios']);
    }
  }

  grabar(){
    this.messageDialog = "¿Desea grabar el registro?";
    this.mostrarModalGrabar = true;
  }

  aceptarGrabar(e: any){
    this.showSpinner = true;
    this.mostrarModalGrabar = false;
    this.form.value.updated_at = this._shared.getCurrentDate();

    if(this.id !== null){
      this.actualizar();
    }else{
      this.insertar();
    }

  }

  private insertar(){
    this._userServices.insert(this.form.value).subscribe((res:any)=> {
      if(res['status'] === 'Token is Expired'){
        this.router.navigate(['/']);
      }else{
        if(res['tipoMensaje'] === "success"){
          this._toastService.showSuccessMessage(res['mensaje']);
          this.router.navigate(['/admin/usuarios']);
        }
        this.showSpinner = false;
      }
    },error=>{
      this._toastService.showErrorMessage(error.message);
      console.log(error);
      this.showSpinner = false;
    });
  }

  private actualizar(){
    this._userServices.update(this.id, this.form.value).subscribe((res: any)=> {
      if(res['status'] === 'Token is Expired'){
        this.router.navigate(['/']);
      }else{
        if(res['tipoMensaje'] === "success"){
          this._toastService.showSuccessMessage(res['mensaje']);
          this.router.navigate(['/admin/usuarios']);
        }
        this.showSpinner = false
      }
    },error=>{
      this._toastService.showErrorMessage(error.message);
      console.log(error);
      this.showSpinner = false
    });
  }

  cancelarGrabar(e: any){
    this.mostrarModalGrabar = false;
  }

  eliminar(){
    this.mostrarModalEliminar = true;
  }


  cancelarEliminar(e: any){
    this.mostrarModalEliminar = false;
  }

  aceptarEliminar(e: any){
    this.showSpinner = true;
    this.mostrarModalEliminar = false;

    this._userServices.delete(this.id).subscribe((res: any) => {
      if(res['status'] === 'Token is Expired'){
        this.router.navigate(['/']);
      }else{
        if(res['tipoMensaje'] === "success"){
          this._toastService.showSuccessMessage(res['mensaje']);
          this.router.navigate(['/admin/usuarios']);
        }
        this.showSpinner = false
      }
    },error=>{
      this._toastService.showErrorMessage(error.message);
      console.log(error);
      this.showSpinner = false
    });
  }

  comparaRoles(rol1: Rol, rol2: Rol):boolean{
    console.log(rol1, rol2);
    return rol1 && rol2 ? rol1.id === rol2.id : rol1 === rol2;
  }

}
