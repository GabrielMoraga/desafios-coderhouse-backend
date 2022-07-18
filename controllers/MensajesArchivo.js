const {promises: fs} = require('fs');

class MensajesArchivo {
    constructor(ruta) {
        this.ruta = ruta;
    }

    async listarAll() {
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8')
            return JSON.parse(objs)
        } catch (error) {
            return []
        }
    }

    async listar(id) {
        try {
            const objs = await this.listarAll()
            const obj = objs.find(prod => prod.id == id)
            return obj || { error: `mensaje id: ${id} no encontrado` }
            
        } catch (error) {
            console.log(error)
        }
    }

    async guardar(obj) {
        const objs = await this.listarAll()
        let newId
        if(objs.length == 0) {
            newId = 1;
        } else {
            const ids = objs.map(o => o.id)
            const max = Math.max(...ids)
            newId = Number(max) + 1
        }

        const newObj = { ...obj, id: newId }
        objs.push(newObj)
        
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            return newObj
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(obj, id) {
        const objs = await this.listarAll()
        const index = objs.findIndex(o => o.id == id)
        const oldProd = objs[index];
        if (oldProd) {
            objs[index] = obj
            try {
                await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        } else {
            return { error: `mensaje id: ${id} no encontrado` }
        }
    }

    async borrar(id) {
        const objs = await this.listarAll()
        const index = objs.findIndex((o) => o.id == id);
        let obj = objs[index]
        if (obj) {
            objs.splice(index,1)
            try {
                await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error al borrar: ${error}`)
            }
        } else {
            return {error: `Error al borrar: no se encontró id: ${id}`};
        }
    };

    async borrarAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}

module.exports = MensajesArchivo