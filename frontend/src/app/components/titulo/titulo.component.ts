import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css',
  '../../../assets/front-office/css/core-style.css']
})
export class TituloComponent implements OnInit {
  @Input() titulo: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
