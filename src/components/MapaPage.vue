<script setup>
import { ref, watch, onMounted,onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerAulasPorPlanta,getCourses,sendErrorInfo,getAulaNow,getClassroomCourse,getAlumnosInBathroom } from '@/api/peticiones';
import { checkData,controlGrupos,showStudentsInfo,findAulaById } from '@/js/utils';
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
let plantaPrimera = ref(false);
let plantaSegunda = ref(false);
let recarga = ref(true);
let aulasTodas = ref([]);
let aulasPlantaBaja = ref([]);
let aulasPlantaPrimera = ref([]);
let aulasPlantaSegunda = ref([]);
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
let tituloAlumnosBaño = ref("");
let infoAlumnos = ref([]);
let infoAlumnosBaño = ref([]);
let aulaEnfasis = ref("");

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

const onClickPlantaBaja = (idAula) =>{
    const imagenPlantaBaja = document.getElementById("planta-baja");
    const imagenPlanta1 = document.getElementById("planta-primera");
    const imagenPlanta2 = document.getElementById("planta-segunda");
    imagenPlantaBaja.style.display = "block";
    imagenPlanta1.style.display = "none";
    imagenPlanta2.style.display = "none";
    plantaBaja.value = true;
    plantaPrimera.value = false;
    plantaSegunda.value = false;
    hacerEnfasis(idAula);
}

const onClickPlantaPrimera = (idAula) =>{
    const imagenPlantaBaja = document.getElementById("planta-baja");
    const imagenPlanta1 = document.getElementById("planta-primera");
    const imagenPlanta2 = document.getElementById("planta-segunda");
    imagenPlantaBaja.style.display = "none";
    imagenPlanta1.style.display = "block";
    imagenPlanta2.style.display = "none";
    plantaBaja.value = false;
    plantaPrimera.value = true;
    plantaSegunda.value = false;
    hacerEnfasis(idAula);
}

const onClickPlantaSegunda = (idAula) =>{
    const imagenPlantaBaja = document.getElementById("planta-baja");
    const imagenPlanta1 = document.getElementById("planta-primera");
    const imagenPlanta2 = document.getElementById("planta-segunda");
    imagenPlantaBaja.style.display = "none";
    imagenPlanta1.style.display = "none";
    imagenPlanta2.style.display = "block";
    plantaBaja.value = false;
    plantaPrimera.value = false;
    plantaSegunda.value = true;
    hacerEnfasis(idAula);
}

const hacerEnfasis = (idAula) => {

    if ((idAula != undefined && idAula != "" && idAula != null))
    {
        resetearEnfasis();
        const aula = document.getElementById(idAula);
        aula.className = "enfasis-aula";
        setTimeout(() => 
        {
            aula.className = "" ;
        }, 3800);
    }

}

const resetearEnfasis = ()=>{
    resetearEnfasisPlanta("planta-baja", aulasPlantaBaja.value);
    resetearEnfasisPlanta("planta-primera", aulasPlantaPrimera.value);
    resetearEnfasisPlanta("planta-segunda", aulasPlantaSegunda.value);
}

