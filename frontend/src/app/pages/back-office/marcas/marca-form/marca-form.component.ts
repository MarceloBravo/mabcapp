import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Marca } from 'src/app/class/marca/marca';
import { Paginacion } from 'src/app/class/paginacion/paginacion';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { FilesService } from 'src/app/services/files/files.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MarcasService } from '../../../../services/marcas/marcas.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-marca-form',
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.css']
})
export class MarcaFormComponent implements OnInit {
  public showSpinner: boolean = false;
  private marca: Marca = new Marca();
  public form: FormGroup = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl(),
    src_imagen: new FormControl(),
    mostrar_en_home: new FormControl(),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl(),
  });
  public id: any = null;
  private accion: string = ''
  private url: string = '/admin/marcas'
  public fileToUpload: File | undefined;
  public fotoObject: string = ''
  public imagenCargada: boolean = false

  constructor(
    private _marcasService: MarcasService,
    private _toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private _sharedServices: SharedService,
    private _modalDialogService: ModalDialogService,
    public _const: ConstantesService,
    private _files: FilesService,
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
      id: [this.marca.id,[Validators.min(0)]],
      nombre: [this.marca.nombre,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      src_imagen: [this.marca.src_imagen ? this.marca.src_imagen : this._const.noImage,[Validators.maxLength(500)]],
      mostrar_en_home: [this.marca.mostrar_en_home,[Validators.required]],
      created_at: this.marca.created_at,
      updated_at: this.marca.updated_at,
      deleted_at: this.marca.deleted_at,
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
    this.marca = res;
    this.initForm();
    this.cargaFotoEnImageControl('', this.marca.src_imagen)
  }


  modalGrabar(){
    this._modalDialogService.mostrarModalDialog('¿Desea grabar el registro?',this.id ? 'Actualizar' : 'Grabar')
    this.accion = 'grabar'
  }

  modalEliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el regsitro?','Eliminar')
    this.accion = 'eliminar'
  }

  aceptarModal(e: any){
    if(this.accion !== 'eliminar'){
      if(this.form.invalid){
        this.showSpinner = !this._sharedServices.handlerError({message: 'Existen datos incompletos o no válidos.'});
      }else{
        this.grabar();
      }
    }else{
      this.eliminar();
    }
  }


  cancelarModal(){
    if(this.accion === 'volver'){
      this.router.navigate([this.url])
    }
  }

  cancelar() {
    if(this.form.dirty){
      //Se han detectado cambios sin guardar
      this._modalDialogService.mostrarModalDialog('Existen cambios sin guardar. ¿Desea grabar los cambios?', 'Confirmar cambios')
      this.accion = 'volver'
    }else{
      //No se han detectado cambios, se redirige al listado de marcas
      this.router.navigate([this.url]);
    }
  }


  private grabar(){
    if(this.fileToUpload?.name)this.form.value.src_imagen = this.fileToUpload.name
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
        this._sharedServices.handlerSucces(res, this.url)
        if(res['tipoMensaje'] === 'success')this.subirFoto(res['id'], this._files)
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
        this._sharedServices.handlerSucces(res, this.url)
        if(res['tipoMensaje'] === 'success')this.subirFoto(this.form.value.id, this._files)
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
        this._sharedServices.handlerSucces(res, this.url)
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

  //Código para la gestión de archivos de imágenes
  handlerCargarImagen(){
    (<HTMLButtonElement>document.getElementById('btn-file')).click();
  }

  cargarImagen(target: any){
    this.fileToUpload = target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.fotoObject = reader.result as string;
      this.cargaFotoEnImageControl(this.fotoObject)
    }
    reader.readAsDataURL(<File>this.fileToUpload)
  }


  private cargaFotoEnImageControl(object: string, url: string = ''){
    let img: HTMLImageElement = <HTMLImageElement>document.getElementById('img-foto')
    img.src = object ? object : url ?  `${this._const.storageImages}marcas/${url}` : this._const.noImage
    this.imagenCargada = (object || url) ? true : false
  }


  private subirFoto(id: number, res: any){
    if(this.fileToUpload){
      this._files.uploadFile(<File>this.fileToUpload, 'marcas/subir/imagen').subscribe(() => {
      },error=>{
        console.log(error)
        this.showSpinner = !this._sharedServices.handlerError(error);
      })
    }
  }


}
