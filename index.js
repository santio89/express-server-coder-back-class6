/* 
HTTP
const http = require('http');
const puerto = 8080;

const server = http.createServer((req, res) => {
    console.log("llego una peticion"); 
    const hora = new Date().getHours();
    const minutos = new Date().getMinutes();
    res.end(`bienvenido a nuestro servidor http\n${hora}:${minutos}hs`)
})

server.listen(puerto, ()=>{
    console.log(`servidor escuchando puerto: ${puerto}`)
}) */

const express = require("express");
const app = express();
const puerto = 8080;
let visitas = 0;

/* middleware */
app.use((req, res, next)=>{
    visitas++;
    next();
})
/* fin middleware */

app.get('/', (req, res)=>{
    res.send("<h1 style=color:blue>Bienvenidos al servidor express</h1>")

})

app.get('/user', (req, res)=>{
    res.send("hola soy user")
})

app.get('/user/:id/:nombre', (req, res)=>{
    const {id, nombre} = req.params;
    res.send("hola soy user. id:"+id+" nombre: "+nombre)
})

app.get('/visitas', (req, res)=>{
    res.send(`visitas: ${visitas}`)
})

app.get('/fyh', (req, res)=>{
/*     const date = new Date();
    res.json(`fyh: ${date}`) */
    const date = new Date().toLocaleString();
    res.send(`fyh: ${date}`)
})

app.listen(puerto, (err)=>{
    if(!err){
        console.log(`El servidor se inicio en el puerto ${puerto}`)
    } else{
        console.log(`Hubo un error al iniciar el servidor: `,err)
    }
    
})