const resetearEnfasisPlanta = async (planta, aulasPlanta)=>{

    for(let i = 0; i < aulasPlanta.length ; i++)
    {
        let numIntAu = aulasPlanta[i].aula.numIntAu;
        const aula = document.getElementById(planta + "-" + numIntAu);
        if(aula != null)
        {
            aula.className = "";
        }
    }

    aulaEnfasis.value = "";
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

const checkStatus = async() =>{
    let error = await checkData();
    if((typeof error != "undefined" && typeof error != "string" && error.headerInfo=="Datos no cargados") && error.headerInfo!="Servidor no lanzado")
    {
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorData.value = true;
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
    }
    else if(error.headerInfo=="Datos de planos no cargados")
    {
        sendErrorInfo(error);
        header.value = error.headerInfo;
        content.value = error.infoError;
        errorData.value = true;
    }
    else if(typeof error!="undefined")
    {
        header.value = "";
        content.value = "";
        errorData.value = false;
        obtenerCursos();
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
        mostrarAlumnosBathroom(dataAlumnos);
    }
}

const mostrarAlumnosBathroom = async(alumnos)=>{
    const alumnosBathroom = await getAlumnosInBathroom();

    if(alumnosBathroom.length>0)
    {
        let array = []
        
        //Iteramos los alumnos y comparamos iterando los cursos
        for(let i = 0;i<alumnosBathroom.length;i++)
        {
            for(let k = 0;k<alumnos.length;k++)
            {
                let alumno = alumnosBathroom[i].name+" "+alumnosBathroom[i].lastName;
                if(alumno==alumnos[k])
                {
                    array.push(alumno);   
                }
            }  
        }
        if(array.length>0)
        {
            tituloAlumnosBaño.value = "----ALUMNOS EN EL BAÑO----";
            infoAlumnosBaño = ref(array);
        }
        else
        {
            tituloAlumnosBaño.value = "No hay alumnos en el baño";
            infoAlumnosBaño = ref([]);
        }
        
    }
    else
    {
        tituloAlumnosBaño.value = "No hay alumnos en el baño";
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

const onChangeCourse = async () =>{
    const cursoSelection = document.getElementById("selector-curso");
    let curso = cursoSelection.options[cursoSelection.selectedIndex].text;
    const data = await getClassroomCourse(curso);

    // OJO QUE EL 0 se ha puesto de forma temporal ya que el endpoint devuelve varios objetos, luego cojo el primero
    let planta = await findAulaById(data[0].classroom.number); 

    let idAula = planta + "-" + data.classroom.number;
    if(planta=="planta-baja")
    {
        onClickPlantaBaja(idAula);
    }
    else if(planta=="planta-primera")
    {
        onClickPlantaPrimera(idAula);
    }
    else if(planta=="planta-segunda")
    {
        onClickPlantaSegunda(idAula);
    } 
}

const cambioPlanta = ()=>{

    if(plantaBaja.value)
    {
        onClickPlantaPrimera();
    }
    else if(plantaPrimera.value)
    {
        onClickPlantaSegunda();
    }
    else if(plantaSegunda.value)
    {
        onClickPlantaBaja();
    }
}

onMounted(async ()=>{
    root.style.setProperty('--map-width',"662px");
    root.style.setProperty('--map-height',"936px");
    obtenerAulas("planta-baja");
    obtenerAulas("planta-primera");
    obtenerAulas("planta-segunda");
    obtenerCursos();
    interval = setInterval(checkStatus,500);
});

const obtenerAulas = async (planta)=>{
    const data = await obtenerAulasPorPlanta(planta);
    
    let array = [];

    for(let i = 0;i<data.length;i++)
    {
        let dimension = new DimensionPlano(data[i].height,data[i].width,data[i].top,data[i].right,data[i].left,data[i].planta,data[i].aula);
        array.push(dimension);
    }

    if (planta == "planta-baja")
    {
        aulasPlantaBaja.value = array;
    }
    else if (planta == "planta-primera")
    {
        aulasPlantaPrimera.value = array;
    }
    else if (planta == "planta-segunda")
    {
        aulasPlantaSegunda.value = array;
    }
    else
    {
        // Todas las aulas
        aulasTodas.value = array;
    }
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

watch(recarga,(nuevo,viejo) =>{
    if(!nuevo)
    {
        recarga.value = true;
    }
})

onUnmounted(async ()=>{
    clearInterval(interval);
    if(typeof _intervaloRotacion != "undefined")
    {
        clearInterval(_intervaloRotacion);
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
                <form action="">
                    <label for="selector-curso">Localizador de cursos:</label>
                    <select name="selector-curso" id="selector-curso" v-on:change="onChangeCourse()">
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
                        <button id="boton-planta-baja" v-on:click="onClickPlantaBaja('')">Planta<br/>baja</button>
                        <button id="boton-planta-primera" v-on:click="onClickPlantaPrimera('')">Planta<br/>primera</button>
                        <button id="boton-planta-segunda" v-on:click="onClickPlantaSegunda('')">Planta<br/>segunda</button>
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
                    <div style="margin-top: 5%;" v-if="tituloAlumnosBaño=='No hay alumnos en el baño'">
                        <p style="text-align: center;"><span>{{ tituloAlumnosBaño }}</span></p>
                    </div>
                    <div style="margin-top: 5%;" v-else>
                        <p style="text-align: center; color: darkred; font-weight: bold;"><span>{{ tituloAlumnosBaño }}</span></p>
                        <br>
                        <p v-for="i in infoAlumnosBaño"><span>{{ i }}</span></p>
                    </div>
                </div>
                

            </div>
            <!-- FIN  Caja donde se deberá renderizar la información recuperada mediante los endpoints y back-end -->
        </div>
        
        <!-- INICIO Sección Mapas del centro -->
        <div class="contenedor">       
          
                <div id="planta-baja" class="caja-mapa" v-show="plantaBaja">
                    <div v-for="itemAula in aulasPlantaBaja" v-bind:style="classroomStyleRender(itemAula)" v-on:click="obtenerInfoAula(itemAula.aula)" v-bind:id="'planta-baja-' + itemAula.aula.numIntAu"></div>
                </div>   

                <div id="planta-primera" class="caja-mapa" v-show="plantaPrimera">
                    <div v-for="itemAula in aulasPlantaPrimera" v-bind:style="classroomStyleRender(itemAula)" v-on:click="obtenerInfoAula(itemAula.aula)" v-bind:id="'planta-primera-' + itemAula.aula.numIntAu"></div>
                </div>

                <div id="planta-segunda" class=" caja-mapa" v-show="plantaSegunda">
                    <div v-for="itemAula in aulasPlantaSegunda" v-bind:style="classroomStyleRender(itemAula)" v-on:click="obtenerInfoAula(itemAula.aula)" v-bind:id="'planta-segunda-' + itemAula.aula.numIntAu"></div>
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
@import url("../assets/mapa.css");
@import url("../assets/firma.css");

</style>