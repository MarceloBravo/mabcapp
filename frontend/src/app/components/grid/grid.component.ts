import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from '../../services/permisos/permisos.service';
import { LoginService } from '../../services/login/login.service';
import { ToastService } from '../../services/toast/toast.service';
import { Rol } from '../../class/rol/rol';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: [
    './grid.component.css',
    '../../../assets/css/app.css',
  ]
})
export class GridComponent implements OnInit {
  @Input() registros: any[] = []
  @Input() cabeceras: Object[] = []
  @Input() columnasVisibles: string[] = []
  @Input() titulo: string = ''
  @Input() urlEditar: string = 'edit';
  @Input() urlNuevo: string = 'nuevo';
  @Output() idEliminar: EventEmitter<number> = new EventEmitter();
  @Output() textoFiltro: EventEmitter<string> = new EventEmitter();
  public mostrarNuevo: boolean = false;
  public mostrarEditar: boolean = false;
  public mostrarEliminar: boolean = false;

  constructor(
    private _permisos: PermisosService,
    private _login: LoginService,
    private router: Router,
    private _toast: ToastService
  ) {
    let roles: Rol[] = this._login.getRolesUsuarioLogueado();
    if(roles){
      let idsRoles = roles.map(r => r.id)
      let url = this.router.url.split('/')[2]
      this.obtenerPermisos(idsRoles, url)
    }else{
      this._toast.showErrorMessage('El usuario no posee datos de ingreso y debe loguearse nuevamente.')
      this.router.navigate(['/'])
    }
  }

  ngOnInit(): void {
  }

  private obtenerPermisos(idsRoles: number[], url: string)
  {
    this._permisos.getRolPermissions(idsRoles, url).subscribe((res: any) => {
      let permisos: boolean[] = [false, false, false]
      res.forEach((p: any) => {
        if(p.crear)permisos[0] = true
        if(p.modificar)permisos[1] = true
        if(p.eliminar)permisos[2] = true
      })
      this.mostrarNuevo = permisos[0]
      this.mostrarEditar = permisos[1]
      this.mostrarEliminar = permisos[2]
      console.log('PERMISOS', idsRoles, res, this.mostrarNuevo, this.mostrarEditar, this.mostrarEliminar)
    },error=> {
      console.log(error)
      this._toast.showErrorMessage('Ocurrió un error al consultar los permisos: ' + error.message)
    })
  }

  eliminar(id: number){
    this.idEliminar.emit(id);
  }

  textoFiltroChange(texto: string){
    this.textoFiltro.emit(texto);
  }

  formatDate(dato: any){
    let parseDate = Date.parse(dato);
    if(isNaN(dato) && !isNaN(parseDate)){
      //Retorna la fecha con formato dd/mm/yyyy
      return dato.toLocaleString().toString().substr(0,10).split('-').reverse().join('/');
    }else{
      //Retorna el dato recibido
      return dato;
    }
  }

  getColNames(obj: object){
    let arrKeyNames = Object.keys(obj);
    if(arrKeyNames.indexOf('id') !== undefined){
      arrKeyNames.splice(arrKeyNames.indexOf('id'),1);
    }
    return arrKeyNames;
  }

}
