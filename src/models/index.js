const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Proveedor = require('./Proveedor');
const Producto = require('./Producto');
const Movimiento = require('./Movimiento');

// Relaciones
// Producto tiene una Categoría
Producto.belongsTo(Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria'
});
Categoria.hasMany(Producto, {
    foreignKey: 'categoria_id',
    as: 'productos'
});

// Producto tiene un Proveedor
Producto.belongsTo(Proveedor, {
    foreignKey: 'proveedor_id',
    as: 'proveedor'
});
Proveedor.hasMany(Producto, {
    foreignKey: 'proveedor_id',
    as: 'productos'
});

// Movimiento pertenece a Producto
Movimiento.belongsTo(Producto, {
    foreignKey: 'producto_id',
    as: 'producto'
});
Producto.hasMany(Movimiento, {
    foreignKey: 'producto_id',
    as: 'movimientos'
});

// Movimiento pertenece a Usuario
Movimiento.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});
Usuario.hasMany(Movimiento, {
    foreignKey: 'usuario_id',
    as: 'movimientos'
});

module.exports = {
    sequelize,
    Usuario,
    Categoria,
    Proveedor,
    Producto,
    Movimiento
};
