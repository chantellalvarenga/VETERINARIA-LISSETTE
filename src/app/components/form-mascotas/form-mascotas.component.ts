import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DatabaseService } from 'src/app/services/database.service';
import { Cliente } from '../../models/cliente';
import { AlertasService } from 'src/app/services/alertas.service';
import Swal from 'sweetalert2';
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
    @Inject(MAT_DIALOG_DATA) data, private database: DatabaseService, private alerta: AlertasService) {
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
        //alert('no encontrado');
        this.alerta.showErrorAlert('Ingrese el nombre de la mascota');
      }


    });

  }

  ngOnInit(): void {

  }

  AddMascota() {

    if (this.MascotaNueva == null || this.MascotaNueva == "") {

      // alert('Ingrese el nombre de la mascota');
      this.alerta.showErrorAlert('Ingrese el nombre de la mascota');


    } else {

      this.ClienteActual.Mascotas.push(this.MascotaNueva);
      this.database.UpdateCliente(this.ClienteActual).then(res => {
        //alert('Mascota agregada');
        this.alerta.showSuccessAlert('Mascota agregada');
      })
        .catch()
      {
        error => {
          //alert('Ha ocurrido un error');
          this.alerta.showErrorAlert('Lo sentimos ha ocurrido un error');


          console.error(error);
        }
      }

    }
  }

  DeleteMascota(indice: number) {

    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no podra revertirse!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado!',
          'Mascota eliminada',
          'success'
        )
        this.ClienteActual.Mascotas.splice(indice, 1);
        this.database.UpdateCliente(this.ClienteActual).then
          (res => {

          })
          .catch(error => {
            //alert('Ha ocurrido un error');
            this.alerta.showErrorAlert('Lo sentimos ha ocurrido un error');
            console.error(error);
          });
      }
    })

  }

  EditMascota(): void { //comienza metodo

    if (this.MascotaNueva == null || this.MascotaNueva == "") {
      //alert('Ingrese el nombre de la mascota');
      this.alerta.showErrorAlert('Ingrese el nombre de la mascota');
    } else {
      //comienza sweetAlert
      Swal.fire({
        title: '¿Estas seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, modificalo!'
      }).then((result) => {
        //si le da aceptar mostramos exito y actualizamos mascota
        if (result.isConfirmed) {
          Swal.fire(
            'Modificado!',
            'La mascota ha sido modificada',
            'success'
          )

          //actualizamos el nombre de la mascota seleccionada
          this.ClienteActual.Mascotas[this.MascotaSeleccionada] = this.MascotaNueva;

          this.database.UpdateCliente(this.ClienteActual).then(res => {
            //limpiar input nombre mascota
            this.MascotaNueva = null;
          })
            .catch()
          {
            error => {
              //alert('Ha ocurrido un error');
              this.alerta.showErrorAlert('Seleccione una mascota');
              console.error(error);
            }
          }


        }
      })//termina sweetAlert

    } //termina else
  } //termina metodo

  openForEdit(indice: number): void {
    //El indice de la mascota seleccionada lo guardamos en la variable del componente
    this.MascotaSeleccionada = indice;
    //Esto sirve para pasar datos de la mascota seleccionada al formGroup 
    this.MascotaNueva = this.ClienteActual.Mascotas[indice];

  }

}


