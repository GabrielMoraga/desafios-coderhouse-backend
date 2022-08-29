const { truncateSync } = require('fs');
const mongoose = require('mongoose');
const { denormalize, normalize, schema } = require('normalizr');
const util = require('util');

const url = 'mongodb://localhost:27017/ecommerce';

//función print
function print(objeto) {
  console.log(util.inspect(objeto,false,12,true))
}

const user = new schema.Entity("users");

// Define your text schema
const text = new schema.Entity("text");

// Define your mensaje
const mensaje = new schema.Entity("mensaje", {
  autor: user,
  text: text,
});

const mensajesSchema = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});


//Creo esquema de mongoose para guardar datos normalizdos (normalizaData)
/* Nunca me funciono este Schema detallado
const esquemaMensaje = new mongoose.Schema({
  entities: {
    users: {
      id: { type: String},
      nombre: { type: String},
      apellido: { type: String},
      edad: { type: String},
      alias: { type: String},
      avatar: { type: String},
    },
    text: { 
      id: String,
      text: String,
     },
    mensaje: { 
      id: { type: String },
      autor: { type: String},
      text: { type: Number },
     },
    mensajes: { 
      id: { type: String},
      mensajes: [],
     },
  },
  result: {type: String},
})
*/
// Este Schema funciona
const esquemaMensaje = new mongoose.Schema({
  entities: {type: [Object], blackbox: true},
  result: {type: String},
})

const daoMensajes = mongoose.model('mensajes', esquemaMensaje)

class ContenedorMongoDB {
  constructor() {
    mongoose.connect(url, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base MongoDB para mensajes');
      }
    })
  }

  async guardar(data) {
    try {
      console.log("HOLA", data)
      await daoMensajes.deleteMany({})
      const saveModel = await daoMensajes.create(data)
    } catch (err) {
      console.log(err);
    }
  }

  async listarAll() {
    try {
      const res = await daoMensajes.find({})
      const json = JSON.stringify(res)
      console.log('CHAO', json)
      return res

    } catch (err) {
      console.log(err);
    }
  } 
        // const denormalizedData = denormalize(
        //       normalizedData.result,
        //       mensajes,
        //       normalizedData.entities
        // );
        // console.log("/* -------------- DENORMALIZED denormalizedData.mensajes ------------- */");
        // console.log(denormalizedData);
        

  borrarPorId(id) {
    return daoMensajes.deleteOne({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        this.DB_MENSAJES = res;
      }
    });
  }
  actualizarPorId(id, nuevoText) {
    return daoMensajes.updateOne({id: id}, {$set: {text: nuevoText}}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        this.DB_MENSAJES = res;
      }
    });
  }
  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
  }
}

module.exports = ContenedorMongoDB;