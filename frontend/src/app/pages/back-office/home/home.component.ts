import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';
import { CuadroMandoService } from '../../../services/cuadroMando/cuadro-mando.service';
import { SharedService } from '../../../services/shared/shared.service';
import { PreciosService } from '../../../services/precios/precios.service';
import { VisitasService } from '../../../services/visitas/visitas.service';
import { ConstantesService } from '../../../services/constantes/constantes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    '../../../../assets/css/googleapi.css',
    //'../../../../assets/css/bootstrap/css/bootstrap.min.css',
    '../../../../assets/icon/themify-icons/themify-icons.css',
    '../../../../assets/icon/icofont/css/icofont.css',
    '../../../../assets/css/style.css',
    '../../../../assets/css/jquery.mCustomScrollbar.css',
  ],
  encapsulation: ViewEncapsulation.None //Permite que la etiqueta del componente de angular no sea considerada en el dom
})
export class HomeComponent implements OnInit {
  despachosPendientes: number = 0
  ventasUltimoMes: string = '$ 0'
  ventasUltimoAnio: string = '$ 0'
  tipoCliente: {cliente_tienda: number, cliente_invitado: number} = {cliente_tienda: 0, cliente_invitado:0}
  fechaDespacho: any
  ciudad: string = ''
  visitasMes: number = 0
  visitasAnio: number = 0
  anuladasMes: number = 0
  anuladasAnio: number = 0
  prodMasVendidos: {producto: string, cantidad: number, imagen: string}[] = []
  sourceImage: string = ''
  detPendientes: {venta_id: number, fecha_venta: string, ciudad: string, cantidad: number, producto: {producto: string, imagen: string}[], despacho_id: number}[] = []
  //ventasPorMes: {cantidad: number, mes: number}[] = []
  public AmCharts: any
  //public chart: any

  constructor(
    private _scriptService: ScriptServicesService,
    private _cuadroMandoService: CuadroMandoService,
    private _sharedServcices: SharedService,
    private _precioService: PreciosService,
    private _visitasService: VisitasService,
    private _const: ConstantesService,
    private router: Router
  ) {
    this.loadScript()
  }

  ngOnInit(): void {
    this.sourceImage = this._const.storageImages
    this.pendientes()
    this.montoVentasUltimoMes()
    this.montoVentasUltimoAnio()
    this.getTipoCliente()
    this.getUltimoEnvio()
    this.getVisitas()
    this.anuladasUltimoMes()
    this.anuladasUltimoAnio()
    this.masVendidos()
    this.detalleDespachosPendientes()
  }

  private loadScript(){
    this._scriptService.load([
      '../../../../assets/js/jquery/jquery.min.js',
      '../../../../assets/js/jquery-ui/jquery-ui.min.js',
      '../../../../assets/js/popper.js/popper.min.js',
      '../../../../assets/js/bootstrap/js/bootstrap.min.js',
      '../../../../assets/js/jquery-slimscroll/jquery.slimscroll.js',
      '../../../../assets/js/modernizr/modernizr.js',
      '../../../../assets/pages/widget/amchart/amcharts.min.js',
      '../../../../assets/pages/widget/amchart/serial.min.js',
      '../../../../assets/pages/todo/todo.js',
      //'../../../../assets/pages/dashboard/custom-dashboard.js',
      //'../../../../assets/js/script.js',
      '../../../../assets/js/SmoothScroll.js',
      '../../../../assets/js/pcoded.min.js',
      //'../../../../assets/js/demo-12.js',
      '../../../../assets/js/jquery.mCustomScrollbar.concat.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.2/Chart.min.js'
    ]);
  }

  private pendientes()
  {
    this._cuadroMandoService.getDespachosPendientes().subscribe((res: any) => {
      this.despachosPendientes = res.cantidad
    }, error => {
      this._sharedServcices.handlerError(error)
    })
  }

  private montoVentasUltimoMes(){
    this._cuadroMandoService.getVentasUltimoMes().subscribe((res: any) => {
      this.ventasUltimoMes = this._precioService.strFormatearPrecio(parseInt(res.total))
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  private montoVentasUltimoAnio(){
    this._cuadroMandoService.getVentasUltimoMes().subscribe((res: any) => {
      this.ventasUltimoAnio = this._precioService.strFormatearPrecio(parseInt(res.total))
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  private getTipoCliente(){
    this._cuadroMandoService.getTipoClienteVenta().subscribe((res: any) => {
      this.tipoCliente = res
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  private getUltimoEnvio(){
    this._cuadroMandoService.getUltimoEnvio().subscribe((res: any) => {
      this.fechaDespacho = this._sharedServcices.formatDateAndTime(res.fecha_despacho)
      this.ciudad = res.ciudad
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }


  private anuladasUltimoMes()
  {
    this._cuadroMandoService.getVentasAnuladasUltimoMes().subscribe((res: any) => {
      this.anuladasMes = res.rechazadas
    }, error =>{
      this._sharedServcices.handlerError(error)
    })

  }

  private anuladasUltimoAnio()
  {
    this._cuadroMandoService.getVentasAnuladasUltimoAnio().subscribe((res: any) => {
      this.anuladasAnio = res.rechazadas
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  private getVisitas(){
    this._visitasService.get().subscribe((res: any) => {
      this.visitasMes = res.visitas_mes
      this.visitasAnio = res.visitas_anio
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  private masVendidos(){
    this._cuadroMandoService.getMasVendidos().subscribe((res: any) => {
      this.prodMasVendidos = res
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  private detalleDespachosPendientes(){
    this._cuadroMandoService.detalleDespachosPendientes().subscribe((res: any) => {
      this.detPendientes = res
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  getUnidadesVendidasMeses(){
    this._cuadroMandoService.getUnidadesVendidasMeses().subscribe((res: any) => {
      this.makeChart(res)
    }, error =>{
      this._sharedServcices.handlerError(error)
    })
  }

  goToShipping(){
    this.router.navigate(['/admin/despachos'])
  }

  formatearFecha(strFecha: string){
    return this._sharedServcices.formatDate(strFecha)
  }

  showDetailShipping(id: number){
    this.router.navigate(['/admin/despachos/edit/' + id])
  }

  private makeChart(data: {cantidad: number, mes: number}[]){
    let datos: { year: any; value: number; }[] = []
    data.forEach(e => datos.push({"year": this._const.meses[e.mes], "value": e.cantidad}))
  }
}
