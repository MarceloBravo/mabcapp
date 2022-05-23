import { Component, OnInit } from '@angular/core';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../../services/productos/productos.service';
import { SharedService } from '../../../services/shared/shared.service';
import { Producto } from '../../../class/producto/producto';
import { ConstantesService } from '../../../services/constantes/constantes.service';
import { CarritoService } from '../../../services/carrito/carrito.service';
import { PreciosService } from '../../../services/precios/precios.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css',
  '../../../../assets/front-office/css/core-style.css',
  '../../../../assets/front-office/css/owl.carousel.css',
  '../../../../assets/front-office/css/classy-nav.min.css']
})
export class DetalleProductoComponent implements OnInit {
  private showSpinner: boolean = false
  private id: number | null = null
  producto: Producto = new Producto()
  precios: {precio_venta: number, precio_normal: number} = {precio_venta: 0, precio_normal: 0}
  imageFolder: string = ''
  currentImage: number | null = null
  previewImageStyle: string = ''
  previewImage: string = ''
  favoritos: number[] = []
  nombreUnidad: string = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private _productosService: ProductosService,
    private _sharedService: SharedService,
    private _const: ConstantesService,
    private _carritoService: CarritoService,
    private _preciosService: PreciosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.imageFolder = this._const.storageImages
    let id: string | null = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.id = parseInt(id)
      this.buscarProducto(parseInt(id))
    }else{
      this.router.navigate(['/'])
    }
    this.favoritos = this._carritoService.getFavorites()
  }

  private buscarProducto(id: number){
    this.showSpinner = true
    this._productosService.getDetail(id).subscribe((res: any) => {

      this.showSpinner = false
      if(res){
        this.producto = res;
        this.nombreUnidad = res.unidad[0] ? (res.stock > 0 ? res.unidad[0].nombre_plural : res.unidad[0].nombre) : ''
        let impuestos: number[] = []
        this.producto.impuestos.forEach(i =>
          impuestos.push(i.porcentaje)
        )
        this.precios = {
          precio_venta:  this._preciosService.precioConImpuestos(this.producto.precios.length > 0 ? this.producto.precios[0].precio: this.producto.precio_venta_normal, impuestos),
          precio_normal: this._preciosService.precioConImpuestos(this.producto.precio_venta_normal, impuestos)}

        this.producto.imagenes.forEach((p, index) => {
          if(p.imagen_principal){
            this.currentImage = index
            return
          }
        })
      }

    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  selectImage(index: number){
    this.currentImage = index
  }

  showImage(){
    this.previewImage = this.currentImage !== null ? this.imageFolder + 'productos/' + this.producto.imagenes[this.currentImage].source_image : ''
  }

  closePreView(){
    this.previewImage = ''
  }


  agregarCarrito(){
    this._carritoService.addToCart(this.producto)
  }

  formatearPrecio(precio: number){
    return this._preciosService.strFormatearPrecio(precio)
  }
}
