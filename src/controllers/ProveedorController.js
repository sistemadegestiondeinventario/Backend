const ProveedorService = require('../services/ProveedorService');

exports.obtenerTodos = async (req, res) => {
    try {
        const resultado = await ProveedorService.obtenerTodos(req.query);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const proveedor = await ProveedorService.obtenerPorId(req.params.id);
        res.json(proveedor);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.obtenerProductosPorProveedor = async (req, res) => {
    try {
        const proveedor = await ProveedorService.obtenerPorId(req.params.id);
        // Obtener productos del proveedor
        const { Producto } = require('../models');
        const productos = await Producto.findAll({ 
            where: { proveedor_id: req.params.id },
            order: [['nombre', 'ASC']]
        });
        res.json({ 
            proveedor: proveedor,
            productos: productos,
            total: productos.length 
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.crear = async (req, res) => {
    try {
        const proveedor = await ProveedorService.crear(req.body);
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const proveedor = await ProveedorService.actualizar(req.params.id, req.body);
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const resultado = await ProveedorService.eliminar(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = exports;