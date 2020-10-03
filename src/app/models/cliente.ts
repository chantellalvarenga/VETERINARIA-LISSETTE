import {Mascota} from '../models/mascota';
import {Visita} from '../models/visita';
export interface Cliente {
    id?:string,
    Nombres:string,
    Apellidos:string,
    DUI:string,
    Mascotas:string[],
    Visitas:Visita[],
    created?:Date
}
