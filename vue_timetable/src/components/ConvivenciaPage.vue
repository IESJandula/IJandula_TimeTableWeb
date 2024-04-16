<script setup>
import { useRouter } from 'vue-router';
import { getStudentCourses,getPoints,getSortStudentsCourse } from '@/api/peticiones';
import { ref,onMounted, watch } from 'vue';
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
let mostrarAlumnos = ref(false);
//Variables privadas
let _puntos = ref([]);

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
    //Iterador de los datos que guarda los alumnos
    for(let i = 0;i<data.length;i++)
    {
        let nombre = data[i].name+" "+data[i].lastName;
        arrayAlumnos.push(nombre);
    }

    alumnos = ref(arrayAlumnos);
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

/**
 * Metodo que se encarga de recoger los datos al entrar en la pagina
 */
onMounted(async ()=>{
    getCourse();
    cargarPuntos();
});

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

    <div class="opcion" v-show="recarga"> 

        <div>
            <h2>Docente actualmente de guardia: <span id="docenteguardia"><!--Aqui se integra el maestro de guardia en ese momento --> Valor automatico. </span></h2>
        </div>

        <div class="contenido">

            <div class="clases"> <!--Boton donde seleccionar el curso del alumno -->
                <select id="cursos" class="form-select" aria-label="Default select example" v-on:change="onChangedCurso">
                    <option selected>Cursos</option>
                    <option v-for="i in cursos">{{ i }}</option>
                </select>
            </div>
    
            <div class="Alumnos"><!--Boton donde seleccionar el alumno, dependiendo del curso seleccionado -->
                <select class="form-select" aria-label="Default select example">
                    <option v-show="!mostrarAlumnos" selected>Selecciona un curso</option>
                    <option v-show="mostrarAlumnos" v-for="i in alumnos">{{ i }}</option>
                </select>
            </div>
    
            <div class="Puntos"><!--Boton donde seleccionar la puntuación que merece el alumno-->
                <select class="form-select" aria-label="Default select example">
                    <option selected>Puntos</option>
                    <option v-for="i in puntos">{{ i }}</option>
                </select>
            </div>
    
            <div>
                <button type="button" class="botonaplicar">Aplicar Puntuación</button> 
            </div>
    
        </div>
    </div>   

<div id="contenedorPDF">
    <embed type="text/html" src="/Puntos_Plan_De_Convivencia.pdf"  width="60%" height="700px">
</div>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

.nav-menu li:nth-child(5){
    background-color: rgb(222, 252, 253) !important;
    border-color: rgb(0, 0, 0);
}
.nav-menu li:nth-child(5) a{
    color: rgb(34, 46, 83) !important;
    font-weight: bold !important;
}

.Contenido {
    background-color: rgb(31, 155, 203);    
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.botonaplicar:hover{
    color: purple;
    font-weight: bo;
    background-color: rgba(226, 131, 43, 0.411);
}

.botonaplicar{
    margin-top: 0%;
    max-width: min-content;
    font-size: 90%;
    font-style: italic;
    border-color: red;
    background-color: white;
    padding: 3px;
}

#contenedorPDF{
    margin-top: 10px;
  
  
    display: flex;
    justify-content:center;
    height: 100%;
    width: 100%;
}

.iframe{
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 80%;
}

.clases,
.Puntos,
.alumnos{
    display: inline-block;
    flex-direction: row;
    justify-content: space-evenly;
}

h1{
    color: white;
    background-color: rgb(138, 138, 255);    
    margin-bottom: 0%;
}

html{
    background-color: rgba(48, 230, 123, 0.705);
}

.opcion{
    display: flex;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
    padding: 0.5em;

}

.opcion div{
    display: flex;
    background-color: rgb(219, 242, 247);
    border-radius: 0.5em;
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
    justify-content: center;
    align-items: center;
    margin-left: 1em;
    margin-right: 1em;
}

#docenteguardia{
    color: rgb(0, 3, 201);
}



*{
    padding: 0;
    margin: 0;
    text-decoration: none;
    list-style: none;
    font-family: 'Open Sans';
}

header{
    background-color: rgb(31, 155, 203);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.5rem 2rem; 
}

a, li{
    font-family: Arial, Helvetica, sans-serif;
}

.logo-header img{
    width: 75px;
}

.nav-menu ul{
    display: flex;
    align-items: center;
}

.nav-menu li{
    margin-right: 1.5rem;
    background-color: skyblue;
    border: 2px solid;
    padding: 0.25rem 0.75rem;
    border-radius: 0.2rem;        
}

.nav-menu a{
    color: black;
}

.menu-icon img{
    width: 30px;
    height: 30px;
    border-radius: 2px;
}

.menu-icon, #check{
    display: none;
}

@media (max-width:768px){   /*Si fuera para dispositivos móviles principalmente usaríamos min-width*/
    .checkbtn{
        display: block;
    }
    .menu-icon{
        display: block;
        position: fixed;
        top: 20px;
        right: 20px;
        cursor: pointer;    /*Sale la manita para saber que es clickable*/
    }
    .nav-menu ul{
        display: block;
        position: fixed;
        top:70px;
        left:-100%;
        background: #222;
        width: 100%;
        height: 100vh;
        right: 0;
    }
    .nav-menu ul li{
        padding: 2rem;
        display: flex;
        justify-content: center;
        margin: 0;
    }
    
    #check:checked ~ ul{    /*Aquí accedemos al id check que está en label e input y que afecta a toda la ul*/
        left: 0;    /**/
        transition: all 0.25s;  /*Activamos una transición para que el menú aparezca*/
    }
}

.botonMenu{
    cursor: pointer;
}


</style>