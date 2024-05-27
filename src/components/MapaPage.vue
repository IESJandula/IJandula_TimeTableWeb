<script setup>
import { ref, watch, onMounted,onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerAulasPorPlanta,getCourses,sendErrorInfo,getAulaNow } from '@/api/peticiones';
import { checkData,controlGrupos,showStudentsInfo } from '@/js/utils';
import { Aula, DimensionPlano } from '@/models/aulas';
import { Grupo } from '@/models/grupos';
//Instancia del router para cambiar de componente
const router = useRouter();
//Acceso al index.html
const body = document.getElementById("body");
body.style.backgroundColor = "rgb(241, 241, 224)";
body.style.padding = 0;
body.style.margin = 0;
const root = document.querySelector(":root");

//Variables
let plantaBaja = ref(true);
let primeraPlanta = ref(false);
let segundaPlanta = ref(false);
let recarga = ref(true);
let aulas = ref([]);
let cursos = ref([]);
let errorData = ref(false);
let header = ref("");
let content = ref("");
let interval = undefined;
let infoAula = ref("");
let infoProfe = ref("");
let infoAsignatura = ref("");
let infoGrupo = ref("");
let textoRotacion = ref("");
let tituloAlumnos = ref("");
let infoAlumnos = ref([]);

//Variables privadas
let _cursos = ref([]);
let _rotacion = ref(false);
let _intervaloRotacion = undefined;

const onChangeDimension = () =>{
    //Obtenemos el elemento selection por su id
    const selector = document.getElementById("selector-dimensiones");
    //Obtenemos su valor en bruto
    let dimension = selector.options[selector.selectedIndex].text;

    let arrayDimension = dimension.split("*");

    root.style.setProperty('--map-width',arrayDimension[0].trim());
    root.style.setProperty('--map-height',arrayDimension[1].trim());
}

const restablecerDimension = () =>{
    root.style.setProperty("--map-width","662px");
    root.style.setProperty("--map-height","936px");
}

const onClickPrimeraPlanta = () =>{
    const imagenPlantaBaja = document.getElementById("planta-baja");
    const imagenPlanta1 = document.getElementById("planta-primera");
    const imagenPlanta2 = document.getElementById("planta-segunda");
    obtenerAulas("PLANTA BAJA");
    imagenPlantaBaja.style.display = "block";
    imagenPlanta1.style.display = "none";
    imagenPlanta2.style.display = "none";
    plantaBaja.value = true;
    primeraPlanta.value = false;
    segundaPlanta.value = false;
    recarga.value = false;
}

const onClickSegundaPlanta = () =>{
    const imagenPlantaBaja = document.getElementById("planta-baja");
    const imagenPlanta1 = document.getElementById("planta-primera");
    const imagenPlanta2 = document.getElementById("planta-segunda");
    obtenerAulas("PRIMERA PLANTA");
    imagenPlantaBaja.style.display = "none";
    imagenPlanta1.style.display = "block";
    imagenPlanta2.style.display = "none";
    plantaBaja.value = false;
    primeraPlanta.value = true;
    segundaPlanta.value = false;
    recarga.value = false;
}

const onClickTerceraPlanta = () =>{
    const imagenPlantaBaja = document.getElementById("planta-baja");
    const imagenPlanta1 = document.getElementById("planta-primera");
    const imagenPlanta2 = document.getElementById("planta-segunda");
    obtenerAulas("SEGUNDA PLANTA");
    imagenPlantaBaja.style.display = "none";
    imagenPlanta1.style.display = "none";
    imagenPlanta2.style.display = "block";
    plantaBaja.value = false;
    primeraPlanta.value = false;
    segundaPlanta.value = true;
    recarga.value = false;
}

/**
 * Metodo que renderiza el aula asignado el estilo de la misma
 * a una directiva v-bind:style de vue
 * @param {DimensionPlano} aula 
 * @returns texto del estilo asociado
 */
const classroomStyleRender = (aula) =>{
    let estilos = "height:"+aula.height+"%; width:"+aula.width+"%; top:"+aula.top+"%; ";

	if (aula.left != 0)
	{
		estilos = estilos + "left:"+aula.left+"%;";
	}

	if (aula.right != 0)
	{
		estilos = estilos + "right:"+aula.right+"%;";
	}

    return estilos; 
}

const obtenerAulas = async (planta)=>{
    const data = await obtenerAulasPorPlanta(planta);
    
    let array = [];

    for(let i = 0;i<data.length;i++)
    {
        let dimension = new DimensionPlano(data[i].height,data[i].width,data[i].top,data[i].right,data[i].left,data[i].planta,data[i].aula);
        array.push(dimension);
    }

    aulas = ref(array);
    recarga.value = false;
}

