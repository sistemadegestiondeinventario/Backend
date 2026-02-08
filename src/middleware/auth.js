const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Token no proporcionado'
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET no configurado en variables de entorno');
            return res.status(500).json({
                error: 'Error de configuración del servidor'
            });
        }

        const decoded = jwt.verify(token, secret);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido: ' + error.message
        });
    }
};

module.exports = {
    autenticar
};