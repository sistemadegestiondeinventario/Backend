const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    contacto: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cuit: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    condiciones_pago: {
        type: DataTypes.STRING(100),
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
    tableName: 'proveedores'
});

module.exports = Proveedor;
