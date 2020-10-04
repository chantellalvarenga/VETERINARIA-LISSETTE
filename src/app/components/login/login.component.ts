import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  hide1 = true;
  hide2 = true;
  correo: string;
  password: string;
  Newcorreo: string;
  Newpassword: string;
  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private autenticacion: AuthService,
    private alerta: AlertasService
  ) { }

  ngOnInit(): void {
  }

  LogginGoogle() {
    this.autenticacion.loginWithGoogle();
  }

  LoginCorreoYcontra() {
    if (this.correo == null || this.correo == '' || this.password == null || this.password == '') {
      //alert('ha ocurrido un error');
      this.alerta.showErrorAlert('Ingrese sus credenciales');

    } else {
      this.autenticacion.SignIn(this.correo, this.password).then
        (res => {
          //alert('todo correcto')
        })
        .catch(error => {
          //alert('ha ocurrido un error');
          this.alerta.showErrorAlert('Ha ocurrido un error!');
        })
    }
  }

  SingUpAccount() {
    if (this.Newcorreo == '' || this.Newcorreo == null || this.Newpassword == null || this.Newpassword == '') {
      //alert('ha ocurrido un error');
      this.alerta.showErrorAlert('Ingrese sus credenciales');

    } else {
      this.autenticacion.SignUp(this.Newcorreo, this.Newpassword).then
        (res => {
          //alert('todo correcto')
        })
        .catch(error => {
          //alert('ha ocurrido un error');
          this.alerta.showErrorAlert('Ha ocurrido un error!');
        })
    }
  }

}
