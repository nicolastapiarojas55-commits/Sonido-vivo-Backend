const { PATRONES, DOMINIOS_VALIDOS } = require('../constants/usuario.constants');

const error = (status, mensaje) => ({ status, mensaje });

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

module.exports = {
    validarCorreo,
    validarFecha
};