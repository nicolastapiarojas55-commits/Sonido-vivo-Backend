const service = require('../Service/usuarioService');

async function login(req, res) {
  try {
    const resultado = await service.login(req.body);
    res.status(200).json(resultado);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.mensaje });
    console.error(e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function registrar(req, res) {
  try {
    const resultado = await service.registrar(req.body);
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

module.exports = { registrar , login , listar};