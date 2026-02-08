const CategoriaService = require('../services/CategoriaService');

exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaService.obtenerTodos();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaService.obtenerPorId(req.params.id);
        res.json(categoria);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.crearCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaService.crear(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizarCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaService.actualizar(req.params.id, req.body);
        res.json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarCategoria = async (req, res) => {
    try {
        const resultado = await CategoriaService.eliminar(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerProductosPorCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaService.obtenerPorId(req.params.id);
        res.json(categoria.productos);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = exports;