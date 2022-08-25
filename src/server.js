const express = require('express')
const router = express.Router();
const MockAPI = require('../controllers/mockAPI');
const handelbars = require('express-handlebars')
const path = require('path')
const { denormalize, normalize, schema } = require('normalizr');
const util = require('util')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorDB = require('../controllers/ContenedorDB')
const ContenedorMongoDB = require('../controllers/ContenedorMongoDB')

const {configSQLite3, configMariaDB} = require('./dbConfig.js')


//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

//Instancio el contenedor con los manejadores CRUD con Knex, le paso la config de la db y el nombre de la tabla
const productosApi = new ContenedorDB(configMariaDB.options, 'productos')
const mensajesApi = new ContenedorMongoDB()

//--------------------------------------------
// configuro el socket

const user = new schema.Entity("users");
const text = new schema.Entity("text");
const mensaje = new schema.Entity("mensaje", {
  autor: user,
  text: text,
});
const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});


function print(objeto) {
    console.log(util.inspect(objeto,false,12,true))
}



io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', await productosApi.listarAll());

    // actualizacion de productos
    socket.on('update', async producto => {
        await productosApi.guardar(producto)
        io.sockets.emit('productos', await productosApi.listarAll());
    })

    let listaMensajes = await  mensajesApi.listarAll()
    //AQUI HAY QUE NORMALIZAR LA LISTA PARA ENVIAR AL FRONT

    // carga inicial de mensajes
    socket.emit('mensajes', listaMensajes);

    // actualizacion de mensajes
    socket.on('nuevoMensaje', async data => {
      const nuevoMensaje = {
        id: listaMensajes.length+1,
        autor: {
          id: data.autor.id,
          nombre: data.autor.nombre,
          apellido: data.autor.apellido,
          edad: data.autor.edad,
          alias: data.autor.alias,
          avatar: data.autor.avatar
        },
        text: {
          id: listaMensajes.length+1,
          text: data.text,
        }
      };

      listaMensajes.push(nuevoMensaje)
      const originalData = {
        id: "1",
        mensajes: listaMensajes,
      };
      //console.log(mensajes)

      let normalizedData = normalize(originalData, mensajes);
      normalizedData = JSON.parse(JSON.stringify(normalizedData))

        await mensajesApi.guardar(normalizedData)
        io.sockets.emit('mensajes', await mensajesApi.listarAll());
    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


// Configuración Handlebars
app.engine(".hbs", handelbars({
        extname: ".hbs",
        defaultLayout: 'main'
    }
));
app.set("view engine", ".hbs");


//---------------------------------------------
// Ruta mock productos

const mock = new MockAPI();

app.get("/api/productos-test", async (req, res) => {
    mock.popular();
      const products = mock.obtenerTodos();
      res.render('productos-test', {
        products: products
      })
      if (products.length == 0) {
        res.status(404).json({
          error: "no hay productos cargados",
        });
      }
    });

//--------------------------------------------
// inicio el servidor

const PORT = process.env.PORT || 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
