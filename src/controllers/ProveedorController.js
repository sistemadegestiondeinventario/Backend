const { Proveedor, Producto } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, buscar } = req.query;
        const offset = (pagina - 1) * limite;

        const where = { activo: true };

        if (buscar) {
            where[Op.or] = [
                { nombre: { [Op.iLike]: `%${buscar}%` } },
                { email: { [Op.iLike]: `%${buscar}%` } },
                { cuit: { [Op.iLike]: `%${buscar}%` } }
            ];
        }

        const { count, rows } = await Proveedor.findAndCountAll({
            where,
            offset,
            limit: parseInt(limite),
            order: [['nombre', 'ASC']]
        });

        res.json({
            proveedores: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un proveedor con sus productos
exports.obtenerProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const proveedor = await Proveedor.findByPk(id, {
            include: [
                {
                    model: Producto,
                    as: 'productos',
                    where: { activo: true },
                    required: false,
                    attributes: ['id', 'codigo', 'nombre', 'precio_compra', 'precio_venta', 'stock_actual']
                }
            ]
        });

        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear nuevo proveedor
exports.crearProveedor = async (req, res) => {
    try {
        const { nombre, contacto, telefono, email, direccion, cuit, condiciones_pago } = req.body;

        if (!nombre || !cuit) {
            return res.status(400).json({ error: 'Nombre y CUIT son requeridos' });
        }

        const proveedor = await Proveedor.create({
            nombre,
            contacto,
            telefono,
            email,
            direccion,
            cuit,
            condiciones_pago
        });

        res.status(201).json(proveedor);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'El CUIT ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Actualizar proveedor
exports.actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, contacto, telefono, email, direccion, cuit, condiciones_pago, activo } = req.body;

        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        await proveedor.update({
            nombre,
            contacto,
            telefono,
            email,
            direccion,
            cuit,
            condiciones_pago,
            activo
        });

        res.json(proveedor);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'El CUIT ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Desactivar proveedor
exports.desactivarProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        await proveedor.update({ activo: false });

        res.json({ mensaje: 'Proveedor desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener productos de un proveedor
exports.obtenerProductosPorProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { pagina = 1, limite = 10 } = req.query;
        const offset = (pagina - 1) * limite;

        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        const { count, rows } = await Producto.findAndCountAll({
            where: { proveedor_id: id, activo: true },
            offset,
            limit: parseInt(limite),
            order: [['nombre', 'ASC']]
        });

        res.json({
            proveedor,
            productos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
