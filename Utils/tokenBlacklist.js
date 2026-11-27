const tokensRevocados = new Map();

function revocarToken(token, expSeg) {
    const expiraEnMs = expSeg * 1000;
    if (expiraEnMs > Date.now()) {
        tokensRevocados.set(token, expiraEnMs);
    }
}

function estaTokenRevocado(token) {
    const expiraEnMs = tokensRevocados.get(token);
    if (!expiraEnMs) return false;

    if (Date.now() > expiraEnMs) {
        tokensRevocados.delete(token);
        return false;
    }

    return true;
}

function limpiarExpirados() {
    const ahora = Date.now();
    for (const [token, expiraEnMs] of tokensRevocados.entries()) {
        if (ahora > expiraEnMs) tokensRevocados.delete(token);
    }
}

//equivale a 10 minutos
setInterval(limpiarExpirados, 600000).unref();

module.exports = { revocarToken, estaTokenRevocado };