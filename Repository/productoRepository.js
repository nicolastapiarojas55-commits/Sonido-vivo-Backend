const pool = require('../Database/db');

const SELECT = `
  SELECT p.id, p.codigo, p.categoria, p.nombre, p.descripcion,
         p.precio::float8 AS precio, p.stock,
         p.marca_id, m.nombre AS marca, p.modelo_id, mo.nombre AS modelo
  FROM producto p
  JOIN marca m ON m.id = p.marca_id
  JOIN modelo mo ON mo.id = p.modelo_id`;

async function listar() {
  const r = await pool.query(`${SELECT} ORDER BY p.id`);
  return r.rows;
}

async function buscarPorId(id) {
  const r = await pool.query(`${SELECT} WHERE p.id = $1`, [id]);
  return r.rows[0] || null;
}

async function existeCodigo(codigo) {
  const r = await pool.query('SELECT id FROM producto WHERE codigo = $1', [codigo]);
  return r.rows[0] || null;
}

async function modeloPerteneceAMarca(modeloId, marcaId) {
  const r = await pool.query('SELECT 1 FROM modelo WHERE id = $1 AND marca_id = $2', [modeloId, marcaId]);
  return r.rowCount > 0;
}

async function crear(p) {
  const r = await pool.query(
    `INSERT INTO producto (codigo, categoria, nombre, descripcion, precio, stock, marca_id, modelo_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [p.codigo, p.categoria, p.nombre, p.descripcion, p.precio, p.stock, p.marcaId, p.modeloId]
  );
  return buscarPorId(r.rows[0].id);
}

async function actualizar(id, p) {
  await pool.query(
    `UPDATE producto
     SET codigo = $1, categoria = $2, nombre = $3, descripcion = $4,
         precio = $5, stock = $6, marca_id = $7, modelo_id = $8
     WHERE id = $9`,
    [p.codigo, p.categoria, p.nombre, p.descripcion, p.precio, p.stock, p.marcaId, p.modeloId, id]
  );
  return buscarPorId(id);
}

async function eliminar(id) {
  const r = await pool.query('DELETE FROM producto WHERE id = $1', [id]);
  return r.rowCount > 0;
}

module.exports = {
  listar, buscarPorId, existeCodigo, modeloPerteneceAMarca,
  crear, actualizar, eliminar
};