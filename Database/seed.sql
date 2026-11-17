INSERT INTO usuario (run, nombre, apellidos, email, password, tipo, region, comuna, direccion)
VALUES (
    '111111111', 
    'Admin', 
    'Sistema', 
    'admin@duoc.cl', 
    '$2a$12$Tlqw7QX6mNq3DJpMRPvhrOUzmS2GxW3aKr0a6zS9alCwJMh5AECyy', -- "12345"
    'Administrador', 
    'Metropolitana', 
    'Santiago', 
    'Sede Central'
) ON CONFLICT (email) DO NOTHING;