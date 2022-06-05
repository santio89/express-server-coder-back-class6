const fs = require("fs");

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async save(objeto) {
        try {
            /* busco id en archivo de ids, si existe.*/
            let ids =Array.from(JSON.parse(await fs.promises.readFile("./ids.txt", "utf-8")));
            
            ids.push(ids[ids.length-1]+1);
            objeto.id = ids[ids.length-1];
            fs.promises.writeFile("./ids.txt", JSON.stringify(ids));

            /* si el archivo existe, agrega un objeto al array */
            let arrayObjetos = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
            arrayObjetos.push(objeto);
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayObjetos))
            console.log("Objeto guardado correctamente en ", this.archivo);
        } catch (error) {
            if (error.code === 'ENOENT') {
                /* si el archivo no existe, agrego el objeto en un archivo vacio */
                objeto.id = 1;
                await fs.promises.writeFile("./ids.txt", JSON.stringify([1]));
                await fs.promises.writeFile(this.archivo, JSON.stringify([objeto]));
                console.log("Objeto guardado correctamente en ", this.archivo);
            } else {
                console.log("Error guardando objeto en el fs. Code: ", error);
            }
        }
    }

    async getById(id) {
        try {
            const data = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
            const objeto = data.find(objeto => objeto.id === id);
            return (objeto ? objeto : `No se encontro el objeto con id ${id}`);
        } catch (error) {
            console.log("Error buscando objeto en el fs. Code: ", error);
        }
    }

    async getAll() {
        try {
            const data = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
            return (data ? console.log(data) : "El archivo está vacío o tiene un problema");
        } catch (error) {
            console.log("Error buscando objetos del archivo. Code: ", error)
        }
    }

    async deleteById(id) {
        try {
            const data = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
            const nuevoArray = data.filter(objeto => objeto.id !== id);
            await fs.promises.writeFile(this.archivo, JSON.stringify(nuevoArray))
            console.log(`Objeto de ID ${id} eliminado`)
        } catch (error) {
            console.log("Error eliminando objeto en el fs. Code: ", error)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.archivo, "")
            console.log("Objetos eliminados")
        } catch (error) {
            console.log("Error eliminando objetos en el fs. Code: ", error)
        }
    }
}


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