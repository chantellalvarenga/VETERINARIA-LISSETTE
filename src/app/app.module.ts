import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Formularios
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

//firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Componentes Creados
import { TablavisitasComponent } from './components/tablavisitas/tablavisitas.component';
import { FormvisitaComponent } from './components/formvisita/formvisita.component';
import { FormNewClienteComponent } from './components/form-new-cliente/form-new-cliente.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import {MaterialModule} from '../material.module';
import { FormMascotasComponent } from './components/form-mascotas/form-mascotas.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TablavisitasComponent,
    FormvisitaComponent,
    FormNewClienteComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FormMascotasComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [FormMascotasComponent]
})
export class AppModule { }
