//!Añadir fichero de carga que contenga el basepath del hosting
//!Base de datos
//!Crear endpoints para las operaciones CRUD de la base de datos servicio
//!Implementar las operaciones CRUD del back al front servicio
//!Crear endpoints para las operaciones CRUD de la base de datos convivencia
//!Implementar las operaciones CRUD del back al front servicio convivencia
//!Tildes en alumnos
//!Correccion de errores
//!Pagina de datos no cargados en la web principal en vez de en su pagina propia
//!Añadir filtro de vuelta en visitas servicio
//Añadir a la documentacion los comandos de nvm (versionado de node)
//!Alumnos planos
//Spring security por ahora como trabajo futuro 
//Parte de tarde
//!Tener un listado de alumnos y averiguar donde estan
//!Actualizar los baños haciendo que si la vuelta es nula poner que el profesor x no le ha dado a regresar
//?Habilitar la localizacion de cursos en los planos (averiguar colocacion enfasis)

import { Alumno } from "@/models/alumnos";
import { Puntos } from "@/models/puntos";
import basePath from "@/resources/path.json";

const path = basePath.base_path;
/**
 * Metodo que realiza una peticion http al servidor TimeTable para recoger 
 * informacion de los profesores
 * @returns informacion de los profesores en formato json
 */
