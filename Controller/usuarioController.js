const service = require('../Service/usuarioService');
const { registroRequestDto, loginRequestDto, crearUsuarioRequestDto, actualizarRequestDto } = require('../Dto/usuario.dto');

async function login(req, res) {
  try {
    const entrada = loginRequestDto(req.body);
    const resultado = await service.login(entrada);
    res.status(200).json(resultado);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.mensaje });
    console.error(e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function registrar(req, res) {
  try {
    const entrada = registroRequestDto(req.body)
    const resultado = await service.registrar(entrada);
    res.status(201).json(resultado);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.mensaje });
    console.error(e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function listar(req, res) {
  try {
    const usuarios = await service.listar();
    res.status(200).json(usuarios);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}
function responderError(res, e) {
  if (e.status) return res.status(e.status).json({ error: e.mensaje });
  console.error(e);
  res.status(500).json({ error: 'Error interno del servidor' });
}

async function obtener(req, res) {
  try { res.status(200).json(await service.obtener(req.params.id, req.usuario)); }
  catch (e) { responderError(res, e); }
}

async function actualizar(req, res) {
  try { 
    const datos = actualizarRequestDto(req.body);
    res.status(200).json(await service.actualizar(req.params.id, datos, req.usuario)); }
  catch (e) { responderError(res, e); }
}

async function eliminar(req, res) {
  try { await service.eliminar(req.params.id, req.usuario); res.status(204).send(); }
  catch (e) { responderError(res, e); }
}

async function activar(req, res) {
  try {
    await usuarioService.activar(Number(req.params.id));
    res.status(204).send();
  } catch (e) {
    responderError(res, e);
  }
}

async function crear(req, res) {
  try { 
    const datos = crearUsuarioRequestDto(req.body);
    res.status(201).json(await service.crear(datos)); }
  catch (e) { responderError(res, e); }
}

module.exports = { registrar, login, listar, obtener, actualizar, eliminar, crear };