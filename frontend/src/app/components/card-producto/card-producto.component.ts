import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemsCarousel } from 'src/app/class/ItemsCarousel/items-carousel';

@Component({
  selector: '[app-card-producto]',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class CardProductoComponent implements OnInit {
  @Input() sourceImage: string = ''
  @Input() imagen: ItemsCarousel = new ItemsCarousel()
  @Output() clickFavorito: EventEmitter<ItemsCarousel> = new EventEmitter()
  @Output() itemClick: EventEmitter<ItemsCarousel> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  clickFavorite(){
    return this.clickFavorito.emit(this.imagen)
  }

  itemOnClick(){
    return this.itemClick.emit(this.imagen)
  }
}
