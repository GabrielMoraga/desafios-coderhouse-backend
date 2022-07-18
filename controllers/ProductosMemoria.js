class Productos {
    constructor() {
        this.productos = []
        this.id = 0
    }

    listarAll() {
        return [...this.productos]
    }

    listar(id) {
        const prod = this.productos.find(prod => prod.id == id)
        return prod || { error: `producto id: ${id} no encontrado` }
    }

    guardar(prod) {
        const newProd = { ...prod, id: ++this.id } // Forma más corta de generar un id no duplicado
        this.productos.push(newProd)
        return newProd
    }

    actualizar(prod, id) {
        const newProd = {...prod, id: Number(id)}
        const index = this.productos.findIndex(p => p.id == id)
        const oldProd = this.productos[index];
        if (oldProd) {
            this.productos[index] = newProd
            return newProd
        } else {
            return { error: `producto id: ${id} no encontrado` }
        }
    }

    borrar(id) {
        const index = this.productos.findIndex((p) => p.id == id);
        let producto = this.productos[index]
        if (producto) {
            this.productos.splice(index,1)
            return producto;
        } else {
            return {error: `Prodcuto id: ${id} no encontrado`};
        }
    };

}

module.exports = Productos