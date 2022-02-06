import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ClientesService } from '../../../../services/clientes/clientes.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Region } from '../../../../class/region/region';
import { Provincia } from '../../../../class/provincia/provincia';
import { Comuna } from 'src/app/class/comuna/comuna';
import { RegionesService } from '../../../../services/regiones/regiones.service';
import { ProvinciasService } from '../../../../services/provincias/provincias.service';
import { ComunasService } from '../../../../services/comunas/comunas.service';
import { ConstantesService } from '../../../../services/constantes/constantes.service';
import { Cliente } from '../../../../class/cliente/cliente';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { FilesService } from 'src/app/services/files/files.service';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {
  public showSpinner: boolean = false
  public titulo: string = 'Clientes'
  public form: FormGroup = new FormGroup({
    id: new FormControl(),
    rut: new FormControl(),
    nombres: new FormControl(),
    apellido1: new FormControl(),
    apellido2: new FormControl(),
    cod_region: new FormControl(),
    cod_provincia: new FormControl(),
    cod_comuna: new FormControl(),
    ciudad: new FormControl(),
    direccion: new FormControl(),
    password: new FormControl(),
    confirm_password: new FormControl(),
    email: new FormControl(),
    fono: new FormControl(),
    foto: new FormControl(),
    casa_num: new FormControl(),
    block_num: new FormControl(),
    referencia: new FormControl(),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl()
  })
  private cliente: Cliente= new Cliente()
  public fotoObject: string = ''
  public fileToUpload: File | undefined;
  public regiones: Region[] = []
  public provincias: Provincia[] = []
  public comunas: Comuna[] = []
  public id: number | null = null
  private accion: string | null = null
  private url: string = '/admin/clientes'

  constructor(
    private _clientesService: ClientesService,
    private _sharedService: SharedService,
    private _regionesService: RegionesService,
    private _provinciasService: ProvinciasService,
    private _comunasService: ComunasService,
    private _const: ConstantesService,
    private _modalDialogService: ModalDialogService,
    private _files: FilesService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    this.obtenerRegiones()
    if(id){
      this.id = parseInt(id)
      this.obtenerDatos()
    }else{
      this.initForm()
    }

  }

  ngOnInit(): void {
    this.cargaFotoEnImageControl('','')
  }


  private initForm(){
    this.form = this.fb.group({
      id: [this.cliente.id],
      rut: [this.cliente.rut, [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      nombres: [this.cliente.nombres, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido1: [this.cliente.apellido1, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido2: [this.cliente.apellido1, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cod_region: [this.cliente.cod_region, [Validators.required, Validators.maxLength(10)]],
      cod_provincia: [this.cliente.cod_provincia, [Validators.required, Validators.maxLength(10)]],
      cod_comuna: [this.cliente.cod_comuna, [Validators.required, Validators.maxLength(10)]],
      ciudad: [this.cliente.ciudad, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      direccion: [this.cliente.direccion, [Validators.required, Validators.maxLength(255)]],
      password: [null, [Validators.minLength(6), Validators.maxLength(20)]],
      confirm_password: [null, [Validators.minLength(6), Validators.maxLength(20)]],
      email: [this.cliente.email, [Validators.required, Validators.email, Validators.maxLength(255)]],
      fono: [this.cliente.fono, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      foto: [''],
      casa_num: [this.cliente.casa_num, [Validators.required, Validators.maxLength(10)]],
      block_num: [this.cliente.block_num, [Validators.required, Validators.maxLength(10)]],
      referencia: [this.cliente.referencia, [Validators.required, Validators.maxLength(255)]],
      created_at: [this.cliente.created_at],
      updated_at: [this.cliente.updated_at],
      deleted_at: [this.cliente.deleted_at]
    },
    //Validaciones Asincronas
    {
      validators: CustomValidators.confirmPassword('password','confirm_password')
    })
  }


  private obtenerDatos(){
    if(this.id){
      this.showSpinner = true
      this._clientesService.find(this.id).subscribe((res: any) => {
        this.showSpinner = false
        this.obtenerProvincias(res['cod_region'])
        this.obtenerComunas(res['cod_provincia'])
        this.cliente = res
        this.initForm()
        this.cargaFotoEnImageControl('',this.cliente.foto)
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }


  private obtenerRegiones(){
    this.showSpinner = true
    this._regionesService.listar().subscribe((res: any) => {
      this.showSpinner = false
      this.regiones = res
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  obtenerProvincias(codRegion: string){
    console.log('codRegion',codRegion)
    if(codRegion.length > 0){
      this.showSpinner = true
      this._provinciasService.listarProvinciasRegion(codRegion).subscribe((res: any) => {
        this.showSpinner = false
        this.provincias = res
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  obtenerComunas(codProvincia: string){
    console.log('codProvincia', codProvincia)
    if(codProvincia.length > 0){
      this.showSpinner = true
      this._comunasService.listarComunasProvincias(codProvincia).subscribe((res: any) => {
        this.showSpinner = false
        this.comunas = res
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  aceptarModal(e: any){
    if(this.accion !== 'eliminar'){
      this.grabar();
    }else{
      this.eliminar();
    }
  }

  private grabar(){
    this.form.value.foto = this.fileToUpload?.name

    this.showSpinner = true;
    this.form.value.updated_at = this._sharedService.getCurrentDate();
    if(this.id !== null){
      this.actualizar();
    }else{
      this.insertar();
    }

  }


  private insertar(){
    this._clientesService.insert(this.form.value).subscribe((res:any)=> {
      if(this.isSuccess(res)){
        this.subirFoto(res['id'], res);
      }
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._sharedService.handlerError(error);
    });
  }


  private actualizar(){
    this._clientesService.update(this.form.value).subscribe((res: any)=> {
      if(this.isSuccess(res)){
        this.subirFoto(res['id'], res);
      }
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._sharedService.handlerError(error);
    });
  }

  private eliminar(){
    if(this.id){
      this.showSpinner = true;

      this._clientesService.delete(this.id).subscribe((res: any) => {
        this._sharedService.handlerSucces(res, this.url)
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedService.handlerError(error);
      });
    }
  }

  cancelarModal(){
    if(this.accion === 'salir'){
      this.router.navigate([this.url])
    }
  }


  cancelar(){
    if(this.form.dirty){
      //Se han detectado cambios sin guardar
      this._modalDialogService.mostrarModalDialog('Existen cambios sin guardar. ¿Desea grabar los cambios?','Confirmar cambios')
      this.accion = 'salir';
    }else{
      //No se han detectado cambios, se redirige al listado de clientes
      this.router.navigate([this.url]);
    }
  }

  modalEliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar')
    this.accion = 'eliminar';
  }

  modalGrabar(){
    this._modalDialogService.mostrarModalDialog('¿Desea grabar el registro?','Grabar')
    this.accion = 'grabar';
  }

  private subirFoto(id: number, res: any){
    if(this.fileToUpload){
      this._files.uploadFile(<File>this.fileToUpload, 'usuarios/subir/foto').subscribe(() => {
      },error=>{
        console.log(error)
        this.showSpinner = !this._sharedService.handlerError(error);
      })
    }
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
    }
    reader.readAsDataURL(<File>this.fileToUpload)
  }

  private cargaFotoEnImageControl(object: string = '', url: string = ''){
    let img: HTMLImageElement = <HTMLImageElement>document.getElementById('img-foto')
    img.src = object ? object : url ? this._const.storageImages + url : this._const.srcDefault
  }

  private isSuccess(res: any){
    return (res['status'] !== 'Token is Expired' && !res.errores && res['tipoMensaje'] === "success")
  }
}
