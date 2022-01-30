import { Component, OnInit } from '@angular/core';
import { SeccionHome } from 'src/app/class/seccionHome/seccion-home';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { SeccionesHomeService } from '../../../../services/seccionesHome/secciones-home.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-secciones-home-grid',
  templateUrl: './secciones-home-grid.component.html',
  styleUrls: ['./secciones-home-grid.component.css']
})
export class SeccionesHomeGridComponent implements OnInit {
  public showSpinner: boolean = false
  public visibleColumns: string[] = ['nombre','created_at','updated_at']
  public data: SeccionHome[] = []
  public paginacion: Paginacion = new Paginacion()
  private textoFiltro: string | null = null
  private idEliminar: number | null = null

  constructor(
    private _seccionesService: SeccionesHomeService,
    private _sharedServices: SharedService,
    private _modalDialogService: ModalDialogService,
    private _toastService: ToastService
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._seccionesService.list(this.paginacion.pagina).subscribe((res: any) => {
      this.cargarDatos(res)
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedServices.handlerError(error)
    })
  }

  private cargarDatos(res: any){
    this.data = res.data
    this.paginacion.pagina = res.page
    this.paginacion.totRegistros = res.rows
    this.paginacion.registrosPorPagina = res.rowsPerPage
    this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage)
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }


  eliminar(id: number){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar sección','Eliminar')
    this.idEliminar = id
  }

  aceptarModal(){
    if(this.idEliminar){
      this.showSpinner = true
      this._seccionesService.delete(this.idEliminar).subscribe((res: any) => {
        if(res['tipoMensaje'] === 'success'){
          this._toastService.showSuccessMessage(res['mensaje'])
          this.obtenerDatos()
        }else{
          this._toastService.showErrorMessage(res['mensaje'])
          this.showSpinner = false
        }
      }, error =>{
        this.showSpinner = false
        this._sharedServices.handlerError(error)
      })
    }
  }

  cancelarModal(){
    this.idEliminar = null
  }

  filtrar(texto: string){
    if(texto !== this.textoFiltro)this.paginacion.pagina = 0
    this.textoFiltro = texto

    if(texto.length > 0){
      this.aplicarFiltro()
    }else{
      this.obtenerDatos()
    }
  }

  private aplicarFiltro(){
    if(this.textoFiltro){
      this.showSpinner = true
      this._seccionesService.filter(this.textoFiltro, this.paginacion.pagina).subscribe((res: any) => {
        this.cargarDatos(res)
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedServices.handlerError(error)
      } )
    }
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    if(this.textoFiltro  && this.textoFiltro.length > 0){
      this.aplicarFiltro()
    }else{
      this.obtenerDatos()
    }
  }
}
