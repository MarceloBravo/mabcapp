import { Component, OnInit } from '@angular/core';
import { Despacho } from '../../../../class/despachos/despacho';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { DespachosService } from '../../../../services/despachos/despachos.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { VentasService } from '../../../../services/ventas/ventas.service';

@Component({
  selector: 'app-despachos-grid',
  templateUrl: './despachos-grid.component.html',
  styleUrls: ['./despachos-grid.component.css']
})
export class DespachosGridComponent implements OnInit {
  paginacion: Paginacion = new Paginacion()
  showSpinner: boolean = false
  data: any[] = []
  private textoFiltro: string = ''
  private idEliminar: number | null = null

  constructor(
    private _despachosService: DespachosService,
    private _sharedService: SharedService,
    private _modalService: ModalDialogService,
    private _toastService: ToastService,
    private _ventasService: VentasService,
  ) { }

  ngOnInit(): void {
    //this.obtenerDespachos()
    this.obtenerVentas()
  }

  private obtenerVentas(){
    this._ventasService.list(this.paginacion.pagina).subscribe((res: any) => {
      //this.data = res.data
      this.cargarDatos(res)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    } )
  }


  eliminar(id: number){
    this._modalService.mostrarModalDialog('¿Desea eliminar la venta?','Anular venta','Anular');
    this.idEliminar = id
  }


  aceptarEliminar(){
    if(this.idEliminar){
      this.showSpinner = true
      this._ventasService.delete(this.idEliminar).subscribe((res: any) => {
        this.showSpinner = false
        if(res['tipoMensaje'] === 'success'){
          this._toastService.showSuccessMessage(res['mensaje'])
          this.obtenerVentas()
        }else{
          this._toastService.showErrorMessage(res['mensaje'])
        }
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  filtrar(texto: string){
    if(texto !== this.textoFiltro)this.paginacion.pagina = 0
    this.textoFiltro = texto
    if(texto.length > 0){
      this.aplicarFiltro()
    }else{
      //this.obtenerDespachos()
      this.obtenerVentas()
    }
  }

  private aplicarFiltro(){
    this.showSpinner = true
    this._despachosService.filter(this.textoFiltro, this.paginacion.pagina).subscribe((res: any) => {
      this.cargarDatos(res)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    if(this.textoFiltro.length > 0){
      this.aplicarFiltro()
    }else{
      //this.obtenerDespachos()
      this.obtenerVentas()
    }
  }

  private cargarDatos(res: any){
    this.data = res.data
    this.paginacion.pagina = res.page
    this.paginacion.totRegistros = res.tows
    this.paginacion.registrosPorPagina = res.rowsPerPage
    this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage)
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }
}
