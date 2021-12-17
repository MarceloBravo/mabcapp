import { Component, OnInit } from '@angular/core';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../../services/productos/productos.service';
import { SharedService } from '../../../services/shared/shared.service';
import { Producto } from '../../../class/producto/producto';
import { ConstantesService } from '../../../services/constantes/constantes.service';
import { ImagenProducto } from '../../../class/imagenProducto/imagen-producto';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css',
  '../../../../assets/front-office/css/core-style.css',
  '../../../../assets/front-office/css/owl.carousel.css',
  '../../../../assets/front-office/css/classy-nav.min.css']
})
export class DetalleProductoComponent implements OnInit {
  private sourceScript: string =  '../../../../assets/front-office/js/'
  private showSpinner: boolean = false
  producto: Producto = new Producto()
  precios: {precio_venta: number, precio_normal: number} = {precio_venta: 0, precio_normal: 0}
  imageFolder: string = ''
  currentImage: number | null = null
  previewImageStyle: string = ''

  previewImage: string = ''

  constructor(
    private _scriptService: ScriptServicesService,
    private activatedRoute: ActivatedRoute,
    private _productosService: ProductosService,
    private _sharedService: SharedService,
    private _const: ConstantesService,
    private router: Router
  ) {
    this.imageFolder = this._const.storageImages
    this.loadScript()
    let id: string | null = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.buscarProducto(parseInt(id))
    }else{
      this.router.navigate(['/'])
    }
  }

  ngOnInit(): void {
  }

  private loadScript(){
    this._scriptService.load([
      `${this.sourceScript}jquery/jquery-2.2.4.min.js`,
      `${this.sourceScript}popper.min.js`,
      `${this.sourceScript}bootstrap.min.js`,
      `${this.sourceScript}plugins.js`,
      `${this.sourceScript}classy-nav.min.js`,
      `${this.sourceScript}active.js`,
    ])
  }

  private buscarProducto(id: number){
    this.showSpinner = true
    this._productosService.getDetail(id).subscribe((res: any) => {
      console.log('buscarProducto',res)
      this.showSpinner = false
      if(res){
        this.producto = res;
        this.precios = {precio_venta: this.producto.precios.length > 0 ? this.producto.precios[0].precio: this.producto.precio_venta_normal, precio_normal: this.producto.precio_venta_normal}

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
}