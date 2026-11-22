const error = (status, mensaje) => ({ status, mensaje });

const PATRONES = {
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    run: /^\d{6,8}[0-9K]$/i
}

function registroRequestDto(body) {
    const { run, nombre, apellidos, email, password, fechaNacimiento, direccion, telefono, comunaId } = body || {};

    if (!run || !nombre || !apellidos || !email || !password) {
        throw error(400, 'Faltan campos obligatorios');
    }

    const runNorm = String(run).trim().toUpperCase();
    const emailNorm = String(email).trim().toLowerCase();

    if (!PATRONES.run.test(runNorm)) throw error(400, 'RUN inválido');
    if (!PATRONES.correo.test(emailNorm)) throw error(400, 'Correo inválido');
    if (password.length < 4 || password.length > 64) {
        throw error(400, 'La contraseña debe tener entre 4 y 64 caracteres');
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

module.exports = { registroRequestDto, loginRequestDto };