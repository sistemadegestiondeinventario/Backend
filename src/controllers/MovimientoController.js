const MovimientoService = require('../services/MovimientoService');

exports.registrar = async (req, res) => {
    try {
        // Agregar el usuario_id del token
        const datos = {
            ...req.body,
            usuario_id: req.usuario.id
        };
        const movimiento = await MovimientoService.registrar(datos);
        res.status(201).json(movimiento);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerTodos = async (req, res) => {
    try {
        const resultado = await MovimientoService.obtenerTodos(req.query);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const movimiento = await MovimientoService.obtenerPorId(req.params.id);
        res.json(movimiento);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.obtenerMovimientosPorProducto = async (req, res) => {
    try {
        const resultado = await MovimientoService.obtenerHistorialProducto(req.params.producto_id, req.query);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.obtenerHistorialProducto = async (req, res) => {
    try {
        const resultado = await MovimientoService.obtenerHistorialProducto(req.params.id, req.query);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.obtenerAlertasStock = async (req, res) => {
    try {
        const alertas = await MovimientoService.obtenerAlertasStock();
        res.json(alertas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerResumen = async (req, res) => {
    try {
        const resumen = await MovimientoService.obtenerResumen(req.query);
        res.json(resumen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;