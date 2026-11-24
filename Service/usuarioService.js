const bcrypt = require('bcryptjs');
const repo = require('../Repository/usuarioRepository');
const { generarToken } = require('../Utils/jwt');
const error = (status, mensaje) => ({ status, mensaje });

//registro publico-servidor fija rol cliente
async function registrar(datos) {
  const usuarioCreado = await crearUsuario(datos, 'Cliente');
  const token = await generarToken({ id: usuarioCreado.id, email: usuarioCreado.email, tipo: usuarioCreado.tipo });
  return {
    mensaje: 'Usuario registrado exitosamente', token, usuario: usuarioCreado
  };
}

  
async function login(datos) {
  const { email, password } = datos;

  const usuario = await repo.buscarPorEmail(email);
  if (!usuario || !usuario.activo) throw error(401, 'Credenciales incorrectas');

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
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

  if (datos.tipo && datos.tipo !== actual.tipo && solicitante.tipo !== 'Administrador') {
    throw error(403, 'Solo el Administrador puede cambiar el rol');
  }
  if (datos.email && datos.email !== actual.email && await repo.buscarPorEmail(datos.email)) {
    throw error(409, 'El correo ya está registrado');
  }
  
try {
    return await repo.actualizar(id, {
      nombre: datos.nombre ?? actual.nombre,
      apellidos: datos.apellidos ?? actual.apellidos,
      email: datos.email ?? actual.email,
      fechaNacimiento: datos.fechaNacimiento ?? actual.fecha_nacimiento,
      tipo: datos.tipo ?? actual.tipo
    });
  } catch (e) {
    if (e.code === '23505') throw error(409, 'El correo ya está registrado');
    throw e;
  }
}

async function eliminar(id, solicitante) {
  validarId(id);
  if (String(solicitante.id) === String(id))
    throw error(409, 'No puedes desactivar tu propia cuenta');
  if (!(await repo.desactivar(id))) throw error(404, 'Usuario no encontrado');
}

async function crearUsuario(entrada, tipo) {
  if (await repo.buscarPorEmail(entrada.email)) throw error(409, 'El correo ya está registrado');
  if (await repo.buscarPorRun(entrada.run)) throw error(409, 'El RUN ya está registrado');

  const hash = await bcrypt.hash(entrada.password, 10);
  try {
    return await repo.crear({ ...entrada, password: hash, tipo });
  } catch (e) {
    if (e.code === '23505') throw error(409, 'Usuario ya registrado');
    throw e;
  }
}

async function crear(entrada) {
  return await crearUsuario(entrada, entrada.tipo);
}

module.exports = { registrar, login, listar, obtener, actualizar, eliminar, crear };