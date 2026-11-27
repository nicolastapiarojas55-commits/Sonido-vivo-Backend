const express = require('express');
const router = express.Router();
const controller = require('../Controller/catalogoController');

router.get('/marcas', controller.listarMarcas);
router.get('/modelos', controller.listarModelos);
router.get('/categorias', controller.listarCategorias);

module.exports = router;