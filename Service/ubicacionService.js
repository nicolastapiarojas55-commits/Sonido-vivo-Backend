const repo = require('../Repository/ubicacionRepository');


async function listarRegiones() {
  return await repo.listarRegiones();
}

async function listarComunas() {
    return await repo.listarComunas();
}

module.exports = { listarRegiones, listarComunas };

