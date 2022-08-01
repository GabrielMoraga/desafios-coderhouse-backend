const knex = require('knex');

class ContenedorDB {
    constructor(config, table){
        this.knex = knex(config);
        this.table = table
    }

    async listarAll() {
        try {
            return await this.knex(this.table)
            //return this.knex(this.table).select().from(this.table)
        } catch (error) {
            throw new Error(`Error al listar: ${error}`) 
        }
        
    }
    
    async listar(id) {
        try {
            return this.knex(this.table).where('id',id)
            //return this.knex().select().from(this.table).where('id', id)
            
        } catch (error) {
            throw new Error(`Error al listar el id: ${id}`) 
        }
        
    }
    
    async guardar(obj) {
        try {
            return await this.knex(this.table).insert(obj)
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`) 
        }
    }
    
    async actualizar(obj, id) {
        try {
            return await this.knex(this.table).where('id',id).update(obj)
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`) 
        }
    }
    
    async borrar(id) {
        try {
            return await this.knex(this.table).where('id',id).del()
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`) 
        }
    };
    
    async borrarAll() {
        try {
            return await this.knex(this.table).del()
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`) 
        }
    };
}

module.exports = ContenedorDB;