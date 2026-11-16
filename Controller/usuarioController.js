const service = require('../Service/usuarioService');

async function registrar(req, res) {
  try {
    const usuario = await service.registrar(req.body);
    res.status(201).json(usuario);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.mensaje });
    console.error(e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
module.exports = { registrar };