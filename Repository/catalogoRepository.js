const pool = require('../Database/db');

const marcas = async () => (await pool.query('SELECT id, nombre FROM marca ORDER BY nombre')).rows;
const modelos = async (marcaId) => {
  const sql = 'SELECT id, marca_id AS "marcaId", nombre FROM modelo' + (marcaId ? ' WHERE marca_id = $1' : '') + ' ORDER BY nombre';
  return (await pool.query(sql, marcaId ? [marcaId] : [])).rows;
};
const categorias = async () =>
  (await pool.query('SELECT DISTINCT categoria AS nombre FROM producto ORDER BY categoria')).rows;

module.exports = { marcas, modelos, categorias };