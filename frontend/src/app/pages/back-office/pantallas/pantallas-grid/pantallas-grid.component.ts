import { Component, OnInit } from '@angular/core';
import { Pantalla } from 'src/app/class/pantalla/pantalla';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { PantallasService } from '../../../../services/pantallas/pantallas.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-pantallas-grid',
  templateUrl: './pantallas-grid.component.html',
  styleUrls: ['./pantallas-grid.component.css']
})
export class PantallasGridComponent implements OnInit {
  public showSpinner: boolean = false;
  public gridHeaders: string[] = ['Nombre','Menú','Url','Fecha creación','Fecha actualización'];
  public visibleColumns: string[] = ['nombre','menu','url','created_at','updated_at'];
  public data: Pantalla[] = [];
  public paginacion: Paginacion  = new Paginacion();


  constructor(
    private _pantallasServices: PantallasService,
    private _toast: ToastService,
    private _sharedServices: SharedService,
    private _modalDialogService: ModalDialogService,
    private router: Router,
  ) {
    this.obtenerDatos();
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true;
    this._pantallasServices.list(this.paginacion.pagina).subscribe(
      (res: any)=>{
        if(res['status'] === 'Token is Expired'){
          this.router.navigate(['/']);
        }else{
          this.cargarDatos(res);
        }
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  private cargarDatos(res: any){
    this.data = res.data;
    this.paginacion.pagina = res.page;
    this.paginacion.registrosPorPagina = res.rowsPerPage;
    this.paginacion.totRegistros = res.rows;
    this.paginacion.totPaginas = Math.ceil( res.rows / res.rowsPerPage );
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
    this.showSpinner = false;
  }


  cancelarEliminar(e: any){
  }

  aceptarEliminar(e: any){
    this.showSpinner = true;
    this._pantallasServices.delete(e).subscribe(
      (res: any) => {
        if(res.tipoMensaje === 'success'){
          this._toast.showSuccessMessage(res.mensaje)
        }else{
          this._toast.showErrorMessage(res.mensaje);
        }
        this.obtenerDatos();
      },error => {
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  eliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar')
  }

  filtrar(texto: string){
    this.paginacion.pagina = 0;
    this._pantallasServices.filter(texto, this.paginacion.pagina).subscribe(
      (res: any)=> {
        this.cargarDatos(res);
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  mostrarPagina(pagina: number){
    this.paginacion.pagina = pagina;
    this.obtenerDatos();
  }

}
