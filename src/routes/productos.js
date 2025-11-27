const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');
const { autenticar } = require('../middleware/auth');

router.use(autenticar);

router.get('/', ProductoController.obtenerTodos);
router.get('/:id', ProductoController.obtenerPorId);
router.post('/', ProductoController.crear);
router.put('/:id', ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);

module.exports = router;
