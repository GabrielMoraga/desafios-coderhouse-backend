const configMariaDB = {
    table: 'productos',
    options: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'ecommerce'
        }
    }
    }


const configSQLite3 = {
    table: 'mensajes',
    options: {
        client: 'sqlite3',
        connection: {
            filename: './DB/ecommerce.sqlite'
        },
        useNullAsDefault: false
    }
}


module.exports = {
    configMariaDB, configSQLite3
}