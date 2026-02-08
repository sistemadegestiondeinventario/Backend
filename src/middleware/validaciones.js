const { body, validationResult, param } = require('express-validator');

const validarProducto = [
    body('codigo').notEmpty().withMessage('Código es requerido'),
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('categoria_id').isInt().withMessage('Categoría es requerida'),
    body('proveedor_id').isInt().withMessage('Proveedor es requerido'),
    body('precio_compra').isDecimal().withMessage('Precio de compra inválido'),
    body('precio_venta').isDecimal().withMessage('Precio de venta inválido'),
    body('stock_minimo').isInt().withMessage('Stock mínimo inválido'),
    body('stock_critico').isInt().withMessage('Stock crítico inválido')
];

const validarCategoria = [
    body('nombre').notEmpty().withMessage('Nombre es requerido').isLength({ min: 3 }).withMessage('Mínimo 3 caracteres')
];

const validarProveedor = [
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('cuit').notEmpty().withMessage('CUIT es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('telefono').optional().isMobilePhone('es-AR').withMessage('Teléfono inválido')
];

const validarMovimiento = [
    body('producto_id').isInt().withMessage('Producto es requerido'),
    body('tipo_movimiento').isIn(['entrada', 'salida', 'ajuste']).withMessage('Tipo de movimiento inválido'),
    body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
    body('usuario_id').isInt().withMessage('Usuario es requerido')
];

const manejarErroresValidacion = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

module.exports = {
    validarProducto,
    validarCategoria,
    validarProveedor,
    validarMovimiento,
    manejarErroresValidacion
};