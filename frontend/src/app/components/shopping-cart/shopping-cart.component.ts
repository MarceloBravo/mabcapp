import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class ShoppingCartComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'

  constructor() { }

  ngOnInit(): void {
  }

}
