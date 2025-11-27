const { Movimiento, Producto, Usuario } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.registrar = async (req, res) => {
    try {
        const movimiento = await MovimientoService.registrar(req.body);
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

exports.obtenerHistorialProducto = async (req, res) => {
    try {
        const resultado = await MovimientoService.obtenerHistorialProducto(req.params.id, req.query);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = exports;