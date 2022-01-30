import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { ImagenMarquesina } from 'src/app/class/imagenMarquesina/imagen-marquesina';

@Component({
  selector: 'app-marquesina',
  templateUrl: './marquesina.component.html',
  styleUrls: ['./marquesina.component.css']
})
export class MarquesinaComponent implements OnInit {
  @Input() segundos: number = 10
  //@Input() imagenes: {imagen: string, texto1: string | null, texto2: string | null, textoBoton: string | null}[] = []
  @Input() imagenes: ImagenMarquesina[] = []
  @Input() textoBoton: string = 'Ver más'
  @Input() imagenesVisibles: number = 1
  @Output() imagenClick: EventEmitter<string> = new EventEmitter()
  private obsTimer: Observable<number> = timer(1000, 1000)
  private count: number = 0
  public imagenActual: number = 0


  constructor() { }


  ngOnInit(): void {
    this.obsTimer.subscribe(currTime => this.cambiarImagen() )
  }


  private cambiarImagen(){
    if(this.imagenes.length > 0){
      if(this.count === this.segundos){
        this.count = 0
        if(this.imagenActual >= this.imagenes.length -1){
          this.imagenActual = 0
        }else{
          this.imagenActual++
        }
      }else{
        this.count++
      }
    }
  }


  clickImage(link: string){
    this.imagenClick.emit(link)
  }

  nextImage(){
    this.imagenActual = (this.imagenActual === this.imagenes.length - 1) ? 0 : this.imagenActual+1
    this.count = 0
  }

  previousImage(){
    this.imagenActual = (this.imagenActual === 0) ? this.imagenes.length - 1  : this.imagenActual-1
    this.count = 0
  }

}
