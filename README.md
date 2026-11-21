# Sonido Vivo – Backend

## Repositorio del frontend
Frontend de Sonido Vivo: https://github.com/CodedbyMeTheGreatest/tienda-sonido-vivo

## Nombre del Equipo
Jelico

## Integrantes
- Jean Lefiman (je.lefiman@duocuc.cl)
- Felix Rojas (fn.rojas@duocuc.cl)
- Corina Urrutia (cor.urrutia@duocuc.cl)

## Caso
Tienda Sonido Vivo, una tienda de instrumentos musicales, equipos de sonido y accesorios en Viña del Mar. Este backend es una API REST con PostgreSQL, JWT y roles, que reemplaza el localStorage del frontend. Por ahora cubre usuarios y autenticación.

## Estructura del proyecto
```
Sonido-vivo-Backend/
├── Controller/   usuarioController.js
├── Database/     db.js, init.sql, initDB.js, seed.sql
├── Docs/         swagger.js
├── Model/        usuarioModel.js
├── Repository/   usuarioRepository.js
├── Routes/       authRoutes.js, usuarioRoutes.js
├── Service/      usuarioService.js
├── Utils/        authMiddleware.js, jwt.js
├── .env.example
└── server.js
```
Flujo: Ruta → Controller (responde con el estado HTTP) → Service (reglas del negocio) → Repository (SQL) → PostgreSQL. El Model define el usuario que se devuelve, sin contraseña.

Responsabilidades: Felix, tablas y estructura de capas; Corina, inicio de sesión; Jean, registro; [COMPLETAR: resto].

## Tecnologías y sus versiones
- Node.js + Express -> [versión]
- PostgreSQL en Amazon RDS, ejecutado desde una instancia EC2 -> [versión]
- pg, bcryptjs, jose, swagger-ui-express -> [versión]

## Base de datos
Diagrama entidad-relación: [ENLACE A DRIVE]

Tablas implementadas: `usuario`, `cliente`, `admin`, `region` y `comuna`. `cliente` y `admin` se relacionan 1 a 1 con `usuario`. `run` y `email` son únicos y `tipo` solo admite Administrador, Vendedor o Cliente. Eliminar un usuario lo desactiva (`activo = false`).

`init.sql` y `seed.sql` se ejecutan al iniciar el servidor, sin duplicar datos. Los datos persisten en PostgreSQL al reiniciar. El seed crea un administrador de prueba (`admin@duoc.cl`, contraseña `12345`).

## API y Swagger
Documentación: `http://[IP-EC2]:3000/api-docs`. Base: `/api/v1`.

| Ruta | Acceso |
|---|---|
| `POST /auth/registro` | Público |
| `POST /auth/login` | Público |
| `GET /usuarios` | Administrador |
| `GET, PUT /usuarios/:id` | El propio usuario o Administrador |
| `DELETE /usuarios/:id` | Administrador |

## Seguridad
- **Contraseñas:** `bcryptjs` (costo 10). Es lento a propósito y usa una sal distinta por usuario, por eso es adecuado para contraseñas. Nunca se guardan en texto plano.
- **JWT:** firmado con HS256 y vigencia de 2 horas. La clave está en `.env`, fuera del repositorio. Cada ruta protegida revisa firma, algoritmo y expiración: `401` si falla, `403` si el rol no alcanza.
- **Datos ajenos:** un usuario solo accede a su propia cuenta.
- **Pendiente:** HTTPS, límite de intentos de login y revocación del token al cerrar sesión.



Diagrama de secuencia del login: [ENLACE]

## Cómo ejecutar el proyecto
```
npm install
cp .env.example .env
npm start
```
Completar `.env` con `PORT`, `HOST`, `CORS_ORIGINS`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` y `JWT_SECRET`. Requiere Node.js 22 y una base PostgreSQL accesible.

## Estado del trabajo
| Operación | Estado |
|---|---|
| Tabla de usuarios (con hash) | Listo |
| Inicio de sesión con JWT | Listo |
| Registro | Listo |
| Listar usuarios | Listo |
| Modificar usuario | Listo |
| Eliminar o desactivar usuario | Listo |
| Catálogo y pedidos | Pendiente |

Pruebas: manuales, con Swagger, Postman y el frontend. 

## Material complementario
Carpeta de Drive con documentos del semestre: https://drive.google.com/drive/folders/1yBC232qOvIjry0WJZZulEDMttQJMAu9i?usp=drive_link
