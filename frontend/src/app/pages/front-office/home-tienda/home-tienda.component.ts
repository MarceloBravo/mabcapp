import { Component, OnInit } from '@angular/core';
import { ItemsCarousel } from 'src/app/class/ItemsCarousel/items-carousel';
import { ScriptServicesService } from 'src/app/services/scriptServices/script-services.service';

@Component({
  selector: 'app-home-tienda',
  templateUrl: './home-tienda.component.html',
  styleUrls: ['./home-tienda.component.css',
  '../../../../assets/front-office/css/core-style.css']
})
export class HomeTiendaComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'
  private sourceScript: string =  '../../../../assets/front-office/js/'
  public imagenes: ItemsCarousel[] = []
  public imgMarcas: string[] = []

  constructor(private _scriptService: ScriptServicesService) {
    this.loadScript()
   }

  ngOnInit(): void {
    this.loadImages()
    this.loadMarcas()
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

  private loadImages(){
    this.imagenes.push({srcImg: 'product-img/product-1.jpg', srcImg2: 'product-img/product-1.jpg', texto1:'topshop', texto2: 'Knot Front Mini Dress', precio: 80.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-2.jpg', srcImg2: 'product-img/product-2.jpg', texto1:'topshop', texto2: 'Poplin Displaced Wrap Dress', precio: 80.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-3.jpg', srcImg2: 'product-img/product-3.jpg', texto1:'Mango', texto2: 'PETITE Crepe Wrap Mini Dress', precio: 55.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-4.jpg', srcImg2: 'product-img/product-4.jpg', texto1:'Mango', texto2: 'PETITE Belted Jumper Dress', precio: 60.000, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-5.jpg', srcImg2: 'product-img/product-5.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-6.jpg', srcImg2: 'product-img/product-6.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-7.jpg', srcImg2: 'product-img/product-7.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-8.jpg', srcImg2: 'product-img/product-8.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
    this.imagenes.push({srcImg: 'product-img/product-9.jpg', srcImg2: 'product-img/product-9.jpg', texto1:'', texto2: '', precio: 0, textoBoton: 'Comprar'})
  }

  private loadMarcas(){
    this.imgMarcas.push('core-img/brand1.png')
    this.imgMarcas.push('core-img/brand2.png')
    this.imgMarcas.push('core-img/brand3.png')
    this.imgMarcas.push('core-img/brand4.png')
    this.imgMarcas.push('core-img/brand5.png')
    this.imgMarcas.push('core-img/brand6.png')
  }

  public itemClick(id: any){

  }

}
