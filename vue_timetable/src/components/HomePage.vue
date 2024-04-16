<script setup>
import { useRouter } from 'vue-router';
let body = document.getElementById("body");
body.style.backgroundColor = "aquamarine";
const router = useRouter();

</script>

<template>
    <div>
        <h1 class="titulo">Reaktor Horarios</h1>
        <h2 class="bienvenida">Bienvenido usuario</h2>
        <div id="botones">
            <button v-on:click="router.push('/horarios/profesores')">Entrar</button>
            <button>Cerrar sesion</button>
        </div>  
    </div>

</template>

<style scoped>

.titulo{
    font-size: 400%;
    margin-top: 10%;
    text-align: center;
}
.bienvenida{
    margin-top: 10%;
    text-align: center;
}
#botones{
    width: fit-content;
    align-items: center;
    margin-left: 46%;
    margin-top: 5%;
    
}

#botones button {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 16px;
    border: 1px solid;
    border-color: rgb(31, 155, 203);
}

#botones button{
    color: white;
    background-color: rgb(31, 155, 203);
    border-radius: 4px;
    border-color: transparent;
    cursor: pointer;
}

#botones button{
    background-color: rgb(1, 128, 179);
}


</style>