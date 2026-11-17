const bcrypt = require('bcryptjs');
const repo = require('../Repository/usuarioRepository');
const { generarToken } = require('../Utils/jwt');

const error = (status, mensaje) => ({ status, mensaje });

const PATRONES = {
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  run: /^\d{6,8}[0-9K]$/i
};

async function registrar(datos) {
  const { run, nombre, apellidos, email, password, fechaNacimiento, direccion, telefono, comunaId } = datos || {};

  if (!run || !nombre || !apellidos || !email || !password)
    throw error(400, 'Faltan campos obligatorios');

  const runNorm = String(run).trim().toUpperCase();
  if (!PATRONES.run.test(runNorm))
    throw error(400, 'RUN inválido');
  if (!PATRONES.correo.test(email))
    throw error(400, 'Correo inválido');
  if (password.length < 4 || password.length > 10)
    throw error(400, 'La contraseña debe tener entre 4 y 10 caracteres');

  const emailNorm = email.trim().toLowerCase();

  if (await repo.buscarPorEmail(emailNorm)) throw error(409, 'El correo ya está registrado');
  if (await repo.buscarPorRun(runNorm)) throw error(409, 'El RUN ya está registrado');

  const hash = await bcrypt.hash(password, 10);
  try {
    const usuarioCreado = await repo.crear({
      run: runNorm, nombre, apellidos, email: emailNorm,
      password: hash, tipo: 'Cliente', fechaNacimiento,
      direccion, telefono, comunaId
    });

    const payload = { id: usuarioCreado.id, email: usuarioCreado.email, tipo: usuarioCreado.tipo };
    const token = await generarToken(payload);

    return {
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: usuarioCreado
    };
  } catch (e) {
    if (e.code === '23505') throw error(409, 'Usuario ya registrado');
    throw e;
  }
}
async function login(datos) {
  const { email, password } = datos || {};

  if(!email || !password){
    throw error(400, 'Faltan credenciales');
  }

  const emailNorm = String(email).trim().toLowerCase();

  const usuario = await repo.buscarPorEmail(emailNorm);
  if(!usuario){
    throw error(401, 'Credenciales incorrectas');
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if(!passwordValida){
    throw error(401, 'Credenciales incorrectas');
  }

  const payload = {
    id: usuario.id,
    email: usuario.email,
    tipo: usuario.tipo
  };
  const token = await generarToken(payload);

  return {
    mensaje: `Bienvenido ${usuario.nombre} a tienda sonido vivo`,
    token: token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      tipo: usuario.tipo
    }
  };
}

async function listar() {
  return await repo.listar();
}
module.exports = { registrar , login, listar};