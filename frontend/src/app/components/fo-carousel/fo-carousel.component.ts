import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemsCarousel } from 'src/app/class/ItemsCarousel/items-carousel';
//npm i angular-responsive-carousel
//https://www.npmjs.com/package/angular-responsive-carousel?activeTab=versions

@Component({
  selector: 'app-fo-carousel',
  templateUrl: './fo-carousel.component.html',
  styleUrls: ['./fo-carousel.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class FoCarouselComponent implements OnInit {
  @Input() sourceImage: string = ''
  @Input() imagenes: ItemsCarousel[] = []
  @Input() height: number = 450
  @Input() loop: boolean = true
  @Input() cellsToShow: number = 4  //Celdas a mostrar
  @Input() dots: boolean = true //Mostrar puntos por cada celda o Barra de progreso del carrusel.
  @Input() margin: number = 30
  @Input() arrowsOutside: boolean = true  //Flechas en el exterior del contenedor del carrusel.
  @Input() pauseOnHover: boolean = true //Detiene la reproducción automática si el cursor está sobre el área del carrusel.
  @Input() arrows: boolean = true //Flechas para la navegación de imágenes.
  @Input() autoplay: boolean = true
  @Input() autoplayInterval: number = 5000  //El intervalo entre el desplazamiento del carrusel. Se usa junto con la reproducción automática.
  @Input() CellToScroll: number = 1  //El número de celdas del carrusel para desplazarse por cada clic de flecha.
  @Input() lightDOM: boolean = false  //Mantenga un número limitado de celdas en el árbol DOM para un número ilimitado de imágenes. A medida que el carrusel se desplaza, las imágenes se cargarán de forma diferida. Esto le permite no sobrecargar la memoria del navegador. Este modo funciona solo con imágenes pasadas como una matriz.
  @Output() clickFavorito: EventEmitter<number> = new EventEmitter()
  @Output() itemClick: EventEmitter<number> = new EventEmitter()
  /*public images = [
    {path: this.sourceImage +'product-img/product-1.jpg'},
    {path: this.sourceImage +'product-img/product-2.jpg'},
    ...
  ]
  */

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(id: any){
    return this.itemClick.emit(id)
  }

  onClickFavorito(id: any){
    return this.clickFavorito.emit(id)
  }
}
