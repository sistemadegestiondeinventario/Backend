const sequelize = require('../config/database');

const Categoria = require('./Categoria');
const Proveedor = require('./Proveedor');
const Producto = require('./Producto');
const Movimiento = require('./Movimiento');
const Usuario = require('./Usuario');

// Associations
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'categoria_id', as: 'productos' });

Producto.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(Producto, { foreignKey: 'proveedor_id', as: 'productos' });

Movimiento.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Movimiento, { foreignKey: 'producto_id', as: 'movimientos' });

Movimiento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Movimiento, { foreignKey: 'usuario_id', as: 'movimientos' });

module.exports = {
    sequelize,
    Categoria,
    Proveedor,
    Producto,
    Movimiento,
    Usuario
};
