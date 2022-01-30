import { Component, OnInit } from '@angular/core';
import { Unidad } from 'src/app/class/Unidad/unidad';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { UnidadesService } from '../../../../services/unidades/unidades.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-unidad-grid',
  templateUrl: './unidad-grid.component.html',
  styleUrls: ['./unidad-grid.component.css']
})
export class UnidadGridComponent implements OnInit {
  public showSpinner: boolean = false
  public headers: string[] = ['Nombre', 'Nombre en plural', 'Fecha de creación', 'Fecha de actualización']
  public visibleColumns: string[] = ['nombre','nombre_plural','created_at','updated_at']
  public paginacion: Paginacion = new Paginacion()
  public data: Unidad[] = []
  private textoFiltro: string = ''
  private idEliminar: number | null = null

  constructor(
    private _unidadesService: UnidadesService,
    private _sharedService: SharedService,
    private _modalDialogService: ModalDialogService,
    private _toastService: ToastService
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private getData(){
    if(this.textoFiltro.length>0){
      this.obtenerDatos()
    }else{
      this.filtrar(this.textoFiltro)
    }
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._unidadesService.list(this.paginacion.pagina).subscribe((res: any)=>{
      this.cargarDatos(res)
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error);
    })
  }

  private cargarDatos(res: any){
    this.showSpinner = false
    this.data = res.data
    this.paginacion.pagina = res['page']
    this.paginacion.registrosPorPagina = res['rowsPerPage']
    this.paginacion.totRegistros = res['rows']
    this.paginacion.totPaginas = Math.ceil(res['rows']/res['rowsPerPage'])
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }

  eliminar(id: number){
    this.idEliminar = id
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar Unidad','Eliminar')
  }

  cancelarEliminar($e: any){
    this.idEliminar = null
  }

  aceptarEliminar($e: any){
    if(this.idEliminar){
      this.showSpinner = true
      this._unidadesService.delete(this.idEliminar).subscribe((res: any)=> {
        if(res['tipoMensaje'] === 'success'){
          this._toastService.showSuccessMessage(res['mensaje'], 'Registro eliminado')
          this.getData()
        }else{
          this._toastService.showErrorMessage(res['mensaje'],'Error')
        }
        this.showSpinner = false

      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  filtrar(texto: string){
    if(this.textoFiltro !== texto){
      this.paginacion.pagina = 0
      this.textoFiltro = texto
    }

    this.showSpinner = true

    if(texto.length > 0){
      this._unidadesService.filter(texto, this.paginacion.pagina).subscribe((res: any)=>{
        this.cargarDatos(res)
      }, error=>{
        this.showSpinner = false
        this._sharedService.handlerError(error);
      })

    }else{
      this.obtenerDatos()
    }
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    this.getData()
  }
}
