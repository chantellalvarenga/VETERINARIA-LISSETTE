import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import {Cliente} from '../../models/cliente';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormMascotasComponent} from '../form-mascotas/form-mascotas.component'
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-new-cliente',
  templateUrl: './form-new-cliente.component.html',
  styleUrls: ['./form-new-cliente.component.css']
})
export class FormNewClienteComponent implements OnInit {

  clientesArray:Cliente[]=[];
  clientesBusqueda:Cliente[];
  busqueda:string='';
  NewCliente:Cliente={Nombres:'',Apellidos:'',DUI:'',Mascotas:[],Visitas:[]};
  SelectedCliente:Cliente={Nombres:'',Apellidos:'',DUI:'',Mascotas:[],Visitas:[]};
  public FormularioActual: FormGroup;
  constructor (private formBuilder: FormBuilder,private database:DatabaseService,private dialog: MatDialog,private router: Router)
  {
    this.database.getClientes().subscribe(res=>
      //res es la respuesta de objetos desde firebase
      {
       
        this.clientesArray=[];
        this.clientesArray=res.map(item=>
          {
           return {id:item.payload.doc.id,
             ...item.payload.doc.data() } as Cliente
          }); 
          console.log(this.clientesArray);
          
      });
      
  }
  private buildForm(){
    this.FormularioActual = this.formBuilder.group({
      Nombres:['',Validators.required],
      Apellidos:['',Validators.required],
      DUI: ['', Validators.required],
      Mascota: ['',]
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  addOrEdit(): void   {  
    this.NewCliente.Nombres=this.FormularioActual.controls['Nombres'].value;
       this.NewCliente.Apellidos=this.FormularioActual.controls['Apellidos'].value;
    this.NewCliente.DUI=this.FormularioActual.controls['DUI'].value;
    
  }    
  openForEdit(_cliente: Cliente): void 
  {     
  this.SelectedCliente = _cliente;
  //Esto sirve para pasar datos del objeto alumno seleccionado al formGroup 
  this.FormularioActual.controls['Nombres'].setValue(this.SelectedCliente.Nombres);
  this.FormularioActual.controls['Apellidos'].setValue(this.SelectedCliente.Apellidos);
  this.FormularioActual.controls['DUI'].setValue(this.SelectedCliente.DUI);
   
  }

  AddCliente()
  {
    this.addOrEdit();
this.database.AddCliente(this.NewCliente)
.then(res=>{
  alert('CLIENTE AGREGADO!');
  this.FormularioActual.reset();
}).catch(err=>{
  alert('Error');
  console.error(err);
});
  }

  UpdateCLiente()
  {
    this.NewCliente.id=this.SelectedCliente.id;
    if(confirm('¿Esta seguro de modificar el Registro?'))
{
  delete this.NewCliente.Visitas;
  delete this.NewCliente.Mascotas;
  this.database.UpdateCliente(this.NewCliente).then(res=>
    {
      console.log(res);
      alert('Cliente Modificado');
      this.FormularioActual.reset();
    }
    )
    .catch(err=>
      {
        alert('ha ocurrido un error');
        console.error(err);
      });
    }
  }

  DeleteCliente(_cliente:Cliente)
  {
      if(confirm('¿Esta seguro de eliminar el Registro?'))
{
   this.database.DeleteCliente(_cliente).then(res=>
    {
      alert('Cliente eliminado');
      this.FormularioActual.reset();
    })
    .catch(err=>
      {
        alert('Ha ocurrido un error');
        console.error(err);
      }
      )
      }
  }

  OpenDialog(_Cliente:Cliente) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data=_Cliente;
     this.dialog.open(FormMascotasComponent, dialogConfig);
}

NavigateVisitas(id:string)
{
this.router.navigate(['/visitas/'+id]);
}
NavigateHistorial(id:string)
{
this.router.navigate(['/historial/'+id]);
}

BuscarCliente(Parametro:string)
{

  this.clientesBusqueda=this.clientesArray;

  this.clientesArray[0]=this.clientesArray.find(x=>
  x.Nombres==Parametro || x.Apellidos==Parametro || x.DUI==Parametro);


}
  
}
