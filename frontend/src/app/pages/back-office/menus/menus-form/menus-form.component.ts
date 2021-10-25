import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Menu } from '../../../../class/menus/menu';
import { MenusService } from '../../../../services/menus/menus.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../services/toast/toast.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-menus-form',
  templateUrl: './menus-form.component.html',
  styleUrls: ['./menus-form.component.css']
})
export class MenusFormComponent implements OnInit {
  public showSpinner: boolean = false;
  public messageDialog: string = '¿Desea grabar el registro?';
  public mostrarModal: boolean = false;
  public tipoModal: string = 'grabar';
  private menu: Menu = new Menu();
  public form: FormGroup = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl(),
    url: new FormControl(),
    menu_padre_id: new FormControl(),
    posicion: new FormControl(),
    created_at: new FormControl(),
    updated_at: new FormControl(),
    deleted_at: new FormControl(),
  });
  public id: any = null;
  public menusPadre: Menu[] = [];

  constructor(
    private _menusService: MenusService,
    private _toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private _sharedServices: SharedService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this._toastService.clearToast();
    this.getMenusPadres();
    let id: any = this.activatedRoute.snapshot.paramMap.get('id');
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
      id: [this.menu.id,[Validators.min(0)]],
      nombre: [this.menu.nombre,[Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      url: [this.menu.url,[Validators.minLength(3), Validators.maxLength(200)]],
      menu_padre_id: this.menu.menu_padre_id,
      posicion: [this.menu.posicion,[Validators.min(0)]],
      created_at: this.menu.created_at,
      updated_at: this.menu.updated_at,
      deleted_at: this.menu.deleted_at,
    });
  }

  private getMenusPadres(){
    this._menusService.getAll().subscribe(
      (res: any)=>{
        this.menusPadre = res;
        this.menusPadre = this.menusPadre.filter(m  => m.id !== this.id);
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }


  private buscar(){
    this.showSpinner = true;
    this._menusService.find(this.id).subscribe(
      (res: any)=>{
      this.cargarDatos(res);
      this.showSpinner = false;
    },error=>{
      this.showSpinner = !this._sharedServices.handlerError(error)
    })
  }

  private cargarDatos(res: any){
    this.menu = res;
    this.initForm();
  }


  modalGrabar(){
    this.mostrarModal = true;
    this.messageDialog = '¿Desea grabar el registro?';
    this.tipoModal = 'grabar';
  }

  modalEliminar(){
    this.mostrarModal = true;
    this.tipoModal = 'eliminar'
    this.messageDialog = '¿Desea eliminar el registro?';
  }

  aceptarModal(e: any){
    this.mostrarModal = false
    if(this.tipoModal === 'grabar' || this.tipoModal === 'confirmar cambios'){
      if(this.form.invalid){
        this.mostrarModal = !this._sharedServices.handlerError({message: 'Existen datos incompletos o no válidos.'});
      }else{
        this.grabar();
      }
    }else{
      this.eliminar();
    }
  }

  cancelarModal(e: any){
    this.mostrarModal = false;
    if(this.tipoModal === 'confirmar cambios'){
      this.router.navigate(['/admin/menus'])
    }
    this.tipoModal = ''
    this.messageDialog = '';
  }

  cancelar() {
    //if(this.detectarCambios()){
    if(this.form.dirty){
      //Se han detectado cambios sin guardar
      this.messageDialog = 'Existen cambios sin guardar. ¿Desea guardar los cambios?';
      this.mostrarModal = true;
      this.tipoModal = 'confirmar cambios';
    }else{
      this.mostrarModal = false
      //No se han detectado cambios, se redirige al listado de roles
      this.router.navigate(['/admin/menus']);
    }
  }
  /*
  private detectarCambios(){
    if(this.form.dirty ){
      let arrDiferencias = Object.keys(this.form.value).filter(k => this.form.get(k)?.value !== (<any>this.menu)[k]);
      return arrDiferencias.length > 0;
    }else{
      return false
    }
  }
  */

  private grabar(){
    this.cancelarModal(null);
    if(this.id !== null){
      this.actualizar();
    }else{
      this.insertar();
    }
  }

  private insertar(){
    this.showSpinner = true;
    this._menusService.insert(this.form.value).subscribe(
      (res: any)=>{
        if(this._sharedServices.handlerSucces(res, '/admin/menus'))this.mostrarModal = false;
        this.showSpinner = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

  private actualizar(){
    this.showSpinner = true;
    this._menusService.update(this.id, this.form.value).subscribe(
      (res: any)=>{
        if(this._sharedServices.handlerSucces(res, '/admin/menus'))this.mostrarModal = false;
        this.showSpinner = false
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error)
      }
    )
  }

  private eliminar(){
    this.showSpinner = true;
    this._menusService.delete(this.id).subscribe(
      (res: any)=>{
        if(this._sharedServices.handlerSucces(res, '/admin/menus'))this.mostrarModal = false;
      },error=>{
        this.showSpinner = !this._sharedServices.handlerError(error);
      }
    )
  }

}
