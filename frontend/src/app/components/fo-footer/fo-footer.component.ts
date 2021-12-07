import { Component, OnInit } from '@angular/core';
import { Tienda } from 'src/app/class/tienda/tienda';
import { ConfigTiendaService } from 'src/app/services/configTienda/config-tienda.service';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-fo-footer',
  templateUrl: './fo-footer.component.html',
  styleUrls: ['./fo-footer.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class FoFooterComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'
  public datosTienda: Tienda = new Tienda()

  constructor(
    private _configTiendaService: ConfigTiendaService,
    private _sharedService: SharedService,
  ) {
    this.obtenerDatos()
  }

  ngOnInit(): void {
  }

  private obtenerDatos(){
    this._configTiendaService.get().subscribe((res: any) =>{
      this.datosTienda = res
    }, error => {
      this._sharedService.handlerError(error)
    })
  }

}
