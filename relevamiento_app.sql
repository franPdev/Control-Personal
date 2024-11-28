CREATE DATABASE IF NOT EXISTS relevamiento_app;
USE relevamiento_app;

-- Crear primero la tabla empleados (a la que se referencian otras tablas)
CREATE TABLE IF NOT EXISTS empleados (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    dni VARCHAR(50) NOT NULL,
    puesto VARCHAR(255) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    estado ENUM('no', 'trabajando') NOT NULL,
    horario_entrada TIME NOT NULL,
    horario_salida TIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (dni)
) ENGINE=InnoDB;

-- Luego crear la tabla turnos
CREATE TABLE IF NOT EXISTS turnos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    empleado_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fin TIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
) ENGINE=InnoDB;

-- Luego crear la tabla actividades
CREATE TABLE IF NOT EXISTS actividades (
    id BIGINT NOT NULL AUTO_INCREMENT,
    empleado_id BIGINT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    turno_id BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id),
    FOREIGN KEY (turno_id) REFERENCES turnos(id)
) ENGINE=InnoDB;

-- Crear la tabla asistencias
CREATE TABLE IF NOT EXISTS asistencias (
    id BIGINT NOT NULL AUTO_INCREMENT,
    empleado_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
) ENGINE=InnoDB;

-- Crear la tabla reportes
CREATE TABLE IF NOT EXISTS reportes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    empleado_id BIGINT NOT NULL,
    periodo VARCHAR(255) NOT NULL,
    horas_trabajadas INT NOT NULL,
    incidencias TEXT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
) ENGINE=InnoDB;

-- Agregando índices para mejorar rendimiento
CREATE INDEX idx_empleado_id ON actividades (empleado_id);
CREATE INDEX idx_empleado_id_asistencias ON asistencias (empleado_id);
CREATE INDEX idx_empleado_id_reportes ON reportes (empleado_id);
CREATE INDEX idx_empleado_id_turnos ON turnos (empleado_id);
