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

CREATE TABLE IF NOT EXISTS marca (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS modelo (
    id SERIAL PRIMARY KEY,
    marca_id INT NOT NULL REFERENCES marca(id),
    nombre VARCHAR(100) NOT NULL,
    UNIQUE (marca_id, nombre)
);

CREATE TABLE IF NOT EXISTS categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS producto (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    marca_id INT NOT NULL REFERENCES marca(id),
    modelo_id INT NOT NULL REFERENCES modelo(id),
    categoria VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS pedido (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuario(id),
  fecha TIMESTAMP NOT NULL DEFAULT NOW(),
  estado VARCHAR(20) NOT NULL DEFAULT 'En preparación'
    CHECK (estado IN ('En preparación', 'Despachado', 'Entregado')),
  tipo_entrega VARCHAR(30) NOT NULL
    CHECK (tipo_entrega IN ('Despacho a domicilio', 'Retiro en tienda')),
  direccion VARCHAR(100),
  total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  CHECK (tipo_entrega <> 'Despacho a domicilio' OR direccion IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES producto(id),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0)
);

--Esto es para desarrollo de apps moviles
ALTER TABLE usuario DROP CONSTRAINT usuario_tipo_check;
ALTER TABLE usuario ADD CONSTRAINT usuario_tipo_check
  CHECK (tipo IN ('Administrador','Encargado','Vendedor','Cliente'));
