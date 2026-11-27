const service = require('../Service/pedidoService');

function responderError(res, e) {
  if (e.status) return res.status(e.status).json({ error: e.message });
  console.error(e);
  res.status(500).json({ error: 'Error interno del servidor' });
}

async function crear(req, res) {
  try { res.status(201).json(await service.crear(req.usuario, req.body)); }
  catch (e) { responderError(res, e); }
}

async function listar(req, res) {
  try { res.json(await service.listar(req.usuario)); }
  catch (e) { responderError(res, e); }
}

async function obtener(req, res) {
  try { res.json(await service.obtener(Number(req.params.id), req.usuario)); }
  catch (e) { responderError(res, e); }
}

async function cambiarEstado(req, res) {
  try { res.json(await service.cambiarEstado(Number(req.params.id), req.body.estado)); }
  catch (e) { responderError(res, e); }
}

module.exports = { crear, listar, obtener, cambiarEstado };