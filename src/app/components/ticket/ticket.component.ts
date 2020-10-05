import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  @Input() dataVisita : any
  @Input() dataCliente : any
  @Input() opMascota : any 
  @ViewChild('getTicket') tick : ElementRef
  date = new Date()
  exp : RegExp

  constructor(
    private rend : Renderer2,
    public router : Router
  ) { }

  ngOnInit(): void {
    this.exp = /historia/
  }

  downloadFile(): void {
    let templateTxt = `Veterinaria Lissette                         Tel: 2305-9882
Calle El Bambú, Ayutuxtepeque, #22.        Nit: 0614-300899-111-9
Fecha:\t${this.date.getDate()}/${this.date.getMonth()}/${this.date.getFullYear()}

Cliente:\t\t${this.dataCliente.Nombres} ${this.dataCliente.Apellidos}
DUI:\t\t\t${this.dataCliente.DUI}
Mascota tratada:\t${this.opMascota==null? this.dataVisita.mascota: this.opMascota}

DETALLES:
\t-Medicamento a Administrar:\t${this.dataVisita.medicamento}
\t-Tratamiento Recomendado:\t${this.dataVisita.tratamiento}

\t\tPrecio:\t\t\t $${Number(this.dataVisita.costo).toFixed(2)}
\t\tDescuento:\t\t-$${Number(this.dataVisita.descuento).toFixed(2)}
\t\tTotal a Pagar:\t\t $${Number(this.dataVisita.total).toFixed(2)}`

    var blob = new Blob([templateTxt], {type: 'text/text'});
    let url = window.URL.createObjectURL(blob)
    this.rend.setAttribute(this.tick.nativeElement,'download','test.txt')
    this.rend.setAttribute(this.tick.nativeElement,'href',url)
  }
}