const obtenerCursos = async ()=>{
    const data = await getCourses();

    let arrayString = [];
    let array = [];

    for(let i = 0;i<data.length;i++)
    {
        let curso = new Grupo(data[i].numIntGr,data[i].abreviatura,data[i].nombre);
        array.push(curso);
        arrayString.push(data[i].nombre);
    }

    cursos = ref(arrayString);
    _cursos = ref(array);

    recarga.value = false;
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
    else if(error.headerInfo=="Datos de estudiantes no cargados")
    {
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorData.value = true;
        recarga.value = false;
    }
    else if(error.headerInfo=="Datos de planos no cargados")
    {
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorData.value = true;
        recarga.value = false;
    }
    else if(typeof error!="undefined")
    {
        header.value = "";
        content.value = "";
        errorData.value = false;
        obtenerCursos();
        recarga.value = false;
        let array = aulas.value;
    }
}

/**
 * Metodo que se encarga de mandar al servidor un aula y recibir
 * y transformar los datos adicionales para mostrarlos en un
 * cuadro en la web
 * @param {Aula} aula 
 */
const obtenerInfoAula = async (aula)=>{
    const data = await getAulaNow(aula.numIntAu,aula.abreviatura,aula.nombre);
    
    if(typeof data == "undefined")
    {
        infoAula.value = "En el aula "+aula.abreviatura+" no se encuentra nadie";
        infoProfe.value = "";
        infoAsignatura.value = "";
        infoGrupo.value = "";
        recarga.value = false;
    }
    else
    {
        infoAula.value = "Aula: "+aula.nombre;
        infoProfe.value = "Profesor: "+data.profesor.nombre+" "+data.profesor.primerApellido+" "+data.profesor.segundoApellido;
        infoAsignatura.value = "Asignatura: "+data.asignatura.nombre;
        infoGrupo.value = controlGrupos(data);
        let dataAlumnos = showStudentsInfo(data);
        if(typeof dataAlumnos!= "string")
        {
            tituloAlumnos.value = "----ALUMNOS----";
            infoAlumnos = ref(dataAlumnos);
        }
        else
        {
            tituloAlumnos.value = "Sin informacion de alumnos";
        }
        recarga.value = false;
    }
}

const activarDesactivarRotacion = (milisegundos,elemento)=>{
    const boton = document.getElementById(elemento);
    if(!_rotacion.value)
    {
        _rotacion.value = true;
        _intervaloRotacion = setInterval(cambioPlanta,milisegundos);
        textoRotacion.value = "Rotacion establecida en "+(milisegundos/1000)+" segundos"
        boton.style.backgroundColor = "rgb(130, 255, 249);";
        boton.style.color = "rgb(255,255,255);"
    }
    else
    {
        _rotacion.value = false;
        clearInterval(_intervaloRotacion);
        textoRotacion.value = "";
        boton.style.backgroundColor = "background-color: rgb(238, 243, 242);";
    }
}


const cambioPlanta = ()=>{

    if(plantaBaja.value)
    {
        onClickSegundaPlanta();
    }
    else if(primeraPlanta.value)
    {
        onClickTerceraPlanta();
    }
    else if(segundaPlanta.value)
    {
        onClickPrimeraPlanta();
    }
}

onMounted(async ()=>{
    root.style.setProperty('--map-width',"662px");
    root.style.setProperty('--map-height',"936px");
    obtenerAulas("PLANTA BAJA");
    obtenerCursos();
    interval = setInterval(checkStatus,500);
});

onUnmounted(async ()=>{
    clearInterval(interval);
    if(typeof _intervaloRotacion != "undefined")
    {
        clearInterval(_intervaloRotacion);
    }
})

