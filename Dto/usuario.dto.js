const error = (status, mensaje) => ({ status, mensaje });

const PATRONES = {
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    run: /^\d{6,8}[0-9K]$/i
}
const ROLES = ['Administrador', 'Vendedor', 'Cliente', 'Encargado'];
const PASSWORD_MIN = 4;
const PASSWORD_MAX = 64;
const DOMINIOS_VALIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

function validarCorreo(email) {
    if (!PATRONES.correo.test(email)) throw error(400, 'Correo inválido');
    const dominio = email.split('@')[1];
    if (!DOMINIOS_VALIDOS.includes(dominio)) {
        throw error(400, `Dominio no permitido. Usa: ${DOMINIOS_VALIDOS.map(d => '@' + d).join(', ')}`);
    }
}

function validarFecha(fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        throw error(400, 'Fecha de nacimiento inválida (usa AAAA-MM-DD)');
    }
    const d = new Date(`${fecha}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== fecha) {
        throw error(400, 'La fecha de nacimiento no existe');
    }
    if (d > new Date()) throw error(400, 'La fecha de nacimiento no puede ser futura');
}



function registroRequestDto(body) {
    const { run, nombre, apellidos, email, password, fechaNacimiento, direccion, telefono, comunaId } = body || {};

    if (!run || !nombre || !apellidos || !email || !password) {
        throw error(400, 'Faltan campos obligatorios');
    }

    const runNorm = String(run).trim().toUpperCase();
    const emailNorm = String(email).trim().toLowerCase();

    if (!PATRONES.run.test(runNorm)) throw error(400, 'RUN inválido');
    validarPassword(password);
    validarCorreo(emailNorm);
    if(fechaNacimiento) {
        validarFecha(fechaNacimiento);
    }

    return {
        run: runNorm,
        nombre: String(nombre).trim(),
        apellidos: String(apellidos).trim(),
        email: emailNorm,
        password: password,
        fechaNacimiento: fechaNacimiento || null,
        direccion: direccion ? String(direccion).trim() : null,
        telefono: telefono ? String(telefono).trim() : null,
        comunaId: comunaId || null
    }
}

function loginRequestDto(body) {
    const { email, password } = body || {};

    if (!email || !password) {
        throw error(400, 'Faltan credenciales');
    }

    return {
        email: String(email).trim().toLowerCase(),
        password: password
    };
}

function validarPassword(password) {
    if (typeof password !== 'string' || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
        throw error(400, `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres`);
    }
}

function crearUsuarioRequestDto(body) {
    const datos = registroRequestDto(body);
    const tipo = body?.tipo;
    if (!ROLES.includes(tipo)) throw error(400, 'Rol inválido');
    return { ...datos, tipo };
}

function actualizarRequestDto(body) {
    const { nombre, apellidos, email, fechaNacimiento, tipo } = body || {};
    const datos = {};

    if (nombre !== undefined) {
        if (!String(nombre).trim()) throw error(400, 'Nombre inválido');
        datos.nombre = String(nombre).trim();
    }
    if (apellidos !== undefined) {
        if (!String(apellidos).trim()) throw error(400, 'Apellidos inválidos');
        datos.apellidos = String(apellidos).trim();
    }
    if (email !== undefined) {
        const emailNorm = String(email).trim().toLowerCase();
        validarCorreo(emailNorm);
        datos.email = emailNorm;
    }
    if (fechaNacimiento) {
        validarFecha(fechaNacimiento);
        datos.fechaNacimiento = fechaNacimiento;
    }
    if (tipo !== undefined) {
        if (!ROLES.includes(tipo)) throw error(400, 'Rol inválido');
        datos.tipo = tipo;
    }
    return datos;
}

module.exports = { registroRequestDto, loginRequestDto, crearUsuarioRequestDto, actualizarRequestDto, validarCorreo, validarFecha };