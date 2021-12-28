import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginClientesService } from 'src/app/services/loginClientes/login-clientes.service';
import { Cliente } from '../../../class/cliente/cliente';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Region } from '../../../class/region/region';
import { Provincia } from '../../../class/provincia/provincia';
import { Comuna } from '../../../class/comuna/comuna';
import { RegionesService } from 'src/app/services/regiones/regiones.service';
import { ProvinciasService } from 'src/app/services/provincias/provincias.service';
import { ComunasService } from 'src/app/services/comunas/comunas.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { CarritoService } from '../../../services/carrito/carrito.service';
import { PreciosService } from '../../../services/precios/precios.service';
import { TransbankService } from '../../../services/transbank/transbank.service';
import { Transbank } from '../../../class/transbank/transbank';

@Component({
  selector: 'app-datos-despacho',
  templateUrl: './datos-despacho.component.html',
  styleUrls: ['./datos-despacho.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class DatosDespachoComponent implements OnInit {
  showSpinner: boolean = false
  titulo: string = 'Datos de envío'
  showToast: boolean = false
  cliente: Cliente | null = null
  form: FormGroup = new FormGroup({
    direccion: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    cod_region: new FormControl(null, [Validators.required]),
    cod_provincia: new FormControl(null, [Validators.required]),
    cod_comuna: new FormControl(null, [Validators.required]),
    ciudad: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    casa_num: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    block_num: new FormControl(null, [Validators.maxLength(10)]),
    referencia: new FormControl(null, [Validators.maxLength(255)]),
  })
  regiones: Region[] = []
  provincias: Provincia[] = []
  comunas: Comuna[] = []
  carrito: any[] = []
  subTotal: number = 0
  total: number = 0
  gastosEnvio: number = 0


  constructor(
    private _regionesService: RegionesService,
    private _provinciasService: ProvinciasService,
    private _comunasService: ComunasService,
    private _loginClienteService: LoginClientesService,
    private _carritoService: CarritoService,
    private _sharedService: SharedService,
    private _preciosService: PreciosService,
    private _transbankService: TransbankService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.obtenerDatosCliente()
    this.cargarRegiones()
    this.cargarDatrosCarrito()
  }

  private cargarDatrosCarrito(){
    this.carrito = this._carritoService.getCarrito()
    this.carrito.forEach( i => {
      this.subTotal += i.precio_venta //Precio incluye impuestos
    } )
    this.total = this.subTotal + this.gastosEnvio
  }

  private obtenerDatosCliente(){
    this.cliente = this._loginClienteService.getClienteLogueado()
    if(!this.cliente){
      this.router.navigate(['/identificacion_cliente'])
    }else{
      this.cargarProvincias(this.cliente.cod_region)
      this.cargarComunas(this.cliente.cod_provincia)
      this.form.patchValue(this.cliente)
    }
  }

  private cargarRegiones(){
    this.provincias = []
    this.comunas = []
    this._regionesService.listar().subscribe((res: any) => {
      this.regiones = res
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }

  cargarProvincias(codRegion: string){
    this.comunas = []
    this._provinciasService.listarProvinciasRegion(codRegion).subscribe((res: any) => {
      this.provincias = res
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }

  cargarComunas(codProvincia: string){
    this._comunasService.listarComunasProvincias(codProvincia).subscribe((res: any) => {
      this.comunas = res
    }, error =>{
      this._sharedService.handlerError(error)
    })
  }

  pagar(){
    this.registrarCliente()
    this.iniciarTransaccion()
  }


  private registrarCliente(){

    let cliente = this._loginClienteService.getClienteLogueado()
    if(cliente){
      cliente.direccion = this.form.value.direccion
      cliente.cod_region = this.form.value.cod_region
      cliente.cod_provincia = this.form.value.cod_provincia
      cliente.cod_comuna = this.form.value.cod_comuna
      cliente.ciudad = this.form.value.ciudad
      cliente.casa_num = this.form.value.casa_num
      cliente.block_num = this.form.value.block_num
      cliente.referencia = this.form.value.referencia
      this._loginClienteService.setCredencialesCliente(cliente)
    }
  }

  private createTranssbankObject(): Transbank{
    let tb = new Transbank()
    tb.ammount = this.total
    tb.session_id = `${Math.random() * (10000 - 1000) + 1000}`
    return tb
  }

  //Inicia una transacción en Webpay y recibe un token por parte de éste
  private iniciarTransaccion(){
    this._transbankService.startTransaction(this.createTranssbankObject()).subscribe((res: any) => {
      //console.log('OK',res, res.split('=')[1])
      window.location.href = res
      //this.confirmarTransaccion({token_ws: res.split('=')[1]})
    }, error =>
        console.log('ERROR',error)
    )
  }

    /*
  //Redirecciona a la página de Webpay, enviando el token recibido desde esa web
  private confirmarTransaccion(data: any){
    this._transbankService.confirmTransaction(data).subscribe((res: any) =>
      console.log('Transacción OK', res)
    ,error =>
      console.log(error)
    )
  }
  */


  formatearPrecio(precio: number){
    return this._preciosService.strFormatearPrecio(precio)
  }

}
