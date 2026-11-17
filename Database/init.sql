CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    run VARCHAR(9) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Administrador', 'Vendedor', 'Cliente')),
    fecha_nacimiento DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS region (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS comuna (
    id SERIAL PRIMARY KEY,
    region_id INT NOT NULL REFERENCES region(id),
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS cliente (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
    direccion VARCHAR(200),
    telefono VARCHAR(30),
    comuna_id INT REFERENCES comuna(id)
);

CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE
);