import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-tablavisitas',
  templateUrl: './tablavisitas.component.html',
  styleUrls: ['./tablavisitas.component.css']
})
export class TablavisitasComponent implements OnInit {
  ClienteActual:Cliente={Nombres:'',Apellidos:'',DUI:'',Mascotas:[],Visitas:[]};
  clientesArray:Cliente[];
  constructor(private database:DatabaseService,private router: Router, private activatedRoute: ActivatedRoute) {

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
      alert('no encontrado');
    }
         
          
      });
   }

  ngOnInit(): void {
  }

  DeleteVisita(indice:number)
  {

    if(confirm('¿Esta seguro de borrar la visita?'))
    {
      
  this.ClienteActual.Visitas.splice(indice,1);
  this.database.UpdateCliente(this.ClienteActual).then
  (res=>{alert('visita eliminada')})
  .catch(error=>
    {
      alert('ha ocurrido un error');
      console.error(error);
    });

  
}
  
  }


}
