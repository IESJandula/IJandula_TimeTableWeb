<script setup>
import { ref, watch, onMounted,onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTeachers,getCourses,descargarPdfProfesores,descargarPdfTodosProfesores,descargarPdfGrupo,descargarPdfGrupos,sendErrorInfo } from '@/api/peticiones';
import { Profesor } from '@/models/profesores';
import { separadorNombre,checkData } from '@/js/utils';

//Instancia del router
const router = useRouter();
//Acceso al body
const body = document.getElementById("body");
body.style.backgroundColor = "white";
body.style.padding = 0;
body.style.margin = 0;

//Instancia de variables
let profesores = ref([]);
let cursos = ref([]);
let recarga = ref(true);
let enlacePdf = ref("/Horario.pdf");
let interval = undefined;
let errorData = ref(false);
let header = ref("");
let content = ref("");
//Variables privadas
let _profesores = ref([]);

//Metodos
/**
 * Metodo que recoge los nombres de los profesores y manda una señal para recargar la pagina
 */
const cargarProfesores = async() =>{
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
 * Metodo que recoge los cursos y manda una señal para recargar la pagina
 */
const cargarCursos = async () =>{
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
 * Metodo que usando el nombre y apellido de un profesor se descarga un pdf
 * que contiene el horario del profesor encontrado
 * @param {string} nombre 
 * @param {string} apellido 
 */
const obtenerPdfProfesor = async (nombre,apellido) =>{
    //Se obtiene el pdf en formato blob
    const blob = await descargarPdfProfesores(nombre,apellido);

    //Al obteberse en formato blob se puede generar un enlace temporal que permite la
    //visualizacion del pdf
    enlacePdf.value = URL.createObjectURL(blob);

    //Se manda una señal para recargar la pagina
    recarga.value = false;
}
/**
 * Metodo que descarga un pdf que contiene el horario de todos los profesores
 */
const obtenerPdfProfesores = async () =>{
    //Se obtiene el pdf en formato blob
    const blob = await descargarPdfTodosProfesores();

    //Al obteberse en formato blob se puede generar un enlace temporal que permite la
    //visualizacion del pdf
    enlacePdf.value = URL.createObjectURL(blob);

    //Se manda una señal para recargar la pagina
    recarga.value = false;
}

/**
 * Metodo que mediante un grupo descarga un pdf que contiene el
 * horario del grupo encoontrado
 * @param {string} grupo 
 */
const obtenerPdfGrupo = async (grupo) =>{
    //Se obtiene el pdf en formato blob
    const blob = await descargarPdfGrupo(grupo);

    //Al obteberse en formato blob se puede generar un enlace temporal que permite la
    //visualizacion del pdf
    enlacePdf.value = URL.createObjectURL(blob);

    //Se manda una señal para recargar la pagina
    recarga.value = false;
}

/**
 * Metodo que descarga un pdf que contiene el horario de todos los grupos
 */
const obtenerPdfGrupos = async () =>{
    const blob = await descargarPdfGrupos();

    enlacePdf.value = URL.createObjectURL(blob);

    recarga.value = false;
}

/**
 * Evento que obtiene el valor actual del selector de profesores y manda
 * separa el nombre y apellidos del profesor y llama al metodo encargado de 
 * descargar el pdf del profesor seleccionado
 */
const onClickProfesor = () =>{
    //Obtenemos el elemento selection por su id
    const profeSelection = document.getElementById("Profesores");
    //Sacamos su valor en bruto
    let profesor = profeSelection.options[profeSelection.selectedIndex].text;
    
    //Se comprueba que se haya seleccionado un valor
    if(profesor=="Selecciona un profesor")
    {
        alert("No se ha seleccionado ningun profesor");
    }
    else
    {
        //Separamos el nombre del apellido
        let nombreApellido = separadorNombre(profesor,_profesores.value);
        //Realizamos la peticion
        obtenerPdfProfesor(nombreApellido[0],nombreApellido[1]);
    }
}

/**
 * Evento que obtiene el valor actual del selector de grupos y llama
 * al metodo encargado de descargar el pdf del grupo seleccionado
 */
const onClickGrupo = () =>{
    //Obtenemos el elemento selection por su id
    const grupoSelection = document.getElementById("Grupos");
    //Sacamos su valor en bruto
    let grupo = grupoSelection.options[grupoSelection.selectedIndex].text;

    //Se comprueba que se haya seleccionado un valor
    if(grupo=="Seleccione un grupo")
    {
        alert("No se ha seleccionado ningun grupo");
    }
    else
    {
        //Realizamos la peticion
        obtenerPdfGrupo(grupo);
    }
    
}

const checkStatus = async() =>{
    let error = await checkData();
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
        cargarProfesores();
        cargarCursos();
        recarga.value = false;
    }
}

/**
 * Metodo que se encarga de recoger los datos al entrar en la pagina
 */
onMounted(async ()=>{
    cargarProfesores();
    cargarCursos();
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
});
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
    <main v-if="!errorData">
        <div id="Horario" v-show="recarga">
            <div id="horario-seleccionar-Profesor">
                <label for="Profesores">Profesores</label>
                <p></p>
                <select name="Profesores-Horarios" id="Profesores">
                    <option selected>Selecciona un profesor</option>
                    <option v-for="i in profesores">{{ i }}</option>
                </select>
                <p></p>
                <button v-on:click="onClickProfesor()">Enviar</button>
            </div>
            
            <div id="horario-todos-Profesores">
                <p>Horario de todos los Profesores</p>
                <button id="button-Horario-Profesores" v-on:click="obtenerPdfProfesores()"> Ver </button>
            </div>
            
            <div id="horario-seleccionar-grupo">
                <label for="Grupos">Grupos</label>
                <p></p>
                <select name="Grupos-Horarios" id="Grupos">
                    <option selected>Seleccione un grupo </option>
                    <option v-for="i in cursos">{{ i }} </option>
                </select>
                <p></p>
                <button v-on:click="onClickGrupo()">Enviar</button>
            
            </div>

            <div id="horario-todos-grupos">
                <p>Horario de todos los Grupos</p>
                <button id="button-Horario-Grupo" v-on:click="obtenerPdfGrupos()"> Ver </button>
            </div>

        </div>   
    <div id="horarios-container" v-show="recarga">
        <embed type="text/html" v-bind:src="enlacePdf"  width="85%" height="900px">
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
@import url("../assets/common.css");
@import url("../assets/horarios.css");
@import url("../assets//firma.css");
</style>