export const getTeachers = async () =>{
    try
    {
        let url = path+"/horarios/get/teachers";
        const response = await fetch(url);
        if(!response.ok)
        {
            throw new Error("No se ha cargado previamente ningun dato de los profesores");
        }  
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

/**
 * Metodo que realiza una peticion http al servidor TimeTable para recoger 
 * informacion de las horas
 * @returns informacion de los profesores en formato json
 */
export const getHours = async ()=>{
    try
    {
        let url = path+"/horarios/get/hours";
        const response = await fetch(url);
        if(!response.ok)
        {
            throw new Error("No se ha cargado previamente ningun dato de las horas");
        }  
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
} 
/**
 * Metodo que realiza una peticion http al servidor TimeTable para recoger 
 * informacion de los cursos
 * @returns informacion de los cursos en formato json
 */
export const getCourses = async ()=>{
    try
    {
        let url = path+"/horarios/get/coursenames";
        const response = await fetch(url);
        if(!response.ok)
        {
            throw new Error("No se ha cargado previamente ningun dato de las horas");
        }  
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getStudentCourses = async ()=>{
    try
    {
        let url = path+"/horarios/get/students-course";
        const response = await fetch(url);
        if(!response.ok)
        {
            throw new Error("No se ha cargado previamente ningun dato sobre los alumnos");
        }
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}
/**
 * Metodo que realiza una peticion http al servidor para recoger 
 * informacion sobre los tramos horarios
 * @returns datos de los tramos horarios en formato json
 */
export const getTramos = async ()=>{
    try
    {
        let url = path+"/horarios/get/tramos";
        const response = await fetch(url);
        if(!response.ok)
        {
            throw new Error("No se han cargado previamente ningun dato de los tramos");
        }
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}
/**
 * Metodo que realiza una peticion http al servidor TimeTable para 
 * localizar a un profesor en tiempo real
 * @param {string} nombre 
 * @param {string} apellido 
 * @returns aula donde se encuentra el profesor
 */
export const getTeacherClassroom = async (nombre,apellido)=>{
    try
    {
        const params = {
            name:nombre,
            lastname: apellido
        };

        let url = path+"/horarios/teacher/get/classroom?"+new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Error al introducir el profesor");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getTeacherClassroomHora = async (nombre,apellido,tramo)=>{
    try
    {
        const params = {
            name:nombre,
            lastname: apellido
        };

        let url = path+"/horarios/teacher/get/classroom/tramo?"+new URLSearchParams(params).toString();

        const response = await fetch(url,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(tramo)
        });

        if(!response.ok)
        {
            throw new Error("Tramos no cargados o mal introducidos");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getClassroomCourse = async (curso)=>{
    try
    {
        const param = {
            courseName: curso
        }

        let url = path+"/horarios/get/teachersubject?"+new URLSearchParams(param).toString();

        const response = await  fetch(url);

        if(!response.ok)
        {
            throw new Error("Cursos no cargados o mal introducidos");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getPoints = async ()=>{
    try
    {
        let url = path+"/horarios/get/points";

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Error de servidor, no se pudo presentar la peticion")
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error)
    }
}

export const getSortStudents = async () =>{
    try
    {
        let url = path+"/horarios/get/sortstudents"

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("No se ha cargado ningn estudiante");
        }

        return await response.json();
    }
    catch(error)
    {

    }
}

export const getSortStudentsCourse = async (curso)=>{
    try
    {
        const param = {
            course: curso
        }

        let url = path+"/horarios/get/course/sort/students?"+new URLSearchParams(param).toString();
        
        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("El curso no coincide o los alumnos no han sido cargados");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error)
    }
}
/**
 * Metodo que envia el fichero xml para configurar el centro
 * @param {FormData} file 
 * @returns true si el fichero ha sido cargado correctamente, false si no
 */
export const cargarXml = async (file) =>{
    try
    {
        let url = path+"/horarios/send/xml";

        const response = await fetch(url,{
            method:"POST",
            body:file
        });

        if(!response.ok)
        {
            throw new Error("El fichero xml es incorrecto");
        }

        return await true;
    }
    catch(error)
    {
        console.log(error);
        return await false;
    }
}

/**
 * Metodo que envia el fichero csv para cargar los alumnos del centro
 * @param {FormData} file 
 * @returns true si el fichero ha sido cargado correctamente, false si no
 */
export const cargarCsvAlumnos = async (file) =>{
    try
    {
        let url = path+"/horarios/send/csv-alumnos";

        const response = await fetch(url,{
            method:"POST",
            body:file
        });

        if(!response.ok)
        {
            throw new Error("El fichero csv es incorrecto");
        }

        return await true;
    }
    catch(error)
    {
        console.log(error);
        return await false;
    }
}
/**
 * Metodo que envia el fichero csv para cargar los planos del centro
 * @param {FormData} file 
 * @returns true si el fichero ha sido cargado correctamente, false si no
 */
export const cargarCsvPlanos = async(file)=>{
    try
    {
        let url = path+"/horarios/send/csv-planos";

        const response = await fetch(url,{
            method:"POST",
            body:file
        });

        if(!response.ok)
        {
            throw new Error("El fichero csv es incorrecto");
        }

        return await true;
    }
    catch(error)
    {
        console.log(error);
        return await false;
    }
}
/**
 * Metodo que pasandole un nombre y apellido realiza una peticion http
 * al servidor devolviendo el horario de un profesor en formato pdf
 * @param {string} nombre 
 * @param {string} apellido 
 * @returns respuesta en blob para obtener la url del pdf descargado en web
 */
export const descargarPdfProfesores = async (nombre,apellido) =>{
    try
    {
        const params = {
            name:nombre,
            lastname: apellido
        };

        let url = path+"/horarios/get/horario/teacher/pdf?"+ new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Profesores no cargados");
        }

        return await response.blob();
    }
    catch(error)
    {
        console.log(error);
    }

}

/**
 * Metodo que realiza una peticion http al servidor para descargar el pdf del
 * horario de todos los profesores
 * @returns respuesta en blob para obtener la url del pdf descargado en web
 */
export const descargarPdfTodosProfesores = async () =>{
    try
    {
        let url = path+"/horarios/get/teachers/pdf";

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Profesores no cargados");
        }

        return await response.blob();
    }
    catch(error)
    {
        console.log(error);
    }
}
/**
 * Metodo que mediante un grupo se realiza una peticion http que descarga un
 * pdf con el horario del grupo introducido
 * @param {string} grupo 
 * @returns respuesta en blob para obtener la url del pdf descargado en web
 */
export const descargarPdfGrupo = async (grupo) => {
    try
    {
        const params = {
            group:grupo
        };

        let url = path+"/horarios/get/grupo/pdf?"+new URLSearchParams(params).toString();
        
        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Grupos no cargados");
        }

        return await response.blob();
    }
    catch(error)
    {
        console.log(error);
    }
}
/**
 * Metodo que realiza una peticion http al servidor para descargar el pdf del
 * horario de todos los grupos
 * @returns respuesta en blob para obtener la url del pdf descargado en web
 */
export const descargarPdfGrupos = async () => {
    try
    {
        let url = path+"/horarios/get/grupos/pdf";

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Grupos no cargados");
        }

        return await response.blob();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const registrarIda = async (nombre,apellidos,curso) =>{
    try
    {
        const params = {
            name:nombre,
            lastName:apellidos,
            course:curso
        };

        let url = path+"/horarios/student/visita/bathroom?"+new URLSearchParams(params).toString();

        const response = await fetch(url,{
            method:"POST"
        });

        if(!response.ok)
        {
            throw new Error("El alumno se encuentra en el baño");
        }

        return true;
    }
    catch(error)
    {
        console.log(error);

        return false;
    }
}

export const registrarVuelta = async(nombre,apellidos,curso) =>{
    try
    {
        const params = {
            name:nombre,
            lastName:apellidos,
            course:curso
        };

        let url = path+"/horarios/student/regreso/bathroom?"+new URLSearchParams(params).toString();

        const response = await fetch(url,{
            method:"POST"
        });

        if(!response.ok)
        {
            throw new Error("El alumno se encuentra en el baño");
        }

        return true;
    }
    catch(error)
    {
        console.log(error);

        return false;
    }

}

export const obtenerVisitasAlumno = async(nombre,apellidos,curso,fechaInicio,fechaFin) =>{
    try
    {
        const params = {
            name:nombre,
            lastName:apellidos,
            course:curso,
            fechaInicio:fechaInicio,
            fechaFin:fechaFin
        }

        let url = path+"/horarios/get/veces/visitado/studentFechas?"+new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("No se encuentran registros de visita al baño por parte del alumno");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const obtenerVisitasAlumnos = async(fechaInicio,fechaFin) =>{
    try
    {
        const params = {
            fechaInicio:fechaInicio,
            fechaFin:fechaFin
        }

        let url = path+"/horarios/get/students/visitas/bathroom?"+new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("No hay visitas en este periodo");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const obtenerNumeroVisitas = async (name,lastName,course) =>{
    try
    {
        let params = {
            name:name,
            lastname:lastName,
            course:course
        }

        let url = path+"/horarios/get/student/numero-veces-servicio?"+ new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Error al obtener el numero de veces que un alumno ha ido al servicio");     
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error)
    }
}

export const obtenerAulasPorPlanta = async(planta) =>{
    try
    {
        const params = {
            planta:planta
        }

        let url = path+"/horarios/get/classroom-planos?"+new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("La planta esta mal introducida");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error)
    }
}

/**
 * Metodo que realiza una peticion http al servidor para comprobar el estado actual
 * de los datos, puede devolver 5 respuestas
 * <ol>
 *  <li>Error de datos en general (datos no cargados)</li>
 *  <li>Estudiantes no cargados</li>
 *  <li>Planos no cargados</li>
 *  <li>Servidor no lanzado</li>
 *  <li>Datos cargados</li>
 * </ol>
 * @returns respuesta cionstante que servira para llamar a otra peticion
 */
export const checkServerData = async()=>{
    try
    {
        let url = path+"/horarios/check-data"; 

        const response = await fetch(url);

        if(response.ok)
        {
            return "ok";
        }
        else if(response.status==400)
        {
            return await response.json();
        }
        else
        {
            throw new Error("El servidor no esta lanzado");
        }
    }
    catch(error)
    {
        console.log(error);
        return undefined;
    }
}
/**
 * Metodo que manda la informacion del error al servidor para obtenerla mas adelante
 * en la pagina de error
 * @returns true o false dependiendo del estado de la respuesta
 */
export const sendErrorInfo = async(objectError)=>{
    try
    {
        let url = path+"/horarios/send/error-info";

        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(objectError)
        });
       
        if(!response.ok)
        {
            throw new Error("Error al mandar la informacion del error")
        }
        return await true;
    }
    catch(error)
    {
        console.log(error);
        return await false;
    }
}
/**
 * Metodo que llama al servidor y obtiene la informacion del error en json
 * para colocar sus datos en la pagina de error 
 * @returns error en formato json
 */
export const getInfoError = async()=>{
    let response = undefined;
    let isDone = false;
    try
    {
        let url = path+"/horarios/get/error-info";

        response = await fetch(url);

        isDone = true;

        if(!response.ok)
        {
            throw new Error("El servidor no se ha lanzado")
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
        //En caso de que la respuesta sea ok y no pueda darle formato al json significa
        //que el servidor se acaba de arrancar y forzamos a devolver el error de que no
        //se han cargado datos en general
        if(isDone)
        {
            if(response.ok)
            {
                let infoError = {
                    headerInfo:"Datos no cargados",
                    infoError:"El administrador aun no ha cargado los datos en el servidor cuando los cargue se le redigira al apartado de planos gracias por la espera",
                    wait:true
                };
                sendErrorInfo(infoError);
                return infoError = {
                    headerInfo:"Datos no cargados",
                    infoError:"El administrador aun no ha cargado los datos en el servidor cuando los cargue se le redigira al apartado de planos gracias por la espera",
                    wait:true
                };
            }
        }
        else
        {
            return undefined;
        }
        
    }
}

/**
 * Metodo que realiza una peticion al servidor enviando un aula como parametro
 * y recibiendo informacion en tiempo real del aula mandada
 * @param {string} numIntAu 
 * @param {string} abreviatura 
 * @param {string} nombre 
 * @returns Profesor que se encuentra en el aula, la asignatura que esta impartiendo y el grupo que esta recibiendo esa asignatura
 */
export const getAulaNow = async(numIntAu,abreviatura,nombre) =>{
    try
    {
        const params = {
            numIntAu:numIntAu,
            abreviatura:abreviatura,
            nombre,nombre
        };

        let url = path+"/horarios/get/aula-now?"+new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Error al obtener la informacion actual del aula");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

/**
     * Metodo que hace una peticion al servidor para guardar en la base de datos
     * una sancion que se impone a un alumno con unos puntos determinados
     * @param {Alumno} student 
     * @param {Puntos} points
     * @returns true o false dependiendo del estado de la peticion
     */
export const ponerSancion = async(student,points) =>{
    try
    {
        let params = {
            value:points.points,
            description:points.description
        }

        let url = path+"/horarios/send/sancion?"+new URLSearchParams(params).toString();

        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body:JSON.stringify(student),
        });

        if(!response.ok)
        {
            throw new Error("Error al imponer la sancion");
        }

        return true;  
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}

export const parseCourseStudent = async(curso) =>{
    try
    {
        const params = {
            course:curso
        };

        let url = path+"/horarios/get/parse-course?"+new URLSearchParams(params).toString();

        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error("Error al parsear el curso del alumno a los datos generales");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}