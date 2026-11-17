const express = require('express');
const router = express.Router();
const usuarioController = require('../Controller/usuarioController');
const { verificarToken } = require('../Utils/authMiddleware');

router.post('/login', usuarioController.login);
router.post('/registro', usuarioController.registrar);
router.get('/usuarios', verificarToken, usuarioController.listar);

module.exports = router;