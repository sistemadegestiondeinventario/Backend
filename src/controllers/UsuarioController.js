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

exports.registrarUsuario = exports.registrar;

exports.obtenerUsuarios = async (req, res) => {
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

exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await UsuarioService.actualizar(req.params.id, req.body);
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.desactivarUsuario = async (req, res) => {
    try {
        const { Usuario } = require('../models');
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        await usuario.update({ activo: false });
        res.json({ mensaje: 'Usuario desactivado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = exports;
