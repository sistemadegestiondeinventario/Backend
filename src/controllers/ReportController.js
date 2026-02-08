const ReporteService = require('../services/ReporteService');
const ReportePDFService = require('../services/ReportePDFService');
const ReporteExcelService = require('../services/ReporteExcelService');

// ============= REPORTES JSON =============

exports.obtenerEstadisticas = async (req, res) => {
    try {
        const estadisticas = await ReporteService.obtenerEstadisticasGenerales();
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerMovimientosPorTipo = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        if (!desde || !hasta) {
            return res.status(400).json({ error: 'Se requieren parámetros desde y hasta' });
        }
        const datos = await ReporteService.obtenerMovimientosPorTipo(desde, hasta);
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerProductosMasMovidos = async (req, res) => {
    try {
        const { limite = 10, desde, hasta } = req.query;
        if (!desde || !hasta) {
            return res.status(400).json({ error: 'Se requieren parámetros desde y hasta' });
        }
        const datos = await ReporteService.obtenerProductosMasMovidos(limite, desde, hasta);
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerValorPromedioPorCategoria = async (req, res) => {
    try {
        const datos = await ReporteService.obtenerValorPromedioPorCategoria();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============= REPORTES PDF =============

exports.descargarPDFEstadisticas = async (req, res) => {
    try {
        const doc = await ReportePDFService.generarReporteEstadisticas();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="estadisticas.pdf"');
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.descargarPDFProductosPorCategoria = async (req, res) => {
    try {
        const doc = await ReportePDFService.generarReporteProductosPorCategoria();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="productos-por-categoria.pdf"');
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.descargarPDFMovimientos = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        if (!desde || !hasta) {
            return res.status(400).json({ error: 'Se requieren parámetros desde y hasta' });
        }
        const doc = await ReportePDFService.generarReporteMovimientos(desde, hasta);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="movimientos.pdf"');
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.descargarPDFAlertasStock = async (req, res) => {
    try {
        const doc = await ReportePDFService.generarReporteAlertasStock();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="alertas-stock.pdf"');
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============= REPORTES EXCEL =============

exports.descargarExcelProductos = async (req, res) => {
    try {
        const workbook = await ReporteExcelService.generarReporteProductos();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="productos.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.descargarExcelMovimientos = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        if (!desde || !hasta) {
            return res.status(400).json({ error: 'Se requieren parámetros desde y hasta' });
        }
        const workbook = await ReporteExcelService.generarReporteMovimientos(desde, hasta);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="movimientos.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.descargarExcelAlertasStock = async (req, res) => {
    try {
        const workbook = await ReporteExcelService.generarReporteAlertasStock();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="alertas-stock.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.descargarExcelEstadisticas = async (req, res) => {
    try {
        const workbook = await ReporteExcelService.generarReporteEstadisticas();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="estadisticas.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;