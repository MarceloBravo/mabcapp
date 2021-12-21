import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Impuesto } from '../../../../class/impuesto/impuesto';
import { Categoria } from '../../../../class/Categoria/categoria';
import { SubCategoria } from '../../../../class/subCategoria/sub-categoria';
import { Marca } from 'src/app/class/marca/marca';
import { ProductosService } from '../../../../services/productos/productos.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from '../../../../class/producto/producto';
import { MarcasService } from '../../../../services/marcas/marcas.service';
import { CategoriasService } from '../../../../services/categorias/categorias.service';
import { SubCategoriasService } from '../../../../services/subCategorias/sub-categorias.service';
import { UnidadesService } from '../../../../services/unidades/unidades.service';
import { Unidad } from 'src/app/class/Unidad/unidad';
import { ImpuestosService } from '../../../../services/impuestos/impuestos.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { FilesService } from 'src/app/services/files/files.service';
import { ImagenProducto } from '../../../../class/imagenProducto/imagen-producto';
import { Precio } from 'src/app/class/precio/precio';
import { Talla } from '../../../../class/talla/talla';
import { TallasService } from '../../../../services/tallas/tallas.service';
import { TallaProducto } from '../../../../class/tallaProducto/talla-producto';

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.css']
})
export class ProductosFormComponent implements OnInit {
  public showSpinner: boolean = false
  public titulo: string = 'Productos'
  public form = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl(),
    descripcion: new FormControl(),
    precio_venta_normal: new FormControl(),
    precio_costo: new FormControl(),
    precios: new FormControl([]),
    stock: new FormControl(),
    descuento_maximo: new FormControl(),
    unidad_id: new FormControl(),
    marca_id: new FormControl(),
    categoria_id: new FormControl(),
    sub_categoria_id: new FormControl(),
    impuestos: new FormControl(),
    foto: new FormControl(), //Contiene las imágenes asubir
    imagenes: new FormControl(),
    tallas: new FormControl()
  })
  public impuestos: Impuesto[] = []
  public categorias: Categoria[] = []
  public subCategorias: SubCategoria[] = []
  public marcas: Marca[] = []
  public unidades: Unidad[] = []
  public tallasProductos: TallaProducto[] = []
  public idTallas: number[] = []
  public id: number | null = null
  private producto: Producto = new Producto()
  private accion: string | null = null
  private url: string = '/admin/productos'
  public idImpuestos: number[] = []
  public principalImage: string = ''
  public arrURLImagenes: {source: string, name:string, imagen_principal: boolean}[] = []
  tallas: Talla[] = []


  constructor(
    private _productosService: ProductosService,
    private _sharedService: SharedService,
    private _modalDialogService: ModalDialogService,
    private _marcasService: MarcasService,
    private _categoriasService: CategoriasService,
    private _subCategoriasService: SubCategoriasService,
    private _unidadesService: UnidadesService,
    private _impuestosService: ImpuestosService,
    private _tallasService: TallasService,
    public _const: ConstantesService,
    private _file: FilesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.cargarMarcas()
    this.cargarCategorias()
    this.cargarUnidades()
    this.cargarImpuestos()
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.id = parseInt(id)
      this.buscarRegistro()
    }else{
      this.cargarSubCategorias()
      this.iniciarForm()
    }
  }


  private cargarMarcas(){
    this.showSpinner = true
    this._marcasService.getAll().subscribe((res: any) => {
      this.marcas = res
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private cargarCategorias(){
    this.showSpinner = true
    this._categoriasService.getAll().subscribe((res: any) => {
      this.categorias = res
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  categoriaChange(e: any){
    this.cargarSubCategorias(e.value)
  }

  public cargarSubCategorias(idCategoria?: any){
    if(idCategoria){
      this.showSpinner = true
      this._subCategoriasService.getAllByCategoria(idCategoria).subscribe((res: any) => {
        this.subCategorias = res
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }else{
      this.subCategorias = []
      this.tallas = []
    }
  }

  private cargarUnidades(){
    this.showSpinner = true
    this._unidadesService.getAll().subscribe((res: any) => {
      this.unidades = res
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private cargarImpuestos(){
    this.showSpinner = true
    this._impuestosService.getAll().subscribe((res: any) => {
      this.impuestos = res
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private cargarTallas(idSubCategoria?: number){
    if(idSubCategoria){
      this.showSpinner = true
      this._tallasService.getBySubCategory(idSubCategoria).subscribe((res: any) => {
        this.tallas =res
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      } )
    }else{
      this.tallas = []
    }
  }

  subCategoriaChange(idSubCat: string){
    this.cargarTallas(parseInt(idSubCat))
  }

  iniciarForm(){

    this.producto.impuestos.forEach(i => {if(i.id)this.idImpuestos.push(i.id)})
    this.producto.tallas_producto.forEach((i: TallaProducto) => {if(i.id)this.idTallas.push(i.talla_id)})

    this.form = this.fb.group({
      id: this.producto.id,
      nombre: [this.producto.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      descripcion: [this.producto.descripcion, [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
      stock: [this.producto.stock, [Validators.required, Validators.min(0)]],
      descuento_maximo: [this.producto.descuento_maximo, [Validators.required, Validators.min(0), Validators.max(100)]],
      precio_costo: [this.producto.precio_costo, [Validators.required, Validators.min(0)]],
      precio_venta_normal: [this.producto.precio_venta_normal, [Validators.required, Validators.min(0)]],
      precios: [this.producto.precios],
      unidad_id: [this.producto.unidad_id, [Validators.required]],
      marca_id: [this.producto.marca_id, [Validators.required]],
      categoria_id: [this.producto.categoria_id, [Validators.required]],
      sub_categoria_id: [this.producto.sub_categoria_id, [Validators.required]],
      impuestos: [this.idImpuestos],
      tallas:[this.idTallas],
      foto:[[]],
      imagenes: [this.producto.imagenes],
      created_at: [this.producto.created_at],
      updated_at: [this.producto.updated_at],
      deleted_at: [this.producto.deleted_at],
    })
  }

  private buscarRegistro(){
    if(this.id){
      this.showSpinner = true
      this._productosService.find(this.id).subscribe((res: any)=> {
        this.producto = res
        //console.log(this.obtenerPrecioActual(this.producto))
        this.cargarSubCategorias(res['categoria_id'])
        this.cargarTallas(res['sub_categoria_id'])
        this.iniciarForm()
        this.cargarRutasImagenes()
        this.showSpinner = false
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  private cargarRutasImagenes(){
    this.form.value.imagenes.forEach((i: ImagenProducto) => {
      this.arrURLImagenes.push({
        source: this._const.storageImages + 'productos/' +i.source_image,
        name: i.source_image,
        imagen_principal: i.imagen_principal
      })

      if(i.imagen_principal)this.principalImage = i.source_image
    })
  }

  aceptarModal(e: any){
    if(this.accion === 'grabar' || this.accion === 'salir'){
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
    this.showSpinner = true
    console.log('actualizar',this.form.value, JSON.stringify(this.form.value))

    this._productosService.insert(this.form.value).subscribe((res: any) => {
      this.subirImagenes()
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  private actualizar(){
    //console.log(this.form.value, JSON.stringify(this.form.value))
    //debugger
    this.showSpinner = true
    this._productosService.update(this.form.value).subscribe((res: any) => {
      this.subirImagenes()
      this._sharedService.handlerSucces(res, this.url)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
        this._sharedService.handlerError(error)
    })
  }

  private subirImagenes(){
    this._file.uploadFiles(this.form.value.foto, 'productos/subir/imagenes').subscribe((res: any) => {
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })

  }

  private eliminar(){
    if(this.id){
      this.showSpinner = true
      this._productosService.delete(this.id).subscribe((res: any) => {
        this._sharedService.handlerSucces(res, this.url)
        this.showSpinner = false
      }, error => {
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

  cancelarForm(){
    if(this.form.dirty){
      this._modalDialogService.mostrarModalDialog('Se han detectado cambios sin guardar. ¿Desea grabar los cambios?', this.id ? 'Actualizar datos' : 'Ingresar producto', 'Grabar')
      this.accion = 'salir'
    }else{
      this.router.navigate([this.url])
    }
  }

  modalEliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar producto','Eliminar')
    this.accion = 'eliminar'
  }

  modalGrabar(){
    this._modalDialogService.mostrarModalDialog(`¿Desea ${this.id ? 'guardar los cambios del' : 'grabar el'} registro?`, this.id ? 'Actualizar datos' : 'Ingresar producto', 'Grabar')
    this.accion = 'grabar'
  }


  handlerCargarFoto(){
    (<HTMLButtonElement>document.getElementById('btn-file')).click();
  }

  cargarFoto(target: any){
    for(let i = 0; i < target.files.length; i++){
      let foto: ImagenProducto = new ImagenProducto()
      foto.source_image = target.files[i].name
      if(this.id)foto.producto_id = this.id

      this.form.value.imagenes.push(foto);
      //this.form.value.imagenes.push(target.files[i].name);
      this.form.value.foto.push(target.files[i]);
      this.loadImage(target.files[i])
    }
  }

  private loadImage(file: File){
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.arrURLImagenes.push({
        source: event.target.result,
        name: file.name,
        imagen_principal: false
      })
    };
    reader.readAsDataURL(file)
  }


  eliminarImagen(nombre: string){
    this.form.value.imagenes.forEach((i: ImagenProducto, k: any) => {
      if(nombre === i.source_image ){
        this.form.value.imagenes[k].deleted_at = (new Date()).toUTCString()
      }
    })

    this.arrURLImagenes.forEach((i, k: any) => {
      if(nombre === i.name){
        this.arrURLImagenes.splice(k,1)
      }
    })

  }


  imagenPorDefecto(fileName: any){
    this.form.value.imagenes.forEach((i: ImagenProducto) => {
      i.imagen_principal = fileName === i.source_image
    })
    this.principalImage = fileName
  }


  obtenerPrecioActual(producto: Producto): Precio{
    let precio = new Precio()
    if(!producto.id)return precio
    if(producto.precios?.length > 0){
      let fecha = new Date()
      producto.precios.forEach((p: any) =>{
        if(new Date(p.fecha_desde) >= fecha && new Date(p.fecha_hasta) <= fecha){
          precio = p
        }else{
          precio.fecha_desde = producto.updated_at
          precio.fecha_hasta = 'Indefinido'
        }
      })
    }else{
      precio.precio = producto.precio_venta_normal
      precio.fecha_desde = producto.updated_at
      precio.fecha_hasta = 'Indefinido'
    }
    return precio
  }


  formatearFecha(fecha?: string){
    return fecha ? fecha.split('T')[0].split('-').reverse().join('-') : 'Indefeinido'
  }
}
