import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fo-footer',
  templateUrl: './fo-footer.component.html',
  styleUrls: ['./fo-footer.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class FoFooterComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'

  constructor() { }

  ngOnInit(): void {
  }

}
