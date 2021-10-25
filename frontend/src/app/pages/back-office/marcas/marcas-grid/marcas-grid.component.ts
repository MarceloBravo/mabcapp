import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Marca } from 'src/app/class/marca/marca';
import { Paginacion } from 'src/app/class/paginacion/paginacion';
import { MarcasService } from 'src/app/services/marcas/marcas.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-marcas-grid',
  templateUrl: './marcas-grid.component.html',
  styleUrls: ['./marcas-grid.component.css']
})
export class MarcasGridComponent implements OnInit {public showSpinner: boolean = false;
  public mostrarModal: boolean = false;
  public headers: string[] = ['Nombre','Fecha creación','Fecha actualización'];
  public visibleColumns: string[] = ['nombre','created_at','updated_at'];
  public marcas: Marca[] = [];
  public paginacion: Paginacion = new Paginacion();
  private idEliminar: any = null;

  constructor(
    private _marcasService: MarcasService,
    private _toastService: ToastService,
    private _sharedServices: SharedService,
    private router: Router,
  ) {
    this.obtenerDatos();
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this.showSpinner = true;
    this._marcasService.list(this.paginacion.pagina).subscribe(
      (res: any)=>{
        console.log(res);
        if(res['status'] === 'Token is Expired'){
          this.router.navigate(['/']);
        }else{
          this.cargarDatos(res);
          this.showSpinner = false;
        }
    },error=>{
      this.showSpinner = !this._sharedServices.handlerError(error);
    })
  }

  private cargarDatos(res: any){
    this.marcas = res.data;
    this.paginacion.pagina = res.page;
    this.paginacion.registrosPorPagina = res.rowsPerPage;
    this.paginacion.totRegistros = res.rows;
    this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage);
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }

  cancelarEliminar(e: any){
    this.idEliminar = null;
    this.mostrarModal = false;
  }

  aceptarEliminar(e: any){
    this.showSpinner = true;
    this._marcasService.delete(this.idEliminar).subscribe(
      (res: any)=>{
        this._toastService.showSuccessMessage(res.mensaje, res.tipoMensaje);
        this.obtenerDatos();
        this.mostrarModal = false;
    },error=>{
      this.showSpinner = !this._sharedServices.handlerError(error);
    })

  }

  eliminar(id: number){
    this.mostrarModal = true;
    this.idEliminar = id;
  }

  mostrarPagina(pag: number){
    this.paginacion.pagina = pag;
    this.obtenerDatos();
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
    this._marcasService.filter(texto, this.paginacion.pagina).subscribe(
      (res: any)=>{
        this.cargarDatos(res);
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

}
