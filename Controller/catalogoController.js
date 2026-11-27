const service = require('../Service/catalogoService');

async function listarMarcas(req, res) {
  try {
    res.status(200).json(await service.listarMarcas());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function listarModelos(req, res) {
  try {
    res.status(200).json(await service.listarModelos(req.query.marcaId));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function listarCategorias(req, res) {
  try {
    res.status(200).json(await service.listarCategorias());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listarMarcas, listarModelos, listarCategorias };