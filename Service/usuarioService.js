const bcrypt = require('bcryptjs');
const repo = require('../Repository/usuarioRepository');

const error = (status, mensaje) => ({ status, mensaje });

const PATRONES = {
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  run: /^\d{6,8}[0-9K]$/i
};

async function registrar(datos) {
  const { run, nombre, apellidos, email, password, fechaNacimiento, region, comuna, direccion } = datos || {};
  const runNorm = String(run).trim().toUpperCase();
  if (!PATRONES.run.test(runNorm)) 
    throw error(400, 'RUN inválido');
  if (!PATRONES.correo.test(email)) 
    throw error(400, 'Correo inválido');
  if (!run || !nombre || !apellidos || !email || !password)
    throw error(400, 'Faltan campos obligatorios');
  if (password.length < 4 || password.length > 10)
    throw error(400, 'La contraseña debe tener entre 4 y 10 caracteres');

  const emailNorm = email.trim().toLowerCase();


  if (await repo.buscarPorEmail(emailNorm)) throw error(409, 'El correo ya está registrado');
  if (await repo.buscarPorRun(runNorm)) throw error(409, 'El RUN ya está registrado');

  const hash = await bcrypt.hash(password, 10);
  try {
    return await repo.crear({
      run: runNorm, nombre, apellidos, email: emailNorm,
      password: hash, tipo: 'Cliente', fechaNacimiento, region, comuna, direccion
    });
  } catch (e) {
    if (e.code === '23505') throw error(409, 'Usuario ya registrado'); // choque UNIQUE
    throw e;
  }
}
module.exports = { registrar };