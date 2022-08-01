const knex = require('knex');
const {configSQLite3, configMariaDB} = require('../src/dbConfig.js');

(async () => {

try {
    const dbProductos = knex(configMariaDB.options);
    await dbProductos.schema.dropTable(configMariaDB.table)

    await dbProductos.schema.createTable(configMariaDB.table, table =>{
        table.increments('id').primary()
        table.string('title')
        table.string('price')
        table.string('thumbnail')
        
    });
    await dbProductos.destroy()
    console.log(`Se creó la tabla: ${configMariaDB.table}`)
} catch (error) {
    console.log(  `error al crear la tabla ${error}`)
}

try {
    const dbMensajes = knex(configSQLite3.options);
    await dbMensajes.schema.dropTable(configSQLite3.table)

    await dbMensajes.schema.createTable(configSQLite3.table, table => {
        table.increments('id').primary();
        table.string('autor');
        table.string('fyh');
        table.string('texto');
    });

    await dbMensajes.destroy();
    console.log(`Se creó la tabla: ${configSQLite3.table}`)
} catch (error) {
    console.log(  `error al crear la tabla ${error}`)
}
})();