const router = require('express').Router();
const { verificarToken, soloRol } = require('../Utils/authMiddleware');
const controller = require('../Controller/pedidoController');

router.post('/', verificarToken, controller.crear);
router.get('/', verificarToken, controller.listar);
router.get('/:id', verificarToken, controller.obtener);
router.patch('/:id/estado', verificarToken, soloRol('Administrador', 'Vendedor'), controller.cambiarEstado);

module.exports = router;