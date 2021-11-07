import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/class/Categoria/categoria';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Paginacion } from '../../../../class/paginacion/paginacion';
import { Router } from '@angular/router';
import { ModalDialogService } from 'src/app/services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-categorias-grid',
  templateUrl: './categorias-grid.component.html',
  styleUrls: ['./categorias-grid.component.css']
})
export class CategoriasGridComponent implements OnInit {
  public showSpinner: boolean = false;
  public data: Categoria[] = [];
  public paginacion: Paginacion = new Paginacion();
  private textoFiltro: string = '';
  private idDelete: number | null = null;

  constructor(
    private _categoriasServioce: CategoriasService,
    private _sharedServices: SharedService,
    private _modalDialogService: ModalDialogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  private obtenerDatos(){
    this.showSpinner = true
    this._categoriasServioce.list(this.paginacion.pagina).subscribe((res: any) => {
      if(res['status'] === 'Token is Expired'){
        this.router.navigate(['/']);
      }else{
        this.cargarDatos(res);
      }
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._sharedServices.handlerError(error);
    })
  }


  private cargarDatos(res: any){
    this.data = res.data;
    this.paginacion.pagina = res.page;
    this.paginacion.registrosPorPagina = res.rowsPerPage;
    this.paginacion.totRegistros = res.rows;
    this.paginacion.totPaginas = Math.ceil(res.rows / res.rowsPerPage);
    this.paginacion.arrPaginas = Array.from({length: this.paginacion.totPaginas},(k ,v)=> v + 1);
  }


  filtrar(texto: string){
    this.textoFiltro = texto
    this.paginacion.pagina = 0;
    if(texto.length > 0){
      this.aplicarFiltro()
    }else{
      this.obtenerDatos();
    }
  }

  private aplicarFiltro(){
    this.showSpinner = true
    if(this.textoFiltro.length > 0){
      this._categoriasServioce.filter(this.textoFiltro, this.paginacion.pagina).subscribe((res: any) => {
        this.showSpinner = false
        this.cargarDatos(res)
      }, error => {
        this.showSpinner = !this._sharedServices.handlerError(error);
      })
    }
  }


  eliminar(id: any){
    this.idDelete = id
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar')
  }


  cancelarEliminar(e: boolean){
    this.idDelete = -1
  }


  aceptarEliminar(res: boolean){
    if(this.idDelete){
      this.showSpinner = true
      this._categoriasServioce.delete(this.idDelete).subscribe((res: any) => {
        this.obtenerDatos();
      }, error => {
        this.showSpinner = !this._sharedServices.handlerError(error);
      })
    }
  }


  mostrarPagina(pag: number){
    if(this.textoFiltro.length > 0){
      this.filtrar(this.textoFiltro);
    }else{
      this.obtenerDatos();
    }
  }
}
