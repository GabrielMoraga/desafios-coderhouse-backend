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

const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});
//Creo esquema de mongoose para guardar datos normalizdos (normalizaData)
const esquemaMensaje = new mongoose.Schema({
  entities: {
    users: { 
      id: { type: String, require: true, max: 1000 },
      nombre: { type: String, require: true, max: 1000 },
      apellido: { type: String, require: true, max: 1000 },
      edad: { type: String, require: true, max: 1000 },
      alias: { type: String, require: true, max: 1000 },
      avatar: { type: String, require: true, max: 1000 },
     },
    text: { 
      id: { type: Number, require: true },
      text: { type: String, require: true, max: 1000 },
     },
    mensaje: { 
      id: { type: Number, require: true },
      autor: { type: String, require: true, max: 1000 },
      text: { type: Number, require: true },
      date: { type: String, require: true, max: 1000 },
     },
    mensajes: { 
      id: { type: String, require: true, max: 1000 },
      mensajes: { type: Number, require: true },
     },
  },
  result: { type: String, require: true, max: 1000 },
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
      const saveModel = new daoMensajes(data)
      const objectSaved = await saveModel.save()
    } catch (err) {
      console.log(err);
    }
  }

  async listarAll() {
    try {
      const res = await daoMensajes.find({})
      console.log('CAHO', res)
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