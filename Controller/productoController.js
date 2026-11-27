const service = require('../Service/productoService');

function responderError(res, e) {
  if (e.status) return res.status(e.status).json({ error: e.mensaje });
  console.error(e);
  res.status(500).json({ error: 'Error interno del servidor' });
}

async function listar(req, res) {
  try { res.status(200).json(await service.listar()); }
  catch (e) { responderError(res, e); }
}

async function obtener(req, res) {
  try { res.status(200).json(await service.obtener(req.params.id)); }
  catch (e) { responderError(res, e); }
}

async function crear(req, res) {
  try { res.status(201).json(await service.crear(req.body)); }
  catch (e) { responderError(res, e); }
}

async function actualizar(req, res) {
  try { res.status(200).json(await service.actualizar(req.params.id, req.body)); }
  catch (e) { responderError(res, e); }
}

async function eliminar(req, res) {
  try { await service.eliminar(req.params.id); res.status(204).send(); }
  catch (e) { responderError(res, e); }
}

async function actualizarStock(req, res) {
  try { res.status(200).json(await service.actualizarStock(req.params.id, req.body)); }
  catch (e) { responderError(res, e); }
}

module.exports = { listar, obtener, crear, actualizar, eliminar, actualizarStock };