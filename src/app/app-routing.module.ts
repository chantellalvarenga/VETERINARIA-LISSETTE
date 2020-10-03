import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormNewClienteComponent } from './components/form-new-cliente/form-new-cliente.component';
import { FormvisitaComponent } from './components/formvisita/formvisita.component';
import { HomeComponent } from './components/home/home.component';
import { TablavisitasComponent } from './components/tablavisitas/tablavisitas.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path:'home',component:HomeComponent},
  {path:'clientes',component:FormNewClienteComponent},
  {path:'visitas/:id',component:FormvisitaComponent},
  {path:'historial/:id',component:TablavisitasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
