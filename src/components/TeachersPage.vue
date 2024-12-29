<script setup>
import { ref, watch, onMounted,onUnmounted } from 'vue';
import { getTeachers,getHours,getCourses,getTramos,getTeacherClassroom,getTeacherClassroomHora,getClassroomCourse,sendErrorInfo } from '@/api/peticiones';
import { useRouter } from 'vue-router';
import { separadorNombre,getSpecificTramo,getOldTramo,checkHoraDia,checkData } from '../js/utils.js';
import { Profesor } from '../models/profesores.js';
import { Tramo } from '../models/tramos.js';
//Instancia del router para cambiar de componente
const router = useRouter();
//Acceso al index.html
const body = document.getElementById("body");
body.style.backgroundColor = "rgb(241, 241, 224)";
body.style.padding = "0%";
body.style.margin = "0%";

//Instancia de variables
let profesores = ref([]);
let horas = ref([]);
let cursos = ref([]);
let infoProfe = ref("");
let infoTramo = ref("");
let infoNumAula = ref("");
let infoNombreAula = ref("");
let noAula = ref("");
let info = ref(false);
let recarga = ref(true);
let interval = undefined;
let errorData = ref(false);
let header = ref("");
let content = ref("");

//Variables privadas
let _profesores = ref([]);
let _tramos = ref([]);
let _usoFecha = false;

//Metodos
/**
 * Metodo que recoge los nombres de los profesores y manda una señal para recargar la pagina
 */
