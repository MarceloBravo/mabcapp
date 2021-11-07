import { Component, OnInit } from '@angular/core';
import { SubCategoria } from 'src/app/class/subCategoria/sub-categoria';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { SubCategoriasService } from '../../../../services/subCategorias/sub-categorias.service';
import { LoguedGuard } from '../../../../guards/logued.guard';

@Component({
  selector: 'app-sub-categorias-grid',
  templateUrl: './sub-categorias-grid.component.html',
  styleUrls: ['./sub-categorias-grid.component.css']
})
export class SubCategoriasGridComponent implements OnInit {
  public showSpinner: boolean = false;
  public mostrarModal: boolean = false;
  public data: SubCategoria[] = [];
  public paginacion: Paginacion = new Paginacion();
  private idDelete: number | null = null;
  private textoFiltro: string = ''

  constructor(
    private _subCategoriasService: SubCategoriasService,
    private _sharedServices: SharedService,
    private _toastService: ToastService,
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._subCategoriasService.list(this.paginacion.pagina).subscribe((res: any) =>{
      this.cargarDatos(res)
      this.showSpinner = false
    }, error => {
      this._sharedServices.handlerError(error);
      this.showSpinner = false
    })
  }

  private cargarDatos(res: any){
    this.data = res.data
    this.paginacion.registrosPorPagina = res.rowsPerPage
    this.paginacion.totRegistros = res.rows
    this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage)
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }


  cancelarEliminar(e: any){
    this.idDelete = null
  }


  aceptarEliminar(res: boolean){
    if(res && this.idDelete){
      this.showSpinner = true
      this._subCategoriasService.delete(this.idDelete).subscribe((res: any) => {
        this.showSpinner = false
        if(res['tipoMensaje'] === 'success'){
          this._toastService.showSuccessMessage(res['mensaje'], 'Registro eliminado')
        }else{
          this._toastService.showErrorMessage(res['mensaje'], 'Error')
        }
        this.showSpinner = false
        this.obtenerDatos()
      }, error =>{
        this.showSpinner = false
        this._sharedServices.handlerError(error)
      })
    }
  }


  eliminar(id: number){
    this.mostrarModal = true;
    this.idDelete = id;
  }


  filtrar(texto: string){
    this.paginacion.pagina = 0
    if(texto.length > 0){
      this.showSpinner = true
      this._subCategoriasService.filter(texto, this.paginacion.pagina).subscribe((res: any) => {
        this.cargarDatos(res)
        this.textoFiltro = texto
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedServices.handlerError(error);
      })
    }else{
      this.obtenerDatos()
    }
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    if(this.textoFiltro.length > 0){
      this.filtrar(this.textoFiltro)
    }else{
      this.obtenerDatos()
    }
  }
}
