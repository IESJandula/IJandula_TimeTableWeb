<script setup>
import { useRouter } from 'vue-router';
import { cargarXml,cargarCsvAlumnos, cargarCsvPlanos } from '@/api/peticiones'
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
const infoFicheroCsvPlanos = ref("");
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
        infoFicheroCsvPlanos.value = "";
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
        infoFicheroCsvPlanos.value = "";
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

const cargarPlanos = () =>{
    //Obtenemos el elemento input file por su id
    const fileName = document.getElementById("planos");

    //Si no encuentra ningun fichero cargado mostramos un warning si no mandamos el fichero
    if(typeof fileName.files[0]=="undefined")
    {
        infoFicheroXml.value = "";
        infoFicheroCsvStudents.value = "";
        infoFicheroCsvPlanos.value = "No se ha seleccionado ningun fichero";
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
        cargarDatosPlanos(file,fileName.files[0].name);
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
        infoFicheroCsvPlanos.value = "";
        infoFicheroXml.value = "Fichero "+fileName+" cargado correctamente";
        //Acceso al estilo
        colorFichero.value = "color:forestgreen;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
    else
    {
        infoFicheroCsvPlanos.value = "";
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
        infoFicheroCsvPlanos.value = "";
        infoFicheroCsvStudents.value = "Fichero "+fileName+" cargado correctamente";
        //Acceso al estilo
        colorFichero.value = "color:forestgreen;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
    else
    {
        infoFicheroXml.value = "";
        infoFicheroCsvPlanos.value = "";
        infoFicheroCsvStudents.value = "El fichero cargado es erroneo, comprueba que la cabecera del fichero sea Alumno/a y Unidad o Curso y que los alumnos esten bien formados";
        //Acceso al estilo
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
const cargarDatosPlanos = async(file,fileName) =>{
    //Llamada a a peticion que devuelve un booleano
    const data = await cargarCsvPlanos(file);

    if(data)
    {
        infoFicheroXml.value = "";
        infoFicheroCsvStudents.value = "";
        infoFicheroCsvPlanos.value = "Fichero "+fileName+" cargado correctamente";
        //Acceso al estilo
        colorFichero.value = "color:forestgreen;";
        //Llamada a la recarga de la pagina
        recarga.value = false;
    }
    else
    {
        infoFicheroXml.value = "";
        infoFicheroCsvStudents.value = "";
        infoFicheroCsvPlanos.value = "El fichero cargado es erroneo, comprueba que la cabecera del fichero sea height,width,top,right,left,planta,numIntAu,abreviatura,nombre y que los planos esten bien formados";
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
                <section class="seccion1">
                    <label for="Planos en csv">Cargar planos en csv:</label>
                    <div class="marco_interno">
                        <input type="file" id="planos" placeholder="Planos..." accept=".csv">
                        <h3 v-bind:style="colorFichero" v-show="infoFicheroCsvPlanos!=''">{{infoFicheroCsvPlanos}}</h3>
                    </div>
                    <button id="alinear" v-on:click="cargarPlanos()">Cargar</button>
                </section>
            </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
@import url("../assets/common.css");
@import url("../assets/admin.css");

</style>