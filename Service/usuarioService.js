const bcrypt = require('bcryptjs');
const repo = require('../Repository/usuarioRepository');
const { generarToken } = require('../Utils/jwt');
const ROLES = ['Administrador', 'Vendedor', 'Cliente'];
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

  //se modifico de 10 a 64 el largo de la contraseña para seguir buenas practicas de seguridad
  if (password.length < 4 || password.length > 64)
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
  if (!usuario || !usuario.activo) throw error(401, 'Credenciales incorrectas');

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

function validarId(id) {
  if (!Number.isInteger(Number(id))) throw error(400, 'Id inválido');
}


function validarAcceso(id, solicitante) {
  if (solicitante.tipo !== 'Administrador' && String(solicitante.id) !== String(id)) {
    throw error(403, 'No tienes permiso para acceder a este usuario');
  }
}

async function obtener(id, solicitante) {
  validarId(id);
  validarAcceso(id, solicitante);
  const usuario = await repo.buscarPorId(id);
  if (!usuario) throw error(404, 'Usuario no encontrado');
  return usuario;
}

async function actualizar(id, datos, solicitante) {
  validarId(id);
  validarAcceso(id, solicitante);
  const actual = await repo.buscarPorId(id);
  if (!actual) throw error(404, 'Usuario no encontrado');

  const { nombre, apellidos, email, fechaNacimiento, tipo } = datos || {};

  if (email && !PATRONES.correo.test(email)) throw error(400, 'Correo inválido');

  if (tipo && tipo !== actual.tipo) {
    if (solicitante.tipo !== 'Administrador')
      throw error(403, 'Solo el Administrador puede cambiar el rol');
    if (!ROLES.includes(tipo)) throw error(400, 'Rol inválido');
  }

  const emailNorm = email ? email.trim().toLowerCase() : actual.email;
  if (emailNorm !== actual.email && await repo.buscarPorEmail(emailNorm)) {
    throw error(409, 'El correo ya está registrado');
  }

  return await repo.actualizar(id, {
    nombre: nombre || actual.nombre,
    apellidos: apellidos || actual.apellidos,
    email: emailNorm,
    fechaNacimiento: fechaNacimiento || actual.fecha_nacimiento,
    tipo: tipo || actual.tipo
  });
}

async function eliminar(id, solicitante) {
  validarId(id);
  if (String(solicitante.id) === String(id))
    throw error(409, 'No puedes desactivar tu propia cuenta');
  if (!(await repo.desactivar(id))) throw error(404, 'Usuario no encontrado');
}
module.exports = { registrar, login, listar, obtener, actualizar, eliminar};