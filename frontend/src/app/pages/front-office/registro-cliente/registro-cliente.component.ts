import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Region } from '../../../class/region/region';
import { Provincia } from '../../../class/provincia/provincia';
import { Comuna } from '../../../class/comuna/comuna';
import { RegionesService } from '../../../services/regiones/regiones.service';
import { SharedService } from '../../../services/shared/shared.service';
import { ProvinciasService } from '../../../services/provincias/provincias.service';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { ClientesService } from '../../../services/clientes/clientes.service';
import { ModalDialogService } from '../../../services/modalDialog/modal-dialog.service';
import { ToastService } from '../../../services/toast/toast.service';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { LoginClientesService } from 'src/app/services/loginClientes/login-clientes.service';
import { timeStamp } from 'console';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class RegistroClienteComponent implements OnInit {
  idCli: number | null = null
  titulo: string = 'Registro de cliente'
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    rut: new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(13)]),
    nombres: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    apellido1: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    apellido2: new FormControl(null, [Validators.minLength(2), Validators.maxLength(50)]),
    fono: new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(200)]),
    password: new FormControl(null, [Validators.minLength(6), Validators.maxLength(20)]),
    confirm_password: new FormControl(null, [Validators.minLength(6), Validators.maxLength(20)]),
    direccion: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    cod_region: new FormControl(null, [Validators.required]),
    cod_provincia: new FormControl(null, [Validators.required]),
    cod_comuna: new FormControl(null, [Validators.required]),
    ciudad: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    casa_num: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    block_num: new FormControl(null, [Validators.maxLength(10)]),
    referencia: new FormControl(null, [Validators.minLength(5), Validators.maxLength(255)]),
  },
  //Validaciones Asincronas
  {
    validators: [
      CustomValidators.confirmPassword('password','confirm_password'),
      CustomValidators.isRequiredIf('id','password'),
    ],
  })
  regiones: Region[] = []
  provincias: Provincia[] = []
  comunas: Comuna[] = []
  showSpinner: boolean = false


  constructor(
    private _regionesService: RegionesService,
    private _provinciasService: ProvinciasService,
    private _comunasService: ComunasService,
    private _sharedService: SharedService,
    private _clientesService: ClientesService,
    private _modalService: ModalDialogService,
    private _toastService: ToastService,
    private _loginClienteService: LoginClientesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarRegiones()
    this.obtenerDatosCliente()
  }

  private obtenerDatosCliente(){
    let cliente = this._loginClienteService.getClienteLogueado()
    if(cliente){
      this.idCli = cliente.id
      this.buscarClientePorId()
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

  private buscarClientePorId(){
    if(this.idCli){
      this.showSpinner = true
      this._clientesService.find(this.idCli).subscribe((res: any) => {
        if(Object.keys(res).length > 0){
          this.cargarProvincias(res['cod_region'])
          this.cargarComunas(res['cod_provincia'])
        }
        this.form.patchValue(res)
        this.showSpinner = false
      }, error => {
        this.showSpinner = false
        this._sharedService.handlerError(error)
      } )
    }
  }


  buscarClientePorRut(rut: string){
    this.showSpinner = true
    this._clientesService.findByRut(rut).subscribe((res: any) => {
      if(Object.keys(res).length > 0){
        this.cargarProvincias(res['cod_region'])
        this.cargarComunas(res['cod_provincia'])
      }
      this.form.patchValue(res)
      this.showSpinner = false
    }, error => {
      this.showSpinner = false
      this._sharedService.handlerError(error)
    } )
  }


  registrarCliente(){
    let pwd = this.form.value.password ? this.form.value.password : ''
    let confirmPwd = this.form.value.confirm_password ? this.form.value.confirm_password : ''
    if(pwd === confirmPwd){
      this._modalService.mostrarModalDialog('¿Desea registrar sus datos?','Registro de cliente','Registrarme')
    }else{
      this._toastService.showErrorMessage('Existen datos incompletos o no válidos!','Error de datos')
    }
  }

  aceptarModal(){
    if(this.form.value.id){
      this.actualizar()
    }else{
      this.insertar()
    }

  }

  private insertar(){
    this.showSpinner = true
    this._clientesService.insert(this.form.value).subscribe((res: any) => {
      this.showSpinner = false
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.router.navigate(['/login_cliente'])
      }else{
        this._toastService.showErrorMessage(res['mensaje'])
      }

    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    } )
  }

  private actualizar(){
    this.showSpinner = true
    this._clientesService.update(this.form.value).subscribe((res: any) => {
      this.showSpinner = false
      if(res['tipoMensaje'] === 'success'){
        this._toastService.showSuccessMessage(res['mensaje'])
        this.router.navigate(['/login_cliente'])
      }else{
        this._toastService.showErrorMessage(res['mensaje'])
      }

    }, error =>{
      this.showSpinner = false
      this._sharedService.handlerError(error)
    } )
  }

  cancelarModal(){

  }
}
