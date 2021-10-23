import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fo-header-navbar',
  templateUrl: './fo-header-navbar.component.html',
  styleUrls: ['./fo-header-navbar.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class FoHeaderNavbarComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'

  constructor() { }

  ngOnInit(): void {
  }

}
