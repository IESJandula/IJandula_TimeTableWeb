<script setup>
import { useRouter } from 'vue-router';
import { getStudentCourses,getPoints,getSortStudentsCourse,ponerSancion,sendErrorInfo } from '@/api/peticiones';
import { checkData,separadorNombreCurso,searchSancion } from '@/js/utils';
import { Alumno } from '@/models/alumnos';
import { ref,onMounted, watch,onUnmounted } from 'vue';
import { Puntos } from '../models/puntos.js'
//Instancia del router
const router = useRouter();
//Acceso al body
const body = document.getElementById("body");
body.style.backgroundColor = "skyblue";
body.style.padding = 0;
body.style.margin = 0;

//Instancia de variables
let cursos = ref([]);
let alumnos = ref([]);
let puntos = ref([]);
let recarga = ref(true);
let textoSancion = ref("");
let estiloSancion = ref("");
let mostrarAlumnos = ref(false);
let errorAlumnos = ref(false);
let header = ref("");
let content = ref("");
let interval = undefined;
//Variables privadas
let _puntos = ref([]);
let _alumnos = ref([]);

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
 * Metodo que recoge la descripcion y puntaje de la sancion o logro que comete el alumno
 */
const cargarPuntos = async()=>{
    //Llamada a la peticion
    const data = await getPoints();
    //Array de objetos
    let arrayPuntos = [];
    //Array de puntos en formato string
    let stringPuntos = [];
    //Iterador de los datos que guarda los puntos
    for(let i = 0;i<data.length;i++)
    {
        let puntos = new Puntos(data[i].points,data[i].description);
        arrayPuntos.push(puntos);
        if(puntos.points>0)
        {
            stringPuntos.push("+"+puntos.points+" "+puntos.description);
        }
        else
        {
            stringPuntos.push(puntos.points+" "+puntos.description);
        }
        
    }

    puntos = ref(stringPuntos);
    _puntos = ref(arrayPuntos);
    //Llamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Metodo que recoge los nombres de los alumnos filtrados por el curso
 * introducido como parametro
 * @param {string} curso 
 */
const cargarAlumnos = async(curso)=>{
    //Llamada a la peticion
    const data = await getSortStudentsCourse(curso);
    //Array de alumnos en formato string 
    let arrayAlumnos = [];
    let array = [];
    //Iterador de los datos que guarda los alumnos
    for(let i = 0;i<data.length;i++)
    {
        let alumno = new Alumno(data[i].name,data[i].lastName,data[i].course,data[i].matriculationYear,data[i].firstTutorLastName,data[i].secondTutorLastName,
		        data[i].tutorName,data[i].tutorPhone,data[i].tutorEmail
		        );
        array.push(alumno);
        arrayAlumnos.push(alumno.name+" "+alumno.lastName);
    }

    alumnos = ref(arrayAlumnos);
    _alumnos = ref(array);
    //Llamada a la recarga de la pagina
    recarga.value = false;
}

/**
 * Evento que comprueba cuando el curso cambia de valor para recargar los alumnos
 */
const onChangedCurso = ()=>{
    //Obtenemos el elemento selection por su id
    const cursoSelection = document.getElementById("cursos");
    //Sacamos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    //Si el valor cambia a Cursos no mostramos los alumnos
    if(curso=="Cursos")
    {
        mostrarAlumnos.value = false;
    }
    else
    {
        mostrarAlumnos.value = true;
        //Llamada a la peticion
        cargarAlumnos(curso);
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
}

const enviarSancion = async ()=>{
    //Obtenemos el id del selector de alumnos
    const alumnoSelection = document.getElementById("alumnos");

    //Obtenemos su valor en bruto
    let alumno = alumnoSelection.options[alumnoSelection.selectedIndex].text;

    //Obtenemos el id del selector de cursos
    const cursoSelection = document.getElementById("cursos");
    
    //Obtenemos su valor en bruto
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;

    //Obtenemos el id del selector de puntos
    const puntosSelection = document.getElementById("puntos");
    
    //Obtenemos su valor en bruto
    let puntos = puntosSelection.options[puntosSelection.selectedIndex].text;

    if(alumno=="Selecciona un curso")
    {
        textoSancion = "No se ha seleccionado ningun alumno";
        estiloSancion.value = "color: darkgoldenrod;";
        recarga.value = false;
    }
    else
    {
        let alumnoObject = separadorNombreCurso(alumno,curso,_alumnos.value);
        let pointObject = searchSancion(puntos,_puntos.value);
        const data =  await ponerSancion(alumnoObject,pointObject);

        if(data)
        {
            textoSancion = pointObject.points>0 ? "Recompensa impuesta sobre " : "Sancion impuesta sobre ";
            textoSancion += alumnoObject.name+" "+alumnoObject.lastName+", se revisara pronto"; 
            estiloSancion.value = "color: forestgreen;";
            recarga.value = false;
        }
        else
        {
            textoSancion = pointObject.points>0 ? "Error al mandar la recompensa" : "Error al mandar la sancion";
            estiloSancion.value = "color: darkred;";
            recarga.value = false;
        }
    }




    
}

const checkStatus = async() =>{
    let error = await checkData();
    if((typeof error != "undefined" && typeof error != "string" && error.headerInfo=="Datos no cargados") && error.headerInfo!="Servidor no lanzado")
    {
        textoSancion = "";
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
        textoSancion = "";
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorAlumnos.value = true;
        recarga.value = false;
    }
    else if(typeof error!="undefined")
    {
        textoSancion = "";
        header.value = "";
        content.value = "";
        errorAlumnos.value = false;
        getCourse();
        recarga.value = false;
    }
}

/**
 * Metodo que se encarga de recoger los datos al entrar en la pagina
 */
onMounted(async ()=>{
    getCourse();
    cargarPuntos();
    interval = setInterval(checkStatus,500);
});

onUnmounted(async ()=>{
    clearInterval(interval);
})

/**
 * Metodo observador que la variable nuevo (booleana) cambie par recargar la pagina
 */
watch(recarga,(nuevo,viejo)=>{
    if(!nuevo)
    {
        recarga.value = true;
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
            <label for="check" class="checkbtn"></label>
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

    <div class="opcion" v-show="recarga" v-if="!errorAlumnos"> 

        <div>
            <h2>Docente actualmente de guardia: <span id="docenteguardia"><!--Aqui se integra el maestro de guardia en ese momento --> No disponible en este momento </span></h2>
        </div>

        <div class="contenido">

            <div class="clases"> <!--Boton donde seleccionar el curso del alumno -->
                <select id="cursos" class="form-select" aria-label="Default select example" v-on:change="onChangedCurso">
                    <option selected>Cursos</option>
                    <option v-for="i in cursos">{{ i }}</option>
                </select>
            </div>
    
            <div class="Alumnos"><!--Boton donde seleccionar el alumno, dependiendo del curso seleccionado -->
                <select class="form-select" aria-label="Default select example" id="alumnos">
                    <option v-show="!mostrarAlumnos" selected>Selecciona un curso</option>
                    <option v-show="mostrarAlumnos" v-for="i in alumnos">{{ i }}</option>
                </select>
            </div>
    
            <div class="Puntos"><!--Boton donde seleccionar la puntuación que merece el alumno-->
                <select class="form-select" aria-label="Default select example" id="puntos">
                    <option selected>Puntos</option>
                    <option v-for="i in puntos">{{ i }}</option>
                </select>
            </div>
            <div>
                <button type="button" class="botonaplicar" v-on:click="enviarSancion()">Aplicar Puntuación</button> 
            </div>
        </div>
    </div>  
    <div v-else>
        <div v-show="recarga" id="errorStudent">
            <header id="errorHeader">
                <h1 class="errorContent">{{ header }}</h1>
            </header>
            <h1 class="errorContent">{{ content }}</h1>
        </div>
    </div> 
    <h3 v-bind:style="estiloSancion" id="textoSancion">{{ textoSancion }}</h3>
<div id="contenedorPDF" v-show="!errorAlumnos">
    <embed type="text/html" src="/Puntos_Plan_De_Convivencia.pdf"  width="60%" height="700px">
</div>
<footer class="firma" style="margin-top: 9.4%;">
    <div>
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
@import url("../assets/convivencia.css");
@import url("../assets/firma.css");
</style>