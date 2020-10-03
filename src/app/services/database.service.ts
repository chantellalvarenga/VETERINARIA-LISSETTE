import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';
import {Cliente} from '../models/cliente';
import { Query } from '@firebase/firestore-types'


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

 //Se crear un coleccion del tipo de dato Alumnos estas collections se importan de angular/fire
  //el observable sirve para estar pendiente de los cambios en la BD en firebase
  private ClientesCollection: AngularFirestoreCollection<Cliente>;
  Clientes: Observable<Cliente[]>;
//inyectando el firestore para ingresar datos en firebase
constructor(private firestore: AngularFirestore,private firebase:AngularFireDatabase) {
  this.getClientes();
 }
getClientes() { 
  
  //Se crea la coleccion de tipo Alumnos que aloja los datos dentro de la coleccion alumnos en firebase 
  //luego con snapshotChanges se esta pendiente de los cambios este metodo entre otras cosas devueleve el id 
  //del registro pero para hacer eso hay que suscribirse al objeto
    this.ClientesCollection = this.firestore.collection<Cliente>('Clientes');
    return this.ClientesCollection.snapshotChanges();
 }
 
 AddCliente(_cliente: Cliente){
     //de esta forma se especifica el id que se utilizara que en este caso es el 10
  return this.ClientesCollection.add(_cliente);
  
 }
 DeleteCliente(_alumno:Cliente)
 {
   return this.ClientesCollection.doc(_alumno.id).delete();
 }
 
 UpdateCliente(_cliente:Cliente)
 { 
   return this.ClientesCollection.doc(_cliente.id).update(_cliente);
 }

}
