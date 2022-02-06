import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/class/rol/rol';
import { User } from 'src/app/class/User/user';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { LoginService } from 'src/app/services/login/login.service';
import { FilesService } from 'src/app/services/files/files.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ModalDialogService } from '../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public showSpinner: boolean = false;
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    a_paterno: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    a_materno: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    email: new FormControl(null,[Validators.required, Validators.email, Validators.maxLength(150)]),
    direccion: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(150)]),
    password: new FormControl(null, [Validators.minLength(6), Validators.maxLength(20)]),
    confirm_password: new FormControl(null, [Validators.minLength(6), Validators.maxLength(20)]),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl(),
    roles: new FormControl(null),
    foto: new FormControl(),  //Url de la foto
  },
  [
    //Validaciones asyncronas
    CustomValidators.confirmPassword('password','confirm_password')
  ]);
  public id: any = null;
  public fileToUpload: File | undefined;
  public fotoObject: string = ''
  private url: string = '/admin'
  private accion: string = ''


  constructor(
    private _usersService: UsuariosService,
    private _toastService: ToastService,
    private _const: ConstantesService,
    private _sharedServices: SharedService,
    private _login: LoginService,
    private _files: FilesService,
    private _modalDialogService: ModalDialogService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cargarDatos()
  }

  private cargarDatos(){
    let user: User | null = this._login.getUsuarioLogueado()
    if(user){
      user['roles'] = this._login.getRolesUsuarioLogueado()
      this.form.patchValue(user)
      this.cargaFotoEnImageControl('', user.foto)
    }else{
      this._toastService.showErrorMessage('No se han podido cargar su información de usuario', 'Error')
      this.router.navigate([this.url])
    }
  }


  aceptarModal(e: any){
    this.showSpinner = true
    this._usersService.update(this.form.value.id, this.form.value).subscribe((res: any) => {
      if(res['tipoMensaje'] === 'success'){
        this.subirFoto(this.form.value.id, this._files)
        this._login.setCredencialesUsuario(this.form.value, this.form.value.roles)

        this._sharedServices.handlerSucces(res, this.url)
        this.showSpinner = false;
      }else{
        this._toastService.showErrorMessage(res['mensaje'],'Error')
      }
    }, error =>{
      this.showSpinner = !this._sharedServices.handlerError(error);
    })
  }


  cancelarModal(){
    if(this.accion === 'volver'){
      this.router.navigate([this.url])
    }
  }


  public grabar(){
    if((this.form.dirty || this.fileToUpload) && !this.form.invalid){
      this._modalDialogService.mostrarModalDialog('¿Desea grabar los cambios?', 'Grabar')
      this.accion = 'grabar'
    }else{
      this._toastService.showWarningMessage('No se han detectado cambios que grabar', 'Sin cambios')
    }
  }


  public cancelar(){
    if(this.form.dirty){
      this._modalDialogService.mostrarModalDialog('¿Desea grabar los cambios?','Confirmar cambios')
      this.accion = 'volver'
    }else{
      this.router.navigate([this.url])
    }
  }


  //Código para la gestión de archivos de imágenes
  handlerCargarFoto(){
    (<HTMLButtonElement>document.getElementById('btn-file')).click();
  }

  cargarFoto(target: any){
    this.fileToUpload = target.files[0];
    this.form.value.foto = this.fileToUpload?.name

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoObject = reader.result as string;
      this.cargaFotoEnImageControl(this.fotoObject)
    }
    reader.readAsDataURL(<File>this.fileToUpload)
  }


  private cargaFotoEnImageControl(object: string, url: string = ''){
    let img: HTMLImageElement = <HTMLImageElement>document.getElementById('img-foto')
    img.src = object ? object : url ? this._const.storageImages + url : this._const.srcDefault
  }


  private subirFoto(id: number, res: any){
    if(this.fileToUpload){
      this._files.uploadFile(<File>this.fileToUpload, 'usuarios/subir/foto').subscribe(() => {
      },error=>{
        console.log(error)
        this.showSpinner = !this._sharedServices.handlerError(error);
      })
    }
  }

}
