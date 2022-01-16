import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PersonalizarService } from 'src/app/services/personalizar/personalizar.service';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [
    './main.component.css',
    '../../../../assets/css/app.css'
  ],
  encapsulation: ViewEncapsulation.None //Permite que la etiqueta del componente de angular no sea considerada en el dom]
})
export class MainComponent implements OnInit {
  public mostrarMenu: boolean = true

  constructor(
    private _configService: PersonalizarService,
    private title: Title
  ) {
    this.getTituloApp()
  }

  ngOnInit(): void {
    this._configService.changeNombreApp$.subscribe((res: string) => {
      this.title.setTitle(res);
    }, (error: any) => {
      console.log(error)
      this.title.setTitle('...');
    })
  }

  private getTituloApp(){
    this._configService.getConfig().subscribe((res: any) => {
      this.title.setTitle(res[0].nombre_app);
    }, error => {
      console.log(error)
      this.title.setTitle('...');
    })
  }

  public mostrarMenuIzquierdo(value: boolean){
    this.mostrarMenu = value
  }
}
