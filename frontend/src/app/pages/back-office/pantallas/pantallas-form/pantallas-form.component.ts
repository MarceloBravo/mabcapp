import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Menu } from '../../../../class/menus/menu';
import { MenusService } from '../../../../services/menus/menus.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PantallasService } from '../../../../services/pantallas/pantallas.service';
import { Pantalla } from '../../../../class/pantalla/pantalla';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ModalDialogService } from '../../../../services/modalDialog/modal-dialog.service';

@Component({
  selector: 'app-pantallas-form',
  templateUrl: './pantallas-form.component.html',
  styleUrls: ['./pantallas-form.component.css']
})
export class PantallasFormComponent implements OnInit {
  public showSpinner: boolean = false;
  private accion = '';
  private pantalla: Pantalla = new Pantalla();
  public form: FormGroup = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl(),
    menus_id: new FormControl(),
    permite_crear: new FormControl(),
    permite_modificar: new FormControl(),
    permite_eliminar: new  FormControl(),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl(),
  });
  public menus: Menu[] = [];
  public id: any = null
  private url: string = '/admin/pantallas'

  constructor(
    private _pantallasService: PantallasService,
    private _menusService: MenusService,
    private activatedRoute: ActivatedRoute,
    private _sharedServices: SharedService,
    private _modalDialogService: ModalDialogService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarMenus();
    if(id !== null){
      this.id = parseInt(id);
      this.buscar();
    }else{
      this.initForm();
    }
  }

  ngOnInit(): void {
  }

  private initForm(){
    this.form = this.fb.group({
      id: [this.pantalla.id,[Validators.min(0)]],
      nombre: [this.pantalla.nombre,[Validators.required, Validators.min(3), Validators.max(50)]],
      menus_id: [this.pantalla.menus_id, [Validators.required]],
      permite_crear: [this.pantalla.permite_crear,[Validators.required]],
      permite_modificar: [this.pantalla.permite_modificar,[Validators.required]],
      permite_eliminar: [this.pantalla.permite_eliminar,[Validators.required]],
      created_at: this.pantalla.created_at,
      updated_at: this.pantalla.updated_at,
      deleted_at: this.pantalla.deleted_at,
    })
  }

  private cargarMenus(){
    this.showSpinner = true;
    this._menusService.getAll().subscribe(
      (res: any)=>{
        this.menus = res;
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  private buscar(){
    this.showSpinner = true;
    this._pantallasService.find(this.id).subscribe(
      (res: any)=> {
        if(res['status'] === 'Token is Expired'){
          this.router.navigate(['/']);
        }else{
          this.pantalla = res;
          this.initForm();
          this.showSpinner = false;
        }
      }, error => {
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  modalGrabar(){
    this._modalDialogService.mostrarModalDialog('¿Desea grabar el registro?','Grabar')
    this.accion = 'grabar';
  }

  modalEliminar(){
    this._modalDialogService.mostrarModalDialog('¿Desea eliminar el registro?','Eliminar')
    this.accion = 'eliminar'
  }

  aceptarModal(e: any){
    if(this.accion !== 'eliminar'){
      this.grabar()
    }else{
      this.eliminar();
    }
  }


  cancelarModal(){
    if(this.accion === 'volver'){
      this.router.navigate([this.url])
    }
  }


  private grabar(){
    this.showSpinner = true;
    if(this.id !== null){
      this.actualizar();
    }else{
      this.insertar();
    }
  }

  private insertar(){
    this._pantallasService.insert(this.form.value).subscribe(
      (res: any)=>{
        this._sharedServices.handlerSucces(res, this.url)
        this.showSpinner = false;

      }, error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

  private actualizar(){
    this._pantallasService.update(this.id, this.form.value).subscribe(
      (res: any)=>{
        this._sharedServices.handlerSucces(res, this.url)
        this.showSpinner = false;

      }, error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  private eliminar(){
    this._pantallasService.delete(this.id).subscribe(
      (res: any)=>{
        this._sharedServices.handlerSucces(res, this.url)
        this.showSpinner = false;

      }, error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  cancelar(){
    delete this.pantalla.url
    delete this.pantalla.menu

    if(this.form.dirty){
      this._modalDialogService.mostrarModalDialog('¿Desea grabar los cambios?','Confirmar cambios')
      this.accion = 'volver';
    }else{
      this.router.navigate([this.url]);
    }
  }


}
