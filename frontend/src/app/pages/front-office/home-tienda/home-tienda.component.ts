import { Component, OnInit } from '@angular/core';
import { ItemsCarousel } from 'src/app/class/ItemsCarousel/items-carousel';
import { ConfigMarquesinaService } from 'src/app/services/configMarquesina/config-marquesina.service';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';
import { ImagenMarquesina } from '../../../class/imagenMarquesina/imagen-marquesina';
import { SharedService } from '../../../services/shared/shared.service';
import { ConstantesService } from '../../../services/constantes/constantes.service';
import { CategoriasService } from '../../../services/categorias/categorias.service';
import { ImageCover } from 'src/app/enum/carousel/imageCover';
import { Categoria } from '../../../class/Categoria/categoria';

@Component({
  selector: 'app-home-tienda',
  templateUrl: './home-tienda.component.html',
  styleUrls: ['./home-tienda.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class HomeTiendaComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'
  private sourceScript: string =  '../../../../assets/front-office/js/'
  public imagenes: ItemsCarousel[] = []
  public imgMarcas: string[] = []
  public imagenesMarquesina: ImagenMarquesina[] = []
  public imgCategorias: {imagen: string, link: string, label: string, imageClass: string, linkClass: string}[] = []
  public srcImagen: string = ''

  constructor(
    private _scriptService: ScriptServicesService,
    private _imagenesMarquesina: ConfigMarquesinaService,
    private _sharedService: SharedService,
    public _const: ConstantesService,
    private _categoriasService: CategoriasService,

    ) {
    this.loadScript()
    this.cargarImagenesMarquesina()
    this.srcImagen = this._const.storageImages + 'categorias/'
   }

  ngOnInit(): void {
    this.loadImages()
    this.loadMarcas()
    this.loadCategories()
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


  private loadCategories(){
    this._categoriasService.getAll().subscribe((res: any) => {
      res.forEach((i: Categoria) => {
        if(i.src_imagen){
          this.imgCategorias.push({
            imagen: i.src_imagen,
            link: '',
            label: i.nombre,
            linkClass: 'link-categorias-class',
            imageClass: 'images-categorias'
          })
        }
      })
      console.log(this.imgCategorias)
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }

  private cargarImagenesMarquesina(){
    this._imagenesMarquesina.getImages().subscribe((res: any) => {
      this.imagenesMarquesina = res
      this.imagenesMarquesina.forEach(i => i.src_imagen = `${this._const.storageImages}marquesina/${i.src_imagen}` )
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }


  private loadImages(){
    this.imagenes.push({srcImg: 'product-img/product-1.jpg', srcImg2: 'product-img/product-1.jpg', texto1:'topshop', texto2: 'Knot Front Mini Dress', precio: 80.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-2.jpg', srcImg2: 'product-img/product-2.jpg', texto1:'topshop', texto2: 'Poplin Displaced Wrap Dress', precio: 80.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-3.jpg', srcImg2: 'product-img/product-3.jpg', texto1:'Mango', texto2: 'PETITE Crepe Wrap Mini Dress', precio: 55.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-4.jpg', srcImg2: 'product-img/product-4.jpg', texto1:'Mango', texto2: 'PETITE Belted Jumper Dress', precio: 60.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-5.jpg', srcImg2: 'product-img/product-5.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-6.jpg', srcImg2: 'product-img/product-6.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-7.jpg', srcImg2: 'product-img/product-7.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-8.jpg', srcImg2: 'product-img/product-8.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-9.jpg', srcImg2: 'product-img/product-9.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
  }

  private loadMarcas(){
    this.imgMarcas.push('core-img/brand1.png')
    this.imgMarcas.push('core-img/brand2.png')
    this.imgMarcas.push('core-img/brand3.png')
    this.imgMarcas.push('core-img/brand4.png')
    this.imgMarcas.push('core-img/brand5.png')
    this.imgMarcas.push('core-img/brand6.png')
  }

  public itemClick(id: any){

  }

}
