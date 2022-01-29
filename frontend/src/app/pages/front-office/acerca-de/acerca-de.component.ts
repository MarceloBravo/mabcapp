import { Component, OnInit } from '@angular/core';
import { ConstantesService } from '../../../services/constantes/constantes.service';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css',
        '../../../../assets/front-office/css/core-style.css']
})
export class AcercaDeComponent implements OnInit {
  public sourceImage: string = '../../../assets/front-office/img/'

  constructor(
    private _const: ConstantesService
  ) { }

  ngOnInit(): void {

  }

}
