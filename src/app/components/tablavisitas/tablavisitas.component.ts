import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { DatabaseService } from 'src/app/services/database.service';
import Swal from 'sweetalert2';
import { AlertasService } from 'src/app/services/alertas.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditVisitaComponent } from '../edit-visita/edit-visita.component';


@Component({
  selector: 'app-tablavisitas',
  templateUrl: './tablavisitas.component.html',
  styleUrls: ['./tablavisitas.component.css']
})
export class TablavisitasComponent implements OnInit {
  ClienteActual:Cliente={Nombres:'',Apellidos:'',DUI:'',Mascotas:[],Visitas:[]};
  clientesArray:Cliente[];
  constructor( private dialog: MatDialog,private database:DatabaseService,private router: Router, private activatedRoute: ActivatedRoute,private alerta: AlertasService ) {

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
          const params = this.activatedRoute.snapshot.params;
    if (params.id) {

      this.ClienteActual=this.clientesArray.find(x=>x.id==params.id);
    }
    else
    {
      //alert('no encontrado');
      this.alerta.showErrorAlert('No encontrado');

    }
         
          
      });
   }

  ngOnInit(): void {
  }

  DeleteVisita(indice:number)
  {
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
        
    this.ClienteActual.Visitas.splice(indice,1);
    this.database.UpdateCliente(this.ClienteActual).then(res=>{
      //alert('visita eliminada')
      Swal.fire(
        'Eliminado!',
          'Visita eliminado',
          'success'
      )
    })
    .catch(error=>
    {
      //alert('ha ocurrido un error');
      this.alerta.showErrorAlert('Ha ocurrido un error');
      console.error(error);
    });

      }
    })
     
  }

  OpenDialog(_Cliente: Cliente,numero:number) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {"cliente":_Cliente,"visita":numero};
    this.dialog.open(EditVisitaComponent, dialogConfig);
  }



}
