import { Component, OnInit } from '@angular/core';
import { ScriptServicesService } from '../../../services/scriptServices/script-services.service';
import { CatalogoService } from '../../../services/catalogo/catalogo.service';
import { SharedService } from '../../../services/shared/shared.service';
import { FoCatalogoParams } from '../../../class/fo-catalogo-params/fo-catalogo-params';
import { Paginacion } from '../../../class/paginacion/paginacion';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { ItemsCarousel } from '../../../class/ItemsCarousel/items-carousel';
import { ActivatedRoute } from '@angular/router';
import { CategoriasService } from '../../../services/categorias/categorias.service';
import { Categoria } from '../../../class/Categoria/categoria';
import { SubCategoriasService } from '../../../services/subCategorias/sub-categorias.service';
import { SubCategoria } from 'src/app/class/subCategoria/sub-categoria';
import { MarcasService } from '../../../services/marcas/marcas.service';
import { Marca } from '../../../class/marca/marca';
import { OrdenarPor } from '../../../enum/catalogoParams/ordenarPor';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class CatalogoComponent implements OnInit {
  private sourceScript: string =  '../../../../assets/front-office/js/'
  params: FoCatalogoParams = new FoCatalogoParams()
  productos: ItemsCarousel[] = []
  paginacion: Paginacion = new Paginacion()
  categorias: Categoria[] = []
  marcas: Marca[] = []
  precioMinMax: {precio_min: number, precio_max: number, value_min: number, value_max: number} = {precio_min:0, precio_max: 10000000, value_min: 0, value_max: 10000000}
  imageFolder: string = ''
  titulo: string | null = null
  ordernarPor: typeof OrdenarPor = OrdenarPor


  constructor(
    private _scriptService: ScriptServicesService,
    private _catalogoService: CatalogoService,
    private _sharedService: SharedService,
    public _categoriasService: CategoriasService,
    private _subCategoriasService: SubCategoriasService,
    private _marcasService: MarcasService,
    public _const: ConstantesService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.loadScript()
    this.obtenerDatos()
    this.cargarCategorias()
    this.cargarMarcas()
    this.obtenerPrecioMinMax()
    this.imageFolder = this._const.storageImages
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(res => {
      this.titulo = res[0].path
    }, error => {
      this.titulo = 'Catalogo'
    } )
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

  private cargarCategorias(){
    this._categoriasService.getAll().subscribe((res: any) => {
      this.categorias = res
    },error =>
      this._sharedService.handlerError(error)
    )
  }

  private cargarMarcas(){
    this._marcasService.getAll().subscribe((res: any) => {
      this.marcas = res
    },error =>
      this._sharedService.handlerError(error)
    )
  }

  private obtenerDatos(){
    this._catalogoService.get(this.paginacion.pagina, this.params).subscribe((res: any) =>
        this.cargarDatos(res)
    , error =>
      this._sharedService.handlerError(error)
    )
  }


  private obtenerPrecioMinMax(){
    this._catalogoService.minMaxPrice().subscribe((res: any) => {
      if(res.length > 0){
        this.precioMinMax.precio_min = res[0]['precio_min']
        this.precioMinMax.precio_max = res[0]['precio_max']
        this.precioMinMax.value_min = res[0]['precio_min']
        this.precioMinMax.value_max = res[0]['precio_max']
      }
    }, error =>
      this._sharedService.handlerError(error))
  }


  private cargarDatos(res: any){
    this.productos = []
    res.data.forEach((i: any) => {
      this.productos.push({
        id: i.id,
        srcImg: i.imagen_principal,
        srcImg2: i.imagen_principal,
        texto1: i.marca,
        texto2: i.nombre,
        precio: i.precio_venta,
        textoBoton: 'Comprar'
      })
    })

    this.paginacion.pagina = parseInt(res['page'])
    this.paginacion.totRegistros = res['rows']
    this.paginacion.registrosPorPagina = res['rowsgitnPerPage']
    this.paginacion.totPaginas = Math.ceil(res['rows'] / res['rowsPerPage'])
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }

  itemClick(e: any){
    console.log('itemClick',e)
  }

  clickFavorito(e: any){
    console.log('clickFavorito',e)
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    this.obtenerDatos()
  }

  collapseStatus(idUl: string){
    let ul = <HTMLUListElement>document.getElementById(idUl)
    ul.className = ul.className.includes('show') ? ul.className.replace('show','') : ul.className.concat(' show')
  }


  filtrarPorCategoria(idCategoria: number | null, todo: boolean = false){
    this.params.categoria_id = idCategoria
    if(!idCategoria || todo)this.params.sub_categoria_id = null
    this.obtenerDatos()
  }

  ordenarItemsPor(value: string){
    this.params.ordenar_por = parseInt(value)
    this.obtenerDatos()
  }


  filtrarPorSubCategoria(idCategoria: number | null, idSubCategoria: number | null){
    this.params.categoria_id = idCategoria
    this.params.sub_categoria_id = idSubCategoria
    this.obtenerDatos()
  }

  filtrarPorMarca(idMarca: number | null){
    this.params.marca_id = idMarca
    this.obtenerDatos()
  }

  filtrarPorPrecio(price: string){
    this.precioMinMax.value_max = parseInt(price)
    this.params.rango_precio = {desde: this.precioMinMax.value_min, hasta: this.precioMinMax.value_max}
    this.obtenerDatos()
  }

  itemsAMostrar(value: any){
    this.params.productos_por_pagina = value
    this.obtenerDatos()
  }

}
