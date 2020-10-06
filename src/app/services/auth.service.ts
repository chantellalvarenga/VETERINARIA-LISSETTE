import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'firebase';
import Swal from 'sweetalert2';
import { AlertasService } from 'src/app/services/alertas.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuario: User;
  NombreUsuario: string;
  FotoPerfil: string;
  correo: string;
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private alerta: AlertasService
  ) {

    /* Guardar datos de usuario en almacenamiento local cuando
   iniciado sesión y configurando nulo al cerrar sesión*/
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.usuario = user;
        localStorage.setItem('user', JSON.stringify(this.usuario));
        //console.log(this.usuario);
      } else {
        localStorage.setItem('user', null);
      }
    })
  }


  ClearUser() {
    this.NombreUsuario = '';
    this.FotoPerfil = '';
    this.correo = '';
  }

  

  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    this.NombreUsuario = this.usuario.displayName;
    this.FotoPerfil = this.usuario.photoURL;
    this.correo = this.usuario.email;
    this.router.navigate(['/clientes']);
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    //alert('has salido');
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Has cerrado sesión',
      showConfirmButton: false,
      timer: 1500
    })
    this.ClearUser();
    this.router.navigate(['/']);
  }
  //Metodo que devuelve un bool para ver si esta loggeado el usuario 
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  // Iniciar sesión con correo electrónico / contraseña
  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then((result) => {
      this.ngZone.run(() => {
        this.alerta.showSuccessAlert('Inicio de sesión exitoso!');
        this.router.navigate(['/clientes']);
      });
      if (result.user) {
        this.usuario = result.user;
        localStorage.setItem('user', JSON.stringify(this.usuario));
        //console.log(this.usuario);
      } else {
        localStorage.setItem('user', null);
      }
    }).catch((error) => {
      // window.alert("Por favor revisar credenciales")
      this.alerta.showErrorAlert('Por favor revisar credenciales');
    })
  }

  // Regístrese con correo electrónico / contraseña
  SignUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Llame a la función SendVerificaitonMail () cuando un nuevo usuario firme
        y vuelve la funcion*/
        this.SendVerificationMail();
        if (result.user) {
          this.alerta.showSuccessAlert('Registro exitoso!');
          this.usuario = result.user;
          localStorage.setItem('user', JSON.stringify(this.usuario));
          console.log(this.usuario);
          //window.location.reload();
          this.router.navigate(['/clientes']);
          
        } else {
          localStorage.setItem('user', null);
        }
      }).catch((error) => {
        this.alerta.showErrorAlert('Ha ocurrido un error');
      })
  }

  // Enviar verificación por correo electrónico cuando se registre un nuevo usuario
  SendVerificationMail() {
    return this.afAuth.currentUser.then(u => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  // Restablecer contraseña olvidada
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }


}
