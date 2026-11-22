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
- Node.js + Express -> 22 + ^5.3.0
- PostgreSQL en Amazon RDS, ejecutado desde una instancia EC2
- pg, bcryptjs, jose, swagger-ui-express -> ^8.23.1, ^3.0.3, ^6.2.17, ^5.0.1

## Base de datos
Diagrama entidad-relación: <img width="1659" height="770" alt="imagen" src="https://github.com/user-attachments/assets/0cb94b70-70aa-400e-84f0-945e05f23033" />

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



Diagrama de secuencia del login: <img width="1428" height="838" alt="imagen" src="https://github.com/user-attachments/assets/ef0f41bb-7334-45b0-b857-a43d477a3f94" />


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

## Pruebas
**Herramientas utilizadas:**
- **Swagger UI:** Accesible en la ruta `/api-docs`. Se utilizó como entorno principal para documentar el contrato de la API y ejecutar pruebas rápidas de los endpoints directamente desde el navegador.
- **Postman:** Empleado para simular escenarios de error específicos, manipular los encabezados (Headers), verificar la validación de los tokens Bearer y capturar los tiempos de respuesta.
- **Frontend (React con Axios):** Utilizado para probar el flujo de usuario real, validando la correcta configuración de las políticas CORS, el manejo de errores HTTP y la integración de variables de entorno.

**Casos de prueba principales validados:**
1. **Validación de formato (DTOs):**
   - Rechazo de peticiones con datos faltantes, correos inválidos, formato de RUN incorrecto o contraseñas fuera del rango permitido (4 a 64 caracteres), devolviendo estado HTTP `400 Bad Request`.
2. **Autenticación y Persistencia:**
   - Inicio de sesión exitoso utilizando la cuenta administradora semilla (`admin@duoc.cl` / `12345`), verificando la correcta generación y recepción del token JWT.
   - Rechazo de acceso (estado HTTP `401 Unauthorized`) al ingresar credenciales incorrectas.
3. **Seguridad y Control de Acceso (Middlewares):**
   - Bloqueo de acceso a rutas protegidas cuando no se provee un token JWT, o cuando este se encuentra expirado (estado HTTP `401`).
   - Verificación de roles: Intento deliberado de acceder a la ruta `GET /usuarios` utilizando un token de rol "Cliente", verificando que el sistema lo rechace correctamente por privilegios insuficientes (estado HTTP `403 Forbidden`).
4. **Reglas de Negocio:**
   - Prevención de registros duplicados: Verificación de que el sistema retorna `409 Conflict` al intentar registrar un usuario con un correo o RUN ya existente en PostgreSQL.
## Material complementario
Carpeta de Drive con documentos del semestre: https://drive.google.com/drive/folders/1yBC232qOvIjry0WJZZulEDMttQJMAu9i?usp=drive_link
