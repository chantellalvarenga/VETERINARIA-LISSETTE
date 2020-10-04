import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { TicketComponent } from '../ticket/ticket.component'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( private rend : Renderer2) { }

  ngOnInit(): void {
  }
  url:string
  nombre:string = "recibo.txt"

  dir : string = "nueva direccion"

  @ViewChild('MyA') myA : ElementRef

  getFile(){
    let templateTxt = 
    `texto de prueba para poder poner en el archivo 
    Nombre de cliente: ${this.nombre}
    Direccion: ${this.dir}`

    var blob = new Blob([templateTxt], {type: 'text/text'});
    this.url = window.URL.createObjectURL(blob)
    this.rend.setAttribute(this.myA.nativeElement,'download','test.txt')
    this.rend.setAttribute(this.myA.nativeElement,'href',this.url)
  }

}
