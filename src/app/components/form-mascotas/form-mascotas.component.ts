import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DatabaseService } from 'src/app/services/database.service';
import { Cliente } from '../../models/cliente';
@Component({
  selector: 'app-form-mascotas',
  templateUrl: './form-mascotas.component.html',
  styleUrls: ['./form-mascotas.component.css']
})
export class FormMascotasComponent implements OnInit {


  MascotaNueva: string; //valor del input Nombre Mascota
  MascotaSeleccionada: number; //saber cual id mascota editará el usuario
  ClienteActual: Cliente; //id del dueño de la mascota
  clientesArray: Cliente[] = [];

  constructor(private dialogRef: MatDialogRef<FormMascotasComponent>,
    @Inject(MAT_DIALOG_DATA) data, private database: DatabaseService) {
    this.ClienteActual = data;
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
      if (this.ClienteActual.id) {

        this.ClienteActual = this.clientesArray.find(x => x.id == this.ClienteActual.id);
      }
      else {
        alert('no encontrado');
      }


    });

  }

  ngOnInit(): void {

  }

  AddMascota() {

    if (this.MascotaNueva == null) {

      alert('Ingrese el nombre de la mascota');

    } else {

      this.ClienteActual.Mascotas.push(this.MascotaNueva);
      this.database.UpdateCliente(this.ClienteActual).then(res => {
        alert('Mascota agregada');
      })
        .catch()
      {
        error => {
          alert('Ha ocurrido un error');
          console.error(error);
        }
      }
      
    }
  }

  DeleteMascota(indice: number) {
    if (confirm('¿Esta seguro de eliminar la mascota?')) {
      this.ClienteActual.Mascotas.splice(indice, 1);
      this.database.UpdateCliente(this.ClienteActual).then
        (res => {
          alert('Mascota eliminada!');

        })
        .catch(error => {
          alert('Ha ocurrido un error');
          console.error(error);
        });
    }
  }

  EditMascota(): void {

    if (this.MascotaNueva == null) {

      alert('Ingrese el nombre de la mascota');

    } else {

      if (confirm('¿Esta seguro de modificar mascota?')) {

        //actualizamos el nombre de la mascota seleccionada
        this.ClienteActual.Mascotas[this.MascotaSeleccionada] = this.MascotaNueva;

        this.database.UpdateCliente(this.ClienteActual).then(res => {
          alert('Mascota modificada exitosamente');

          //limpiar input nombre mascota
          this.MascotaNueva = null;
        })
          .catch()
        {
          error => {
            alert('Ha ocurrido un error');
            console.error(error);
          }
        }
      }

    }
  }

  openForEdit(indice: number): void {
    //El indice de la mascota seleccionada lo guardamos en la variable del componente
    this.MascotaSeleccionada = indice;
    //Esto sirve para pasar datos de la mascota seleccionada al formGroup 
    this.MascotaNueva = this.ClienteActual.Mascotas[indice];

  }

}


