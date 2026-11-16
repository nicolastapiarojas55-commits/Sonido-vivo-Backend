CREATE TABLE IF NOT EXISTS usuario (
    id               SERIAL PRIMARY KEY,
    run              VARCHAR(9)   NOT NULL UNIQUE,
    nombre           VARCHAR(100) NOT NULL,
    apellidos        VARCHAR(100) NOT NULL,
    email            VARCHAR(100) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    tipo             VARCHAR(20)  NOT NULL
                     CHECK (tipo IN ('Administrador', 'Vendedor', 'Cliente')),
    fecha_nacimiento DATE,
    region    VARCHAR(100),
    comuna    VARCHAR(100),
    direccion VARCHAR(200),
    activo    BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE usuario ADD COLUMN IF NOT EXISTS region    VARCHAR(100);
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS comuna    VARCHAR(100);
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS direccion VARCHAR(200);
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS activo    BOOLEAN NOT NULL DEFAULT TRUE;