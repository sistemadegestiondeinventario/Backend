const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

// ============= REPORTES JSON =============
router.get('/json/estadisticas', ReportController.obtenerEstadisticas);
router.get('/json/movimientos-por-tipo', ReportController.obtenerMovimientosPorTipo);
router.get('/json/productos-mas-movidos', ReportController.obtenerProductosMasMovidos);
router.get('/json/valor-promedio-categoria', ReportController.obtenerValorPromedioPorCategoria);

// ============= REPORTES PDF =============
router.get('/pdf/estadisticas', ReportController.descargarPDFEstadisticas);
router.get('/pdf/productos-por-categoria', ReportController.descargarPDFProductosPorCategoria);
router.get('/pdf/movimientos', ReportController.descargarPDFMovimientos);
router.get('/pdf/alertas-stock', ReportController.descargarPDFAlertasStock);

// ============= REPORTES EXCEL =============
router.get('/excel/productos', ReportController.descargarExcelProductos);
router.get('/excel/movimientos', ReportController.descargarExcelMovimientos);
router.get('/excel/alertas-stock', ReportController.descargarExcelAlertasStock);
router.get('/excel/estadisticas', ReportController.descargarExcelEstadisticas);

module.exports = router;
