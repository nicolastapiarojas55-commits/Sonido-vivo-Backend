const pool = require('../Database/db');
const COLUMNAS = 'id, run, nombre, apellidos, email, tipo, fecha_nacimiento';

async function buscarPorEmail(email) {
  const r = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
  return r.rows[0] || null;
}
async function buscarPorRun(run) {
  const r = await pool.query('SELECT * FROM usuario WHERE run = $1', [run]);
  return r.rows[0] || null;
}
async function crear(u) {
  const r = await pool.query(
    `INSERT INTO usuario (run, nombre, apellidos, email, password, tipo, fecha_nacimiento, region, comuna, direccion)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ${COLUMNAS}`,
    [u.run, u.nombre, u.apellidos, u.email, u.password, u.tipo,
     u.fechaNacimiento || null, u.region || null, u.comuna || null, u.direccion || null]
  );
  return r.rows[0];
}
module.exports = { buscarPorEmail, buscarPorRun, crear };