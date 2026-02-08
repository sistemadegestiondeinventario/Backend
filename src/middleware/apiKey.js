/**
 * Middleware para validar API_KEY
 * Protege todas las rutas contra acceso no autorizado
 */

const verificarApiKey = (req, res, next) => {
    try {
        // Obtener API_KEY del header o query params
        const apiKeyHeader = req.headers['x-api-key'];
        const apiKeyQuery = req.query['api_key'];
        const apiKey = apiKeyHeader || apiKeyQuery;

        if (!apiKey) {
            return res.status(401).json({
                error: 'API_KEY requerida',
                mensaje: 'Se requiere proporcionar x-api-key en headers o api_key en query params'
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
            error: 'Error validando API_KEY: ' + error.message
        });
    }
};

module.exports = {
    verificarApiKey
};
