const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const { verificarToken } = require('../Utils/authMiddleware');

router.post('/login', authController.login);
router.post('/registro', authController.registrar);
router.post('/logout', verificarToken, authController.logout);

module.exports = router;