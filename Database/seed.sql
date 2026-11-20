INSERT INTO usuario (run, nombre, apellidos, email, password, tipo)
VALUES (
    '111111111',
    'Admin',
    'Sistema',
    'admin@duoc.cl',
    '$2a$12$Tlqw7QX6mNq3DJpMRPvhrOUzmS2GxW3aKr0a6zS9alCwJMh5AECyy',
    'Administrador'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO admin (usuario_id)
SELECT id FROM usuario WHERE email = 'admin@duoc.cl'
ON CONFLICT (usuario_id) DO NOTHING;