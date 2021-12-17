import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../../services/catalogo/catalogo.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fo-header-navbar',
  templateUrl: './fo-header-navbar.component.html',
  styleUrls: ['./fo-header-navbar.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class FoHeaderNavbarComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'
  private ruta: string = ''
  textoFiltro: string = ''

  constructor(
    private _catalogoService: CatalogoService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(res => {
      if(res[0]){
        this.ruta = res[0].path
      }
    })
  }

  changeTextoFiltro(texto: string){
    this._catalogoService.setTextoFiltro(texto)
    if(this.ruta !== 'catalogo'){
      this.router.navigate(['catalogo'])
    }
  }
}
