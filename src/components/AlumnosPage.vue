<script setup>
import { ref, watch,onMounted,onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getStudentCourses,getSortStudentsCourse,getSortStudents,registrarIda,registrarVuelta,obtenerVisitasAlumno,obtenerVisitasAlumnos,sendErrorInfo,obtenerNumeroVisitas,getClassroomCourse,parseCourseStudent } from '@/api/peticiones';
import { Alumno } from '@/models/alumnos';
import { RegistroVisita,AlumnoBathroom } from '@/models/visitas';
import { separadorNombreCurso,compareDate,convertirFecha,checkData } from "@/js/utils";
//Instancia del router
const router = useRouter();
const body = document.getElementById("body");
body.style.backgroundColor = "rgb(230, 253, 253)";
body.style.padding = 0;
body.style.margin = 0;

//Instancia de variables
let recarga = ref(true);
let cursos = ref([]);
let alumnos = ref([]);
let tipoAlumno = ref("");
let tutor = ref(["?","?","?"]);
let idaVuelta = ref(["?","?","?"]);
let stats = ref(["?","?","?","?"]);
let mostrarTutor = ref(false);
let infoTutor = ref("");
let estiloTutor = ref("");
let infoIdaVuelta = ref("");
let estiloIdaVuelta = ref("");
let mostrarVisitas = ref(false);
let infoEstadisticas = ref("");
let estiloEstadisticas = ref("");
let infoListado = ref("");
let mostrarListado = ref(false);
let errorAlumnos = ref(false);
let header = ref("");
let content = ref("");
let interval = undefined;
let filtradoCurso = ref(false);
let filtradoAlumno = ref(false);
let showLocAlumno = ref(false);
let infoAlumno = ref("");
let infoAula = ref("");
//Variables privadas
let _alumnos = ref([]);
let _alumnosLoc = ref([]);
let _infoAlumnos = ref([]);
let _idaVueltaAlumnos = ref([]);
let _statsAlumnos = ref([]);
let _mostrarInfoAlumnos = ref(false);
let _mostrarIdaVueltaAlumnos = ref(false);
let _mostrarStatsAlumnos = ref(false);
let _visitasAlumno = ref([]); 
let _listadoAlumno = ref([]);
let _cursosAlumno = ref([]);

//Metodos
/**
 * Metodo que recoge los cursos de los alumnos y manda una señal para recargar la pagina
 */
