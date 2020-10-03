import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoginComponent} from '../login/login.component'
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { User } from  'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuarioLoggeado:User;
  public Islogged:boolean;
  NombreUsuario:string;
  Correo:string;
  foto:string;
   constructor(private dialog: MatDialog,private autenticacion:AuthService,private router:Router) { 
     this.usuarioLoggeado=JSON.parse(localStorage.getItem('user'));
   }

  ngOnInit(): void {
    
    this.VerificarLoggin();
    this.NombreUsuario=this.usuarioLoggeado.displayName;
     this.foto=this.usuarioLoggeado.photoURL;
     this.Correo=this.usuarioLoggeado.email;
    
  }

  OpenLogin() {

    const dialogConfig = new MatDialogConfig();
    /*dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;*/
     this.dialog.open(LoginComponent, dialogConfig);
     this.VerificarLoggin();
}

async CerrarSesion()
{
await this.autenticacion.logout();
this.VerificarLoggin();
this.ngOnInit();


} 

VerificarLoggin()
{
  this.Islogged=this.autenticacion.isLoggedIn;
}

}
