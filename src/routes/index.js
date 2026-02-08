const express = require('express');
const router = express.Router();

const productosRoutes = require('./productos');
const categoriasRoutes = require('./categorias');
const proveedoresRoutes = require('./proveedores');
const movimientosRoutes = require('./movimientos');
const usuariosRoutes = require('./usuarios');
const reportesRoutes = require('./reportes');

router.use('/productos', productosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/proveedores', proveedoresRoutes);
router.use('/movimientos', movimientosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/reportes', reportesRoutes);

module.exports = router;