watch(recarga,(nuevo,viejo) =>{
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
                <i class="menu-icon"></i>
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
    <div id="djg-main-box" v-show="recarga" v-if="!errorData">
        <div id="panel">

            <div id="panel-selector">
                <!-- PARA PABLO DE SEGUNDO -->
                <!-- Este formulario es un placeholder. Va alimentado por un endpoint que le dice que cursos existen en el sistema -->
                <!-- La idea aqui imagino que es identificar las aulas y según el curso seleccionado, marcarlas en el plano con un efecto de colores o algo-->
                <!-- Disculpad el desorden, si puedo hacer algo avisadme, soy David Jason de primero. -->
                <form action="">
                    <label for="selector-curso">Localizador de cursos:</label>
                    <select name="selector-curso" id="selector-curso">
                        <option value="0">Seleccionar</option>
                        <option v-for="i in cursos">{{ i }}</option>
                    </select>           
                </form>
            </div>

            <!-- INICIO Botones para seleccion de planta y rotacion automatica  -->
            <div id="contenedor-botones-rotacion">

                <p class="titulo-djg" >Mostrar planta.</p>
                <div style="display: block; align-items: center;">
                    <!-- Botones de selección manual de planta -->
                    <div id="contenedor-botones-plantas"> 
                        <button id="boton-planta-baja" v-on:click="onClickPrimeraPlanta()">Planta<br/>baja</button>
                        <button id="boton-planta-primera" v-on:click="onClickSegundaPlanta()">Planta<br/>primera</button>
                        <button id="boton-planta-segunda" v-on:click="onClickTerceraPlanta()">Planta<br/>segunda</button>
                    </div>
                    <!-- este div solo sirve para reflejar al usuario el estado de la rotación, por defecto desactivada-->
                    <div id="indicador" v-if="!_rotacion">Rotacion: Desactivada</div>
                    <div id="indicador" v-else>Rotacion: Activada</div>

                    <!-- Botones de rotacion automatica -->
                    <button id="boton-autorotacion" v-on:click="activarDesactivarRotacion(3000,'boton-autorotacion')">03s</button>
                    <button id="rotacion-5" v-on:click="activarDesactivarRotacion(5000,'rotacion-5')">05s</button>
                    <button id="rotacion-10" v-on:click="activarDesactivarRotacion(10000,'rotacion-10')">10s</button>
                    <button id="rotacion-15" v-on:click="activarDesactivarRotacion(15000,'rotacion-15')">15s</button>
                    <button id="rotacion-20" v-on:click="activarDesactivarRotacion(20000,'rotacion-20')">20s</button>
                    <button id="rotacion-30" v-on:click="activarDesactivarRotacion(30000,'rotacion-30')">30s</button>
                </div>
                <h4>{{textoRotacion}}</h4>
            </div>

            <!-- INICIO  Menu desplegable para seleccion de tamaño caja mapa  -->
            <div id="conenetdor-desplegable-dimensiones">
                <label for="selector-dimensiones" class="titulo-djg">Dimensiones plano.<br/></label>
                <select name="selector-dimensiones" id="selector-dimensiones" v-on:change="onChangeDimension()">
                    <!-- Mucho ojo con estos valores, son multiplos de la resolución de las imagenes de los planos
                    Es necesario que respeten al 100% la proporción de las imagenes en multiplos porque de lo contrario los 
                    divs posicionados dentro del contenedor padre de los planos se le va la flapa y no tomarán la posicion correcta.
                    NOTA: Estos valores están tomados de la variable ROOT de CSS y aplicados mediante una función javascript -->
                    <option value="res1">662px * 936px</option>
                    <option value="res2">777px * 1100px</option>
                    <option value="res3">827px * 1170px</option>
                    <option value="res4">910px * 1287px</option>
                    <option value="res5">992px * 1404px</option>
                    <option value="res6">1984px * 2808px</option>
                </select>
                <!-- Esto es un boton que recarga la página, la idea es que al pinchar en el boton se recargue la página 
                    reactivando los mediaqueries que dan valor a la variable que define el tamaño de los mapas.-->
                <a><button id="restablecer" v-on:click="restablecerDimension()">Restablecer</button></a>
            </div>
            <!-- FIN  Menu desplegable para seleccion de tamaño caja mapa  -->

            <!-- INICIO  Caja donde se deberá renderizar la información recuperada mediante los endpoints y back-end -->
            <div id="contenedor-info-box-endpoints">
            <p class="titulo-djg">Información del aula.</p>
                <div v-if="infoAula==''">
                    <p ><span> Seleccione un aula. </span> </p>
                </div>
                <div v-else-if="infoAula!='' && infoProfe=='' && infoAsignatura=='' && infoGrupo==''">
                    <p><span>{{ infoAula }}</span></p>
                </div>
                <div v-else>
                    <p><span>{{ infoAula }}</span></p>
                    <br>
                    <p><span>{{ infoProfe }}</span></p>
                    <br>
                    <p><span>{{ infoAsignatura }}</span></p>
                    <br>
                    <p><span>{{ infoGrupo }}</span></p>
                    <br>
                    <div v-if="tituloAlumnos!='Sin informacion de alumnos'">
                        <p style="text-align: center;"><span>{{ tituloAlumnos }}</span></p>
                        <br>
                        <p v-for="i in infoAlumnos"><span>{{ i }}</span></p>
                    </div>
                    <div v-else>
                        <p style="text-align: center;"><span>{{ tituloAlumnos }}</span></p>
                    </div>
                </div>
                

            </div>
            <!-- FIN  Caja donde se deberá renderizar la información recuperada mediante los endpoints y back-end -->
        </div>
        
        <!-- INICIO Sección Mapas del centro -->
        <div class="contenedor">       
          
                <div id="planta-baja" class="caja-mapa" v-show="plantaBaja">
                    <div v-for="i in aulas" v-bind:style="classroomStyleRender(i)" v-on:click="obtenerInfoAula(i.aula)"></div>
                </div>   

                <div id="planta-primera" class="caja-mapa" v-show="primeraPlanta">
                    <div v-for="i in aulas" v-bind:style="classroomStyleRender(i)" v-on:click="obtenerInfoAula(i.aula)"></div>
                </div>

                <div id="planta-segunda" class=" caja-mapa" v-show="segundaPlanta">
                    <div v-for="i in aulas" v-bind:style="classroomStyleRender(i)" v-on:click="obtenerInfoAula(i.aula)"></div>
                </div>
        </div>
        <!-- FINAL Sección Mapas del centro -->

        <!-- Importación javascript David Jason Gianmoena para que funcionen los controles de los mapas etc.. -->
        <!-- Importante: Esta importación debe residir en la sección final del docuemnto html para que funcione adecuadamente -->
    </div>
    <div v-else>
            <div v-show="recarga" id="errorStudent">
                <header id="errorHeader">
                    <h1 class="errorContent">{{ header }}</h1>
                </header>
                <h1 class="errorContent">{{ content }}</h1>
            </div>

        </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

/*Resalta el boton de la barra de navegación de la sección para las migajas*/
.nav-menu li:last-child{
    background-color: rgb(222, 252, 253) !important;
    border-color: rgb(0, 0, 0);
}
/*Resalta el boton de la barra de navegación de la sección para las migajas*/
.nav-menu li:last-child a{
    color: rgb(34, 46, 83) !important;
    font-weight: bold !important;
}

/* Esta clase solo está para que la demo de la caja de información*/ 
/* que aparece al hacer hover sobre las aulas funcione. */
.aparece{
    display: block !important;
}

/*borra esto cuando veas*/
/*Estas son las cajas que aparecen en la demo al hacer hover.*/
#cuadro, #cuadro2{
    background-color: rgb(215, 243, 252) !important;
    display: none;
    position: absolute;
    top: 40%;
    left: 40%;
    border: 1px solid black;
    border-radius: 10px;
    padding: 15px;
    z-index: 99;
    box-shadow: 10px 10px 10px ;
    transition: all;
    transition: 0.2s;
}

/*A partir de aqui son cosas importantes de estilo*/ 
* {
    padding: 0;
    margin: 0;
    font-size: 16px; 
}

body{
    background-color: rgb(243, 235, 243);
    font-family: 'Open Sans';
}

:root {
    --map-width: 300px;
    --map-height: 300px;
    --status-color: red;
}

/*Animación que marca el aula seleccionada en el localizador de cursos.*/
@keyframes enfasis {
    from {
        background-color: rgba(255, 0, 0, 0);
    }
    to {
        background-color: rgba(29, 117, 218, 0.75);
        border: 1px solid rgb(0, 0, 0);
        box-shadow: 0px 0px 10px 5px red;
    }
  }


/*Esta clase es para enfatizar las aulas
 mediante la función de "Localizador curso.
 Funciona invocando la animación de arriba. */
.enfasis-aula{
    animation-name: enfasis;
    animation-duration: 0.33s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

/*Conjunto de mediaqueries que dan el valor inicial a la variable root para el tamaño de los planos */
@media screen and (max-width: 4096px) {
    :root {
        --map-width: 2808px;
        --map-height: 1984px;
    }
}

@media screen and (max-width: 2048px) {
    :root {
        --map-width: 1404px;
        --map-height: 992px;
    }
}

@media screen and (max-width: 1920px) {
    :root {
        --map-width: 1170px;
        --map-height: 827px;
    }
}

@media screen and (max-width: 1440px) {
    :root {
        --map-width: 1100px;
        --map-height: 777px;
    }
}

@media screen and (max-width: 1366px) {
    :root {
        --map-width: 936px;
        --map-height: 662px;
    }
}

@media screen and (max-width: 1280px) {
    :root {
        --map-width: 936px;
        --map-height: 662px;
    }
}

/*Da estilo al texto de "Rotación activa"*/
#rotacionActiva {
    font-weight: bold;
    color: var(--status-color);
}
/*Da estilo al texto de "Rotación desactivada"*/
#rotacionNoActiva {
    font-weight: bold;
    color: var(--status-color);
}


