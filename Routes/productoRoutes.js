const express = require('express');
const router = express.Router();
const controller = require('../Controller/productoController');
const { verificarToken, soloRol } = require('../Utils/authMiddleware');

router.get('/', controller.listar);      
router.get('/:id', controller.obtener);    
router.post('/', verificarToken, soloRol('Administrador'), controller.crear);
router.put('/:id', verificarToken, soloRol('Administrador'), controller.actualizar);
router.delete('/:id', verificarToken, soloRol('Administrador'), controller.eliminar);
router.patch('/:id/stock', verificarToken, soloRol('Administrador','Vendedor'), controller.actualizarStock);

module.exports = router;