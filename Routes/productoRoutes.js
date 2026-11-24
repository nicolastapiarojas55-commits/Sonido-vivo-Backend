const express = require('express');
const router = express.Router();
const controller = require('../Controller/productoController');
const { verificarToken, soloRol } = require('../Utils/authMiddleware');

router.get('/', controller.listar);      
router.get('/:id', controller.obtener);    
router.post('/', verificarToken, soloRol('Administrador', 'Vendedor'), controller.crear);
router.put('/:id', verificarToken, soloRol('Administrador', 'Vendedor'), controller.actualizar);
router.delete('/:id', verificarToken, soloRol('Administrador'), controller.eliminar);

module.exports = router;