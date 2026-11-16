const express = require('express');
const router = express.Router();
const usuarioController = require('../Controller/usuarioController');

router.post('/registro', usuarioController.registrar);

module.exports = router;