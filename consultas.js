const connection = require('./dbConnection');

const agregarEmpleados = () => {
    const empleados = [
        {
            nombre: 'Ana',
            apellido: 'Gomez',
            dni: '87654321',
            puesto: 'Diseñador',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00',

        },
        {
            nombre: 'Carlos',
            apellido: 'López',
            dni: '11223344',
            puesto: 'Tester',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00'

        },
        {
            nombre: 'María',
            apellido: 'Pérez',
            dni: '22334455',
            puesto: 'Desarrollador Fullstack',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00'
        },
        {
            nombre: 'Luis',
            apellido: 'Fernández',
            dni: '33445566',
            puesto: 'Gerente de Proyecto',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00'
        },
        {
            nombre: 'Laura',
            apellido: 'Gutiérrez',
            dni: '44556677',
            puesto: 'Analista de datos',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00'
        },
        {
            nombre: 'Sofía',
            apellido: 'Martínez',
            dni: '55667788',
            puesto: 'Desarrollador Backend',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00'
        },
        {
            nombre: 'Javier',
            apellido: 'Ramírez',
            dni: '66778899',
            puesto: 'Desarrollador Frontend',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00'
        },
        {
            nombre: 'Valentina',
            apellido: 'López',
            dni: '77889900',
            puesto: 'Recursos Humanos',
            fecha_ingreso: '2024-01-01',
            estado: 'trabajando',
            horario_entrada: '09:00:00',
            horario_salida: '17:00:00'
        }
    ];
    empleados.forEach(empleado => {
        const query = 'INSERT INTO empleados (nombre, apellido, dni, puesto, fecha_ingreso, estado, horario_entrada, horario_salida) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [empleado.nombre, empleado.apellido, empleado.dni, empleado.puesto, empleado.fecha_ingreso, empleado.estado, empleado.horario_entrada, empleado.horario_salida];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Error al agregar empleado:', err);
            } else {
                console.log(`Empleado ${empleado.nombre} agregado con éxito.`);
            }
        });
    });
};


agregarEmpleados();
