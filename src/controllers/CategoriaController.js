const CategoriaService = require('../services/CategoriaService');

exports.obtenerTodos = async (req, res) => {
    try {
        const categorias = await CategoriaService.obtenerTodos();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const categoria = await CategoriaService.obtenerPorId(req.params.id);
        res.json(categoria);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.crear = async (req, res) => {
    try {
        const categoria = await CategoriaService.crear(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const categoria = await CategoriaService.actualizar(req.params.id, req.body);
        res.json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const resultado = await CategoriaService.eliminar(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = exports;