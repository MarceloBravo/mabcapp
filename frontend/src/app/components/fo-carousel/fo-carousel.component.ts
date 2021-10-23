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

  itemOnClick(id: any){
    return this.itemClick.emit(id)
  }
}
