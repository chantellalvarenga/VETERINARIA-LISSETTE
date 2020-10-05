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
    let templateTxt = `
Veterinaria Lissette                         Tel: 2305-9882
Calle El Bambú, Ayutuxtepeque, #22.        Nit: 0614-300899-111-9

Cliente:\t\t${'nombreCliente'}\t\t\tFecha:
DUI:\t\t\t${'059296381'}\t\t\t28/08/2020
Mascota tratada:\t${'nombremascota'}

Medicamento a Administrar:\t${'Medicamento'}
Tratamiento Recomendado:\t${'Tratamiento'}

\t\t\tPrecio:\t\t\t ${'precio'}
\t\t\tDescuento:\t\t-${'descuento'}
\t\t\tTotal a Pagar:\t\t=${'total'}
`

    var blob = new Blob([templateTxt], {type: 'text/text'});
    this.url = window.URL.createObjectURL(blob)
    this.rend.setAttribute(this.myA.nativeElement,'download','test.txt')
    this.rend.setAttribute(this.myA.nativeElement,'href',this.url)
  }

}
