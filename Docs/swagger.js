const error = (descripcion) => ({
  description: descripcion,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
});
const seguridad = [{ bearerAuth: [] }];
const parametroId = {
  name: 'id', in: 'path', required: true,
  schema: { type: 'integer' }, example: 2
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'API Sonido Vivo',
    version: '1.0.0',
    description: 'Autenticación y gestión de usuarios de la tienda Sonido Vivo.'
  },
  servers: [{ url: '/', description: 'Servidor actual' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'Credenciales incorrectas' } }
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 2 },
          run: { type: 'string', example: '12345678K' },
          nombre: { type: 'string', example: 'Ana' },
          apellidos: { type: 'string', example: 'Pérez' },
          email: { type: 'string', example: 'ana@correo.cl' },
          tipo: { type: 'string', enum: ['Administrador', 'Vendedor', 'Cliente'] },
          fecha_nacimiento: { type: 'string', format: 'date', nullable: true },
          activo: { type: 'boolean', example: true }
        }
      },
      Login: {
        type: 'object', required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@duoc.cl' },
          password: { type: 'string', example: '12345' }
        }
      },
      Registro: {
        type: 'object',
        required: ['run', 'nombre', 'apellidos', 'email', 'password'],
        properties: {
          run: { type: 'string', example: '12345678K' },
          nombre: { type: 'string', example: 'Ana' },
          apellidos: { type: 'string', example: 'Pérez' },
          email: { type: 'string', example: 'ana@correo.cl' },
          password: { type: 'string', example: 'Clave1234', description: '4 a 10 caracteres' },
          fechaNacimiento: { type: 'string', format: 'date', example: '1999-05-20' },
          direccion: { type: 'string', example: 'Calle 1' },
          telefono: { type: 'string', example: '912345678' },
          comunaId: { type: 'integer', nullable: true }
        }
      },
      ActualizarUsuario: {
        type: 'object',
        properties: {
          nombre: { type: 'string', example: 'Ana María' },
          apellidos: { type: 'string' },
          email: { type: 'string' },
          fechaNacimiento: { type: 'string', format: 'date' },
          tipo: { type: 'string', enum: ['Administrador', 'Vendedor', 'Cliente'],
                  description: 'Solo el Administrador puede cambiarlo' }
        }
      },
      CrearUsuario: {
        type: 'object',
        required: ['run', 'nombre', 'apellidos', 'email', 'password', 'tipo'],
        properties: {
          run: { type: 'string', example: '12345678K' },
          nombre: { type: 'string', example: 'Luis' },
          apellidos: { type: 'string', example: 'Soto' },
          email: { type: 'string', example: 'luis@duoc.cl' },
          password: { type: 'string', example: 'Clave1234', description: '4 a 60 caracteres' },
          tipo: { type: 'string', enum: ['Administrador', 'Vendedor', 'Cliente'] },
          fechaNacimiento: { type: 'string', format: 'date' }
        }
      }
    }
  },
  paths: {
    '/api/v1/auth/login': {
      post: {
        tags: ['Autenticación'], summary: 'Iniciar sesión',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } },
        responses: {
          200: { description: 'Acceso correcto. Devuelve el JWT (vigencia de 2 horas).' },
          400: error('Faltan credenciales'),
          401: error('Credenciales incorrectas')
        }
      }
    },
    '/api/v1/auth/registro': {
      post: {
        tags: ['Autenticación'], summary: 'Registrar un cliente (el rol lo asigna el servidor)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Registro' } } } },
        responses: {
          201: { description: 'Usuario registrado' },
          400: error('Datos inválidos o faltantes'),
          409: error('Correo o RUN ya registrado')
        }
      }
    },
    '/api/v1/usuarios': {
      get: {
        tags: ['Usuarios'], summary: 'Listar usuarios (solo Administrador)', security: seguridad,
        responses: {
          200: { description: 'Lista de usuarios',
                 content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Usuario' } } } } },
          401: error('Token ausente, inválido o vencido'),
          403: error('Rol insuficiente')
        }
      },
      post: {
        tags: ['Usuarios'], summary: 'Crear un usuario con el rol elegido (solo Administrador)', security: seguridad,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CrearUsuario' } } } },
        responses: {
          201: { description: 'Usuario creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          400: error('Datos inválidos o rol inválido'),
          401: error('Token ausente, inválido o vencido'),
          403: error('Rol insuficiente'),
          409: error('Correo o RUN ya registrado')
        }
      }
    },
    '/api/v1/usuarios/{id}': {
      get: {
        tags: ['Usuarios'], summary: 'Ver un usuario (el propio, o cualquiera si es Administrador)',
        security: seguridad, parameters: [parametroId],
        responses: {
          200: { description: 'Usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          400: error('Id inválido'),
          401: error('Token ausente, inválido o vencido'),
          403: error('Intenta acceder a la cuenta de otra persona'),
          404: error('Usuario no encontrado')
        }
      },
      put: {
        tags: ['Usuarios'], summary: 'Modificar un usuario', security: seguridad, parameters: [parametroId],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ActualizarUsuario' } } } },
        responses: {
          200: { description: 'Usuario actualizado' },
          400: error('Datos inválidos'),
          401: error('Token ausente, inválido o vencido'),
          403: error('Cuenta ajena, o cambio de rol sin ser Administrador'),
          404: error('Usuario no encontrado'),
          409: error('El correo ya está registrado')
        }
      },
      delete: {
        tags: ['Usuarios'], summary: 'Desactivar un usuario (solo Administrador)',
        security: seguridad, parameters: [parametroId],
        responses: {
          204: { description: 'Usuario desactivado' },
          401: error('Token ausente, inválido o vencido'),
          403: error('Rol insuficiente'),
          404: error('Usuario no encontrado'),
          409: error('No puedes desactivar tu propia cuenta')
        }
      }
    },
    '/api/v1/usuarios/{id}/activar': {
      patch: {
        tags: ['Usuarios'], summary: 'Reactivar un usuario desactivado (solo Administrador)',
        security: seguridad, parameters: [parametroId],
        responses: {
          204: { description: 'Usuario activado' },
          401: error('Token ausente, inválido o vencido'),
          403: error('Rol insuficiente'),
          404: error('Usuario no encontrado'),
          409: error('El usuario ya está activo')
        }
      }
    }
  }
};