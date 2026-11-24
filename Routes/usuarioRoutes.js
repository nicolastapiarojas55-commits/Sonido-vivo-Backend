const express = require('express');
const router = express.Router();
const usuarioController = require('../Controller/usuarioController');
const { verificarToken, soloRol } = require('../Utils/authMiddleware');

router.get('/', verificarToken, soloRol('Administrador'), usuarioController.listar);
router.get('/:id', verificarToken, usuarioController.obtener);
router.put('/:id', verificarToken, usuarioController.actualizar);
router.delete('/:id', verificarToken, soloRol('Administrador'), usuarioController.eliminar);
router.post('/', verificarToken, soloRol('Administrador'), usuarioController.crear);

module.exports = router;