import { Component, OnInit } from '@angular/core';
import { ItemsCarousel } from 'src/app/class/ItemsCarousel/items-carousel';
import { ConfigMarquesinaService } from 'src/app/services/configMarquesina/config-marquesina.service';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';
import { ImagenMarquesina } from '../../../class/imagenMarquesina/imagen-marquesina';
import { SharedService } from '../../../services/shared/shared.service';
import { ConstantesService } from '../../../services/constantes/constantes.service';
import { CategoriasService } from '../../../services/categorias/categorias.service';
import { Categoria } from '../../../class/Categoria/categoria';
import { MarcasService } from '../../../services/marcas/marcas.service';
import { Marca } from '../../../class/marca/marca';
import { ConfigOfertaService } from '../../../services/configOferta/config-oferta.service';
import { OfertaPrincipal } from '../../../class/ofertaPrincipal/oferta-principal';
import { SeccionesHomeService } from '../../../services/seccionesHome/secciones-home.service';

@Component({
  selector: 'app-home-tienda',
  templateUrl: './home-tienda.component.html',
  styleUrls: ['./home-tienda.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class HomeTiendaComponent implements OnInit {
  public sourceImage: string = ''
  public imageFolder: string = ''
  private sourceScript: string =  '../../../../assets/front-office/js/'
  public imagenes: ItemsCarousel[] = []
  public imgMarcas: {imagen: string, link: string, label: string, imageClass: string, linkClass: string}[] = []
  public imagenesMarquesina: ImagenMarquesina[] = []
  public imgCategorias: {imagen: string, link: string, label: string, imageClass: string, linkClass: string}[] = []
  public srcImagen: string = ''
  public ofertaPrincipal: OfertaPrincipal = new OfertaPrincipal()
  public secciones: any[] = []

  constructor(
    private _scriptService: ScriptServicesService,
    private _imagenesMarquesina: ConfigMarquesinaService,
    private _sharedService: SharedService,
    public _const: ConstantesService,
    private _categoriasService: CategoriasService,
    private _marcasService: MarcasService,
    private _configOfertaService: ConfigOfertaService,
    private _seccionesService: SeccionesHomeService,

    ) {
    this.loadScript()
    this.cargarImagenesMarquesina()
    this.imageFolder = this._const.storageImages
   }

  ngOnInit(): void {
    this.loadMarcas()
    this.loadCategories()
    this.cargarOfertaPrincipal()
    this.cargarSecciones()
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
      this.imagenesMarquesina.forEach(i => i.src_imagen = `${this.imageFolder}marquesina/${i.src_imagen}` )
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }

  private cargarOfertaPrincipal(){
    this._configOfertaService.get().subscribe((res: any) => {
      this.ofertaPrincipal = res
      this.sourceImage = this._const.storageImages + 'oferta_home/' + this.ofertaPrincipal.src_imagen
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }


  private cargarSecciones(){
    this._seccionesService.getSeccionesHome().subscribe((res: any) => {
      console.log(res)
      //this.secciones =
      res.forEach((prod: any) => {
        this.secciones.push({
          nombre: prod.nombre,
          productos: prod.productos.map((p: any) => ({
            srcImg: p.source_image,
            srcImg2: p.source_image,
            texto1: p.texto1 ? p.texto1 : p.marca,
            texto2: p.texto2 ? p.texto2 : p.nombre,
            precio: p.precio_venta_normal,
            textoBoton: 'Comprar'
          }))
        })
      })
      /*
      this.secciones.push({
        nombre: res.nombre,
        producto: res.productos.map((p: any) => ({
          srcImg: p.src_imagen,
          srcImg2: p.src_imagen,
          texto1: p.texto1,
          texto2: p.texto2,
          precio: p.precio,
          texto_boton: 'Comprar'
        }))
      })
      */
      console.log(this.secciones)
    }, error => {
      this._sharedService.handlerError(error)
    })
  }

  private loadMarcas(){
    this._marcasService.getHome().subscribe((res: any)=>{
        res.forEach((i: Marca) => {
          if(i.src_imagen){
            this.imgMarcas.push({
                imagen: i.src_imagen,
                link: '',
                label: '',
                imageClass: 'single-brands-logo',
                linkClass: ''
              })
            }
        })
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }

  public itemClick(id: any){
    console.log('itemClick',id)
  }

  public clickFavorito(id: any){
    console.log('clickFavorito', id)
  }

}
