const { SignJWT } = require('jose');
const JWT_SECRET = process.env.JWT_SECRET;
if(!process.env.JWT_SECRET){
    throw new Error('Clave no esta definida en variables de entornos. No se puede permitir el acceso sin ella.');
}
const encoder = new TextEncoder().encode(JWT_SECRET);

async function generarToken(payload) {
  const jwtConstructor = new SignJWT(payload);
  
  const token = await jwtConstructor
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encoder);

  return token;
}

module.exports = { generarToken };