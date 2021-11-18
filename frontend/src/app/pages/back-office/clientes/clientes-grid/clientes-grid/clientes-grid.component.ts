import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/class/cliente/cliente';
import { Paginacion } from '../../../../../class/paginacion/paginacion';
import { ClientesService } from '../../../../../services/clientes/clientes.service';
import { SharedService } from '../../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-clientes-grid',
  templateUrl: './clientes-grid.component.html',
  styleUrls: ['./clientes-grid.component.css']
})
export class ClientesGridComponent implements OnInit {
  public showSpinner: boolean = false
  public titulo: string = 'Clientes'
  public headers: string[] = ['Rut','Nombres','Primer apellido','Segundo apellido','Ciudad','Email','Fecha creación','Fecha actualización']
  public visibleColumns: string[] = ['rut','nombres','apellido1','apellido2','ciudad','email','created_at','updated_at']
  public data: Cliente[] = []
  public paginacion: Paginacion = new Paginacion()
  private idEliminar: number | null = null
  private textoFiltro: string = ''

  constructor(
    private _clientesService: ClientesService,
    private _sharedService: SharedService,
    private _modalDialogService: ModalDialogService,
    private _toastService: ToastService
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._clientesService.list(this.paginacion.pagina).subscribe((res: any)=>{
      this.showSpinner = false
      this.cargarDatos(res)
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error);
    })
  }


  private cargarDatos(res: any){
    this.data = res.data
    this.paginacion.pagina = res['page']
    this.paginacion.totRegistros = res['rows']
    this.paginacion.registrosPorPagina = res['rowsPerPage']
    this.paginacion.totPaginas = res['rows'] / res['rowsPerPage']
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }

  eliminar(id: any){
    this.idEliminar = id
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar cliente','Eliminar')
  }

  cancelarEliminar(e: any){
    this.idEliminar = null
  }

  aceptarEliminar(e: any){
    if(this.idEliminar){
      this.showSpinner = true
      this._clientesService.delete(this.idEliminar).subscribe((res: any) => {
        if(res['tipoMensaje'] === 'success'){
          this._toastService.showSuccessMessage(res['mensaje'], 'Registro eliminado')
        }else{
          this._toastService.showErrorMessage(res['mensaje'], 'Error')
        }
        this.obtenerDatos()

      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  filtrar(texto: any){
    if(this.textoFiltro !== texto)this.paginacion.pagina = 0
    this.textoFiltro = texto
    if(texto.length > 0){
      this.obtenerfiltrarDatos()
    }else{
      this.obtenerDatos()
    }
  }

  private obtenerfiltrarDatos(){
    this.showSpinner = true
      this._clientesService.filter(this.textoFiltro, this.paginacion.pagina).subscribe((res: any)=>{

      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    if(this.textoFiltro.length > 0){
      this.obtenerfiltrarDatos()
    }else{
      this.obtenerDatos()
    }

  }


}
