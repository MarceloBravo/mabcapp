import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { User } from '../../../../class/User/user';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { Router } from '@angular/router';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-usuarios-grid',
  templateUrl: './usuarios-grid.component.html',
  styleUrls: [
    './usuarios-grid.component.css',
    '../../../../../assets/css/app.css',
  ]
})
export class UsuariosGridComponent implements OnInit {
  public showSpinner: boolean = false;
  public paginacion: Paginacion = new Paginacion();
  public usuarios: User[] = [];
  public titulos: string[] = ['Nombre','A. Paterno','A. Materno','Email','Dirección','Fecha Creación','Ult. Actualización']
  public campos: string[] = ['name','a_paterno','a_materno','email','direccion','created_at','updated_at']
  private idDelete: number = 0;



  constructor(
    private _usuariosServices: UsuariosService,
    private _toastService: ToastService,
    private _shared: SharedService,
    private _modalDialogService: ModalDialogService,
    private router: Router,
  ) {
    this.obtenerDatos();
  }

  ngOnInit(): void {
    this._toastService.showPendingToast();
  }

  private obtenerDatos(){
    this.showSpinner = true;
    this._usuariosServices.list(this.paginacion.pagina).subscribe((res: any)=>{
      console.log('Success',res);
      if(res['status'] === 'Token is Expired'){
        this.router.navigate(['/']);
      }else{
        this.cargarDatos(res);
        this.showSpinner = false;
      }
    },error => {
      this.showSpinner = !this._shared.handlerError(error);
    })
  }

  private cargarDatos(res: any){
    this.usuarios = res.data;
    this.paginacion.registrosPorPagina = res.rowsPerPage;
    this.paginacion.totPaginas = res.rows;
    this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage);
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }


  eliminar(id: number){
    this.idDelete = id;
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar')
  }

  aceptarEliminar(e: any){
    this.showSpinner = true
    this._usuariosServices.delete(this.idDelete).subscribe(
      (res: any)=>{
        if(res['tipoMensaje'] === "success"){
          this._toastService.showSuccessMessage(res['mensaje']);
          this.obtenerDatos();
        }
        this.showSpinner = false
      },error=>{
        this.showSpinner = !this._shared.handlerError(error);
      }
    );
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag
    this.obtenerDatos()
  }

  filtrar(texto: string){
    this.paginacion.pagina = 0;
    if(texto  === ""){
      this.obtenerDatos();
    }else{
      this.filtrarDatos(texto);
    }
  }

  private filtrarDatos(texto: string){
    this.showSpinner = true;
    this._usuariosServices.filter(texto, this.paginacion.pagina).subscribe(
      (res: any)=>{
        this.cargarDatos(res);
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._shared.handlerError(error);
      }
    )
  }

}
