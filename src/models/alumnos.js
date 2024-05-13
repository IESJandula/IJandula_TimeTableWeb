export class Alumno{

    /**
     * Constructor que instancia un alumno por su nombre, apellidos, curso año de matriculacion 
     * nombre de tutor, telefono del tutor y email del tutor
     * @param {string} name 
     * @param {string} lastName 
     * @param {string} course 
     * @param {string} matriculationYear 
     * @param {string} firstTutorLastName 
     * @param {string} secondTutorLastName 
     * @param {string} tutorName 
     * @param {string} tutorPhone 
     * @param {string} tutorEmail 
     */
    constructor(name,lastName,course,matriculationYear,firstTutorLastName,secondTutorLastName,tutorName,tutorPhone,tutorEmail)
    {
            this.name = name
            this.lastName = lastName
            this.course = course
            this.matriculationYear = matriculationYear
            this.firstTutorLastName = firstTutorLastName
            this.secondTutorLastName = secondTutorLastName
            this.tutorName = tutorName
            this.tutorPhone = tutorPhone
            this.tutorEmail = tutorEmail
    }
}