const socket = io.connect();

function addProducto(productos) {
    const formAgregarProducto = document.getElementById('formAgregarProducto')
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('update', producto);
    formAgregarProducto.reset()
}


socket.on('productos', productos => {
    makeHtmlTable(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')
console.log(inputMensaje)

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = {autor: {
        id: document.getElementById('inputUsername').value,
        nombre: document.getElementById('username').value,
        apellido: document.getElementById('apellido').value,
        edad: document.getElementById('edad').value,
        alias: document.getElementById('alias').value,
        avatar: document.getElementById('avatar').value
    },
    text: document.getElementById('inputMensaje').value
    }

    socket.emit('nuevoMensaje', mensaje);
})


socket.on('mensajes', mensajes => {
    console.log('ESTOS SON LOS MENSAJES RECIBIDOS EN EL FRONT', mensajes)
    console.log(mensajes)
    //const objeto = {entities: mensajes[0].entities, result: mensajes[0].result}
    // Aquí debo desnormalizar //
        // Esquema de Normalización
        const user = new normalizr.schema.Entity("users");
        const text = new normalizr.schema.Entity("text");
        const mensaje = new normalizr.schema.Entity("mensaje", {
        autor: user,
        text: text,
        });
        const mensajesSchema = new normalizr.schema.Entity("mensajes", {
        mensajes: [mensaje],
        });

        //Desnormalizo
        const denormalizedMensajes = normalizr.denormalize(mensajes[0].result[0], mensajesSchema, mensajes[0].entities[0]);
        console.log('ESTOS SON LOS MENSAJES DESNORMALIZADOS', denormalizedMensajes)
        let compresion = Number(JSON.stringify(mensajes).length)/ Number(JSON.stringify(denormalizedMensajes.mensajes).length)
        compresion = Math.round(compresion*100)
        document.getElementById('compresion').innerHTML = `(Compresión ${compresion}%)`

    const html = makeHtmlList(denormalizedMensajes.mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    return mensajes.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.autor.id}</b>
                [<span style="color:brown;">${mensaje.date}</span>] :
                <i style="color:green;">${mensaje.text.text}</i>
            </div>
        `)
    }).join(" ");
}