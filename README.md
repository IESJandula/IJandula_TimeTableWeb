# Timetable Web

## Introducción

Timetable Web es la parte web que se complementa con el proyecto [TimetableServer](https://github.com/IESJandula/Reaktor_TimetableServer), y la que recoge los datos del servidor mostrándolos en tiempo real, la web está realizada en Vue.js, Node JS y JavaScript, más una base de HTML y CSS realizada por los alumnos de 1 DAM.

## Manual de instalación

Para usar la web tendremos que tener [Node Js](https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi) instalado en nuestro equipo, además de que necesitaremos una versión específica de Node Js, para eso deberemos de tener instalado también [NVM](https://github.com/coreybutler/nvm-windows/releases/download/1.1.12/nvm-setup.exe), una vez que tengamos NVM instalado necesitaremos la versión de Node 20.11.1 para tener esa versión abrimos la cmd y ejecutamos:

```
nvm install 20.11.1
```

Una vez con la versión instalada ejecutamos:

```
nvm use 20.11.1
```

Para comprobar que la versión de Node es la correcta ejecutamos:

```
node --version
```
Una vez con Node y su versión correcta nos dirigimos al proyecto y ejecutamos:

```
npm install
```
Con esto instalamos las dependencias del fichero package.json que son pinia, vue y vue-router, todas son necesarias para la composición y arranque del proyecto.

## Arranque del proyecto

Una vez con las dependencias instaladas, para arrancar el proyecto ejecutamos:

```
npm run dev
```

Se abrirá un servidor en el puerto 5173 con el que podemos ver la web completa además de que los cambios que hagamos se verán reflejados en la web sin necesidad de parar y ejecutar el servidor de nuevo.

Si queremos que el servidor sea público en la intranet para probarlo en otros dispositivos ejecutamos:

```
npm run dev -- --host
```

## Contenido del proyecto

La web se divide en 6 secciones con las que podremos cambiar en un menú situado en la cabecera de la página, estas secciones son:

<ul>
    <li>Administración: esta sección se encarga de cargar los datos, actualmente los datos que se pyeden cargar son, los datos del centro generales en formato XML, alumnos en CSV y planos de las aulas en CSV.</li>
    <br>
    <li>Profesores: esta sección se encarga de buscar en tiempo real a un profesor ya sea por su nombre y apellido, o por el curso en el que imparte clase ahora mismo, también se puede buscar a un profesor por su tramo horario y en otro día determinado que no sea el actual.</li>
    <br>
    <li>Alumno : esta sección se encarga de localizar alumnos en tiempo real, mostrar los datos de su tutor legal, registrar su visita al baño, y consultar la visita al baño por periodo de un alumno o de varios</li>
    <br>
    <li>Horarios: esta sección se encarga de generar los horarios de los profesores y grupos en PDF, permitiendo a los docentes descargarlo o visualizarlo rápidamente</li>
    <br>
    <li>Convivencia: esta sección se encarga de imponer sanciones o recompensas a los alumnos de forma rápida guardando el motivo y los puntos que se suman o quitan en la base de datos del servidor</li>
    <br>
    <li>Planos: esta sección es la más grande y completa de la web ya que muestra un mapa del instituto con las aulas en las que se encuentran alumnos y profesores, lo que se puede hacer en esta sección es buscar un aula determinada por el curso que se encuentra en ella, y consultar los profesres, alumnos, grupos, asignaturas y alumnos en el baño que contiene el aula seleccionada</li>
</ul>

## Créditos

Este proyecto comienza con la base de HTML y CSS por los alumnos de 1 DAM supervisado por:


- [Francisco Benítez Chico](https://www.linkedin.com/in/franciscobenitezchico/)</li>

La continuación en Vue.js, Node Js y JavaScript por el alumno:


- [Pablo Elías Ruiz Cánovas](https://www.linkedin.com/in/pablo-el%C3%ADas-ruiz-c%C3%A1novas-315a66267/)

Supervisado por el profesor [Francisco Benítez Chico](https://www.linkedin.com/in/franciscobenitezchico/) .
