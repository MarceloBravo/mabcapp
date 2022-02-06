import { Component, OnInit } from '@angular/core';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';
import { VisitasService } from '../../../services/visitas/visitas.service';

@Component({
  selector: 'app-main-tienda',
  templateUrl: './main-tienda.component.html',
  styleUrls: ['./main-tienda.component.css']
})
export class MainTiendaComponent implements OnInit {
  private sourceScript: string =  '../../../../assets/front-office/js/'

  constructor(
    private _scriptService: ScriptServicesService,
    private _visitasService: VisitasService,
  ) { }

  ngOnInit(): void {
    this.loadScript()
    this.registrarVisita()
  }

  private loadScript(){
    this._scriptService.load([
      `${this.sourceScript}jquery/jquery-2.2.4.min.js`,
      `${this.sourceScript}popper.min.js`,
      `${this.sourceScript}bootstrap.min.js`,
      `${this.sourceScript}plugins.js`,
      `${this.sourceScript}classy-nav.min.js`,
      `${this.sourceScript}active.js`,
    ])
  }

  private registrarVisita(){
    if(!this._visitasService.checkearVisitaEnStorage()){
      this._visitasService.registrarVisita().subscribe((res: any) => {
        if(res.tipoMensaje === 'danger'){
          console.log(res.mensaje)
        }else{
          this._visitasService.registrarVisitaEnStorage()
        }
      }, error => {
        console.log('Error al registrar la visita:', error)
      })
    }
  }
}
