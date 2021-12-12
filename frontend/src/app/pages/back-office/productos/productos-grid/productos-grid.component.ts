import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/class/producto/producto';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { ProductosService } from '../../../../services/productos/productos.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from 'src/app/services/modalDialog/modal-dialog.service';
import { ConstantesService } from '../../../../services/constantes/constantes.service';

@Component({
  selector: 'app-productos-grid',
  templateUrl: './productos-grid.component.html',
  styleUrls: ['./productos-grid.component.css']
})
export class ProductosGridComponent implements OnInit {
  public showSpinner: boolean = false
  public titulo: string = 'Productos'
  public headers: string[] = ['Foto','Nombre', 'Descripción', 'Precio', 'Categoría', 'Sub-categoría', 'Marca', 'Stock', 'Fecha creación', 'Fecha actualizacón']
  public visibleColumns: string[] = ['imagen_principal','nombre', 'descripcion', 'precio_venta_normal', 'nombre_categoria', 'nombre_sub_categoria', 'nombre_marca', 'stock', 'created_at', 'updated_at']
  public data: Producto[] = []
  public imagesColumn: string[] = ['imagen_principal']
  public paginacion: Paginacion = new Paginacion()
  private idEliminar: number | null = null
  private textoFiltro: string = ''

  constructor(
    private _productosServices: ProductosService,
    private _sharedService: SharedService,
    private _modalDialogService: ModalDialogService,
    private _const: ConstantesService,
  ) {
    this.obtenerDatos()
  }


  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._productosServices.list(this.paginacion.pagina).subscribe((res: any)=>{
      this.cargarDatos(res)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error);
    })
  }

  private cargarDatos(res: any){
    this.data = res.data
    res.data.forEach((p: any) => {
      p.imagen_principal = this._const.storageImages + 'productos/' + p.imagen_principal
    })

    this.paginacion.pagina = res.page
    this.paginacion.totRegistros = res.rows
    this.paginacion.registrosPorPagina = res.rowsPerPage
    this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage)
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }

  cancelarEliminar(e: any){
    this.idEliminar = null
  }

  aceptarEliminar(e: any){
    if(this.idEliminar){
      this.showSpinner = true
      this._productosServices.delete(this.idEliminar).subscribe((res: any) =>  {
        this.paginacion.pagina = 0
        this.obtenerDatos()
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  eliminar(id: any){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar producto','Eliminar')
    this.idEliminar = id
  }

  filtrar(texto: any){
    this.textoFiltro = texto
    if(this.textoFiltro !== texto)this.paginacion.pagina = 0

    if(texto.length > 0){
      debugger
      this._productosServices.filter(texto, this.paginacion.pagina).subscribe((res: any) => {
        this.cargarDatos(res)
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }else{
      this.obtenerDatos()
    }

  }

  mostrarPagina(pag: number){
    if(this.textoFiltro.length > 0 ){
      this.filtrar(this.textoFiltro)
    }else{
      this.obtenerDatos()
    }
  }


}
