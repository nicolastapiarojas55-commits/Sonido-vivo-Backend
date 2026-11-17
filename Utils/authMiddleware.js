const { jwtVerify } = require('jose');

async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado: Token inexistente o con formato inválido' });
  }

  const token = authHeader.split(' ')[1];
  const encoder = new TextEncoder().encode(JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, encoder);
    
    req.usuario = payload; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado' });
  }
}

module.exports = { verificarToken };