import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageCover } from 'src/app/enum/carousel/imageCover';
import { TransitionTimingFunction } from 'src/app/enum/carousel/transitionTimingFunction';
import { ArrowsTheme } from '../../enum/carousel/arrowsTheme';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() sourceImage: string = ''
  @Input() imagenes: {imagen: string, link: string, label: string, imageClass: string, linkClass: string}[] = []
  //@Input() links: {link: string, label: string, class: string}[] = []
  @Input() height: number = 450
  @Input() cellWidth: number = 100
  @Input() objectFit: ImageCover = ImageCover.cover ////Ajuste del tamaño de la imágen
  @Input() loop: boolean = true
  @Input() cellsToShow: number = 4  //Celdas a mostrar
  @Input() dots: boolean = true //Mostrar puntos por cada celda o Barra de progreso del carrusel.
  @Input() margin: number = 30
  @Input() arrowsOutside: boolean = false  //Flechas en el exterior del contenedor del carrusel.
  @Input() pauseOnHover: boolean = false //Detiene la reproducción automática si el cursor está sobre el área del carrusel.
  @Input() arrows: boolean = true //Flechas para la navegación de imágenes.
  @Input() arrowsTheme: ArrowsTheme = ArrowsTheme.dark  //Tema de color de flecha.
  @Input() autoplay: boolean = true
  @Input() autoplayInterval: number = 5000  //El intervalo entre el desplazamiento del carrusel. Se usa junto con la reproducción automática.
  @Input() CellToScroll: number = 1  //El número de celdas del carrusel para desplazarse por cada clic de flecha.
  @Input() lightDOM: boolean = false  //Mantenga un número limitado de celdas en el árbol DOM para un número ilimitado de imágenes. A medida que el carrusel se desplaza, las imágenes se cargarán de forma diferida. Esto le permite no sobrecargar la memoria del navegador. Este modo funciona solo con imágenes pasadas como una matriz.
  @Input() transitionTimingFunction: TransitionTimingFunction = TransitionTimingFunction.erase_in_out ////Función de animación suave.
  @Output() itemClick: EventEmitter<number> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
    console.log(this.imagenes, this.sourceImage)
  }

  onItemClick(e: any){
    return this.itemClick.emit(e)
  }
}
