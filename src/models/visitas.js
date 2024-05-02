import { Alumno } from "./alumnos";
export class Visita{
    /**
     * Constructor que crea una visita al baño por un alumno y una fecha
     * @param {Alumno} alumno 
     * @param {string} fecha 
     */
    constructor(alumno,fecha)
    {
        this.alumno = alumno;
        this.fecha = fecha;
    }
}

export class RegistroVisita{
    /**
     * Constructor que guarda el registro de una visita realizada por un alumno
     * @param {string} hora 
     * @param {string} dia 
     */
    constructor(hora,dia)
    {
        this.hora = hora;
        this.dia = dia;
    }
}