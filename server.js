require('dotenv').config();
const pedidoRoutes = require('./Routes/pedidoRoutes');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const usuarioRoutes = require('./Routes/usuarioRoutes');
const productoRoutes = require('./Routes/productoRoutes');
const { inicializarBaseDeDatos } = require('./Database/initDB');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./Docs/swagger');

const app = express();

const origenes = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);

app.use(cors({
    origin: origenes,
    credentials: true
}));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/productos', productoRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use('/api/v1/pedidos', pedidoRoutes);

const PORT = process.env.PORT || 3000;

async function arrancarServidor() {
    try {
        await inicializarBaseDeDatos();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`
    ılılı   ııl ılıllll  ıılılllı  lılılllıılı     lıllllıı     lıllı
         ████  ███  █   █ ███ ████   ███     █   █ ███ █   █  ███    
        █ ░░░░█ ░░█ ██  █░ █░░█░░░█ █ ░░█    █░  █░ █░░█░  █░█ ░░█   
         ███░░█░ ░█░█░█ █░░█░░█░░░█░█░ ░█░   █░░ █░░█░░█░░ █░█░ ░█░  
          ░░█ █░░ █░█░░██░░█░░█░░ █░█░░ █░░   █░█ ░░█░░ █░█ ░█░░ █░░ 
        ████░░ ███ ░█░░ █░███░████ ░░███ ░░    █ ░ ███░  █ ░ ░███ ░░ 
         ░░░░ ░ ░░░ ░░░  ░░░░░ ░░░░ ░ ░░░ ░     ░ ░ ░░░   ░ ░  ░░░ ░ 
          ░░░░   ░░░  ░   ░ ░░░ ░░░░   ░░░       ░   ░░░   ░    ░░░  
    ılılı   ııl ılıllll  ıılılllı  lılılllıılı     lıllllıı     lıllı

  🎧 ¡Bienvenido a la tienda oficial de Sonido Vivo! 🎧
  ======================================================
  Local (Interno) : http://localhost:${PORT}
  Red (Externo)   : http://[IP-PUBLICA-DE-EC2]:${PORT}
  Entorno        : Desarrollo
  Base de Datos  : [ OK ] Online y Sincronizada
  Versión Node   : ${process.version}
  Arranque       : ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}
  ======================================================
            `);
        });
    } catch (error) {
        console.error('El servidor no pudo arrancar debido a un error:', error);
        process.exit(1);
    }
}

arrancarServidor();