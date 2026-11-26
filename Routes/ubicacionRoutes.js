const express = require('express');
const router = express.Router();
const controller = require('../Controller/ubicacionController');

router.get('/regiones', controller.listarRegiones)
router.get('/comunas', controller.listarComunas)

module.exports = router;