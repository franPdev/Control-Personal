const mysql = require('mysql2');

// Configuración de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'relevamiento_app',
    port: '3306'
};

// Función para manejar la desconexión y reconexión
function handleDisconnect() {
    const connection = mysql.createConnection(dbConfig);

    connection.connect(function (err) {
        if (err) {
            console.log('Error al conectar con MySQL:', err);
            setTimeout(handleDisconnect, 2000); // Reintento tras 2 segundos
        } else {
            console.log('Conexión a MySQL exitosa.');
        }
    });

    connection.on('error', function (err) {
        console.log('Error en la conexión MySQL:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // Manejo del error de pérdida de conexión: reconexión automática
            handleDisconnect();
        } else {
            throw err; // Otros errores se lanzan
        }
    });

    return connection;
}

// Exporta la conexión
const connection = handleDisconnect();
module.exports = connection;
