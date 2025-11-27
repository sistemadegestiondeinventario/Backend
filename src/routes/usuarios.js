const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { autenticar } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// Rutas autenticadas
router.use(autenticar);
router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', UsuarioController.eliminar);

module.exports = router;
