import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  showErrorAlert(textoalerta: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops..',
      text: textoalerta
    })
  }
  showSuccessAlert(textoalerta: string) {
    Swal.fire({
      icon: 'success',
      title: 'WooHoo!',
      text: textoalerta
    })
  }


  constructor() { }
}