const getCourse = async()=>{
    //Llamada a la peticion
    const data = await getStudentCourses();
    //Array cursos en formato string
    let arrayCursos = [];
    //Iterador de los datos que guarda los cursos
    for(let i = 0;i<data.length;i++)
    {
        arrayCursos.push(data[i]);
    }

    cursos = ref(arrayCursos);
    //Llamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Metodo que carga todos los alumnos al principio para guardar las
 * veces que un alumno ha ido al baño
 */
const cargarAlumnos = async()=>{
    const data = await getSortStudents();

    let arrayAlumno = [];
    let arrayAlumnoLoc = [];
    for(let i=0;i<data.length;i++)
    {
        let alumno = new Alumno(data[i].name,data[i].lastName,data[i].course,data[i].matriculationYear,data[i].firstTutorLastName,data[i].secondTutorLastName,
		        data[i].tutorName,data[i].tutorPhone,data[i].tutorEmail
		        );
    
        arrayAlumno.push(alumno);
        arrayAlumnoLoc.push(alumno.name+" "+alumno.lastName);
    }

    _alumnos = ref(arrayAlumno);
    _alumnosLoc = ref(arrayAlumnoLoc);
    recarga.value = false;
}

/**
 * Metodo que recoge los nombres de los alumnos filtrados por el curso
 * introducido como parametro 
 * @param {string} curso 
 */
 const cargarAlumnosCurso = async(curso)=>{
    //Llamada a la peticion
    const data = await getSortStudentsCourse(curso);
    //Array de alumnos en formato string 
    let alumnosString = [];
    //Iterador de los datos que guarda los alumnos
    for(let i = 0;i<data.length;i++)
    {
        let nombre = data[i].name+" "+data[i].lastName;
        alumnosString.push(nombre);
    }

    alumnos.value = alumnosString;
    //Llamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Metodo que recoge los nombres de los alumnos filtrados por el curso
 * introducido como parametro 
 * @param {string} curso 
 */
 const cargarAlumnosCursoLoc = async(curso)=>{
    //Llamada a la peticion
    const data = await getSortStudentsCourse(curso);
    //Array de alumnos en formato string 
    let alumnosString = [];
    //Iterador de los datos que guarda los alumnos
    for(let i = 0;i<data.length;i++)
    {
        let nombre = data[i].name+" "+data[i].lastName;
        alumnosString.push(nombre);
    }

    _alumnosLoc.value = alumnosString;
    //Llamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Evento que controla que al cambiar el selector de cursos de la informacion de alumnos
 * los alumnos se filtren segun el curso seleccionado
 */
const onChangeCursoInfoAlumno = () => {
    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("selector-curso");
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    //Comprobamos que se haya seleccionado algun dato
    if(curso=="Seleccionar")
    {
        alert("Curso nulo no se filtran alumnos");
        _mostrarInfoAlumnos.value = false;
    }
    else
    {
        _mostrarInfoAlumnos.value = true;
        //Indicamos que solo queremos mostrar los alumnos del apartado de info
        tipoAlumno.value = "info_alumnos"
        cargarAlumnosCurso(curso);
    }

}

/**
 * Evento que controla que al cambiar el selector de cursos del registro de ida y vuelta 
 * los alumnos se filtren segun el curso seleccionado
 */
const onChangeCursoIdaVuelta = () => {
    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("cursoBathroom");
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    //Comprobamos que se haya seleccionado algun dato
    if(curso=="Seleccionar")
    {
        alert("Curso nulo no se filtran alumnos");
        _mostrarIdaVueltaAlumnos.value = false;
    }
    else
    {
        _mostrarIdaVueltaAlumnos.value = true;
        //Indicamos que solo queremos mostrar los alumnos del apartado de info
        tipoAlumno.value = "ida_vuelta_alumnos"
        cargarAlumnosCurso(curso);
    }
} 

/**
 * Evento que controla que al cambiar el selector de cursos del registro de estadisticas
 * los alumnos se filtran segun el curso seleccionado
 */
const onChangeStats = () =>{
    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("cursoStats");
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    //Comprobamos que se haya seleccionado algun dato
    if(curso=="Seleccionar")
    {
        alert("Curso nulo no se filtran alumnos");
        _mostrarStatsAlumnos.value = false;
    }
    else
    {
        _mostrarStatsAlumnos.value = true;
        //Indicamos que solo queremos mostrar los alumnos del apartado de info
        tipoAlumno.value = "stats_alumnos"
        cargarAlumnosCurso(curso);
    }
}
/**
 * Evento que recoge los datos del alumno y el curso al cambiar el selector de alumnos 
 * los encapsula en una tabla para luego mandarlos en una peticion http
 */
const onChangeAlumnosIdaVuelta = () =>{
    //Obtenemos el id del selector de alumnos
    const alumnoSelection = document.getElementById("alumnosIdaVuelta");
    //Obtenemos su valor en bruto
    let alumno = alumnoSelection.options[alumnoSelection.selectedIndex].text;

    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("cursoBathroom");
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    if(alumno=="Nombre y apellidos")
    {
        infoIdaVuelta.value = "No se ha seleccionado ningun alumno";
        estiloIdaVuelta.value = "color:darkgoldenrod;";
        idaVuelta = ref(["?","?","?"]);
        recarga.value = false;

    }
    else
    {
        let alumnoObject = separadorNombreCurso(alumno,curso,_alumnos.value);
        idaVuelta = ref([alumnoObject.name,alumnoObject.lastName,alumnoObject.course]);
        infoIdaVuelta.value = "";
        recarga.value = false;
    }
}

/**
 * Evento que recoge los datos del alumno y el curso al cambiar el selector de alumnos
 * los encapsula en una tabla para luego mandarlos en una peticion http
 */
const onChangeAlumnosStats = async () =>{
    //Obtenemos el id del selector de alumnos
    const alumnoSelection = document.getElementById("alumnosStats");
    //Obtenemos su valor en bruto
    let alumno = alumnoSelection.options[alumnoSelection.selectedIndex].text;

    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("cursoStats");
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    if(alumno=="Nombre y apellidos")
    {
        stats = ref(["?","?","?","?"]);
        recarga.value = false;
    }
    else
    {
        let alumnoObject = separadorNombreCurso(alumno,curso,_alumnos.value);
        let numeroVisitas = await obtenerNumeroVisitas(alumnoObject.name,alumnoObject.lastName,alumnoObject.course);
        stats = ref([alumnoObject.name,alumnoObject.lastName,alumnoObject.course,numeroVisitas]);
        recarga.value = false;
    }
}

const onClickIda = async () =>{

    if(idaVuelta.value[0]=="?" || idaVuelta.value[1]=="?" || idaVuelta.value[2]=="?")
    {
        infoIdaVuelta.value = "Alumno/a no seleccionado";
        estiloIdaVuelta.value = "color:darkgoldenrod;";
        recarga.value = false;
    }
    else
    {
        const data = await registrarIda(idaVuelta.value[0],idaVuelta.value[1],idaVuelta.value[2]);

        if(data)
        {
            infoIdaVuelta.value = "Ida registrada para el alumno/a "+idaVuelta.value[0]+" "+idaVuelta.value[1];
            estiloIdaVuelta.value = "color:forestgreen;"
            recarga.value = false;
        }
        else
        {
            infoIdaVuelta.value = "El alumno/a "+idaVuelta.value[0]+" "+idaVuelta.value[1]+" se encuentra en el baño";
            estiloIdaVuelta.value = "color:darkred;"
            recarga.value = false;
        }
    }
    
}

const onClickVuelta = async () => {
    if(idaVuelta.value[0]=="?" || idaVuelta.value[1]=="?" || idaVuelta.value[2]=="?")
    {
        infoIdaVuelta.value = "Alumno/a no seleccionado";
        estiloIdaVuelta.value = "color:darkgoldenrod;"
        recarga.value = false;
    }
    else
    {
        const data = await registrarVuelta(idaVuelta.value[0],idaVuelta.value[1],idaVuelta.value[2]);

        if(data)
        {
            infoIdaVuelta.value = "Vuelta registrada para el alumno/a "+idaVuelta.value[0]+" "+idaVuelta.value[1];
            estiloIdaVuelta.value = "color:forestgreen;"
            recarga.value = false;
            cargarAlumnos();
        }
        else
        {
            infoIdaVuelta.value = "El alumno/a "+idaVuelta.value[0]+" "+idaVuelta.value[1]+" no ha ido al baño";
            estiloIdaVuelta.value = "color:darkred;"
            recarga.value = false;
        }
    }
}

const obtenerVisitaAlumno = async(nombre,apellidos,curso,fechaInicio,fechaFin) =>{
    const data = await obtenerVisitasAlumno(nombre,apellidos,curso,fechaInicio,fechaFin);

    if(typeof data == "undefined")
    {
        infoEstadisticas.value = "No se han encontrado registros para el periodo "+fechaInicio+" - "+fechaFin;
        estiloEstadisticas = "color:darkred;";
        mostrarVisitas.value = false
    }
    else if(data.length==0)
    {
        infoEstadisticas.value = "Registros no encontrados para el alumno "+nombre+" "+apellidos;
        estiloEstadisticas = "color:darkred;";
        mostrarVisitas.value = false;
    }
    else
    {
        let arrayVisitas = [];

        for(let i=0;i<data.length;i++)
        {
            let visita = new RegistroVisita(data[i].horas,data[i].dia);
            arrayVisitas.push(visita);
        }
        _visitasAlumno = ref(arrayVisitas);
        mostrarVisitas.value = true;
        infoEstadisticas.value = "";
    }
    recarga.value = false;
}

const obtenerVisitaAlumnos = async(fechaInicio,fechaFin) =>{
    const data = await obtenerVisitasAlumnos(fechaInicio,fechaFin);

    if(typeof data == "undefined")
    {
        mostrarListado.value = false;
        estiloIdaVuelta.value = "color: darkred;"
        infoListado.value = "No se han podido encontrar alumnos en este momento";
    }
    else
    {
        let arrayListado = [];

        for(let i=0;i<data.length;i++)
        {
            let alumno = new AlumnoBathroom(data[i].alumno.nombre,data[i].alumno.apellidos,data[i].curso,data[i].horas,data[i].dia)
            arrayListado.push(alumno);
        }

        _listadoAlumno = ref(arrayListado);


        estiloIdaVuelta.value = "color: forestgreen;"
        infoListado.value = "Alumnos encontrados";
        mostrarListado.value = true;
    }
    recarga.value = false;
}
/**
 * 
 */
const onClickStats = () =>{
     //Obtenemos el id del selector de alumnos
     const alumnoSelection = document.getElementById("alumnosStats");
    //Obtenemos su valor en bruto
    let alumno = alumnoSelection.options[alumnoSelection.selectedIndex].text;

    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("cursoStats");
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    //Obtenemos la fecha de inicio
    const fechaInicio = document.getElementById("fechaInicio");
    //Obtenemos su valor en bruto
    let valorFechaInicio = convertirFecha(fechaInicio.value);

    //Obtenemos la fecha de fin
    const fechaFin = document.getElementById("fechaFin");
    //Obtenemos su valor en bruto
    let valorFechaFin = convertirFecha(fechaFin.value);

    if(alumno=="Nombre y apellidos")
    {
        infoEstadisticas.value = "No se ha seleccionado ningun alumno";
        estiloEstadisticas = "color:darkgoldenrod;";
    }
    else if(valorFechaInicio=="")
    {
        infoEstadisticas.value = "No se ha seleccionado fecha de inicio";
        estiloEstadisticas = "color:darkgoldenrod;";
    }
    else if(valorFechaFin=="")
    {
        infoEstadisticas.value = "No se ha seleccionado fecha de fin";
        estiloEstadisticas = "color:darkgoldenrod;";
    }
    else if(!compareDate(valorFechaInicio,valorFechaFin))
    {
        infoEstadisticas.value = "La fecha de inicio es posterior a la fecha de fin";
        estiloEstadisticas = "color:darkgoldenrod;";
    }
    else
    {
        let nombreApellido = separadorNombreCurso(alumno,curso,_alumnos.value);
        obtenerVisitaAlumno(nombreApellido.name,nombreApellido.lastName,curso,valorFechaInicio,valorFechaFin); 
    }
}

const onClickListado = () =>{
    //Obtenemos la fecha de inicio
    const fechaInicio = document.getElementById("fechaListadoInicio");
    //Obtenemos su valor en bruto
    let valorFechaInicio = convertirFecha(fechaInicio.value);

    //Obtenemos la fecha de fin
    const fechaFin = document.getElementById("fechaListadoFinal");
    //Obtenemos su valor en bruto
    let valorFechaFin = convertirFecha(fechaFin.value);

    if(valorFechaInicio=="")
    {
        alert("No se ha seleccionado fecha de inicio");
    }
    else if(valorFechaFin=="")
    {
        alert("No se ha seleccionado fecha de fin");
    }
    else if(!compareDate(valorFechaInicio,valorFechaFin))
    {
        alert("La fecha de inicio es posterior a la fecha de fin");
    }
    else
    {
        obtenerVisitaAlumnos(valorFechaInicio,valorFechaFin); 
    }
}

const checkStatus = async() =>{
    let error = await checkData();
    if((typeof error != "undefined" && typeof error != "string" && error.headerInfo=="Datos no cargados") && error.headerInfo!="Servidor no lanzado")
    {
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorAlumnos.value = true;
        recarga.value = false;
    }
    else if(error.headerInfo=="Servidor no lanzado")
    {
        router.push("/error");
    }
    else if(error.headerInfo=="Datos de estudiantes no cargados")
    {
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorAlumnos.value = true;
        recarga.value = false;
    }
    else if(typeof error!="undefined")
    {
        header.value = "";
        content.value = "";
        errorAlumnos.value = false;
        getCourse();
        recarga.value = false;
    }
}

const onClickTutor = () =>{
    infoTutor.value = "No disponible en este momento";
    estiloTutor = "color: darkgoldenrod;";
}

const onClickTutorLegal = () =>{
    //Obtenemos el id del selector de alumnos
    let tutorAlumno = document.getElementById("selector-alumno");

    //Obtenemos su valor en bruto
    let alumno = tutorAlumno.options[tutorAlumno.selectedIndex].text;

    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("selector-curso");
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    if(alumno=="Nombre y apellidos")
    {
        tutor = ref(["?","?","?"]);
        recarga.value = false;
        mostrarTutor.value = false;
    }
    else
    {
        let alumnoObject = separadorNombreCurso(alumno,curso,_alumnos.value);

        if(alumnoObject.tutorName==null)
        {
            alumnoObject.tutorName = "";
        }

        if(alumnoObject.firstTutorLastName==null)
        {
            alumnoObject.firstTutorLastName = "";
        }

        if(alumnoObject.secondTutorLastName==null)
        {
            alumnoObject.secondTutorLastName = "";
        }

        let nombreTutor = alumnoObject.tutorName+" "+alumnoObject.firstTutorLastName+" "+alumnoObject.secondTutorLastName;
        
        if(nombreTutor.trim()=="")
        {
            nombreTutor = "sin datos";
        }

        if(alumnoObject.tutorEmail==null)
        {
            alumnoObject.tutorEmail = "sin datos";
        }
        
        if(alumnoObject.tutorPhone==null)
        {
            alumnoObject.tutorPhone = "sin datos";
        }

        tutor = ref([nombreTutor,alumnoObject.tutorEmail,alumnoObject.tutorPhone]);
        recarga.value = false;
        mostrarTutor.value = true;
    }

}

const onChangeCourseSelector = ()=>{
    filtradoCurso.value = true;
    filtradoAlumno.value = false;
    const cursoSelection = document.getElementById("selector-curso-loc");

    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    cargarAlumnosCursoLoc(curso);

    recarga.value = false;
}

const onChangeAlumnoSelector = ()=>{
    filtradoAlumno.value = true;
    filtradoCurso.value = false;
    const alumnoSelection = document.getElementById("selector-alumno-loc");

    let alumno = alumnoSelection.options[alumnoSelection.selectedIndex].text;

    let index = 0;
    let array = [];

    for(let i = 0;i<_alumnos.value.length;i++)
    {
        let item = _alumnos.value[i];
        let value = item.name+" "+item.lastName;
    
        if(alumno==value)
        {
            array.push(item.course);
        }
    }
    if(array.length==0)
    {
        array.push("No encontrado");
    }

    _cursosAlumno = ref(array);
}

const onPressLocAlumno = async () =>{
    const alumnoSelection = document.getElementById("selector-alumno-loc");
    const cursoSelection = document.getElementById("selector-curso-loc");

    let alumno = alumnoSelection.options[alumnoSelection.selectedIndex].text;

    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    const cursoParsed = await parseCourseStudent(curso);
    const data = await getClassroomCourse(cursoParsed.curso);

    if(typeof data == "undefined")
    {
        showLocAlumno.value = true;
        infoAlumno.value = "No se ha podido encontrar la"
        infoAula.value = "localizacion del alumno/a "+alumno;
    }
    else
    {
        showLocAlumno.value = true;
        infoAlumno.value = "El alumno "+alumno
        infoAula.value = "Debe encontrarse en el aula "+data.classroom.floor+" - "+data.classroom.name;
    }

    recarga.value = false;
}

const resetearSelector = async() =>{
    const cursoSelection = document.getElementById("selector-curso-loc");
    const alumnoSelection = document.getElementById("selector-alumno-loc");

    //Seteamos el valor a 0 "Seleccionar" antes de restaurar los booleanos
    cursoSelection.selectedIndex = 0;
    alumnoSelection.selectedIndex = 0;

    filtradoAlumno.value = false;
    filtradoCurso.value = false;

    //Seteamos el valor a 0 "Seleccionar" despues de restaurar los booleanos
    cursoSelection.selectedIndex = 0;
    alumnoSelection.selectedIndex = 0;

    cargarAlumnos();
    getCourse();

    showLocAlumno.value = false;
    _cursoValue.value = "No encontrado";
    recarga.value = false;
}

/**
 * Metodo que se encarga de recoger los datos al entrar en la pagina
 */
onMounted( async () =>{
    getCourse();
    cargarAlumnos();
    interval = setInterval(checkStatus,500);
});

onUnmounted(async ()=>{
    clearInterval(interval);
})

/**
 * Metodo observador que la variable nuevo (booleana) cambie par recargar la pagina
 */
watch(recarga,(nuevo,viejo) => {
    if(!nuevo)
    {
        recarga.value = true;
    }
});

/**
 * Metodo observador que observa que el array de alumnos cambie, una vez
 * que cambia compruevba el tipo de alumno y asigna al valor nuevo al array
 * correspondiente
 */
watch(alumnos,(nuevo,viejo) => {
    if(tipoAlumno.value == "info_alumnos")
    {
        _infoAlumnos = ref(nuevo);
        recarga.value = false;
    }
    else if(tipoAlumno.value == "ida_vuelta_alumnos")
    {
        _idaVueltaAlumnos = ref(nuevo);
        recarga.value = false;
    }
    else if(tipoAlumno.value == "stats_alumnos")
    {
        _statsAlumnos = ref(nuevo);
        recarga.value = false;
    }
})

</script>

<template>
 <header class="header">
            <div class="logo-header">
                <a href=""><img src="/logo.png" alt="logo"></a>
            </div>
            <div class="nav-menu">
                <input type="checkbox" id="check">
                <label for="check" class="checkbtn">
                   
                </label>
                <ul>
                    <li class="botonMenu"  v-on:click="router.push('/horarios/admin')">Administración</li>
                    <li class="botonMenu" v-on:click="router.push('/horarios/profesores')">Profesores</li>
                    <li class="botonMenu" v-on:click="router.push('/horarios/alumnos')">Alumnos</li>
                    <li class="botonMenu" v-on:click="router.push('/horarios/horas')">Horarios</li>
                    <li class="botonMenu" v-on:click="router.push('/horarios/convivencia')">Convivencia</li>
                    <li class="botonMenu" v-on:click="router.push('/horarios/mapa')">Mapas</li>
                </ul>
            </div>
       </header> 
       <div v-if="!errorAlumnos">
        <div class="table-title">
                <h2>Localizar Alumnos</h2>
            </div>
          

            <div class="container-table-info-alumnos" v-show="recarga">
                <div class="selectores-localizacion">
                    
                    <label for="selector-alumno">Alumnos:</label class="selector-alumno">
                        
                    <select name="selector-alumno-loc" id="selector-alumno-loc" v-if="filtradoCurso">
                        <option value="0" selected>Seleccionar</option>
                        <option v-for="i in _alumnosLoc">{{ i }}</option>
                    </select>
                    <select name="selector-alumno" id="selector-alumno-loc" v-else v-on:change="onChangeAlumnoSelector()">
                        <option value="0" selected>Seleccionar</option>
                        <option v-for="i in _alumnosLoc">{{ i }}</option>
                    </select>

                    <label class="label-curso">Cursos:</label>

                    <select name="selector-curso" id="selector-curso-loc" class="selector-curso" v-if="filtradoAlumno">
                        <option v-for="i in _cursosAlumno">{{ i }}</option>
                    </select>
                    <select name="selector-curso" id="selector-curso-loc" class="selector-curso" v-else v-on:change="onChangeCourseSelector()">
                        <option value="0" selected>Seleccionar</option>
                        <option v-for="i in cursos">{{ i }}</option>
                    </select>
                </div>
                <button id="botonStats" v-on:click="resetearSelector()">Resetear</button>
                <button id="botonStats" class="button-style" v-on:click="onPressLocAlumno()">Localizar alumno</button>
                <div id="infoAlumnos" v-show="showLocAlumno">
                    <h3>{{ infoAlumno }}</h3>
                    <h3>{{ infoAula }}</h3>
                </div>
            </div>

            <div class="table-title">
                <h2>Info Alumnos</h2>
            </div>
            <div class="container-table-info-alumnos" v-show="recarga">

                <div class="selectores">
                    <form>
                        <label for="selector-curso">Cursos:</label>
                        <select name="selector-curso" id="selector-curso" v-on:change="onChangeCursoInfoAlumno()">
                            <option selected>Seleccionar</option>
                            <option v-for="i in cursos">{{ i }}</option>
                        </select>
                    </form>

                    <form>
                        <label for="selector-alumno">Alumnos:</label>
                        <select name="selector-alumno" id="selector-alumno">
                            <option selected>Seleccionar</option>
                            <option v-for="i in _infoAlumnos" v-show="_mostrarInfoAlumnos">{{ i }}</option>
                        </select>
                    </form>
                </div>
                
                <div class="tabla-info-alumno">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
        
                        <tbody>
                            <tr v-if="!mostrarTutor">
                                
                                <td>?</td>
                                <td>?</td>
                                <td>?</td>
                                <td>
                                    <span class="action-btn">
                                        <a  v-on:click="onClickTutor()">Info Tutor</a>
                                        <a  v-on:click="onClickTutorLegal()">Info Tutor Legal</a>
                                    </span>
                                </td>
                            </tr>
                            <tr v-else>
                                <td>{{ tutor[0] }}</td>
                                <td>{{ tutor[1] }}</td>
                                <td>{{ tutor[2] }}</td>
                                <td>
                                    <span class="action-btn">
                                        <a href="#" v-on:click="onClickTutor()">Info Tutor</a>
                                        <a href="#" v-on:click="onClickTutorLegal()">Info Tutor Legal</a>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 v-bind:style="estiloTutor">{{ infoTutor }}</h1>
        
                </div>
            </div>


            <!--Tabla 1: Hace referencia al registro de ida y vuelta del baño de un alumno-->

            
            <div class="table-title">
                <h2>Registrar ida y vuelta</h2>
            </div>

            <div class="table-record-01" v-show="recarga">

                <div class="configuration-header">
                
                    <div class="add">
                        <span>Datos: </span>
                        <select name="course-select" id="cursoBathroom" v-on:change="onChangeCursoIdaVuelta()">
                            <option selected>Seleccionar</option>
                            <option v-for="i in cursos">{{ i }}</option>
                        </select>
        
                        <select name="name-select" id="alumnosIdaVuelta" v-on:change="onChangeAlumnosIdaVuelta()">
                            <option selected>Nombre y apellidos</option>
                            <option v-for="i in _idaVueltaAlumnos" v-show="_mostrarIdaVueltaAlumnos">{{ i }}</option>
                        </select>

                    </div>
        
                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Curso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{{ idaVuelta[0] }}</td>
                            <td>{{ idaVuelta[1] }}</td>
                            <td>{{ idaVuelta[2] }}</td>
                            <td>
                                <span class="action-btn">
                                    <a href="#" v-on:click="onClickIda()">Ida</a>
                                    <a href="#" v-on:click="onClickVuelta()">Vuelta</a>
                                </span>
                            </td>
                        </tr>
                    </tbody>

                </table>
                <h2 v-bind:style="estiloIdaVuelta" v-show="infoIdaVuelta!=''">{{ infoIdaVuelta }}</h2>

            </div>

            <!--Tabla 2: Hace referencia a las estadísticas determinadas de un alumno-->

            <div class="table-title">
                <h2>Estadísticas del alumno</h2>
            </div>

            <div class="table-record-02" v-show="recarga">

                <div class="configuration-header">
                
                    <div class="add">
                        <span>Datos: </span>
                        <select name="course-select" id="cursoStats" v-on:change="onChangeStats()">
                            <option selected>Seleccionar</option>
                            <option v-for="i in cursos">{{ i }}</option>
                        </select>
        
                        <select name="name-select" id="alumnosStats" v-on:change="onChangeAlumnosStats()">
                            <option value="group-option">Nombre y apellidos</option>
                            <option v-for="i in _statsAlumnos" v-show="_statsAlumnos">{{ i }}</option>
                        </select>

                    </div>

                    <div class="date">
                        <span>Periodo</span>
                        <input type="date" title="Fecha de inicio" class="date-search" placeholder="Fecha inicio" id="fechaInicio">
                        <input type="date" title="Fecha de fin" class="date-search" placeholder="Fecha fin" id="fechaFin">
                        <br>
                        <button id="botonStats" v-on:click="onClickStats()">Buscar</button>
                    </div>
        
                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Curso</th>
                            <th>Veces idas al baño</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{{ stats[0] }}</td>
                            <td>{{ stats[1] }}</td>
                            <td>{{ stats[2] }}</td>
                            <td>{{ stats[3] }}</td>
                        </tr>
                    </tbody>

                </table>

                <table>

                    <thead>
                        <tr>
                            <th>Días</th>
                            <th>Horas</th>
                        </tr>
                    </thead>

                    <tbody v-if="!mostrarVisitas">
                        <tr>
                            <td>?</td>
                            <td>?</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr v-for="i in _visitasAlumno">
                            <td>{{ i.dia }}</td>
                            <td>{{ i.hora }}</td>
                        </tr>
                    </tbody>

                </table>
                <h2 v-bind:style="estiloEstadisticas" v-show="infoEstadisticas!=''">{{ infoEstadisticas }}</h2>

            </div>

            <!--Tabla 3: Hace referencia a la lista de alumnos con el número de veces que han ido al baño-->

            <div class="table-title">
                <h2>Listado de alumnos</h2>
            </div>

            <div class="table-record-03" v-show="recarga">

                <div class="configuration-header">

                    <div class="date">
                        <span>Periodo</span>
                        <input type="date" title="Fecha de inicio" class="date-search" placeholder="Fecha inicio" id="fechaListadoInicio">
                        <input type="date" title="Fecha de fin" class="date-search" placeholder="Fecha fin" id="fechaListadoFinal">
                        <br>
                        <button id="botonStats" v-on:click="onClickListado()">Buscar</button>
                    </div>
        
                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Curso</th>
                            <th>Día</th>
                            <th>Horas</th>
                        </tr>
                    </thead>

                    <tbody v-if="!mostrarListado">
                        <tr>
                            <td>?</td>
                            <td>?</td>
                            <td>?</td>
                            <td>?</td>
                            <td>?</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr v-for="i in _listadoAlumno">
                            <td>{{ i.nombre }}</td>
                            <td>{{ i.apellidos }}</td>
                            <td>{{ i.curso }}</td>
                            <td>{{ i.dia }}</td>
                            <td>{{ i.hora }}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
        <div v-else>
            <div v-show="recarga" id="errorStudent">
                <header id="errorHeader">
                    <h1>{{ header }}</h1>
                </header>
                <h1>{{ content }}</h1>
            </div>

        </div>
        <footer class="firma" style="margin-top: 9.4%;">
            <div>
                <a href="https://www.linkedin.com/company/ies-jándula/" target="_blank"><img src="../assets/linkedin.png"></a>
                <p>Web propietaria del centro IES Jandula 2024 ©</p>
            </div>
            <div>
                <a href="https://www.linkedin.com/in/pablo-el%C3%ADas-ruiz-c%C3%A1novas-315a66267/" target="_blank"><img src="../assets/linkedin.png"></a>
                <p>Web desarrollada por los alumnos de 1 DAM curso 2023/2024 y el alumno de 2DAM Pablo Elías Ruiz Cánovas</p>
            </div>        
        </footer>
        

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
@import url("../assets/common.css");
@import url("../assets/alumnos.css");
@import url("../assets/firma.css");

</style>