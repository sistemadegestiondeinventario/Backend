const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Registrar nuevo usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        if (!['administrador', 'encargado', 'consultor'].includes(rol || 'consultor')) {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            rol: rol || 'consultor'
        });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET || 'tu_clave_secreta',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                activo: usuario.activo
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordValido = await usuario.validarPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET || 'tu_clave_secreta',
            { expiresIn: '24h' }
        );

        res.json({
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                activo: usuario.activo
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener perfil del usuario autenticado
exports.obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: { exclude: ['password'] }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar perfil del usuario
exports.actualizarPerfil = async (req, res) => {
    try {
        const { nombre, email, passwordActual, passwordNueva } = req.body;
        const usuario = await Usuario.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si se intenta cambiar contraseña
        if (passwordNueva) {
            if (!passwordActual) {
                return res.status(400).json({ error: 'Se requiere la contraseña actual' });
            }

            const passwordValida = await usuario.validarPassword(passwordActual);
            if (!passwordValida) {
                return res.status(401).json({ error: 'Contraseña actual incorrecta' });
            }

            usuario.password = passwordNueva;
        }

        if (nombre) usuario.nombre = nombre;
        if (email && email !== usuario.email) {
            const emailExistente = await Usuario.findOne({
                where: { email, id: { [Op.ne]: usuario.id } }
            });
            if (emailExistente) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
            usuario.email = email;
        }

        await usuario.save();

        res.json({
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                activo: usuario.activo
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los usuarios (solo administrador)
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] },
            order: [['nombre', 'ASC']]
        });

        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario (solo administrador)
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol, activo } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (email && email !== usuario.email) {
            const emailExistente = await Usuario.findOne({
                where: { email, id: { [Op.ne]: id } }
            });
            if (emailExistente) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
        }

        if (rol && !['administrador', 'encargado', 'consultor'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        await usuario.update({
            nombre: nombre || usuario.nombre,
            email: email || usuario.email,
            rol: rol || usuario.rol,
            activo: activo !== undefined ? activo : usuario.activo
        });

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desactivar usuario (soft delete)
exports.desactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.update({ activo: false });

        res.json({ mensaje: 'Usuario desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener permisos por rol
exports.obtenerPermisosRol = (req, res) => {
    const permisos = {
        administrador: {
            productos: ['crear', 'leer', 'actualizar', 'eliminar'],
            categorias: ['crear', 'leer', 'actualizar', 'eliminar'],
            proveedores: ['crear', 'leer', 'actualizar', 'eliminar'],
            movimientos: ['crear', 'leer'],
            usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
            reportes: ['acceso_total']
        },
        encargado: {
            productos: ['leer', 'actualizar'],
            categorias: ['leer'],
            proveedores: ['leer'],
            movimientos: ['crear', 'leer'],
            usuarios: ['leer_propio', 'actualizar_propio'],
            reportes: ['acceso_inventario']
        },
        consultor: {
            productos: ['leer'],
            categorias: ['leer'],
            proveedores: ['leer'],
            movimientos: ['leer'],
            usuarios: ['leer_propio', 'actualizar_propio'],
            reportes: ['acceso_consulta']
        }
    };

    const rolUsuario = req.usuario?.rol || 'consultor';
    res.json(permisos[rolUsuario] || permisos['consultor']);
};

module.exports = exports;
