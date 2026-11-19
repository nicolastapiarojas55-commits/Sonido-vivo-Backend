require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const { inicializarBaseDeDatos } = require('./Database/initDB');
const usuarioRoutes = require('./Routes/usuarioRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./Docs/swagger');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'Desarrollo';

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
  Entorno        : ${ENV}
  Base de Datos  : [ OK ] Online y Sincronizada
  Versión Node   : ${process.version}
  Arranque       : ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}
  ======================================================
            `);
        });
    } catch (error) {
        console.error('El servidor no pudo arrancar debido a un error crítico:', error);
        process.exit(1);
    }
}

arrancarServidor();