const express = require("express");
const cors = require("cors");
const connection = require("./dbConnection");

const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json()); // Para analizar JSON

// Ruta para asignar y guardar actividades y turnos
app.post('/guardarTareaYTurno', (req, res) => {
    console.log('Petición recibida en /guardarTareaYTurno');
    const tareas = req.body;

    console.log('Datos recibidos:', tareas); 

    if (!Array.isArray(tareas) || tareas.length === 0) {
        return res.status(400).json({ mensaje: 'No se enviaron actividades válidas' });
    }

    // Empezar a guardar cada tarea y turno
    const actividadesGuardadas = [];
    tareas.forEach(tarea => {
        // Insertar turno para cada tarea
        const queryTurnos = 'INSERT INTO turnos (empleado_id, fecha, horario_inicio, horario_fin) VALUES (?, ?, ?, ?)';
        const turnosValues = [tarea.empleado_id, tarea.turno.fecha, tarea.turno.horario_inicio, tarea.turno.horario_fin];

        connection.query(queryTurnos, turnosValues, (errTurno, resultTurno) => {
            if (errTurno) {
                console.error('Error al guardar el turno:', errTurno.message);
                return res.status(500).json({ mensaje: 'Error al guardar el turno', error: errTurno.message });
            }

            // Recuperar el ID del turno insertado
            const turnoId = resultTurno.insertId;

            // Insertar actividad usando el turnoId recuperado
            const queryActividad = 'INSERT INTO actividades (empleado_id, descripcion, fecha, turno_id) VALUES (?, ?, ?, ?)';
            const actividadValues = [tarea.empleado_id, tarea.descripcion, tarea.fecha, turnoId];

            connection.query(queryActividad, actividadValues, (errActividad, resultActividad) => {
                if (errActividad) {
                    console.error('Error al guardar la actividad:', errActividad.message);
                    return res.status(500).json({ mensaje: 'Error al guardar la actividad', error: errActividad.message });
                }
                console.log('Actividad guardada correctamente:', resultActividad);
                actividadesGuardadas.push(resultActividad);

                // Comprobar si todas las actividades fueron guardadas
                if (actividadesGuardadas.length === tareas.length) {
                    return res.status(200).json({ mensaje: 'Actividades y turnos guardados correctamente' });
                }
            });
        });
    });
});


// Endpoint para obtener todos los empleados
// Ruta para obtener empleados
app.get('/obtenerEmpleados', (req, res) => {
    connection.query('SELECT id, nombre, apellido, puesto FROM empleados', (err, results) => {
        if (err) {
            console.error("Error al obtener empleados:", err);
            return res.status(500).json({ error: "Error al obtener empleados" });
        }
        res.json(results); // Envía los resultados al frontend
    });
});

// Obtener Reportes de Actividades y Turnos
app.get('/obtenerReporte/:empleado_id', (req, res) => {
    const empleadoId = req.params.empleado_id;

    const query = `
        SELECT a.descripcion, a.fecha, t.horario_inicio, t.horario_fin, a.estado_actividad
        FROM actividades a
        JOIN turnos t ON a.turno_id = t.id
        WHERE a.empleado_id = ?
    `;

    connection.query(query, [empleadoId], (err, results) => {
        if (err) {
            console.error("Error al obtener el reporte:", err);
            return res.status(500).json({ error: "Error al obtener el reporte del empleado" });
        }

        // Si no hay resultados, enviamos un 200 con un mensaje
        if (results.length === 0) {
            return res.status(200).json({ mensaje: "No se encontraron actividades para el empleado" });
        }

        // Si hay resultados, enviamos los datos normalmente
        res.json(results);
    });
});



//Backend para Datos del Gráfico

app.get('/obtenerFrecuenciaActividades', (req, res) => {
    const query = `
        SELECT descripcion, COUNT(*) AS frecuencia
        FROM actividades
        GROUP BY descripcion
        ORDER BY frecuencia DESC
        LIMIT 10;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Esto enviará los resultados en formato JSON
    });
});


//Backend para Obtener las Horas de Trabajo


app.get('/obtenerHorasTrabajadas', (req, res) => {
    const query = `
        SELECT e.nombre, e.apellido, SUM(TIMESTAMPDIFF(HOUR, t.horario_inicio, t.horario_fin)) AS horas_trabajadas
        FROM empleados e
        JOIN turnos t ON e.id = t.empleado_id
        GROUP BY e.id
        ORDER BY horas_trabajadas DESC;
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener las horas trabajadas:", err);
            return res.status(500).json({ error: "Error al obtener las horas trabajadas" });
        }
        res.json(results);
    });
});


//Back para estado de actividades

// Backend para obtener el estado de las actividades
app.get('/obtenerEstadoActividades', (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN estado_actividad = 'realizada' THEN 1 ELSE 0 END) AS realizadas,
            SUM(CASE WHEN estado_actividad = 'no realizada' THEN 1 ELSE 0 END) AS no_realizadas,
            SUM(CASE WHEN estado_actividad = 'en progreso' THEN 1 ELSE 0 END) AS en_progreso
        FROM actividades;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener el estado de actividades:", err);
            return res.status(500).json({ error: "Error al obtener el estado de actividades" });
        }
        
        console.log(results);  // Verifica los resultados en la consola
        res.json(results[0]);  // Esto debería ser un objeto con las tres propiedades: realizadas, no_realizadas, en_progreso
    });
});


// Servidor en el puerto 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});