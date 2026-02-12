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

exports.login = async (req, res) => {
    try {
        console.log('🔐 Intentando login:', { email: req.body.email });
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password requeridos' });
        }
        
        console.log('🔍 Buscando usuario...');
        const resultado = await UsuarioService.login(email, password);
        console.log('✅ Login exitoso:', { id: resultado.usuario.id, email: resultado.usuario.email });
        res.json(resultado);
    } catch (error) {
        console.error('❌ Error en login:', error.message);
        res.status(401).json({ error: error.message });
    }
};

exports.obtenerPerfil = async (req, res) => {
    try {
        // El usuario viene del middleware de autenticación en req.usuario
        const usuario = await UsuarioService.obtenerPorId(req.usuario.id);
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        // Si se pasa como /perfil, usar req.usuario del middleware de autenticación
        const usuarioId = req.params.id || req.usuario?.id;
        if (!usuarioId) {
            return res.status(400).json({ error: 'ID de usuario requerido' });
        }
        const usuario = await UsuarioService.obtenerPorId(usuarioId);
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioService.obtenerTodos();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        // Puede actualizar su propio perfil o como admin actualizar otro
        const usuarioId = req.params.id || req.usuario?.id;
        if (!usuarioId) {
            return res.status(400).json({ error: 'ID de usuario requerido' });
        }
        const usuario = await UsuarioService.actualizar(usuarioId, req.body);
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
