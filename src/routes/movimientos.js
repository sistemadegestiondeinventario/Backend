const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/MovimientoController');
const { autenticar } = require('../middleware/auth');

router.use(autenticar);

router.post('/', MovimientoController.registrar);
router.get('/', MovimientoController.obtenerTodos);
router.get('/:id', MovimientoController.obtenerPorId);
router.get('/producto/:id', MovimientoController.obtenerHistorialProducto);

module.exports = router;
