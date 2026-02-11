const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UsuarioService {
    async registrar(nombre, email, password) {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            throw new Error('El email ya está registrado');
        }

        const usuario = await Usuario.create({
            nombre,
            email,
            password
        });

        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        };
    }

    async login(email, password) {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }

        const passwordValido = await usuario.validarPassword(password);
        if (!passwordValido) {
            throw new Error('Credenciales inválidas');
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET no configurado');
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            secret,
            { expiresIn: '24h' }
        );

        return {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        };
    }

    async obtenerTodos() {
        return await Usuario.findAll({
            attributes: { exclude: ['password'] }
        });
    }

    async obtenerPorId(id) {
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return usuario;
    }

    async actualizar(id, datos) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        await usuario.update(datos);
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        };
    }

    async eliminar(id) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        await usuario.destroy();
        return { mensaje: 'Usuario eliminado correctamente' };
    }
}

module.exports = new UsuarioService();
