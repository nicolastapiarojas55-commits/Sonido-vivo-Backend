const repo = require('../Repository/catalogoRepository');

async function listarMarcas() {
  return await repo.marcas();
}

async function listarModelos(marcaId) {
  const id = Number(marcaId) || null;
  return await repo.modelos(id);
}

async function listarCategorias() {
  return await repo.categorias();
}

module.exports = { listarMarcas, listarModelos, listarCategorias };