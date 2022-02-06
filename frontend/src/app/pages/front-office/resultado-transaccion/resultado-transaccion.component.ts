import { Component, OnInit } from '@angular/core';
import { LoginClientesService } from '../../../services/loginClientes/login-clientes.service';
import { CarritoService } from '../../../services/carrito/carrito.service';
import { Cliente } from '../../../class/cliente/cliente';
import { ItemCarrito } from '../../../class/itemCarrito/item-carrito';
import { ConstantesService } from '../../../services/constantes/constantes.service';
import { SharedService } from '../../../services/shared/shared.service';
import { PreciosService } from '../../../services/precios/precios.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TransbankService } from '../../../services/transbank/transbank.service';
import { ToastService } from '../../../services/toast/toast.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ConfigTiendaService } from '../../../services/configTienda/config-tienda.service';
import { Tienda } from '../../../class/tienda/tienda';
import { MailService } from '../../../services/mail/mail.service';
import { VentasClienteInvitadoService } from '../../../services/ventasClienteInvitado/ventas-cliente-invitado.service';
import { DespachosService } from '../../../services/despachos/despachos.service';
import { Despacho } from '../../../class/despachos/despacho';
import { VentasService } from '../../../services/ventas/ventas.service';
import { VentasClienteTiendaService } from 'src/app/services/ventasClienteTienda/ventas-cliente-tienda.service';
import { DetalleVentaService } from '../../../services/detalleVenta/detalle-venta.service';
import { Precio } from '../../../class/precio/precio';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-resultado-transaccion',
  templateUrl: './resultado-transaccion.component.html',
  styleUrls: ['./resultado-transaccion.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class ResultadoTransaccionComponent implements OnInit {
  titulo: string = 'Resultado de la transacción'
  cliente: Cliente = new Cliente()
  carrito: ItemCarrito[] = []
  total: number = 0
  estadoCompra: string = ''
  msgErrorCompra: string = ''
  folio: string = ''
  tienda: Tienda = new Tienda()
  fechaTransaccion: string = ''



  constructor(
    private _loginClientesService: LoginClientesService,
    private _precioService: PreciosService,
    private _carritoService: CarritoService,
    private _transbankService: TransbankService,
    private _sharedService: SharedService,
    private _toastService: ToastService,
    private _configService: ConfigTiendaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _const: ConstantesService,
    private _mailService: MailService,
    private _ventasClienteTiendaService: VentasClienteTiendaService,
    private _ventasClienteInvitadoService: VentasClienteInvitadoService,
    private _despachosService: DespachosService,
    private _detalleVentasService: DetalleVentaService,
    private _ventasService: VentasService,
  ) { }

  ngOnInit(): void {
    this.obtenerDatosCliente()
    this.obtenerDatosCarrito()
    this.obtenerDatosTransaccion()
    this.obtenerDatosTienda()
  }


  private obtenerDatosTienda(){
    this._configService.get().subscribe((res: any) => {
      this.tienda = res
    },error =>
      console.log('Error datos tienda', error)
     )
  }


  private obtenerDatosTransaccion(){
    let estado = this.activatedRoute.snapshot.paramMap.get('estado')
    let webpayId = this.activatedRoute.snapshot.paramMap.get('webpay_id')
    let ventaId = this.activatedRoute.snapshot.paramMap.get('venta_id')

    if(webpayId && ventaId){
      let wpId: number = parseInt(webpayId)
      let idVenta: number = parseInt(ventaId)
      this._transbankService.find(wpId).subscribe((res: any) => {

        this.folio = '0'.repeat(10 - res.buy_order.length) + res.buy_order
          this.estadoCompra = estado ? estado : 'ERROR: No se ha recibido información.'
          this.fechaTransaccion = res.transaccion_date

          if(estado !== 'AUTHORIZED'){
            this.msgErrorCompra = 'Lo sentimos, no fue posible llevar a cabo tu compra. No se ha realizado ningun cargo a tu tarjeta. Puedes reintenar el pago de tu compra.';
            this._toastService.showErrorMessage(this.msgErrorCompra)
          }else{

            if(this.cliente.id){
              this.registrarClienteTienda(idVenta)
            }else{
              this.registrarClienteInvitado(idVenta)
            }
            this._carritoService.vaciarCarrito()
          }

      }, error => {
        this._sharedService.handlerError(error)
      })
    }else{
      this._toastService.showErrorMessage('No fue posible encontrar los datos de la compra');
      this.router.navigate(['/'])
    }
  }


  private registrarClienteTienda(ventaId: number){
    this._ventasClienteTiendaService.insert(this.cliente.id, ventaId).subscribe((res: any) => {
      this.registrarDatosDespacho(ventaId)
    }, error =>
      this._sharedService.handlerError(error)
    )
  }


  private registrarClienteInvitado(ventaId: number){
    let cliente: any = this.cliente
    cliente.venta_id = ventaId
    this._ventasClienteInvitadoService.insert(cliente).subscribe((res: any) => {
      this.registrarDatosDespacho(ventaId)
    }, error =>
      this._sharedService.handlerError(error)
    )
  }



  private obtenerDatosCliente(){
    let cliente = this._loginClientesService.getClienteLogueado()
    if(cliente){
      this.cliente = cliente
    }
  }

  private obtenerDatosCarrito(){
    let carrito = this._carritoService.getCarrito()
    if(carrito){
      carrito.forEach((i: ItemCarrito) => {
        i.imagen = this._const.storageImages + '/productos/' + i.imagen
        this.total += i.precio_venta
      })
      this.actualizarStock(carrito)
      this.carrito = carrito
    }

    if(carrito.length === 0){
      this.router.navigate(['/'])
    }
  }

  private actualizarStock(carrito: ItemCarrito[]){
    this._detalleVentasService.actualizarStockVendidos(carrito).subscribe((res: any) => {
      if(res.tipoMensaje === 'danger'){
        this._toastService.showErrorMessage(res.mensaje)
      }
    }, error => {
      this._sharedService.handlerError(error)
    })
  }


  formatearPrecio(monto: number){
    return this._precioService.strFormatearPrecio(monto)
  }



  private registrarDatosDespacho(venta_id: number){
    if(this.cliente){
      let despacho: Despacho = new Despacho()

      despacho.venta_id = venta_id,
      despacho.direccion = this.cliente.direccion,
      despacho.region = this.cliente.cod_region,
      despacho.provincia = this.cliente.cod_provincia,
      despacho.comuna = this.cliente.cod_comuna,
      despacho.ciudad = this.cliente.ciudad,
      despacho.casa_num = this.cliente.casa_num,
      despacho.block_num = this.cliente.block_num ? this.cliente.block_num : '',
      despacho.referencia = this.cliente.referencia
      this.carrito.forEach(e => e.precio_neto = e.precio_venta)

      this._despachosService.insert(despacho, this.carrito).subscribe((res: any) => {
        if(res['tipoMensaje'] === 'success'){
          this._toastService.showSuccessMessage(res['mensaje'])
        }else{
          this._toastService.showErrorMessage(res['mensaje'])
        }
      }, error => {
        this._sharedService.handlerError(error);
      } )
    }
  }



  /* GENERANDO LA BOLETA END PDF */

  //Video: https://www.youtube.com/watch?v=lLy4dwU6NsM
  //Código de ejemplo de propiedades de pdfmake : https://bitbucket.org/jcabelloc-itana/itana-demos/src/master/pdfmake/src/app/components/pdfmake-getting-started/pdfmake-getting-started.component.ts
  //Ejemplo de boleta pdf: https://www.c-sharpcorner.com/article/client-side-pdf-generation-in-angular-with-pdfmake/
  generatePDF(action = 'open') {
    let detalleBoleta = this.generarDetallePDF()
    let docDefinition = this.getDocumentDefinition(detalleBoleta)

    if(action==='download'){
      pdfMake.createPdf(<any>docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(<any>docDefinition).print();
    }else{
      pdfMake.createPdf(<any>docDefinition).open();
    }

  }

  private generarDetallePDF(){
    let detalle: any[] = [['Producto', 'Cantidad', {text: 'Precio', alignment: 'right'}]]
    this.carrito.map(p => [
      p.nombre,
      {text:`${p.cantidad}`, alignment: 'center'},
      {text: this._precioService.strFormatearPrecio(p.precio_venta * p.cantidad), alignment: 'right'}
    ]).forEach(i => detalle.push(i))

    detalle.push(['', {text: 'Total', bold: true}, {text: this._precioService.strFormatearPrecio(this.total), alignment: 'right'}])

    return detalle
  }


  getDocumentDefinition(detalleBoleta: any) {
    return {
      content: [
        {text: this.tienda.nombre_tienda, fontSize: 20},
        {text: ' '},
        {
          columns: [
            {
              stack: [
                // first column consists of paragraphs
                this.tienda.direccion,
                this.tienda.email,
                this.tienda.fono_venta,
                this.fechaTransaccion.split('T')[0].split('-').reverse().join('/')
              ],
              fontSize: 12
            },

              [
                // second column consists of paragraphs
                {text: 'Boleta N°', style: ['alignCenter']},
                {text: this.folio,  style: ['alignCenter']},
              ]
          ],

        },

        {text: ' '},
        {text: 'Detalle de la compra'},

        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100],

            body: detalleBoleta
          }
        },
        ' ',
        {
          columns: [
            {
              qr: `${this.tienda.nombre_tienda}`, fit: 50
             }
          ]
        },
        ' ',
        {
          ul: [
            `Tu compra será despachada a nombre de ${this.cliente.nombres} ${this.cliente.apellido1} ${this.cliente.apellido2}`,
            `La compra será enviada a: ${this.cliente.direccion}, N°${this.cliente.casa_num},  ${this.cliente.ciudad} ${this.cliente.block_num ? ',' + this.cliente.block_num : ''}
            ${this.cliente.referencia ? ' (' + this.cliente.referencia + ') ' : ''}`,
          ],
        },
        ' ',
        {
          ol: [
            'La compra podrá ser devuelta en un máximo de 10 días.',
            'La garantía de los productos podrá estar sujeta a los terminos del fabricante y sus condiciones.',
          ],
        }
      ],
      styles:{
        alignCenter:{alignment: 'right', color: 'red', fontSize: 18, bold: true,}
      }
    };
  }

  /* ENVIANDO LA BOLETA POR EMAIL */

  //https://rabineupane.com.np/how-to-send-mail-in-laravel-6-api-with-gmail/
  sendMail(){
    let data: any = {
      carrito: this.carrito,
      cliente: this.cliente,
      tienda: this.tienda,
      total: this.total,
      fecha: this.fechaTransaccion.split('T')[0].split('-').reverse().join('/'),
      folio: this.folio
    }

    this._mailService.sesendMail(data).subscribe((res: any) => {
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage('El comprobante de compra ha sido enviado a tu correo.')
      }else{
        this._toastService.showErrorMessage('Ocurrió un errorb al intentar enviar el correo electrónico.')
      }
    }, error => {
      this._sharedService.handlerError(error)
    })
  }
}
