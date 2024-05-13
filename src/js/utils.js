import { Profesor } from "@/models/profesores";
import { Tramo } from "@/models/tramos";
import { Alumno } from "@/models/alumnos";
import { checkServerData } from "@/api/peticiones";
import { Puntos } from "@/models/puntos";

/**
 * Metodo que compara el nombre seleccionado con los datos cargadados
 * de los profesores devolviendo el nombre y apellidos para la busqueda
 * posterior en el servidor
 * @param {string} nombre 
 * @param {Profesor[]} profesores 
 * @returns array con 2 datos, nombre(0) y apellidos(1)
 */
export const separadorNombre = (nombre,profesores) =>{
    let nombreApellido = [];
    let index = 0;
    let salir = false;
    while(index<profesores.length && !salir)
    {
        let profe = profesores.at(index);
        let nombreCompleto = profe.nombre+" "+profe.primerApellido+" "+profe.segundoApellido;

        if(nombre == nombreCompleto)
        {
            nombreApellido.push(profe.nombre);
            nombreApellido.push(profe.primerApellido+" "+profe.segundoApellido);
            salir = true;
        }

        index++;
    }
    return nombreApellido;
}
/**
 * Metodo que mediante un tramo horario y una lista de tramos
 * devuelve un tramo especifico para su posterior uso en una
 * llamada http
 * @param {string} hora 
 * @param {Tramo[]} tramos 
 * @returns tramo especifico 
 */
export const getSpecificTramo = (hora,tramos)=>{
    //Como la hora siempre va a venir dada por hh - hh separamos por "-"
    let array = hora.split("-");
    //Creamos un tramo por defecto
    let tramo = new Tramo("","","","");
    //Eliminamos los espacios sobrantes
    array[0] = array[0].trim();
    array[1] = array[1].trim();
    
    //Instanciamos la fecha actual
    let date = new Date();

    //Comprobamos que los dias no sean sabado o domingo
    if(date.getUTCDay()==6)
    {
        alert("Estas busacando un profesor en sabado")
    }
    else if(date.getUTCDay()==0)
    {
        alert("Estas buscando un profesor en domingo")
    }
    else
    {   
        //Buscamos el tramo y se lo asignamos al que queremos devolver
        for(let i=0;i<tramos.length;i++)
        {
            tramos[i].startHour = tramos[i].startHour.trim();
            tramos[i].endHour = tramos[i].endHour.trim();

            if(tramos[i].startHour==array[0] && tramos[i].endHour==array[1] && tramos[i].dayNumber==(date.getUTCDay()+""))
            {
                tramo = tramos[i];
            }
        }
    }
    
    return tramo;
}

/**
 * Metodo que meiante un tramo horario, un dia especifico y una lista
 * de tramos devuelve un tramo especifico para su posterior uso en 
 * una llamada http
 * @param {string} hora 
 * @param {string} dia 
 * @param {Tramo[]} tramos 
 * @returns tramo especifico
 */
export const getOldTramo = (hora,dia,tramos)=>{

    //Creamos la fecha utilizando el valor seleccionado del dia
    let date = new Date(dia);

    //Como la hora siempre va a venir dada por hh - hh separamos por "-"
    let array = hora.split("-");
    //Creamos un tramo por defecto
    let tramo = new Tramo("","","","");
    //Eliminamos los espacios sobrantes
    array[0] = array[0].trim();
    array[1] = array[1].trim();

    //Controlamaos que el dia no sea ni sabado ni domingo
    if(date.getUTCDay()==6)
    {
        alert("Has seleccionado sabado, dia no laborable");
    }
    else if(date.getUTCDay()==0)
    {
        alert("Has seleccionado domingo, dia no laborable");
    }
    else
    {
        //Buscamos el tramo y se lo asignamos al que queremos devolver
        for(let i=0;i<tramos.length;i++)
        {
            tramos[i].startHour = tramos[i].startHour.trim();
            tramos[i].endHour = tramos[i].endHour.trim();

            if(tramos[i].startHour==array[0] && tramos[i].endHour==array[1] && tramos[i].dayNumber==(date.getUTCDay()+""))
            {
                tramo = tramos[i];
            }
        }
    }

    return tramo;
}
/**
 * Metodo que recoge el dia la hora y los minutos actuales para la localizacion
 * a tiempo real de un profesor buscandolo por su curso
 * @returns booleano que determina si se debe de mostrar o no un PopUp informativo
 */
