import { Component, OnInit } from '@angular/core';
import { Impuesto } from '../../../../class/impuesto/impuesto';
import { Paginacion } from 'src/app/class/paginacion/paginacion';
import { ImpuestosService } from '../../../../services/impuestos/impuestos.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impuestos-grid',
  templateUrl: './impuestos-grid.component.html',
  styleUrls: ['./impuestos-grid.component.css']
})
export class ImpuestosGridComponent implements OnInit {
  public showSpinner: boolean = false;
  public mostrarModal: boolean = false;
  public data: Impuesto[] = [];
  public paginacion: Paginacion = new Paginacion();
  private textoFiltro: string = '';
  private idDelete: number | null = null

  constructor(
    private _impuestosService: ImpuestosService,
    private _sharedService: SharedService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.obtenerDatos();
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._impuestosService.list(this.paginacion.pagina).subscribe((res: any) => {
      this.cargarDatos(res);
      this.showSpinner = false;
    }, error => {
      this._sharedService.handlerError(error)
      this.showSpinner = false;
    } )
  }


  filtrar(texto: any){
    if(texto){
      this.showSpinner = true;
      this._impuestosService.filter(texto, 0).subscribe((res: any) => {
        this.cargarDatos(res);
        this.showSpinner = false;
      }, error =>{
        this.showSpinner = false;
        this._sharedService.handlerError(error);
      })
    }else{
     this.obtenerDatos() 
    }
  }


  private cargarDatos(res: any){
    if(res['status'] === 'Token is Expired'){
      this.router.navigate(['/']);
    }else{
      this.data = res.data;
      this.paginacion.pagina = res.page;
      this.paginacion.registrosPorPagina = res.rowsPerPage;
      this.paginacion.totRegistros = res.rows;
      this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage);
      this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
    }
  }


  eliminar(id: any){
    this.idDelete = id;
    this.mostrarModal = true;
  }


  cancelarEliminar(e: any){
    this.idDelete = null
  }


  aceptarEliminar(e: any){
    if(this.idDelete === null)return
    this.showSpinner = true;
    this._impuestosService.delete(this.idDelete).subscribe((res: any) => {
      this.obtenerDatos();
    }, error => {
      this._sharedService.handlerError(error);
      this.showSpinner=false;
    })
  }


  mostrarPagina(pag: any){
    this.paginacion.pagina = pag;
    if(this.textoFiltro !== ''){
      this.obtenerDatos();
    }else{
      this.filtrar(this.textoFiltro)
    }
  }
}
