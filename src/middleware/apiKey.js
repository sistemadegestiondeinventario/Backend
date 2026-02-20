/**
 * Middleware para validar API_KEY (OPCIONAL si hay JWT)
 * Si el usuario tiene JWT válido, no necesita API_KEY
 */

const jwt = require('jsonwebtoken');

const verificarApiKey = (req, res, next) => {
    try {
        // Verificar si hay JWT válido en el header Authorization
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (token) {
            try {
                jwt.verify(token, process.env.JWT_SECRET);
                // JWT válido, no necesita API_KEY
                return next();
            } catch (error) {
                // JWT inválido o expirado, continuar a verificar API_KEY
            }
        }

        // Si no hay JWT válido, verificar API_KEY (para rutas públicas como login/registro)
        const apiKeyHeader = req.headers['x-api-key'];
        const apiKeyQuery = req.query['api_key'];
        const apiKey = apiKeyHeader || apiKeyQuery;

        if (!apiKey) {
            return res.status(401).json({
                error: 'API_KEY o autenticación requerida',
                mensaje: 'Proporciona x-api-key en headers o autentica con JWT'
            });
        }

        const apiKeyValida = process.env.API_KEY;

        if (!apiKeyValida) {
            console.error('API_KEY no configurada en variables de entorno');
            return res.status(500).json({
                error: 'Error de configuración del servidor'
            });
        }

        // Validar que la API_KEY sea correcta
        if (apiKey !== apiKeyValida) {
            return res.status(403).json({
                error: 'API_KEY inválida',
                mensaje: 'La clave API proporcionada no es válida'
            });
        }

        // API_KEY válida, continuar
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Error validando autenticación: ' + error.message
        });
    }
};

module.exports = {
    verificarApiKey
};
