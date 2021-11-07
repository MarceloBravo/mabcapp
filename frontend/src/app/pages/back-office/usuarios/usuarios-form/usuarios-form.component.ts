import { Component, OnInit, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { User } from '../../../../class/User/user';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../services/roles/roles.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { Rol } from '../../../../class/rol/rol';
import { CustomValidators } from '../../../../validators/custom-validators';
import { FilesService } from '../../../../services/files/files.service';
import { ConstantesService } from '../../../../services/constantes/constantes.service';
import { LoginService } from '../../../../services/login/login.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit {
  public showSpinner: boolean = false;
  private accion = 'grabar';
  public url: string = '/admin/usuarios';
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
    foto: new FormControl(),  //Url de la foto
  });
  public id: any = null;
  public fileToUpload: File | undefined;
  public fotoObject: string = ''

  constructor(
    private _userServices: UsuariosService,
    private _files: FilesService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _rolesService: RolesService,
    private router: Router,
    private _shared: SharedService,
    private _toastService: ToastService,
    private _const: ConstantesService,
    private _login: LoginService,
    private _modalDialogService: ModalDialogService,
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
    this.cargaFotoEnImageControl('','')
  }


  private iniciarForm(){
    this.form = this.fb.group(
      //Validaciones Sincronas
      {
      id: [this.usuario.id,[Validators.min(0)]],
      name: [this.usuario.name,[Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      a_paterno: [this.usuario.a_paterno,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      a_materno: [this.usuario.a_materno,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: [this.usuario.email,[Validators.required, Validators.email, Validators.maxLength(150)]],
      direccion: [this.usuario.direccion,[Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      password: [this.usuario.password,[Validators.minLength(6), Validators.maxLength(20)]],
      confirm_password: [this.usuario.confirm_password,[Validators.minLength(6), Validators.maxLength(20)]],
      roles: [this.usuario.roles,[Validators.required]],
      foto: '',
      //fotoObject: this.usuario.fotoObject,
      created_at: this.usuario.created_at,
      updated_at: this.usuario.updated_at,
      deleted_at: this.usuario.deleted_at
    },
    //Validaciones Asincronas
    {
      validators: CustomValidators.confirmPassword('password','confirm_password')
    }
    );
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
      this.showSpinner = !this._shared.handlerError(error);
    });
  }


  private cargarDatos(res: any){
    this.usuario = res;
    this.iniciarForm();
    this.cargaFotoEnImageControl('',this.usuario.foto)
  }


  private cargarRoles(){
    this._rolesService.getAll().subscribe((res: any)=>{
      this.roles = res;
    }, error => {
      console.log(error);
    });
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
      this.router.navigate([this.url]);
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
      this.router.navigate([this.url])
    }
  }


  private grabar(){
    this.form.value.foto = this.fileToUpload?.name

    this.showSpinner = true;
    this.form.value.updated_at = this._shared.getCurrentDate();
    if(this.id !== null){
      this.actualizar();
    }else{
      this.insertar();
    }

  }


  private insertar(){
    this._userServices.insert(this.form.value).subscribe((res:any)=> {
      if(this.isSuccess(res)){
        this.subirFoto(res['id'], res);
      }
      this._shared.handlerSucces(res, this.url)
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._shared.handlerError(error);
    });
  }


  private actualizar(){
    this._userServices.update(this.id, this.form.value).subscribe((res: any)=> {
      if(this.isSuccess(res)){
        this.subirFoto(res['id'], res);
        this._login.setCredencialesUsuario(this.form.value, this.form.value.roles)  //Actualizando los datos del usuario logueado
      }
      this._shared.handlerSucces(res, this.url)
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._shared.handlerError(error);
    });
  }

  private isSuccess(res: any){
    return (res['status'] !== 'Token is Expired' && !res.errores && res['tipoMensaje'] === "success")
  }


  private subirFoto(id: number, res: any){
    if(this.fileToUpload){
      this._files.uploadFile(<File>this.fileToUpload, 'usuarios/subir/foto').subscribe(() => {
      },error=>{
        console.log(error)
        this.showSpinner = !this._shared.handlerError(error);
      })
    }
  }


  private eliminar(){
    this.showSpinner = true;

    this._userServices.delete(this.id).subscribe((res: any) => {
      this._shared.handlerSucces(res, this.url)
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._shared.handlerError(error);
    });
  }

  comparaRoles(rol1: Rol, rol2: Rol):boolean{
    return rol1 && rol2 ? rol1.id === rol2.id : rol1 === rol2;
  }

  handlerCargarFoto(){
    (<HTMLButtonElement>document.getElementById('btn-file')).click();
  }

  cargarFoto(target: any){
    this.fileToUpload = target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      //this.form.value.foto = (<File>this.fileToUpload).name;
      //this.usuario.foto = this.form.value.foto  //Actualizando el objeto usuario
      //this.usuario.foto = (<File>this.fileToUpload).name;
      //this.form.value.fotoObject = reader.result// as string;
      this.fotoObject = reader.result as string;
      this.cargaFotoEnImageControl(this.fotoObject)
      console.log(this.form.value)
    }
    reader.readAsDataURL(<File>this.fileToUpload)
  }

  private cargaFotoEnImageControl(object: string = '', url: string = ''){
    let img: HTMLImageElement = <HTMLImageElement>document.getElementById('img-foto')
    img.src = object ? object : url ? this._const.storageImages + url : this._const.srcDefault
  }
}
