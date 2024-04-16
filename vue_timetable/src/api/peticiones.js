
/**
 * Metodo que realiza una peticion http al servidor TimeTable para recoger 
 * informacion de los profesores
 * @returns informacion de los profesores en formato json
 */
export const getTeachers = async () =>{
    try
    {
        let url = "http://localhost:8088/horarios/get/teachers";
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
        let url = "http://localhost:8088/horarios/get/hours";
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
        let url = "http://localhost:8088/horarios/get/coursenames";
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
        let url = "http://localhost:8088/horarios/get/students-course";
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
        let url = "http://localhost:8088/horarios/get/tramos";
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

        let url = "http://localhost:8088/horarios/teacher/get/classroom?"+new URLSearchParams(params).toString();

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

        let url = "http://localhost:8088/horarios/teacher/get/classroom/tramo?"+new URLSearchParams(params).toString();

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

        let url = "http://localhost:8088/horarios/get/teachersubject?"+new URLSearchParams(param).toString();

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
        let url = "http://localhost:8088/horarios/get/points";

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
        let url = "http://localhost:8088/horarios/get/sortstudents"

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

        let url = "http://localhost:8088/horarios/get/course/sort/students?"+new URLSearchParams(param).toString();
        
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
        let url = "http://localhost:8088/horarios/send/xml";

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
        let url = "http://localhost:8088/horarios/send/csv-alumnos";

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

        let url = "http://localhost:8088/horarios/get/horario/teacher/pdf?"+ new URLSearchParams(params).toString();

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
        let url = "http://localhost:8088/horarios/get/teachers/pdf";

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

        let url = "http://localhost:8088/horarios/get/grupo/pdf?"+new URLSearchParams(params).toString();
        
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
        let url = "http://localhost:8088/horarios/get/grupos/pdf";

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

        let url = "http://localhost:8088/horarios/student/visita/bathroom?"+new URLSearchParams(params).toString();

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

        let url = "http://localhost:8088/horarios/student/regreso/bathroom?"+new URLSearchParams(params).toString();

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

        let url = "http://localhost:8088/horarios/get/veces/visitado/studentFechas?"+new URLSearchParams(params).toString();

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

        let url = "http://localhost:8088/horarios/get/students/visitas/bathroom?"+new URLSearchParams(params).toString();

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

export const obtenerAulasPorPlanta = async(planta) =>{
    try
    {
        const params = {
            planta:planta
        }

        let url = "http://localhost:8088/horarios/get/classroom-planos?"+new URLSearchParams(params).toString();

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