const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');
const { autenticar } = require('../middleware/auth');

router.get('/', CategoriaController.obtenerTodos);
router.get('/:id', CategoriaController.obtenerPorId);

router.use(autenticar);
router.post('/', CategoriaController.crear);
router.put('/:id', CategoriaController.actualizar);
router.delete('/:id', CategoriaController.eliminar);

module.exports = router;
