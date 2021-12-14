import { Component, OnInit } from '@angular/core';
import { ScriptServicesService } from '../../../services/scriptServices/script-services.service';
import { CatalogoService } from '../../../services/catalogo/catalogo.service';
import { SharedService } from '../../../services/shared/shared.service';
import { FoCatalogoParams } from '../../../class/fo-catalogo-params/fo-catalogo-params';
import { Paginacion } from '../../../class/paginacion/paginacion';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { ItemsCarousel } from '../../../class/ItemsCarousel/items-carousel';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class CatalogoComponent implements OnInit {
  private sourceScript: string =  '../../../../assets/front-office/js/'
  private params: FoCatalogoParams = new FoCatalogoParams()
  paginacion: Paginacion = new Paginacion()
  public imgCategorias: ItemsCarousel[] = []
  public imageFolder: string = ''

  constructor(
    private _scriptService: ScriptServicesService,
    private _catalogoServoce: CatalogoService,
    private _sharedService: SharedService,
    public _const: ConstantesService,
  ) {
    this.loadScript()
    this.obteberDatos()
    this.imageFolder = this._const.storageImages
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

  private obteberDatos(){
    this._catalogoServoce.get(this.paginacion.pagina, this.params).subscribe((res: any) => {
        this.cargarDatos(res)

    }, error =>{
      this._sharedService.handlerError(error)
    })
  }

  private cargarDatos(res: any){
    this.imgCategorias = []
    res.data.forEach((i: any) => {
      this.imgCategorias.push({
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
    this.paginacion.registrosPorPagina = res['rowsPerPage']
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
    this.obteberDatos()
  }
}
