const { Client } = require('pg');
const conexion = {
    host: 'localhost',
    user: 'postgres',
    password: 'trigun200312',
    database: 'BaseDir',
};

const postgres = new Client(conexion);

postgres.connect()
    .then((connection) => {
    console.log('Base Conectada');
});

module.exports = postgres;