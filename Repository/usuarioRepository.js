const pool = require('../Database/db');
const COLUMNAS = 'id, run, nombre, apellidos, email, tipo, fecha_nacimiento, activo';

async function buscarPorId(id) {
  const r = await pool.query(`SELECT ${COLUMNAS} FROM usuario WHERE id = $1`, [id]);
  return r.rows[0] || null;
}
async function actualizar(id, u) {
  const r = await pool.query(
    `UPDATE usuario
     SET nombre = $1, apellidos = $2, email = $3, fecha_nacimiento = $4, tipo = $5
     WHERE id = $6
     RETURNING ${COLUMNAS}`,
    [u.nombre, u.apellidos, u.email, u.fechaNacimiento, u.tipo, id]
  );
  return r.rows[0] || null;
}

async function desactivar(id) {
  const r = await pool.query('UPDATE usuario SET activo = FALSE WHERE id = $1', [id]);
  return r.rowCount > 0;
}

async function buscarPorEmail(email) {
  const r = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
  return r.rows[0] || null;
}
async function buscarPorRun(run) {
  const r = await pool.query('SELECT * FROM usuario WHERE run = $1', [run]);
  return r.rows[0] || null;
}
async function crear(u) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const r = await client.query(
      `INSERT INTO usuario (run, nombre, apellidos, email, password, tipo, fecha_nacimiento)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${COLUMNAS}`,
      [u.run, u.nombre, u.apellidos, u.email, u.password, u.tipo, u.fechaNacimiento || null]
    );
    const usuario = r.rows[0];
    if (u.tipo === 'Cliente') {
      await client.query(
        `INSERT INTO cliente (usuario_id, direccion, telefono, comuna_id) VALUES ($1,$2,$3,$4)`,
        [usuario.id, u.direccion || null, u.telefono || null, u.comunaId || null]
      );
    }else if (u.tipo === 'Administrador') {
      await client.query('INSERT INTO admin (usuario_id) VALUES ($1)', [usuario.id]);
    }
    await client.query('COMMIT');
    return usuario;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function listar() {
  const r = await pool.query(`SELECT ${COLUMNAS} FROM usuario`);
  return r.rows;
}
module.exports = { buscarPorEmail, buscarPorRun, crear, listar, buscarPorId, actualizar, desactivar };