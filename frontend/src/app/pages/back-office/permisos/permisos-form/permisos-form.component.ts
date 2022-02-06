import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Permisos } from 'src/app/class/permisos/permisos';
import { Rol } from 'src/app/class/rol/rol';
import { ModalDialogService } from 'src/app/services/modalDialog/modal-dialog.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { PermisosService } from '../../../../services/permisos/permisos.service';
import { RolesService } from '../../../../services/roles/roles.service';
import { ToastService } from '../../../../services/toast/toast.service';
/*
IMPORTANTE: Este mantenedor no es un formulario reactivo sino que un formulario enlazado por lo
cual requiere importar "import { FormsModule } from '@angular/forms';" en el archivo app.module.ts
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';
para poder utilizar [(ngModule)] en los archivos html no enlazados
*/

@Component({
  selector: 'app-permisos-form',
  templateUrl: './permisos-form.component.html',
  styleUrls: ['./permisos-form.component.css']
})
export class PermisosFormComponent implements OnInit {
  public showSpinner: boolean = false;
  public roles: Rol[] = [];

  public id: any = null;
  public permisos: Permisos[] = [];


  constructor(
    private _permisosService: PermisosService,
    private _rolesService: RolesService,
    private _toastService: ToastService,
    private _sharedServices: SharedService,
    private _modalDialogService: ModalDialogService,
    ) {
      this.getRoles();
    }

  ngOnInit(): void {
  }


  private getRoles(){
    this._rolesService.getAll().subscribe(
      (res: any)=>{
        this.roles = res;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }


  buscar(select: HTMLSelectElement){
    this.id = select.value;
    this.showSpinner = true;
    this._permisosService.find(parseInt(select.value)).subscribe(
      (res: any)=>{
        this.permisos = res;
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

  modalGrabar(){
    this._modalDialogService.mostrarModalDialog('¿Desea grabar los permisos?','Grabar')
  }


  aceptarModal(e: any){
    this.showSpinner = true;
    this._permisosService.save(this.id, this.permisos).subscribe(
      (res: any)=>{
        if(res.tipoMensaje === 'success'){
          this._toastService.showSuccessMessage(res.mensaje);
        }else{
          this._toastService.showErrorMessage(res.mensaje);
        }
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

}
