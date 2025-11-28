const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/ProveedorController');
const { autenticar } = require('../middleware/auth');

router.get('/', ProveedorController.obtenerTodos);
router.get('/:id', ProveedorController.obtenerPorId);

router.use(autenticar);
router.post('/', ProveedorController.crear);
router.put('/:id', ProveedorController.actualizar);
router.delete('/:id', ProveedorController.eliminar);

module.exports = router;
