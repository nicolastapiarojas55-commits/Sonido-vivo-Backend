const repo = require('../Repository/pedidoRepository');

const ESTADOS = ['En preparación', 'Despachado', 'Entregado'];
const ENTREGAS = ['Despacho a domicilio', 'Retiro en tienda'];
const error = (status, mensaje) => Object.assign(new Error(mensaje), { status });

function validarYAgrupar(body) {
  const { tipoEntrega, direccion, items } = body || {};
  if (!ENTREGAS.includes(tipoEntrega)) throw error(400, 'Forma de entrega inválida');
  const despacho = tipoEntrega === ENTREGAS[0];
  if (despacho && (typeof direccion !== 'string' || !direccion.trim() || direccion.length > 100))
    throw error(400, 'La dirección de despacho es obligatoria (máximo 100 caracteres)');
  if (!Array.isArray(items) || items.length === 0) throw error(400, 'El pedido debe tener al menos un producto');

  const porCodigo = new Map();
  for (const it of items) {
    if (!it || typeof it.codigo !== 'string' || !Number.isInteger(it.cantidad) || it.cantidad < 1)
      throw error(400, 'Cada producto necesita codigo y cantidad entera mayor a 0');
    porCodigo.set(it.codigo, (porCodigo.get(it.codigo) || 0) + it.cantidad);
  }
  return {
    tipoEntrega,
    direccion: despacho ? direccion.trim() : null,
    items: [...porCodigo].map(([codigo, cantidad]) => ({ codigo, cantidad }))
  };
}

async function crear(usuario, body) {
  const datos = validarYAgrupar(body);
  const id = await repo.crear(usuario.id, datos.tipoEntrega, datos.direccion, datos.items);
  return await repo.buscarPorId(id);
}

async function listar(usuario) {
  return await repo.listar(usuario.tipo === 'Cliente' ? usuario.id : null);
}

async function obtener(id, usuario) {
  const pedido = await repo.buscarPorId(id);
  if (!pedido) throw error(404, 'Pedido no encontrado');
  if (usuario.tipo === 'Cliente' && pedido.usuarioId !== usuario.id)
    throw error(403, 'No puedes ver pedidos de otra persona');
  return pedido;
}

async function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) throw error(400, 'Estado inválido');
  if (!(await repo.actualizarEstado(id, estado))) throw error(404, 'Pedido no encontrado');
  return await repo.buscarPorId(id);
}

module.exports = { crear, listar, obtener, cambiarEstado };