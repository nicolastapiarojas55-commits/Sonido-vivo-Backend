const PATRONES = {
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    run: /^\d{6,8}[0-9K]$/i
};

const ROLES = ['Administrador', 'Vendedor', 'Cliente', 'Encargado'];
const PASSWORD_MIN = 4;
const PASSWORD_MAX = 64;
const DOMINIOS_VALIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

module.exports = {
    PATRONES,
    ROLES,
    PASSWORD_MIN,
    PASSWORD_MAX,
    DOMINIOS_VALIDOS
};