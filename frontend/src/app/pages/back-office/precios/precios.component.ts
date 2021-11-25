import { Component, OnInit } from '@angular/core';
import { Paginacion } from '../../../class/paginacion/paginacion';
import { PreciosService } from '../../../services/precios/precios.service';
import { SharedService } from '../../../services/shared/shared.service';
import { ModalDialogService } from '../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.css']
})
export class PreciosComponent implements OnInit {
  public showSpinner: boolean = false
  public titulo: string = 'Precios'
  public data: {
    id: number,
    producto: string,
    precio_venta_normal: number,
    precio: number,
    descuento: number,
    descuento_maximo: number,
    fecha_desde: string,
    fecha_hasta: string,
    stock: number,
    marca: string,
    unidad: string,
    categoría: string,
    sub_categoría: string,
    created_at: string,
    updated_at: string
  }[] = []
  public paginacion: Paginacion = new Paginacion()
  private idEliminar: number | null = null
  private textoFiltro: string = ''
  private loadedData: string = ''
  private deletedIds: number[] =[]
  public editando: boolean = false
  private accion: string | null = null
  public msgError: string = ''


  constructor(
    private _preciosService: PreciosService,
    private _sharedService: SharedService,
    private _modalDialogServices: ModalDialogService,
    private _toastService: ToastService,
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._preciosService.list(this.paginacion.pagina).subscribe((res: any) => {
      this.cargarDatos(res)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    })
  }


  private cargarDatos(res: any){
    this.data =  res.data
    this.loadedData = JSON.stringify(res.data)
    this.paginacion.pagina = res.page
    this.paginacion.totRegistros = res.rows
    this.paginacion.registrosPorPagina = res.rowsPerPage
    this.paginacion.totPaginas = Math.ceil( res.rows / res.rowsPerPage)
    this.paginacion.arrPaginas = this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }


