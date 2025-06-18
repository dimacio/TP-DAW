const mysql = require('mysql');

const db_config = {
    host: 'db',
    port: '3306',
    user: 'root',
    password: 'userpass',
    database: 'smart_home'
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, as the old one is gone.

    connection.connect(function(err) {
        if (err) {
            console.error('Error al conectar a la DB:', err);
            setTimeout(handleDisconnect, 2000); // Intenta reconectar después de 2 segundos
        } else {
            console.log('Conectado a la DB con el thread ID:', connection.threadId);
        }
    });

    connection.on('error', function(err) {
        console.error('Error en la DB:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('La conexión con la DB se perdió. Intentando reconectar...');
            handleDisconnect(); // Si la conexión se pierde, la manejamos.
        } else {
            throw err; // Lanza otros errores no manejados
        }
    });
}

handleDisconnect();

module.exports = connection;