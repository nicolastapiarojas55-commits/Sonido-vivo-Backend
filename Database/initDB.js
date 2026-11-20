const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function inicializarBaseDeDatos() {
    const client = await pool.connect();
    try {
        console.log('Verificando estructura de la Base de Datos...');
        await client.query('BEGIN');

        const initPath = path.join(__dirname, 'init.sql');
        const initSql = fs.readFileSync(initPath, { encoding: 'utf8' });
        await client.query(initSql);
        console.log('Tablas creadas o verificadas con éxito.');

        const seedPath = path.join(__dirname, 'seed.sql');
        if (fs.existsSync(seedPath)) {
            const seedSql = fs.readFileSync(seedPath, { encoding: 'utf8' });
            if (seedSql.trim().length > 0) {
                await client.query(seedSql);
                console.log('Datos semilla sincronizados con éxito.');
            }
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error inicializando la base de datos:', error);
        throw error;
    }finally {
        client.release();
    }
}

module.exports = { inicializarBaseDeDatos };