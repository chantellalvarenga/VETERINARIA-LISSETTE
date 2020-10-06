import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Cliente } from '../../models/cliente';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormMascotasComponent } from '../form-mascotas/form-mascotas.component'
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-new-cliente',
  templateUrl: './form-new-cliente.component.html',
  styleUrls: ['./form-new-cliente.component.css']
})
export class FormNewClienteComponent implements OnInit {

  clientesArray: Cliente[] = [];
  clientesBusqueda: Cliente[];
  busqueda: string = '';
  NewCliente: Cliente = { Nombres: '', Apellidos: '', DUI: '', Mascotas: [], Visitas: [] };
  SelectedCliente: Cliente = { Nombres: '', Apellidos: '', DUI: '', Mascotas: [], Visitas: [] };
  public FormularioActual: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private database: DatabaseService,
    private dialog: MatDialog, private router: Router,
    private alerta: AlertasService
  ) {

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

    });
  }

  private buildForm() {
    this.FormularioActual = this.formBuilder.group({
      Nombres: ['', Validators.required],
      Apellidos: ['', Validators.required],
      DUI: ['', Validators.required],
      Mascota: ['',]
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  addOrEdit(): void {
    this.NewCliente.Nombres = this.FormularioActual.controls['Nombres'].value;
    this.NewCliente.Apellidos = this.FormularioActual.controls['Apellidos'].value;
    this.NewCliente.DUI = this.FormularioActual.controls['DUI'].value;

  }
  openForEdit(_cliente: Cliente): void {
    this.SelectedCliente = _cliente;
    //Esto sirve para pasar datos del objeto alumno seleccionado al formGroup 
    this.FormularioActual.controls['Nombres'].setValue(this.SelectedCliente.Nombres);
    this.FormularioActual.controls['Apellidos'].setValue(this.SelectedCliente.Apellidos);
    this.FormularioActual.controls['DUI'].setValue(this.SelectedCliente.DUI);

  }

  AddCliente() {

    //validacion de campos vacios
    if (this.FormularioActual.controls['Nombres'].value == "" || this.FormularioActual.controls['Apellidos'].value == "" || this.FormularioActual.controls['DUI'].value == ""
      || this.FormularioActual.controls['Nombres'].value == null || this.FormularioActual.controls['Apellidos'].value == null || this.FormularioActual.controls['DUI'].value == null) {

      // alert('Ingrese todos los datos personales del cliente');
      this.alerta.showErrorAlert('Ingrese todos los datos personales del cliente');
    } else {

      this.addOrEdit();
      this.database.AddCliente(this.NewCliente)
        .then(res => {
          //alert('CLIENTE AGREGADO!');
          this.alerta.showSuccessAlert('Cliente Agregado');
          this.FormularioActual.reset();
        }).catch(err => { 
          //alert('Error');
          this.alerta.showErrorAlert('Lo sentimos, ha ocurrido un error');
          console.error(err);
        });

    }
  }

  UpdateCLiente() {

    //validacion de campos vacios
    if (this.FormularioActual.controls['Nombres'].value == "" || this.FormularioActual.controls['Apellidos'].value == "" || this.FormularioActual.controls['DUI'].value == ""
      || this.FormularioActual.controls['Nombres'].value == null || this.FormularioActual.controls['Apellidos'].value == null || this.FormularioActual.controls['DUI'].value == null) {


      //alert('Ingrese todos los datos personales del cliente');
      this.alerta.showErrorAlert('Seleccione un cliente');
    } else {

      this.NewCliente.id = this.SelectedCliente.id;

      Swal.fire({
        title: '¿Estas seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, modificalo!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Modificado!',
            'El cliente ha sido modificado',
            'success'
          )

          //codigo
          delete this.NewCliente.Visitas;
          delete this.NewCliente.Mascotas;
          this.database.UpdateCliente(this.NewCliente).then(res => {
            console.log(res);
            //alert('Cliente Modificado');
            this.FormularioActual.reset();
          }
          )
            .catch(err => {
              //alert('ha ocurrido un error');
              this.alerta.showErrorAlert('Lo siento ha ocurrido un error');
              console.error(err);
            });
          //
        }
      })

    }

  }

  DeleteCliente(_cliente: Cliente) {

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
          'Cliente eliminado',
          'success'
        )
        this.database.DeleteCliente(_cliente).then(res => {
          //alert('Cliente eliminado');
          this.FormularioActual.reset();
        })
          .catch(err => {
            //alert('Ha ocurrido un error');
            this.alerta.showErrorAlert('Lo siento ha ocurrido un error');
            console.error(err);
          }
          )
      }
    })

  }//termina metodo

  OpenDialog(_Cliente: Cliente) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = _Cliente;
    this.dialog.open(FormMascotasComponent, dialogConfig);
  }

  NavigateVisitas(id: string) {
    this.router.navigate(['/visitas/' + id]);
  }
  NavigateHistorial(id: string) {
    this.router.navigate(['/historial/' + id]);
  }

  BuscarCliente(Parametro: string) {


    if(Parametro.length==0)
    {
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
    
        });
    }
    else{
    this.database.SerachClientes(Parametro).then(res=>{

      this.clientesArray = res.docs.map(item => {
        return {
          id: item.id,
          ...item.data()
        } as Cliente
      });
    }
    ).catch(err=>{console.error(err)});
  }
}

}
