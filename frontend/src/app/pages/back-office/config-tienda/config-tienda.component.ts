import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast/toast.service';
import { SharedService } from '../../../services/shared/shared.service';
import { ModalDialogService } from '../../../services/modalDialog/modal-dialog.service';
import { ConfigMarquesinaService } from '../../../services/configMarquesina/config-marquesina.service';
import { ImagenMarquesina } from '../../../class/imagenMarquesina/imagen-marquesina';
import { ConstantesService } from '../../../services/constantes/constantes.service';
import { FilesService } from '../../../services/files/files.service';
@Component({
  selector: 'app-config-tienda',
  templateUrl: './config-tienda.component.html',
  styleUrls: ['./config-tienda.component.css']
})
export class ConfigTiendaComponent implements OnInit {
  public titulo: string = 'Configuración de la Tienda'
  public isOpen1: boolean = false
  public isOpen2: boolean = false

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
      this.isOpen2 = false
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
      this.isOpen2 = false
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
}
