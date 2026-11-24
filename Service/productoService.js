const repo = require('../Repository/productoRepository');

const error = (status, mensaje) => ({ status, mensaje });

function esVacio(valor) {
  return valor === undefined || valor === null || String(valor).trim() === '';
}

function validar(d) {
  const { codigo, categoria, nombre, descripcion, precio, stock, marcaId, modeloId } = d || {};

   const faltantes = Object.entries({ codigo, categoria, nombre, descripcion })
    .filter(([, valor]) => esVacio(valor))
    .map(([campo]) => campo);
  if (faltantes.length > 0)
    throw error(400, 'Faltan campos obligatorios: ' + faltantes.join(', '));
  if (String(codigo).trim().length > 10)
    throw error(400, 'El código admite hasta 10 caracteres');
  if (String(categoria).trim().length > 50)
    throw error(400, 'La categoría admite hasta 50 caracteres');
  if (String(nombre).trim().length > 100)
    throw error(400, 'El nombre admite hasta 100 caracteres');
  if (String(descripcion).trim().length > 500)
    throw error(400, 'La descripción admite hasta 500 caracteres');
  if (esVacio(precio) || !(Number(precio) >= 0))
    throw error(400, 'El precio debe ser un número mayor o igual a 0');
  if (esVacio(stock) || !Number.isInteger(Number(stock)) || Number(stock) < 0)
    throw error(400, 'El stock debe ser un entero mayor o igual a 0');
  if (esVacio(marcaId) || !Number.isInteger(Number(marcaId)) ||
      esVacio(modeloId) || !Number.isInteger(Number(modeloId)))
    throw error(400, 'Marca y modelo son obligatorios');

  return {
    codigo: String(codigo).trim().toUpperCase(),
    categoria: String(categoria).trim(),
    nombre: String(nombre).trim(),
    descripcion: String(descripcion).trim(),
    precio: Number(precio),
    stock: Number(stock),
    marcaId: Number(marcaId),
    modeloId: Number(modeloId)
  };
}

function validarId(id) {
  if (!Number.isInteger(Number(id))) throw error(400, 'Id inválido');
}

async function validarMarcaModelo(p) {
  if (!(await repo.modeloPerteneceAMarca(p.modeloId, p.marcaId)))
    throw error(400, 'El modelo no existe o no pertenece a esa marca');
}

async function listar() {
  return await repo.listar();
}

async function obtener(id) {
  validarId(id);
  const producto = await repo.buscarPorId(id);
  if (!producto) throw error(404, 'Producto no encontrado');
  return producto;
}

async function crear(datos) {
  const p = validar(datos);
  if (await repo.existeCodigo(p.codigo))
    throw error(409, 'Ya existe un producto con ese código');
  await validarMarcaModelo(p);
  return await repo.crear(p);
}

async function actualizar(id, datos) {
  validarId(id);
  const p = validar(datos);
  const actual = await repo.buscarPorId(id);
  if (!actual) throw error(404, 'Producto no encontrado');

  const otro = await repo.existeCodigo(p.codigo);
  if (otro && String(otro.id) !== String(id))
    throw error(409, 'Ya existe un producto con ese código');

  await validarMarcaModelo(p);
  return await repo.actualizar(id, p);
}

async function eliminar(id) {
  validarId(id);
  try {
    if (!(await repo.eliminar(id))) throw error(404, 'Producto no encontrado');
  } catch (e) {
    if (e.code === '23503')
      throw error(409, 'El producto no se puede eliminar porque está en pedidos');
    throw e;
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };