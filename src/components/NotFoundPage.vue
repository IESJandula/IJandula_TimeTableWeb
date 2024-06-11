<script setup>
import { useRouter } from 'vue-router';
import { getInfoError } from '@/api/peticiones';
import { checkData } from '@/js/utils';
import { ref,onMounted,watch,onUnmounted } from 'vue';
let body = document.getElementById("body");
body.style.backgroundColor = "aquamarine";
const router = useRouter();

//Variables
const header = ref("");
const content = ref("");
const wait = ref(false);
const waitServer = ref(false);
const recarga = ref(true);
let interval = undefined;
const setError = async()=>{
    const data = await getInfoError();
    
    if(typeof data=="undefined")
    {
        header.value = "Servidor no lanzado";
        content.value = "El servidor principal no ha sido lanzado, cuando se lance sera redirigido al inicio de sesion, gracias por la espera";
        recarga.value = false;
    }
    else
    {
        header.value = data.headerInfo;
        content.value = data.infoError;
        wait.value = data.wait;
        recarga.value = false;
    }
}

const checkStatus = async()=>{
    const data = await checkData()

    if((typeof data == "string" && data=="ok"))
    {
        waitServer.value = true;
    }
    else
    {
        if(data.headerInfo=="Servidor no lanzado")
        {
            setError();
        }
        else
        {
            waitServer.value = true;
        }
        
    }
  
}

onMounted(async()=>{
    setError();
    interval = setInterval(checkStatus,5000);
})

onUnmounted(async ()=>{
    clearInterval(interval);
})
watch(recarga,(nuevo,viejo)=>{
    if(!nuevo)
    {
        recarga.value = true;
    }
})

watch(waitServer,(nuevo,viejo)=>{
    if(nuevo)
    {
        waitServer.value = false;
        router.push("/horarios/profesores");
    }
});
</script>

<template>
    <div v-show="recarga">
        <header>
            <h1>{{ header }}</h1>
        </header>
        <h1>{{ content }}</h1>
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