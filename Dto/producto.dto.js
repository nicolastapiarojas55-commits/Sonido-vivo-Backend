const error = (status, mensaje) => ({ status, mensaje });
const esEntero = (v) => String(v).trim() !== '' && Number.isInteger(Number(v));

function productoRequestDto(body) {
  const { codigo, nombre, descripcion, precio, stock, marcaId, modeloId, categoriaId } = body || {};

  const requeridos = [codigo, nombre, descripcion, precio, stock, marcaId, modeloId, categoriaId];
  if (requeridos.some((v) => v === undefined || v === null || v === '')) {
    throw error(400, 'Faltan campos obligatorios');
  }

  const codigoNorm = String(codigo).trim().toUpperCase();
  if (!/^[A-Z0-9]{3,10}$/.test(codigoNorm)) throw error(400, 'Código inválido (3 a 10 letras o números)');

  const nombreNorm = String(nombre).trim();
  if (nombreNorm.length < 1 || nombreNorm.length > 100) throw error(400, 'Nombre inválido (1 a 100 caracteres)');

  const descripcionNorm = String(descripcion).trim();
  if (descripcionNorm.length < 1 || descripcionNorm.length > 500) throw error(400, 'Descripción inválida (1 a 500 caracteres)');

  const precioNum = Number(precio);
  if (!Number.isFinite(precioNum) || precioNum < 0 || precioNum > 99999999) throw error(400, 'Precio inválido');

  if (!esEntero(stock) || Number(stock) < 0) throw error(400, 'El stock debe ser un entero mayor o igual a 0');

  for (const [nombreCampo, valor] of [['marcaId', marcaId], ['modeloId', modeloId], ['categoriaId', categoriaId]]) {
    if (!esEntero(valor) || Number(valor) <= 0) throw error(400, `${nombreCampo} inválido`);
  }

  return {
    codigo: codigoNorm, nombre: nombreNorm, descripcion: descripcionNorm,
    precio: precioNum, stock: Number(stock),
    marcaId: Number(marcaId), modeloId: Number(modeloId), categoriaId: Number(categoriaId)
  };
}

function stockRequestDto(body) {
  const { stock } = body || {};
  if (stock === undefined || stock === null || !esEntero(stock) || Number(stock) < 0) {
    throw error(400, 'El stock debe ser un entero mayor o igual a 0');
  }
  return { stock: Number(stock) };
}

module.exports = { productoRequestDto, stockRequestDto };