#contenedor-botones-plantas{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
}

/*Define las dimensiones del plano en pantalla.*/
/*NO DIMENSIONAR CON PORCENTAJES O PETARÁ */
.caja-mapa {
    height: var(--map-height);
    width: var(--map-width);
    border: 3px solid var(--status-color);
    margin-top: 10px;

}
/*Panel contenedor de los modulos de la izquierda.*/
#panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 5px;
    height: 913px;
    width: 310px;
}
/*Aplica las reglas a todos los hijos del panel lateral izquierdo*/
#panel>*{
    border-radius: 5px;
    border: 1px solid grey;
    background-color: rgb(255, 255, 255);
    padding:10px;
    margin: 5px;
}

#contenedor-botones-plantas{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
/*Titulos del panel lateral izquierdo.*/
.titulo-djg{
    font-weight: bold;
    margin-bottom: 5px;
}

#panel-selector {
    font-weight: bold;
    display: flex;
    justify-content: center;
}

#djg-main-box{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    background-color: rgb(241, 241, 224);
}


#contenedor-botones-dimensiones {
    display: none;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top:10px;
}

#contenedor-columnas-dimensiones {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
}

.columna-dimensiones{
    display: flex;
    flex-direction: column;
    width: 100%;
}

#selector-dimensiones{
    border-radius: 5px;
    margin: 5px;
    padding: 3px;
}

