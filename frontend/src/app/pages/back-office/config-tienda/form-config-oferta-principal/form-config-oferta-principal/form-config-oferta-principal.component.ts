import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalDialogService } from 'src/app/services/modalDialog/modal-dialog.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigOfertaService } from '../../../../../services/configOferta/config-oferta.service';
import { ConstantesService } from '../../../../../services/constantes/constantes.service';
import { FilesService } from '../../../../../services/files/files.service';
import { OfertaPrincipal } from '../../../../../class/ofertaPrincipal/oferta-principal';

@Component({
  selector: 'app-form-config-oferta-principal',
  templateUrl: './form-config-oferta-principal.component.html',
  styleUrls: ['./form-config-oferta-principal.component.css']
})
export class FormConfigOfertaPrincipalComponent implements OnInit {
  showSpinner: boolean = false
  form: FormGroup = new FormGroup({
    id: new FormControl(),
    texto1: new FormControl(),
    texto2: new FormControl(),
    texto_boton: new FormControl(),
    src_imagen: new FormControl(),
    link: new FormControl(),
    posicion_horizontal: new FormControl(),
    posicion_vertical: new FormControl()
  })
  src_imagen: string = ''
  private accion: string | null = null
  public fileToUpload?: File;
  public fotoObject: string = ''
  @Output() close: EventEmitter<boolean> = new EventEmitter()

  constructor(
    private _configOfertaService: ConfigOfertaService,
    private _toastService: ToastService,
    private _sharedService: SharedService,
    private _modalService: ModalDialogService,
    private _const: ConstantesService,
    private _files: FilesService,
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this.form.patchValue(new OfertaPrincipal())
    this._configOfertaService.get().subscribe((res: any) => {
      this.form.patchValue(res)
      this.cargaFotoEnImageControl('', res.src_imagen)
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  grabar(){
    this._modalService.mostrarModalDialog('¿Desea grabar los datos?','Grabar','Grabar')
    this.accion = 'grabar'
  }

  eliminar(){
    this._modalService.mostrarModalDialog('¿Desea eliminar la oferta del home de la tienda?','Eliminar oferta','Eliminar')
    this.accion = 'eliminar'
  }

  cancelar(){
    this.close.emit(true)
  }

  aceptarModal(){
    if(this.accion === 'grabar'){
      if(this.fileToUpload?.name)this.form.value.src_imagen = this.fileToUpload.name
      if(this.form.value.id){
        this.update()
      }else{
        this.insert()
      }
    }else{
      this.delete()
    }
  }

  private insert(){
    this.showSpinner = true
    this._configOfertaService.insert(this.form.value).subscribe((res: any) => {
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.subirFoto();

      }else{
        let errs = res['errores'] ? this._sharedService.detalleErrores(res['errores']) : ''
        this._toastService.showErrorMessage(res['mensaje'] + ': ' + errs)
      }
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })

  }

  private update(){
    this.showSpinner = true
    this._configOfertaService.update(this.form.value).subscribe((res: any) => {
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.subirFoto()
      }else{
        let errs = res['errores'] ? this._sharedService.detalleErrores(res['errores']) : ''
        this._toastService.showErrorMessage(res['mensaje'] + ': ' + errs)
      }
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private delete(){
    this.showSpinner = true
    this._configOfertaService.delete(this.form.value.id).subscribe((res: any) => {
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.obtenerDatos()
      }else{
        this._toastService.showErrorMessage(res['mensaje'])
      }
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }



  cancelarModal(){
    this.accion = null
  }

  //Código para la gestión de archivos de imágenes
  handlerCargarFoto(){
    (<HTMLButtonElement>document.getElementById('btn-file')).click();
  }

  cargarImagen(target: any){
    this.fileToUpload = target.files[0];
    this.form.value.foto = this.fileToUpload?.name

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoObject = reader.result as string;
      this.cargaFotoEnImageControl(this.fotoObject)
    }
    reader.readAsDataURL(<File>this.fileToUpload)
  }

  buscarImagen(target: any){
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
    img.src = object ? object : url ? this._const.storageImages + 'oferta_home/' + url : this._const.noImage
  }


  private subirFoto(){
    if(this.fileToUpload){
      this._files.uploadFile(<File>this.fileToUpload, 'oferta_principal_home/subir/imagen').subscribe(() => {
      },error=>{
        console.log(error)
        this.showSpinner = !this._sharedService.handlerError(error);
      })
    }
  }

  eliminarImagen(){

  }
}
