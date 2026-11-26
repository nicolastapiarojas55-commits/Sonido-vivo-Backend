const service = require('../Service/ubicacionService');

async function listarRegiones(res) {
  res.status(200).json(await service.listarRegiones());
}

async function listarComunas(res) {
  res.status(200).json(await service.listarComunas());
}

module.exports = { listarRegiones, listarComunas };