#contenedor-info-box-endpoints {
    margin-top:10px;
    height: auto;
    background-color: rgb(230, 248, 253);
    transition: 1s;
    transition: all;
}

#selector-curso{
    padding: 3px;
    margin-top: 5px;
    border-radius: 5px;
    background-color: rgb(238, 243, 242);
}

button {
    cursor: pointer;
    color: rgb(0, 0, 0);
    background-color: rgb(238, 243, 242);
    transition: 0.2s;
    border-radius: 5px;
    border: 1px solid black;
    margin: 5px;
    padding: 3px;
}

#contenedor-botones-rotacion button{
    /*Para diseño interactivo*/
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 3px;
    padding-bottom: 3px;
    margin-top: 8px;
    margin-bottom: 8px;
}

#contenedor-botones-rotacion button.boton-active,
#contenedor-botones-dimensiones button.boton-active {
    color: rgb(255, 255, 255);
    background-color:  rgb(31, 155, 203);
    transition: 0.2s;
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    font-weight: bold;
}

#contenedor-botones-rotacion button:hover,
.columna-dimensiones button:hover {
    color: rgb(0, 0, 0);
    background-color:  rgb(253, 255, 121);
    transition: 0.2s;
}


#restablecer:hover{
    color: rgb(0, 0, 0);
    background-color:  rgb(252, 218, 174);
}

.boton-active {
    color: rgb(255, 255, 255);
    background-color:  rgb(31, 155, 203);
    transition: 0.2s;
}

.boton-active-temp {
    color: rgb(0, 26, 255);
    background-color:  rgb(253, 255, 121);
    transition: 0.3s;
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    font-weight: bold;
}

/*Propiedades comunes a todas las plantas*/
#planta-baja, #planta-primera, #planta-segunda{
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
}

#planta-baja {
    background-image: url(/Planta-baja.png);
}

#planta-primera {
    background-image: url(/Planta-primera.png);
     
}

#planta-segunda {
    background-image: url(/Planta-segunda.png);
    
}

/*Selecciona todos los divs de AULA dentro de cada planta.*/
#planta-baja>* , #planta-primera>* , #planta-segunda>* {
    position: absolute;
    background-color: rgba(255, 255, 0, 0.26);
    border: 1px solid rgb(0, 0, 0);
 }

/*Atiende al HOVER de todos los divs AULA dentro de cada planta.*/
 #planta-baja>*:hover, #planta-primera>*:hover, #planta-segunda:hover>*:hover {
    background-color: rgba(28, 46, 146, 0.5);
    border: 1px solid gray;
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

.botonMenu{
    cursor: pointer;
}

#errorStudent
{
    width: 40%;
    margin-top: 8%;
    margin-left: 30%;
    text-align: center;
}

#errorHeader{
    width: 80%;
    font-size: 160%;
    margin-bottom: 10%;
    margin-left: 10%;
    background-color: rgb(241, 241, 224);
}

.errorContent{
    color: black;
    font-size: 160%;  
}

</style>