export const checkHoraDia = () =>
{
    let data = "";
    let date = new Date();

    if(date.getUTCDay()==6)
    {
        data = "No se puede localizar un profesor en sabado";
    }
    else if(date.getUTCDay()==0)
    {
        data = "No se puede localizar un profesor en domingo";
    }
    else if(date.getHours()<8 && date.getMinutes<15)
    {
        data = "Se esta buscando un profesor antes del tramo inicial (8:15)";
    }
    else if(date.getHours()>14 && date.getMinutes<45)
    {
        
        data = "Se esta buscando un profesor antes del tramo inicial (14:45)";
    }

    return data;
}

/**
 * Metodo que mediante un alumno y un curso devuelve un alumno en concreto
 * para su puesta de datos en una tabla
 * @param {string} alumno 
 * @param {string} curso 
 * @param {Alumno[]} alumnos 
 * @returns alumno encontrado
 */
export const separadorNombreCurso = (alumno,curso,alumnos) =>{
    let alumnoFound =  new Alumno("?","?","?","","","","","","");

    for(let i = 0;i<alumnos.length;i++)
    {
        let item = alumnos[i];
        let itemValue = item.name+" "+item.lastName;

        if(itemValue==alumno)
        {       
            alumnoFound = new Alumno(item.name,item.lastName,item.course,item.matriculationYear,item.firstTutorLastName,item.secondTutorLastName,
		        item.tutorName,item.tutorPhone,item.tutorEmail
		        );
        }
    }

    return alumnoFound;
}
/**
 * Metodo que transforma la fecha de formato ingles yyyy-mm-dd a formato español dd/mm/yyyy
 * @param {string} fecha 
 * @returns fecha transformada a dd/mm/yyyy
 */
export const convertirFecha = (fecha) =>{
    
    if(fecha=="")
    {
        return "";
    }

    let split = fecha.split("-");

    let fechaNueva = "";

    fechaNueva = split[2].trim()+"/"+split[1].trim()+"/"+split[0].trim();
    
    return fechaNueva;
}
/**
 * Metodo que compara 2 fechas y devuelve true o false dependiendo si son
 * mayores o menores
 * @param {string} fechaInicio 
 * @param {string} fechaFin 
 * @returns teue si la fecha de inicio es menor false si no
 */
export const compareDate = (fechaInicio,fechaFin) =>{
    let compare = true;
    let splitInicio = fechaInicio.split("/");
    let splitFin = fechaFin.split("/");

    //Comprobamos el year
    compare = Number(splitInicio[2].trim())<=Number(splitFin[2].trim());

    //Comprobamos el mes
    if(compare)
    {
        compare =  Number(splitInicio[1].trim())<=Number(splitFin[1].trim());
    }

    //Comprobamos el dia
    if(compare)
    {
        compare =  Number(splitInicio[0].trim())<=Number(splitFin[0].trim());
    }

    return compare;
}

/**
 * Metodo que se ejecuta al cargar la pagina y comprueba si en el servidor
 * existen datos, en caso contrario redirige al usuario a la pagina de error
 */
export const checkData = async()=>{
    const data = await checkServerData();

    if(typeof data == "undefined")
    {
        return {
            headerInfo:"Servidor no lanzado",
            infoError:"El servidor principal no ha sido lanzado, cuando se lance sera redirigido al inicio de sesion, gracias por la espera",
            wait:true
        };
    }
    else if(typeof data != "string")
    {
        if(data.error == "Error de datos en general")
        {
            return {
                headerInfo:"Datos no cargados",
                infoError:"El administrador aun no ha cargado los datos en el servidor cuando los cargue se recargara la pagina automaticamente",
                wait:true
            };
        }
        else if(data.error == "Error de datos de estudiantes")
        {
            return {
                headerInfo:"Datos de estudiantes no cargados",
                infoError:"El administrador aun no ha cargado los datos de los estudiantes en el servidor cuando los cargue se cargara automaticamente la pagina gracias por la espera",
                wait:true
            };
        }
        else if(data.error == "Error de datos de planos")
        {
            return {
                headerInfo:"Datos de planos no cargados",
                infoError:"El administrador aun no ha cargado los datos de los planos en el servidor cuando los cargue se cargara automaticamente la pagina gracias por la espera",
                wait:true
            };
        }
    }
    else
    {
        return "ok";
    }
}

/**
 * Metodo que busca y devuelve la sancion concreta
 * a aplicar sobre el alumno
 * @param {string} valor 
 * @param {Puntos[]} puntos 
 * @returns sancion encontrada o sancion por defecto
 */
export const searchSancion  = (valor,puntos) =>{
    let sancion = new Puntos(0,"?");

    for(let i = 0;i<puntos.length;i++)
    {
        if(valor.search(puntos[i].description)>0)
        {
            sancion = puntos[i];
        }
    }

    return sancion;
}