  filtrar(texto: string){
    if(this.textoFiltro !== texto)this.paginacion.pagina = 0

    this.textoFiltro = texto
    if(texto.length > 0){

        this.showSpinner = true
        this._preciosService.filter(this.textoFiltro, this.paginacion.pagina).subscribe((res: any) => {
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


  duplicarFila(idFila: number){
    let newRow = JSON.parse(JSON.stringify(this.data[idFila]))
    newRow.id = Math.random() * (0 + 1000) - 1000
    this.data.splice(idFila,0,newRow)
    this.editando = true
  }


  cancelarEdicion(){
    this._modalDialogServices.mostrarModalDialog('Existen cambios sin guardar. ¿Desea grabar el listado?','Grabar cambios','Finalizar edición')
    this.accion = 'cancelar'
  }

  grabar(){
    this._modalDialogServices.mostrarModalDialog('¿Desea grabar el listado?','Grabar precio', 'Grabar')
    this.accion = 'grabar'
  }


  onChangeColumn(e: any){
    this.editando = true
    //{fila: 2, columna: 'precio_venta_normal', nuevo_valor: '22000', valor_anterior: 33000}
    switch(e['columna']){
      case 'precio':  //Precio vent
        let descuento = this.calcularPorcentajeDescuento(e['nuevo_valor'], this.data[e['fila']]['precio_venta_normal'])
        if(descuento > this.data[e['fila']]['descuento_maximo']){
          descuento = this.data[e['fila']]['descuento_maximo']
          this.data[e['fila']]['precio'] = this.calcularPrecio(descuento, this.data[e['fila']]['precio_venta_normal']);
          (<HTMLInputElement>document.getElementById(`${e['fila']}-precio`)).value = `${this.data[e['fila']]['precio']}`
        }
        this.data[e['fila']]['descuento'] =  Math.round(descuento);

        break;

      case 'descuento': //Porcentaje de descuento aplicado
        if(e['nuevo_valor'] > this.data[e['fila']]['descuento_maximo']){
          e['nuevo_valor'] = this.data[e['fila']]['descuento_maximo']
          this.data[e['fila']]['descuento'] = this.data[e['fila']]['descuento_maximo'];
          (<HTMLInputElement>document.getElementById(`${e['fila']}-descuento`)).value = e['nuevo_valor']
        }
        this.data[e['fila']]['precio'] = Math.round(this.calcularPrecio(e['nuevo_valor'], this.data[e['fila']]['precio_venta_normal']))
        break;

      case 'fecha_desde':
        var fechaDesde = new Date(e['nuevo_valor'])
        var fechaHasta = new Date(this.data[e['fila']]['fecha_hasta'])
        if(fechaDesde > fechaHasta){
          fechaDesde = fechaHasta;
          (<HTMLInputElement>document.getElementById(`${e['fila']}-fecha_desde`)).value = fechaDesde.toJSON().split('T')[0]
        }
        this.data[e['fila']]['fecha_desde'] = fechaDesde.toJSON().split('T')[0]
        break;

      case 'fecha_hasta':
        var fechaHasta = new Date(e['nuevo_valor'])
        var fechaDesde = new Date(this.data[e['fila']]['fecha_desde'])
        if(fechaDesde > fechaHasta){
          fechaDesde = fechaHasta;
          this.data[e['fila']]['fecha_desde'] = fechaDesde.toJSON().split('T')[0];
          (<HTMLInputElement>document.getElementById(`${e['fila']}-fecha_desde`)).value = fechaDesde.toJSON().split('T')[0]
        }
        this.data[e['fila']]['fecha_hasta'] = fechaHasta.toJSON().split('T')[0]
        break;
    }
    //let topeFechas: {fila1: number, fila2: number}[] = this.validaTopeFechas()
    this.resaltarTopeFechas(this.validaTopeFechas())
  }


  private validaTopeFechas(){
    let topeFechas: {fila1: number, fila2: number}[] = []

    this.data.forEach((i1, key1) =>{
      (<HTMLTableRowElement>document.getElementById(`${key1}`)).className = ''
      this.data.forEach((i2, key2) => {
        if(i1.producto === i2.producto && key1 !== key2 &&
          ((i2.fecha_desde >= i1.fecha_desde && i2.fecha_desde <= i1.fecha_hasta) ||
          (i2.fecha_hasta >= i1.fecha_desde && i2.fecha_hasta <= i1.fecha_hasta))){
            topeFechas.push({fila1: key1, fila2: key2})
          }
      })
    })

    this.msgError = topeFechas ? 'ERROR: Existen topes de fechas...' : ''

    return topeFechas
  }

  private resaltarTopeFechas(topeFechas: {fila1: number, fila2: number}[]){
    topeFechas.forEach(i => {
      (<HTMLTableRowElement>document.getElementById(`${i.fila1}`)).className = `rowError`;
      (<HTMLTableRowElement>document.getElementById(`${i.fila2}`)).className = 'rowError';
    })
  }


  private calcularPrecio(porcentaje: number, precioNormal: number){
    return precioNormal - (porcentaje * precioNormal / 100)
  }

  private calcularPorcentajeDescuento(nuevoPrecio: number, precioNormal: number){
    return 100 - (nuevoPrecio * 100 / precioNormal)
  }

  eliminar(id: number){
    this.idEliminar = id
    this._modalDialogServices.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar precio','Eliminar')
    this.accion = 'eliminar'
  }

  cancelarDialogo(e: any){
    if(this.accion === 'cancelar'){
      //Recarga el listado de precios sin grabar los datos
        this.editando = false
        this.obtenerDatos()
    }else if(this.accion === 'eliminar'){
      //Resetea el código del registro a eliminar
      this.idEliminar = null
    }
    this.msgError = ''
    this.accion = null
  }


  aceptarDialogo(e: any){
    if(this.accion === 'grabar' || this.accion === 'cancelar'){ //Si se seleccionó

      this.editando = false
      this.showSpinner = true
      if(JSON.stringify(this.data) !== this.loadedData){
        this._preciosService.save({data: this.data, deleted: this.deletedIds}).subscribe((res: any) => {
          if(res['tipomensaje'] === 'success'){
            this._toastService.showSuccessMessage(res['mensaje'])
          }else{
            this._toastService.showErrorMessage(res['mensaje'])
          }
          this.showSpinner = false

        }, error => {
          this.showSpinner = false
          this._sharedService.handlerError(error)
        })
      }

    }else if(this.accion === 'eliminar' && this.idEliminar){
        this.deletedIds.push(this.idEliminar)
        this.data.forEach((d, i) => {if(d['id'] === this.idEliminar){this.data.splice(i, 1)}})

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
