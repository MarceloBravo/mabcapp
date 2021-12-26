import { Component, OnInit } from '@angular/core';
import { ItemsCarousel } from 'src/app/class/ItemsCarousel/items-carousel';
import { ConfigMarquesinaService } from 'src/app/services/configMarquesina/config-marquesina.service';
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
import { Router } from '@angular/router';
import { CarritoService } from '../../../services/carrito/carrito.service';
import { PreciosService } from '../../../services/precios/precios.service';

@Component({
  selector: 'app-home-tienda',
  templateUrl: './home-tienda.component.html',
  styleUrls: ['./home-tienda.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class HomeTiendaComponent implements OnInit {
  public sourceImage: string = ''
  public imageFolder: string = ''
  public imagenes: ItemsCarousel[] = []
  public imgMarcas: {imagen: string, link: string, label: string, imageClass: string, linkClass: string}[] = []
  public imagenesMarquesina: ImagenMarquesina[] = []
  public imgCategorias: {imagen: string, link: string, label: string, imageClass: string, linkClass: string}[] = []
  public srcImagen: string = ''
  public ofertaPrincipal: OfertaPrincipal = new OfertaPrincipal()
  public secciones: any[] = []

  constructor(
    private _imagenesMarquesina: ConfigMarquesinaService,
    private _sharedService: SharedService,
    public _const: ConstantesService,
    private _categoriasService: CategoriasService,
    private _marcasService: MarcasService,
    private _configOfertaService: ConfigOfertaService,
    private _seccionesService: SeccionesHomeService,
    private _preciosService: PreciosService,
    private _carritoServices: CarritoService,
    private router: Router
  ) {
      this.cargarImagenesMarquesina()
      this.imageFolder = this._const.storageImages
  }

  ngOnInit(): void {
    this.loadMarcas()
    this.loadCategories()
    this.cargarOfertaPrincipal()
    this.cargarSecciones()
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
            id: p.id,
            srcImg: p.source_image,
            srcImg2: p.source_image,
            texto1: p.texto1 ? p.texto1 : p.marca,
            texto2: p.texto2 ? p.texto2 : p.nombre,
            precio: this._preciosService.precioConImpuestos(p.precio_venta_normal, [p.promedio_impuestos]),
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

  public itemClick(e: any){
    this.router.navigate(['/detalle_producto/' + e.id])
  }

  public clickFavorito(e: any){
    this._carritoServices.setFavorites(e.id); //Agrega y eliminar productos a los favoritos
  }

}
