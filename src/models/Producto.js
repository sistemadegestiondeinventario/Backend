const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categorias',
            key: 'id'
        }
    },
    proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'proveedores',
            key: 'id'
        }
    },
    precio_compra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    precio_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock_actual: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    stock_minimo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_critico: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unidad_medida: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'unidad'
    },
    ubicacion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false,
    tableName: 'productos'
});

module.exports = Producto;
