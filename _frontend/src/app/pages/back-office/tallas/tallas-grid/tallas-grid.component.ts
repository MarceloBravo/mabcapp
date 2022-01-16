import { Component, OnInit } from '@angular/core';
import { Talla } from '../../../../class/talla/talla';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { TallasService } from '../../../../services/tallas/tallas.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../../services/toast/toast.service';


@Component({
  selector: 'app-tallas-grid',
  templateUrl: './tallas-grid.component.html',
  styleUrls: ['./tallas-grid.component.css']
})
export class TallasGridComponent implements OnInit {
  paginacion: Paginacion = new Paginacion()
  showSpinner: boolean = false
  titulo: string = 'Tallas'
  data: Talla[] = []
  private id: number | null = null
  private textoFiltro: string = ''

  constructor(
    private _tallasService: TallasService,
    private _sharedService: SharedService,
    private _modalService: ModalDialogService,
    private _toastService: ToastService,
  ) { }


  ngOnInit(): void {
    this.obtenerDatos()
  }


  private obtenerDatos(){
    this.showSpinner = true
    this._tallasService.list(this.paginacion.pagina).subscribe((res: any) => {
      this.cargarDatos(res)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
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


  aceptarEliminar(e: any){
    if(this.id){
      this.showSpinner = true
      this._tallasService.delete(this.id).subscribe((res: any) => {
        this.showSpinner = false
        if(res.tipoMensaje === 'success'){
          this._toastService.showSuccessMessage(res.mensaje)
          this.obtenerDatos()
        }else{
          this._toastService.showErrorMessage(res.mensaje)
        }
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }


  eliminar(id: number){
    this._modalService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar registro','Eliminar');
    this.id = id
  }


  filtrar(texto: string){
    if(this.textoFiltro !== texto)this.paginacion.pagina = 0
    this.textoFiltro = texto
    if(texto !== ''){
      this.aplicarFiltro()
    }else{
      this.obtenerDatos()
    }
  }


  private aplicarFiltro(){
    this.showSpinner = true
    this._tallasService.filter(this.textoFiltro, this.paginacion.pagina).subscribe((res: any) => {
      this.cargarDatos(res)
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }


  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    if(this.textoFiltro !== ''){
      this.aplicarFiltro()
    }else{
      this.obtenerDatos()
    }
  }
}
