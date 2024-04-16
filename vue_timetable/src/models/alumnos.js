export class Alumno {
    /**
     * Constructor que instancia un alumno por su nombre, apellido,curso y numero de baño
     * @param {string} nombre 
     * @param {string} apellidos 
     * @param {string} curso 
     * @param {number} numBathroom
     */
    constructor(nombre,apellidos,curso,numBathroom)
    {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.curso = curso;
        this.numBathroom = numBathroom;
    }
}