const getTeacher = async () =>{
    //Llamada a la peticion
    const data = await getTeachers();
    //Array de objetos
    let arrayProfes = [];
    //Array de nombres em formato string
    let stringProfes = [];
    //Iterador de los datos que guarda los objetos y los nombres
    for(let i=0;i<data.length;i++)
    {
        let profe = new Profesor(data[i].nombre,data[i].primerApellido,data[i].segundoApellido);
        arrayProfes.push(profe);
        stringProfes.push(profe.nombre+" "+profe.primerApellido+" "+profe.segundoApellido);
    }
    
    _profesores = ref(arrayProfes);
    profesores = ref(stringProfes);
    //Llamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Metodo que recoge las horas y manda una señal para recargar la pagina
 */
const getHour = async () =>{
    //Llamada a la peticion
    const data = await getHours();
    //Array de horas en formato string
    let arrayHoras = [];
    //Iterador de los datos que guarda los objetos y las horas
    for(let i = 0;i<data.length;i++)
    {
        arrayHoras.push(data[i].start+" - "+data[i].end);
    }

    horas = ref(arrayHoras);
    //Llamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Metodo que recoge los tramos para su uso en la busqueda de profesores
 * manda una señal para recargar la pagina
 */
const getTramo = async () =>{
    //Llamada a la peticion
    const data = await getTramos();
    //Array de objetos 
    let array = [];
    //Iterador de los datos que guarda los objetos y las horas
    for(let i=0;i<data.length;i++)
    {
        let tramo = new Tramo(data[i].numTr,data[i].dayNumber,data[i].startHour,data[i].endHour);
        array.push(tramo);
    }

    _tramos = ref(array);
    //LLamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Metodo que recoge los cursos para su uso en la localizacion actual
 * de la clase y el profesor que la imparte, manda una señal para
 * recargar la pagina
 */
const getCourse = async () =>{
    //Llamada a la peticion
    const data = await getCourses();
    //Array cursos en formato string
    let arrayCursos = [];
    //Iterador de los datos que guarda los cursos
    for(let i = 0;i<data.length;i++)
    {
        arrayCursos.push(data[i].nombre);
    }

    cursos = ref(arrayCursos);
    //Llamada a la recarga de la pagina
    recarga.value = false
}
/**
 * Metodo que mediante un nombre y apellido devuelve donde se encuentra el profesor usando
 * la hora del sistema
 * @param {string} nombre 
 * @param {string} apellidos 
 */
const getLocTeacher = async (nombre,apellidos)=>{
    //Llamada a la peticion
    const data = await getTeacherClassroom(nombre,apellidos);
    //Se controla la fecha en caso de que sea sabado o domingo
    let date = new Date();
    console.log(date.getDay());
    //Se evalua que la peticion haya devuelto el aula para mostralo en un PopUp
    if(typeof data == "undefined")
    {
        infoProfe.value = "El profesor/a "+nombre+" "+apellidos;
        noAula.value = "  No se encuentra ningun aula  ";
    }
    else if(date.getDay()==0)
    {
        noAula.value = "No se puede buscar un profesor en domingo";
    }
    else if(date.getDay()==6)
    {
        noAula.value = "No se puede buscar un profesor en sabado";
    }
    else if(typeof data.classroom.floor == "undefined" || typeof data.classroom.number == "undefined" || data.classroom.name == "Sin asignar o sin aula")
    {
        infoProfe.value = "El profesor/a "+nombre+" "+apellidos;
        noAula.value = "  No se encuentra ningun aula  ";
    }
    else
    {
        noAula.value = "";
        infoProfe.value = "El profesor/a "+nombre+" "+apellidos;
        infoNumAula.value = "Se encuentra en el aula "+data.classroom.floor+"."+data.classroom.number;
        infoNombreAula.value = "Aula "+data.classroom.name+" impartiendo "+data.subject.nombre;
    }
   
}

/**
 * Metodo que mediante un nombre, apellido y tramo horario devuelve donde se encuentra el profesor usando 
 * el tramo horario seleccionado
 * @param {string} nombre 
 * @param {string} apellidos 
 * @param {Tramo} tramo 
 */
const getLocTeacherTramo = async (nombre,apellidos,tramo)=>{
    //Llamada a la peticion
    const data = await getTeacherClassroomHora(nombre,apellidos,tramo);
    //Se evalua haya devuelto el aula y el tramo para mostrarlo en un popup ademas se recoge la fecha para mostrarla
    //Como dato adicional
    if(typeof data == "undefined")
    {
        const fecha = document.getElementById("dia");
        infoProfe.value = _usoFecha ? "El profesor/a "+nombre+" "+apellidos+" el dia "+fecha.value : "El profesor/a "+nombre+" "+apellidos;
        noAula.value = "En el tramo "+tramo.startHour+" - "+tramo.endHour+" no se encuentra ningun aula ";
    }
    else
    {
        const fecha = document.getElementById("dia");
        noAula.value = "";
        infoProfe.value = _usoFecha ? "El profesor/a "+nombre+" "+apellidos+" el dia "+fecha.value : "El profesor/a "+nombre+" "+apellidos;
        infoNumAula.value = "En el tramo "+tramo.startHour+" - "+tramo.endHour+" "+"se encuentra en el aula "+data.classroom.floor+"."+data.classroom.number;
        infoNombreAula.value = "Aula "+data.classroom.name+" impartiendo "+data.subject.nombre;
    }
}

/**
 * Metodo que mediante un curso devuelve la informacion actual de un curso
 * en tiempo real
 * @param {string} curso 
 */
const getLocTeacherCourse = async(curso) =>{
    const data = await getClassroomCourse(curso);
  
    if(typeof data == "undefined")
    {
        info.value = true;
        infoProfe.value = "";
        infoNumAula.value = "";
        infoNombreAula.value = "";
        noAula.value = checkHoraDia()!="" ? checkHoraDia() : "No se ha podido encontrar ningun profesor en este momento";
    }
    else
    {
        // Verifica primero si 'data' es efectivamente un array y tiene elementos
        if (Array.isArray(data) && data.length > 0) 
        {
            data.forEach((item) => 
            {
                // item sería un objeto del tipo TeacherMoment
                const { teacher, subject, classroom } = item;

                // Manejo básico de 'lastName' para evitar fallos si no existe o no tiene dos palabras
                let arrayApellidos = teacher.lastName ? teacher.lastName.split(" ") : [];
                let primerApellido  = arrayApellidos[0] ? arrayApellidos[0].trim() : "";
                let segundoApellido = arrayApellidos[1] ? arrayApellidos[1].trim() : "";

                infoProfe.value      = "El profesor " + teacher.name + " " + primerApellido + " " + segundoApellido;
                infoNumAula.value    = "imparte " + subject + " en el aula " + classroom.name + " - " + classroom.floor;
                infoNombreAula.value = "para el curso " + curso;
                noAula.value         = "";
                info.value           = true;


            });
        }
        else 
        {
            // Manejo del caso en que sea vacío o no sea array
            console.warn("No se recibió un array válido de datos");
            noAula.value = "No se encontraron resultados";
            info.value   = false;
        }

    }
    console.log(data);
}

/**
 * Evento que muestra la localizacion del profesor seleccionado en un PopUp
 */
const mostrarDocente = ()=>{
    //Colocamos la fecha por defecto a false a no ser que se utilice despues
    _usoFecha = false;
    //Obtenemos el elemento selection por su id
    const profeSelection = document.getElementById("profesor");
    //Sacamos su valor en bruto
    let profesor = profeSelection.options[profeSelection.selectedIndex].text;
    //Mismo procedimiento con las horas
    const horaSelection = document.getElementById("hora");
    let hora = horaSelection.options[horaSelection.selectedIndex].text;

    //Obtenemos la fecha en caso de que este introducida para sacar el dia exacto
    const fecha = document.getElementById("dia");
    let fechaString = fecha.value;
    let nombreApellido = separadorNombre(profesor,_profesores.value);
    //Evaluamos que se haya seleccionado un profesor, que el tramo sea una hora o la hora actual
    if(profesor=="Selecciona un profesor")
    {
      info.value = true;
      infoProfe.value = "";
      noAula.value = "No se ha seleccionado ningun profesor";
    }
    else if(hora == "Ahora mismo")
    {
        getLocTeacher(nombreApellido[0],nombreApellido[1]);
        info.value = true;
        
    }
    else
    {
        //En caso contrario recogemos los datos del input date y si no aparece nada coge
        //El dia actual, si no coge el valor seleccionado
        if(fechaString!="")
        {
            //Comprobamos que el dia escogido este dentro de la semana en caso contrario
            //Se mostrara una alerta
            let tramo = getOldTramo(hora,fechaString,_tramos.value);
            if(tramo.numTr!="")
            {
                //Llamada a la peticion donde se muestra los datos
                getLocTeacherTramo(nombreApellido[0],nombreApellido[1],tramo);
                _usoFecha = true;   
                info.value = true;
            }
            else
            {
                info.value = false;
            }
        }
        else
        {
            //Recogemos el tramo usando la fecha seleccionada y se comprueba que este
            //dentro de la semana
            let tramo = getSpecificTramo(hora,_tramos.value);
            if(tramo.numTr!="")
            {
                 //Llamada a la peticion donde se muestra los datos
                getLocTeacherTramo(nombreApellido[0],nombreApellido[1],tramo);
                _usoFecha = true;   
                info.value = true;
            }
            else
            {
                info.value = false;
            }
        }
        
    }
}

/**
 * Evento de localizacion de un curso mostrandolo en un PopUp
 */
const mostrarDocenteCurso = ()=>{
    const cursoSelection = document.getElementById("curso");
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;
    if(curso == "Selecciona un curso")
    {
        info.value = true;
        infoProfe.value = "";
        noAula.value = "No se ha seleccionado ningun curso";
    }
    else
    {
        getLocTeacherCourse(curso);
    }
    
}

/**
 * Evento que comprueba que se haya seleccionado una hora para habilitar el input de la fecha
 */
const onchangeHour = ()=>{
    //Recogemos el valor actual del select y lo convertimos a string
    const horaSelection = document.getElementById("hora");
    let hora = horaSelection.options[horaSelection.selectedIndex].text;
    //Recogemos solo el elemento input date
    const fecha = document.getElementById("dia");   
    //Si el valor del select es "Ahora mismo" deshabilitamos la fecha si no la habilitamos
    if(hora!="Ahora mismo")
    {
        fecha.removeAttribute("disabled")
    }
    else
    {
        fecha.setAttribute("disabled","true");
    }
   
}

const checkStatus = async() =>{
    let error = "hola";//await checkData();
    if((typeof error != "undefined" && typeof error != "string" && error.headerInfo=="Datos no cargados") && error.headerInfo!="Servidor no lanzado")
    {
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorData.value = true;
        recarga.value = false;
    }
    else if(error.headerInfo=="Servidor no lanzado")
    {
        router.push("/error");
    }
    else if(typeof error!="undefined")
    {
        header.value = "";
        content.value = "";
        errorData.value = false;
        /*getTeacher();
        getCourse();
        getHour();
        getTramo();*/
        recarga.value = false;
    }
}

/**
 * Metodo que se encarga de recoger los datos al entrar en la pagina
 */
onMounted(async ()=>{
    getTeacher();
    getCourse();
    getHour();
    getTramo();
    interval = setInterval(checkStatus,500);
});

onUnmounted(async()=>{
    clearInterval(interval);
})

/**
 * Metodo observador que la variable nuevo (booleana) cambie par recargar la pagina
 */
watch(recarga,(nuevo,viejo)=>{
    
    if(!nuevo);
    {
        recarga.value = true
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
        <br>
        <main v-show="recarga" v-if="!errorData">
            <div id="docente" >
                <div  id="docente-profesor">
                <label for="profesor">Profesor: </label>
                <select  name="profesor" id="profesor">
                    <option value="default">Selecciona un profesor</option>
                    <option v-for="i in profesores" value="{{ i }}">{{ i }}</option>
                </select>
                <br><br>
                <label for="hora">Tramo Horario: </label> 
                <select name="hora" id="hora" v-on:change="onchangeHour">
                    <option value="default">Ahora mismo</option>
                    <option v-for="i in horas" value="{{ i }}">{{ i }}</option>
                    
                </select>
                <br><br>
                <label for="dia">Día: </label>
                <input type="date" id="dia" disabled> 
                <br><br>
                <button class="button-docente" v-on:click="mostrarDocente">Buscar por docente</button>
            </div>

            <div id="docente-curso">
                <label for="curso">Curso: </label>
                <select name="curso" id="curso">
                    <option value="default">Selecciona un curso</option>
                    <option v-for="i in cursos" value="{{ i }}">{{ i }}</option>
                </select>
                <br><br>
                <button class="button-docente" v-on:click="mostrarDocenteCurso">Buscar por curso</button> 
            </div>
            <div id="info-aula" v-show="info">
                <div v-if="noAula==''">
                    <br>
                    <h3>{{ infoProfe }}</h3>
                    <br>
                    <h3>{{ infoNumAula }}</h3>
                    <br>
                    <h3>{{ infoNombreAula }}</h3>
                    <br>
                </div>
                <div v-else>
                    <h3>{{ infoProfe }}</h3>
                    <br>
                    <h3 style="text-align: center;">{{ noAula }}</h3>
                    <br>
                </div>
                </div>
            </div>
            <br><hr><br>
            <div id="docente-guardia"> 
                <iframe id="hoja-calculo" src="https://docs.google.com/spreadsheets/d/16w92lExDZ9_-X9Bx3g6k5kdb5WjTtZNckmSsqw4Yx9M/edit#gid=2027701287"></iframe>
            </div>
        </main>
        <main v-else>
            <div v-show="recarga" id="errorStudent">
                <header id="errorHeader">
                    <h1>{{ header }}</h1>
                </header>
                <h1>{{ content }}</h1>
            </div>
        </main>
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
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
@import url("../assets/common.css");
@import url("../assets/teachers.css");
@import url("../assets/firma.css");
</style>