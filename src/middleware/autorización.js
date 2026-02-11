const verificarRol = (...rolesPermitidos) => {
    return async (req, res, next) => {
        try {
            if (!req.usuario) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            if (rolesPermitidos.length === 0) {
                return next();
            }

            // Obtener el rol del usuario desde la BD
            const { Usuario } = require('../models');
            const usuario = await Usuario.findByPk(req.usuario.id);

            if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
                return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
            }

            req.usuarioDb = usuario;
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Error verificando permisos: ' + error.message });
        }
    };
};

module.exports = {
    verificarRol
};