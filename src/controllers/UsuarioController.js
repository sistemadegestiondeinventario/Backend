const UsuarioService = require('../services/UsuarioService');

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const usuario = await UsuarioService.registrar(nombre, email, password);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const resultado = await UsuarioService.login(email, password);
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.obtenerTodos = async (req, res) => {
    try {
        const usuarios = await UsuarioService.obtenerTodos();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const usuario = await UsuarioService.obtenerPorId(req.params.id);
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const usuario = await UsuarioService.actualizar(req.params.id, req.body);
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const resultado = await UsuarioService.eliminar(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = exports;
