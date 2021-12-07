import { Component, OnInit } from '@angular/core';
import { SeccionesHomeService } from '../../../../services/seccionesHome/secciones-home.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosSeccionHome } from '../../../../class/productosSeccionHome/productos-seccion-home';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { ProductosService } from '../../../../services/productos/productos.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ConstantesService } from '../../../../services/constantes/constantes.service';
import { FilesService } from '../../../../services/files/files.service';

@Component({
  selector: 'app-secciones-home-form',
  templateUrl: './secciones-home-form.component.html',
  styleUrls: ['./secciones-home-form.component.css']
})
export class SeccionesHomeFormComponent implements OnInit {
  public showSpinner: boolean = false
  public form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    src_imagen: new FormControl(null, [Validators.maxLength(500)]),
    productos: new FormControl([]),
    deleted: new FormControl([])
  })
  public id: number | null = null
  private accion: string | null = null
  private url: string = '/admin/secciones_home'
  public search: string = ''
  public productos: any[] = []
  public visibleColumns: string[] = ['nombre','nombre_marca','texto1','texto2']
  public idSelectedProd: any = null
  private fileToUpload?: File
  public fotoObject: string = ''


  constructor(
    private _seccionesService: SeccionesHomeService,
    private _sharedService: SharedService,
    private _productosService: ProductosService,
    private avctivatedRoute: ActivatedRoute,
    private _modalService: ModalDialogService,
    private _toastService: ToastService,
    private _const: ConstantesService,
    private _files: FilesService,
    private router: Router,
  ) {
    let id = this.avctivatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.id = parseInt(id)
      this.obtenerDatos()
    }
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    if(this.id){
      this._seccionesService.find(this.id).subscribe((res: any) =>{
        this.form.patchValue(res)
        this.cargaFotoEnImageControl('', this.form.value.src_imagen)
        this.showSpinner = false
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }


  aceptarModal(){
    if(this.accion === 'grabar'){
      if(this.fileToUpload?.name)this.form.value.src_imagen = this.fileToUpload.name
      if(this.id){
        this.actualizar()
      }else{
        this.insertar()
      }
    }else{
        this.eliminar()
    }

  }


  private insertar(){
    this._seccionesService.insert(this.form.value).subscribe((res: any) =>{
      if(res['tipoMensaje'] === 'success'){
        this._sharedService.handlerSucces(res, this.url)
        this.subirFoto(res['id'], this._files)
      }else{
        this._sharedService.handlerError(res['mensaje'])
      }
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }


  private actualizar(){
    if(this.id){
      this._seccionesService.update(this.form.value).subscribe((res: any) =>{
        if(res['tipoMensaje'] === 'success'){
          this._sharedService.handlerSucces(res, this.url)
          this.subirFoto(res['id'], this._files)
        }else{
          this._sharedService.handlerError(res['mensaje'])
        }
        this.showSpinner = false
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }


  private eliminar(){
    if(this.id){
      this._seccionesService.delete(this.id).subscribe((res: any) =>{
        if(res['tipoMensaje'] === 'success'){
          this._sharedService.handlerSucces(res, this.url)
        }else{
          this._sharedService.handlerError(res['mensaje'])
        }
        this.showSpinner = false
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }


  cancelarModal(){
    if(this.accion === 'salir'){
      this.router.navigate([this.url])
    }
    this.accion = null
  }


  cancelar(){
    if(this.form.dirty){
      this._modalService.mostrarModalDialog('Existen cambios sin grabar. ¿Desea grabar los cambios?', 'Grabar sección','Grabar')
      this.accion = 'salir'
    }else{
      this.router.navigate([this.url])
    }
  }


  modalEliminar(){
    this._modalService.mostrarModalDialog('¿Desea eliminar el registro?', 'Eliminar sección','Eliminar')
    this.accion = 'eliminar'
  }


  modalGrabar(){
    this._modalService.mostrarModalDialog('¿Desea grabar los cambios?', 'Grabar sección','Grabar')
    this.accion = 'grabar'
  }

  buscarProducto(e: any){
    this.idSelectedProd = null
    if(e.target.value.length > 0){
      this._productosService.getAllFilter(e.target.value).subscribe((res: any) => {
        this.productos = res
        if(this.productos.length > 0){
          e.target.value = res[0].nombre + ' ' + res[0].nombre_marca
          this.idSelectedProd = 0
        }
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }else{
      this.productos = []
    }
  }

  changeCboProducto(e: any){
    this.idSelectedProd = e.value
    let input = <HTMLInputElement>document.getElementById('txt_producto')
    input.value = this.productos[e.value].nombre + ' ' + this.productos[e.value].nombre_marca
  }

  eliminarProd(id: number){
    this.form.value.productos.forEach((p: any, k: any) => {
      if(p.id === id){
        this.form.value.productos.splice(k, 1)
        if(id > 0)this.form.value.deleted.push(id)
        return
      }
    })

  }

  agregarProducto(){
    let prod = this.productos[this.idSelectedProd]
    let count = 0
    this.form.value.productos.forEach((p: any) => count += p.producto_id === prod.id ? 1 : 0)
    if(count === 0){
      this.form.value.productos.push({
        id: -(Math.random() * (1000 - 0)),
        seccion_id: this.id,
        producto_id: prod.id,
        nombre: prod.nombre,
        nombre_marca: prod.nombre_marca,
        texto1: '',
        texto2: ''
      })
    }else{
      this._toastService.showErrorMessage('El producto ya se encuentra en el listado','Producto ya ingresado')
    }
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
    img.src = object ? object : url ?  `${this._const.storageImages}secciones/${url}` : this._const.noImage
  }


  private subirFoto(id: number, res: any){
    if(this.fileToUpload){
      this._files.uploadFile(<File>this.fileToUpload, 'secciones_home/subir/imagen').subscribe(() => {
      },error=>{
        console.log(error)
        this.showSpinner = !this._sharedService.handlerError(error);
      })
    }
  }

}
