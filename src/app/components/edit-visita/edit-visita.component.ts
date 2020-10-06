import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DatabaseService } from 'src/app/services/database.service';
import { Cliente } from '../../models/cliente';
import { Visita } from '../../models/visita';
import { AlertasService } from 'src/app/services/alertas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-visita',
  templateUrl: './edit-visita.component.html',
  styleUrls: ['./edit-visita.component.css']
})
export class EditVisitaComponent implements OnInit {
  ClienteActual: Cliente = { Nombres: '', Apellidos: '', DUI: '', Mascotas: [], Visitas: [] };
  clientesArray: Cliente[];
  numeroVisita: number = 0;
  VisitaActual: Visita = { numero: 0, medicamento: '', tratamiento: '', costo: 0, descuento: 0, total: 0, mascota: '' };
  seleccionado: string = '';
  mensaje: string = '';
  costo: number;

  public FormularioActual: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditVisitaComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private database: DatabaseService,
    private alerta: AlertasService,
    private formBuilder: FormBuilder
  ) {

    this.ClienteActual = data.cliente;
    this.numeroVisita = data.visita;

    this.database.getClientes().subscribe(res =>
    {
      //res es la respuesta de objetos desde firebase
      this.clientesArray = [];
      this.clientesArray = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Cliente
      });
      console.log(this.clientesArray);
      if (this.ClienteActual.id) {

        this.ClienteActual = this.clientesArray.find(x => x.id == this.ClienteActual.id);
        this.VisitaActual = this.ClienteActual.Visitas.find(x => x.numero == this.numeroVisita);
        this.openForEdit();

      }
      else {
        //alert('no encontrado');
        this.alerta.showErrorAlert('Ingrese el nombre de la mascota');
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

  openForEdit(): void {
    //Esto sirve para pasar datos del objeto alumno seleccionado al formGroup 
    this.FormularioActual.controls['medicamento'].setValue(this.VisitaActual.medicamento);
    this.FormularioActual.controls['tratamiento'].setValue(this.VisitaActual.tratamiento);
    this.FormularioActual.controls['mascota'].setValue(this.VisitaActual.mascota);
    this.FormularioActual.controls['costo'].setValue(this.VisitaActual.costo);
  }

  PasarCosto() {
    this.VisitaActual.costo = this.FormularioActual.controls['costo'].value;
  }

  CalcularDatos(numero: number, costo: number) {

    var descuento: number = 0;
    var total: number = 0;

    if (numero == 2) {
      descuento = costo * 0.05;
      this.mensaje = '5% de descuento';
    }

    else if (numero > 5) {
      descuento = costo * 0.08;
      this.mensaje = '8% de descuento';
    }
    else {
      descuento = 0;
      this.mensaje = '0% de descuento';
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
      //alert(this.numeroVisita);

      this.ClienteActual.Visitas[(this.numeroVisita - 1)] = this.VisitaActual;

      this.database.UpdateCliente(this.ClienteActual).then
        (res => {
          //alert('visita agregada');
          this.alerta.showSuccessAlert('Visita modificada');

        }

        ).catch(error => {
          //alert('Ha ocurrido un error');
          this.alerta.showErrorAlert('Lo sentimos ha ocurrido un error');
          console.error(error)
        })

    }
  }


}
