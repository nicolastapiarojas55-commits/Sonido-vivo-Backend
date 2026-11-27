const { jwtVerify } = require('jose');
const { estaTokenRevocado } = require('./tokenBlacklist');
const usuarioRepo = require('../Repository/usuarioRepository');

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // ajusta si tu env se llama distinto

async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  
  if (estaTokenRevocado(token)) {
    return res.status(401).json({ mensaje: 'Sesión cerrada' });
  }

  let payload;
  try {
    const resultado = await jwtVerify(token, secret);
    payload = resultado.payload;
  } catch (err) {
    console.error('Error verificando JWT:', err.message);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }

  try {
    const usuario = await usuarioRepo.buscarPorId(payload.id);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo o no encontrado' });
    }

    req.usuario = {
      id: usuario.id,
      email: payload.email,
      tipo: usuario.tipo,
    };

    return next();
  } catch (err) {
    return next(err);
  }
}

function soloRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción' });
    }
    next();
  };
}

module.exports = { verificarToken, soloRol };


