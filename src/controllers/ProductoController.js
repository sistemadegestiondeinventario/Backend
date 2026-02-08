const ProductoService = require('../services/ProductoService');

exports.obtenerProductos = async (req, res) => {
    try {
        const resultado = await ProductoService.obtenerTodos(req.query);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerProducto = async (req, res) => {
    try {
        const producto = await ProductoService.obtenerPorId(req.params.id);
        res.json(producto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.crearProducto = async (req, res) => {
    try {
        const producto = await ProductoService.crear(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizarProducto = async (req, res) => {
    try {
        const producto = await ProductoService.actualizar(req.params.id, req.body);
        res.json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const resultado = await ProductoService.eliminar(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.obtenerAlertasStock = async (req, res) => {
    try {
        const alertas = await ProductoService.obtenerAlertasStock();
        res.json(alertas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerHistorialProducto = async (req, res) => {
    try {
        const { pagina = 1, limite = 20, tipo_movimiento } = req.query;
        const resultado = await ProductoService.obtenerHistorialProducto(req.params.id, { pagina, limite, tipo_movimiento });
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = exports;