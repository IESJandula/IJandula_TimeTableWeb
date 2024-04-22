<script setup>
import { useRouter } from 'vue-router';
let body = document.getElementById("body");
body.style.backgroundColor = "aquamarine";
const router = useRouter();
</script>

<template>
    <div>
        <header>
            <h1>Datos no cargados</h1>
        </header>
        <h1>El administrador aun no ha cargado los datos en el servidor cuando los cargue se le redigira al apartado de planos gracias por la espera</h1>
    </div>

</template>

<style scoped>

div{
    width: 40%;
    margin-top: 8%;
    margin-left: 30%;
    text-align: center;
}
h1{
    font-size: 300%;
}
header{
    width: 80%;
    font-size: 160%;
    margin-bottom: 10%;
    margin-left: 10%;
}
</style>