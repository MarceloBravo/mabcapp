import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: [
    './main-menu.component.css',
  ],
  encapsulation: ViewEncapsulation.None //Permite que la etiqueta del componente de angular no sea considerada en el dom
})
export class MainMenuComponent implements OnInit {
  //@HostBinding('style') style = 'display: contents';

  constructor(
    private _scriptService: ScriptServicesService
  ) {
    this.loadScript()
  }

  ngOnInit(): void {
  }

  private loadScript(){
    this._scriptService.load([
      '../../../../assets/bower_components/jquery/dist/jquery.min.js',
      '../../../../assets/bower_components/popper.js/dist/umd/popper.min.js',
      '../../../../assets/dist/js/bootstrap.min.js',
      '../../../../assets/js/app-style-switcher.js',
      '../../../../assets/js/waves.js',
      '../../../../assets/js/sidebarmenu.js',
      '../../../../assets/js/custom.js',
      '../../../../assets/bower_components/chartist/dist/chartist.min.js',
      '../../../../assets/bower_components/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.min.js',
    ]);
  }

}
