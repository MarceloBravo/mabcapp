import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DespachosService } from '../../../../services/despachos/despachos.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { Despacho } from '../../../../class/despachos/despacho';
import { Cliente } from 'src/app/class/cliente/cliente';
import { VentasService } from '../../../../services/ventas/ventas.service';
import { DetalleVentaService } from '../../../../services/detalleVenta/detalle-venta.service';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ItemCarrito } from '../../../../class/itemCarrito/item-carrito';

@Component({
  selector: 'app-despachos-form',
  templateUrl: './despachos-form.component.html',
  styleUrls: ['./despachos-form.component.css']
})
export class DespachosFormComponent implements OnInit {
  showSpinner: boolean = false
  id: number | null = null
  despacho: Despacho = new Despacho()
  cliente: Cliente = new Cliente()
  detalleVenta: ItemCarrito[] = []
  paginacion: Paginacion = new Paginacion()
  private accion: string = 'despachar'

  constructor(
    private activatedRoute: ActivatedRoute,
    private _despachosService: DespachosService,
    private _sharedService: SharedService,
    private _ventasService: VentasService,
    private _detalleVentasService: DetalleVentaService,
    private _modalService: ModalDialogService,
    private _toastService: ToastService,
    private router: Router
  ) { }


  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      this.id = parseInt(id)
      this.buscar()
    }
  }


  private buscar(){
    if(this.id){
      this.showSpinner = true
      this._despachosService.findBySale(this.id).subscribe((res: any) => {
        this.despacho = res
        this.buscarDatosCliente(res.venta_id)
        this.buscarDetalle(res.venta_id)
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }


  private buscarDatosCliente(venta_id: number){
    this.showSpinner = true
    this._ventasService.getCliente(venta_id).subscribe((res: any) => {
      this.cliente = res.cliente
      this.showSpinner = false
    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }


  private buscarDetalle(idVenta: number){
    this.showSpinner = true
    this._detalleVentasService.detalle(idVenta,  this.paginacion.pagina).subscribe((res: any) => {
      this.showSpinner = false
      this.detalleVenta = res.data
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }


  aceptarModal(){
    if(this.accion === 'despachar'){
      this.despacharVenta()
    }else{
      this.anularVenta()
    }
  }

  private despacharVenta(){
    if(this.id){
      this.showSpinner = true
      this._despachosService.enviarDespacho(this.id).subscribe((res: any) => {
        this.showSpinner = false
        if(res.tipoMensaje === 'success'){
          this._sharedService.handlerSucces(res, '/admin/despachos')
        }else{
          this._toastService.showErrorMessage(res.mensaje)
        }
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  private anularVenta(){
    if(this.id){
      this.showSpinner = true
      this._ventasService.delete(this.id).subscribe((res: any) => {
        this.showSpinner = false
        if(res.tipoMensaje === 'success'){
          this._sharedService.handlerSucces(res, '/admin/despachos')
        }else{
          this._toastService.showErrorMessage(res.message)
        }
      }, error =>{
        this.showSpinner = false
        this._sharedService.handlerError(error)
      })
    }
  }

  cancelarModal(){

  }


  cancelar(){
    this.router.navigate(['/admin/despachos'])
  }


  modalAnularPedido(){
    this._modalService.mostrarModalDialog('¿Desea anular el despacho y la venta?','Anular despacho y venta','Anular venta')
    this.accion = 'anular'
  }


  modalDepacharPedido(){
    this._modalService.mostrarModalDialog('¿Desea realizar el despacho?','Despachar pedido','Despachar')
    this.accion = 'despachar'
  }


  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    this.buscar()
  }

}
