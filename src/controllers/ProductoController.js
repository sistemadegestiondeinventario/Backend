const { Producto, Categoria, Proveedor, Movimiento, Usuario } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.obtenerTodos = async (req, res) => {
    try {
        const resultado = await ProductoService.obtenerTodos(req.query);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const producto = await ProductoService.obtenerPorId(req.params.id);
        res.json(producto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.crear = async (req, res) => {
    try {
        const producto = await ProductoService.crear(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const producto = await ProductoService.actualizar(req.params.id, req.body);
        res.json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const resultado = await ProductoService.eliminar(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = exports;