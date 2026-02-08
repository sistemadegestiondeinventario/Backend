const ProveedorService = require('../services/ProveedorService');

exports.obtenerProveedores = async (req, res) => {
    try {
        const resultado = await ProveedorService.obtenerTodos(req.query);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerProveedor = async (req, res) => {
    try {
        const proveedor = await ProveedorService.obtenerPorId(req.params.id);
        res.json(proveedor);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.crearProveedor = async (req, res) => {
    try {
        const proveedor = await ProveedorService.crear(req.body);
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizarProveedor = async (req, res) => {
    try {
        const proveedor = await ProveedorService.actualizar(req.params.id, req.body);
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.desactivarProveedor = async (req, res) => {
    try {
        const resultado = await ProveedorService.eliminar(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = exports;