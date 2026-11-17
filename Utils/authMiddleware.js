const { jwtVerify } = require('jose');

async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado: Token inexistente o con formato inválido' });
  }

  const token = authHeader.split(' ')[1];
  const encoder = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, encoder, { algorithms: ['HS256'] });
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado' });
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