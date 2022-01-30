import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImagenMarquesina } from 'src/app/class/imagenMarquesina/imagen-marquesina';
import { ConfigMarquesinaService } from 'src/app/services/configMarquesina/config-marquesina.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { FilesService } from 'src/app/services/files/files.service';
import { ModalDialogService } from 'src/app/services/modalDialog/modal-dialog.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-form-config-marquesina-home',
  templateUrl: './form-config-marquesina-home.component.html',
  styleUrls: ['./form-config-marquesina-home.component.css']
})
export class FormConfigMarquesinaHomeComponent implements OnInit {
  public showSpinner: boolean = false
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    src_imagen: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    texto: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    texto2: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    link: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    posicion: new FormControl(null, [Validators.required, Validators.min(0)]),
    posicion_horizontal: new FormControl(null, [Validators.required, Validators.min(10)]),
    posicion_vertical: new FormControl(null, [Validators.required, Validators.min(10)]),
    created_at: new FormControl(null),
    uodated_at: new FormControl(null),
    deleted_at: new FormControl(null),
  })
  public imagenesMarquesina: any[] = []
  private indiceEliminar: number | null = null
  private deleted: number[] = []
  private fileToUpload: File[] = []
  private accion: string | null = null
  private loadedData: string = ''
  @Output() close: EventEmitter<boolean> = new EventEmitter()


  constructor(
    private _configMarquesina: ConfigMarquesinaService,
    private _toastService: ToastService,
    private _sharedService: SharedService,
    private _modalService: ModalDialogService,
    private _files: FilesService,
    private _const: ConstantesService
  ) { 
    this.resetForm()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._configMarquesina.getAll().subscribe((res: any) => {
      this.imagenesMarquesina = res
      this.loadedData = JSON.stringify(this.imagenesMarquesina)
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  eliminarImagen(index: number, id: any){
    this._modalService.mostrarModalDialog('¿Desea eliminar la imagen?' + index,'Eliminar imagen','Eliminar')
    this.indiceEliminar = index
    this.accion = 'eliminar'
  }

  aceptarModal(){
    if(this.accion === 'eliminar' && this.indiceEliminar !== null){
      this.deleted.push(this.imagenesMarquesina[this.indiceEliminar].id)
      this.imagenesMarquesina.splice(this.indiceEliminar, 1)
    }else if(this.accion === 'salir' || this.accion === 'grabar'){
      this.uploadFiles()
    }
  }

  private guardarDatos(){
    this.showSpinner = true
    this._configMarquesina.save({imagenes: this.imagenesMarquesina, deleted: this.deleted}).subscribe((res: any) =>{

      if(res['tipoMensaje'] === 'success' ){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.resetForm()
      }else{
        this._toastService.showErrorMessage(res['mensaje'] + ' ' + this.errores(res['errores']))
      }
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private uploadFiles(){
    this.showSpinner = true
    this._files.uploadFiles(this.fileToUpload, 'imagenes_marquesina/files').subscribe((res: any) =>{
      if(res?.body?.tipoMensaje === 'success'){
        this.guardarDatos()
      }
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  cancelarModal(){
    this.indiceEliminar = null
    if(this.accion === 'salir'){
        this.cerrarAccordeon2()
    }
  }

  nuevaImagen(){
    this.imagenesMarquesina.unshift(new ImagenMarquesina())
  }

  buscarImagen(index: number){
    (<HTMLInputElement>document.getElementById('file'+index)).click()
  }


  grabar(){
    this._modalService.mostrarModalDialog('¿Desea grabar los datos?','Actualizar marquesina','Grabar')
    this.accion = 'grabar'
  }


  cancelar(){
    if(this.fileToUpload.length > 0 || this.loadedData !== JSON.stringify(this.imagenesMarquesina)){
      this._modalService.mostrarModalDialog('Existen cambios sin guardar. ¿Desea grabar los datos?','Actualizar marquesina','Grabar','Cerrar')
      this.accion = 'salir'
    }else{
      this.cerrarAccordeon2()
      this.resetForm()
    }
  }


  updateData(index: any, col: string,  e:any){
    this.imagenesMarquesina[index][col] = e.target.value
  }

  cargarImagen(index: number){
    let file = <HTMLInputElement>document.getElementById('file'+index)
    if(file.files){
      if(this.fileToUpload[index]){
        this.fileToUpload.splice(index, 1)
      }
      this.imagenesMarquesina[index].src_imagen = file.files[0].name
      this.fileToUpload.push(file.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        this.cargaFotoEnImageControl(reader.result as string, null, index)
      }
      reader.readAsDataURL(<File>file.files[0])
    }
  }

  cargaFotoEnImageControl(object: any, url: any, index: number){
    let img: HTMLImageElement = <HTMLImageElement>document.getElementById('img'+index)
    img.src = object ? object : url ? this._const.storageImages + 'marquesina/' + url : 'Archivo no encontrado'
  }


  getFullPathImage(imageName: string){
    return imageName ? this._const.storageImages + 'marquesina/' + imageName : '#'
  }


  private resetForm(){
    this.obtenerDatos()
    this.fileToUpload = []
  }


  private errores(errors: any){
    return errors ? Object.keys(errors).map(e => errors[e]).reduce((msg, e) => msg += e) : ''
  }

  cerrarAccordeon2(){
    this.close.emit(true)
    this.form.patchValue(this.imagenesMarquesina)
  }
}
