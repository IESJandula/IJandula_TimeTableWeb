<script setup>
import { useRouter } from 'vue-router';
import { cargarXml,cargarCsvAlumnos } from '@/api/peticiones'
import { ref, watch } from 'vue';
//Instancia del router
const router = useRouter();
//Acceso al body
const body = document.getElementById("body");
body.style.backgroundColor = "rgb(241, 241, 224)";
body.style.padding = 0;
body.style.margin = 0;

//Instancia de variables
const colorFichero = ref("");
const infoFicheroXml = ref("");
const infoFicheroCsvStudents = ref("");
const recarga = ref(true);

//Metodos
/**
 * Evento que se encarga de recoger el fichero cargado por el
 * administrador que contiene datos sobre el centro
 * para enviarlo posteriormente al servidor
 */
const cargarCentro = ()=>{
    //Obtenemos el elemento input file por su id
    const fileName = document.getElementById("confXml");

    //Si no se encuentra ningun fichero cargado mostramos un warning si no mandamos el fichero
    if (typeof fileName.files[0]=="undefined")
    {
        infoFicheroCsvStudents.value = "";
        infoFicheroXml.value = "No se ha seleccionado ningun fichero";
        //Acceso al estilo
        colorFichero.value = "color:darkgoldenrod;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
    else
    {
        //Instanciamos un fichero de tipo .*
        let file = new FormData();

        //Le asignamos el fichero cargado
        file.append('xmlFile',fileName.files[0]);

        //Mandamos el fichero y su nombre
        cargarDatosCentro(file,fileName.files[0].name);
    }
}

/**
 * Evento que se encarga de recoger el fichero cargado por el 
 * administrador que contiene datos sobre los alumnos para
 * enviarlo posteriormente al servidor
 */
const cargarAlumnos = ()=>{
    //Obtenemos el elemento input file por su id
    const fileName = document.getElementById("students");

    //Si no se encuentra ningun fichero cargado mostramos un warning si no mandamos el fichero
    if(typeof fileName.files[0]=="undefined")
    {
        infoFicheroXml.value = "";
        infoFicheroCsvStudents.value = "No se ha seleccionado ningun fichero";
        //Acceso al estilo
        colorFichero.value = "color:darkgoldenrod;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
    else
    {

        //Instanciamos un fichero de tipo .*
        let file = new FormData();

        //Le asignamos el fichero cargado
        file.append('csvFile',fileName.files[0]);

        //Mandamos el fichero y su nombre
        cargarDatosAlumnos(file,fileName.files[0].name);
    }
}

/**
 * Metodo que llama a la peticion donde se envia el fichero xml
 * que el administrador proporciona al servidor, ademas avisa al 
 * administrador si el fichero esta bien formado o no
 * @param {FormData} file 
 * @param {string} fileName
 */
const cargarDatosCentro = async (file,fileName) =>{
    //Llamada a la peticion que devuelve un booleano
    const data = await cargarXml(file);
    
    //Si es true muestra confirmacion si no un error 
    if(data)
    {
        infoFicheroCsvStudents.value = "";
        infoFicheroXml.value = "Fichero "+fileName+" cargado correctamente";
        //Acceso al estilo
        colorFichero.value = "color:forestgreen;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
    else
    {
        infoFicheroCsvStudents.value = "";
        infoFicheroXml.value = "El fichero cargado es erroneo, comprueba que contiene la estructura correcta del centro";
        //Llamada al estilo
        colorFichero.value = "color:darkred;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
}

/**
 * Metodo que llama a la peticion donde se envia el fichero csv
 * que el administrador proporciona al servidor, ademas avisa al 
 * administrador si el fichero esta bien formado o no
 * @param {FormData} file 
 * @param {string} fileName 
 */
const cargarDatosAlumnos = async (file,fileName) => {
    //Llamada a la peticion que devuelve un booleano
    const data = await cargarCsvAlumnos(file);

    //Si es true muestra confirmacion si no un error
    if(data)
    {
        infoFicheroXml.value = "";
        infoFicheroCsvStudents.value = "Fichero "+fileName+" cargado correctamente";
        //Acceso al estilo
        colorFichero.value = "color:forestgreen;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
    else
    {
        infoFicheroXml.value = "";
        infoFicheroCsvStudents.value = "El fichero cargado es erroneo, comprueba que la cabecera del fichero sea Alumno/a y Unidad o Curso y que los alumnos esten bien formados";
        //Acceso al estilo
        colorFichero.value = "color:darkred;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
}

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
            <!-- Fondo de la pagina -->
            <div v-show="recarga" class="fondo_cuadrado">
                <!-- Formulario -->
                <section class="seccion1">
                    <label  for="Configuración en xml">Cargar configuración en xml:</label>
                    <div class="marco_interno">
                        <input type="file" id="confXml" placeholder="Configuración..." accept=".xml">
                        <h3 v-bind:style="colorFichero" v-show="infoFicheroXml!=''">{{infoFicheroXml}}</h3>
                    </div>
                    <button  id="alinear" v-on:click="cargarCentro">Cargar</button>
                </section>
                <section class="seccion1">
                    <label  for="Roles csv">Cargar roles en csv:</label>
                    <div class="marco_interno">
                        <input type="file" placeholder="Roles..." accept=".csv">
                    </div>
                    <button  id="alinear">Cargar</button>
                </section>
                <section class="seccion1">
                    <label for="Alumnos en csv">Cargar alumnos en csv:</label>
                    <div class="marco_interno">
                        <input type="file" id="students" placeholder="Alumnos..." accept=".csv">
                        <h3 v-bind:style="colorFichero" v-show="infoFicheroCsvStudents!=''">{{infoFicheroCsvStudents}}</h3>
                    </div>
                    <button id="alinear" v-on:click="cargarAlumnos()">Cargar</button>
                </section>
            </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

/*Resalta el boton de la barra de navegación de la sección para las migajas*/
.nav-menu li:nth-child(1){
    background-color: rgb(222, 252, 253) !important;
    border-color: rgb(0, 0, 0);
}
/*Resalta el boton de la barra de navegación de la sección para las migajas*/
.nav-menu li:nth-child(1) a{
    color: rgb(34, 46, 83) !important;
    font-weight: bold !important;
}

*{
    font-size: 16px;
    font-family: 'Open Sans';
}
.fondo{
    background-color: #f2f2f2;
}

.fondo_cuadrado{
    background-color: white;
    width: 80%;
    margin-left: 10%;
    box-shadow: 0 0 3px -1px;
}

.seccion1{
    height: 130px;
    max-height: 135px;
    margin-left: 2%;
    margin-right: 2%;
    margin-top: 1%;
}
.marco_interno {
    font-size: 28px;
    border: 1px solid #d0d0d0;
    border-radius: 10px;
    padding: 1px;
    background-color: #f2f2f2;
}
#alinear{
    margin-top: 1%;
    margin-left: 94%;
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