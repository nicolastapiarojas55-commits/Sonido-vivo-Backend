const service = require('../Service/usuarioService');
const { revocarToken } = require('../Utils/tokenBlacklist');
const { registroRequestDto, loginRequestDto } = require('../Dto/usuario.dto');

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

function logout(req, res) {
  revocarToken(req.token, req.usuario.exp);
  return res.status(200).json({ mensaje: 'Sesión cerrada correctamente' });
}

module.exports = { login, registrar, logout };