const pool = require('../Database/db'); 
const error = (status, mensaje) => Object.assign(new Error(mensaje), { status });

const BASE = `
  SELECT p.id, p.usuario_id AS "usuarioId", p.fecha, p.estado,
         p.tipo_entrega AS "tipoEntrega", p.direccion, p.total::float8 AS total,
         COALESCE(json_agg(json_build_object(
           'codigo', pr.codigo, 'nombre', pr.nombre,
           'cantidad', d.cantidad, 'precio', d.precio_unitario::float8
         ) ORDER BY d.id) FILTER (WHERE d.id IS NOT NULL), '[]') AS items
  FROM pedido p
  LEFT JOIN detalle_pedido d ON d.pedido_id = p.id
  LEFT JOIN producto pr ON pr.id = d.producto_id`;

async function crear(usuarioId, tipoEntrega, direccion, items) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const lineas = [];
    const sinStock = [];
    for (const item of items) {
      const r = await client.query(
        'SELECT id, nombre, precio::float8 AS precio, stock FROM producto WHERE codigo = $1 FOR UPDATE',
        [item.codigo]
      );
      if (r.rows.length === 0) throw error(404, 'El producto ' + item.codigo + ' no existe');
      const p = r.rows[0];
      if (item.cantidad > p.stock) sinStock.push(p.nombre + ' (disponible: ' + p.stock + ')');
      lineas.push({ producto: p, cantidad: item.cantidad });
    }
    if (sinStock.length > 0) throw error(409, 'Stock insuficiente: ' + sinStock.join(', '));

    const total = lineas.reduce((suma, l) => suma + l.producto.precio * l.cantidad, 0);
    const ped = await client.query(
      'INSERT INTO pedido (usuario_id, tipo_entrega, direccion, total) VALUES ($1, $2, $3, $4) RETURNING id',
      [usuarioId, tipoEntrega, direccion, total]
    );
    const pedidoId = ped.rows[0].id;
    for (const l of lineas) {
      await client.query(
        'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [pedidoId, l.producto.id, l.cantidad, l.producto.precio]
      );
      await client.query('UPDATE producto SET stock = stock - $1 WHERE id = $2', [l.cantidad, l.producto.id]);
    }
    await client.query('COMMIT');
    return pedidoId;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function listar(usuarioId) {
  const r = await pool.query(
    BASE + ' WHERE ($1::int IS NULL OR p.usuario_id = $1) GROUP BY p.id ORDER BY p.id DESC',
    [usuarioId]
  );
  return r.rows;
}

async function buscarPorId(id) {
  const r = await pool.query(BASE + ' WHERE p.id = $1 GROUP BY p.id', [id]);
  return r.rows[0] || null;
}

async function actualizarEstado(id, estado) {
  const r = await pool.query('UPDATE pedido SET estado = $1 WHERE id = $2', [estado, id]);
  return r.rowCount > 0;
}

module.exports = { crear, listar, buscarPorId, actualizarEstado };