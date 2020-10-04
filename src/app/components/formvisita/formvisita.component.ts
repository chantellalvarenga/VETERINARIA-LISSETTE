import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { Visita } from 'src/app/models/visita';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-formvisita',
  templateUrl: './formvisita.component.html',
  styleUrls: ['./formvisita.component.css']
})
export class FormvisitaComponent implements OnInit {
  ClienteActual: Cliente = { Nombres: '', Apellidos: '', DUI: '', Mascotas: [], Visitas: [] };
  clientesArray: Cliente[];
  VisitaActual: Visita = { numero: 0, medicamento: '', tratamiento: '', costo: 0, descuento: 0, total: 0, mascota: '' };
  seleccionado: string = '';
  mensaje: string = '';
  costo: number;

  public FormularioActual: FormGroup;
  constructor(private formBuilder: FormBuilder, private database: DatabaseService, private router: Router, private activatedRoute: ActivatedRoute, private alerta: AlertasService) {
    this.database.getClientes().subscribe(res =>
    //res es la respuesta de objetos desde firebase
    {

      this.clientesArray = [];
      this.clientesArray = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Cliente
      });
      console.log(this.clientesArray);
      const params = this.activatedRoute.snapshot.params;
      if (params.id) {

        this.ClienteActual = this.clientesArray.find(x => x.id == params.id);
      }
      else {
        //alert('no encontrado');

        this.alerta.showErrorAlert('Cliente no encontrado');
      }


    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.costo = 0;

  }
  private buildForm() {
    this.FormularioActual = this.formBuilder.group({
      medicamento: ['', Validators.required],
      tratamiento: ['', Validators.required],
      costo: ['', Validators.required],
      mascota: ['', Validators.required]
    });
  }

  addOrEdit(): void {
    this.VisitaActual.medicamento = this.FormularioActual.controls['medicamento'].value;
    this.VisitaActual.tratamiento = this.FormularioActual.controls['tratamiento'].value;
    this.VisitaActual.mascota = this.FormularioActual.controls['mascota'].value;


  }
  PasarCosto() {
    this.VisitaActual.costo = this.FormularioActual.controls['costo'].value;
  }

  CalcularDatos(numero: number, costo: number) {

    var descuento: number = 0;
    var total: number = 0;

    if (numero <= 2) {
      descuento = 0;
      this.mensaje = '0% de descuento';
    }

    else if (numero > 2 && numero < 6) {
      descuento = costo * 0.05;
      this.mensaje = '5% de descuento';
    }
    else {
      descuento = costo * 0.08;
      this.mensaje = '8% de descuento';
    }

    total = costo - descuento;
    this.VisitaActual.costo = costo;
    this.VisitaActual.descuento = descuento;
    this.VisitaActual.total = total;
    this.VisitaActual.numero = numero;
  }

  AddVisita() {
    if (this.FormularioActual.controls['tratamiento'].value == "" || this.FormularioActual.controls['medicamento'].value == "" || this.FormularioActual.controls['mascota'].value == "" || this.FormularioActual.controls['costo'].value == "") {

      //alert('Debe ingresar todos los campos');
      this.alerta.showErrorAlert('Debe ingresar todos los campos');

    } else {


      this.addOrEdit();
      this.VisitaActual.fecha = firebase.database.ServerValue.TIMESTAMP;
      this.ClienteActual.Visitas.push(this.VisitaActual);
      this.database.UpdateCliente(this.ClienteActual).then
        (res => {
          //alert('visita agregada');
          this.alerta.showSuccessAlert('Visita agregada');
          this.router.navigate(['/historial/' + this.ClienteActual.id]);
        }

        ).catch(error => {
          //alert('Ha ocurrido un error');
          this.alerta.showErrorAlert('Lo sentimos ha ocurrido un error');
          console.error(error)
        })




    }
  }

}
