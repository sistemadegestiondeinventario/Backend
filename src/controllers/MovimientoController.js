const { Movimiento, Producto, Usuario } = require('../models');
const { Op } = require('sequelize');

// Registrar un movimiento (entrada, salida o ajuste)
exports.registrarMovimiento = async (req, res) => {
    try {
        const { producto_id, tipo_movimiento, cantidad, motivo, observaciones } = req.body;
        const usuario_id = req.usuario.id;

        if (!producto_id || !tipo_movimiento || !cantidad) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        if (!['entrada', 'salida', 'ajuste'].includes(tipo_movimiento)) {
            return res.status(400).json({ error: 'Tipo de movimiento inválido' });
        }

        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Crear el movimiento
        const movimiento = await Movimiento.create({
            producto_id,
            tipo_movimiento,
            cantidad,
            usuario_id,
            motivo,
            observaciones
        });

        // Actualizar stock del producto
        let nuevoStock = producto.stock_actual;

        if (tipo_movimiento === 'entrada') {
            nuevoStock += cantidad;
        } else if (tipo_movimiento === 'salida') {
            if (nuevoStock < cantidad) {
                // Revertir el movimiento
                await movimiento.destroy();
                return res.status(400).json({ error: 'Stock insuficiente para la salida' });
            }
            nuevoStock -= cantidad;
        } else if (tipo_movimiento === 'ajuste') {
            nuevoStock = cantidad; // En ajuste, la cantidad es el nuevo stock
        }

        await producto.update({ stock_actual: nuevoStock });

        const movimientoCompleto = await Movimiento.findByPk(movimiento.id, {
            include: [
                { model: Producto, as: 'producto', attributes: ['codigo', 'nombre'] },
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
            ]
        });

        res.status(201).json(movimientoCompleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener historial de movimientos con filtros
exports.obtenerMovimientos = async (req, res) => {
    try {
        const { pagina = 1, limite = 20, producto_id, tipo_movimiento, desde, hasta } = req.query;
        const offset = (pagina - 1) * limite;

        const where = {};

        if (producto_id) {
            where.producto_id = producto_id;
        }

        if (tipo_movimiento) {
            where.tipo_movimiento = tipo_movimiento;
        }

        if (desde || hasta) {
            where.fecha_movimiento = {};
            if (desde) {
                where.fecha_movimiento[Op.gte] = new Date(desde);
            }
            if (hasta) {
                where.fecha_movimiento[Op.lte] = new Date(hasta);
            }
        }

        const { count, rows } = await Movimiento.findAndCountAll({
            where,
            include: [
                { model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] },
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
            ],
            offset,
            limit: parseInt(limite),
            order: [['fecha_movimiento', 'DESC']]
        });

        res.json({
            movimientos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener historial de movimientos de un producto específico
exports.obtenerMovimientosProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { pagina = 1, limite = 20 } = req.query;
        const offset = (pagina - 1) * limite;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const { count, rows } = await Movimiento.findAndCountAll({
            where: { producto_id: id },
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
            ],
            offset,
            limit: parseInt(limite),
            order: [['fecha_movimiento', 'DESC']]
        });

        res.json({
            producto,
            movimientos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener alertas de stock (mínimo y crítico)
exports.obtenerAlertasStock = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            where: {
                activo: true,
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.col('stock_actual'),
                        Op.lte,
                        Sequelize.col('stock_critico')
                    ),
                    Sequelize.where(
                        Sequelize.col('stock_actual'),
                        Op.lte,
                        Sequelize.col('stock_minimo')
                    )
                ]
            },
            attributes: ['id', 'codigo', 'nombre', 'stock_actual', 'stock_minimo', 'stock_critico'],
            order: [['stock_actual', 'ASC']]
        });

        const alertas = productos.map(p => ({
            ...p.dataValues,
            nivelAlerta: p.stock_actual <= p.stock_critico ? 'crítico' : 'bajo'
        }));

        res.json(alertas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener resumen de movimientos por tipo
exports.obtenerResumenMovimientos = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        const where = {};

        if (desde || hasta) {
            where.fecha_movimiento = {};
            if (desde) {
                where.fecha_movimiento[Op.gte] = new Date(desde);
            }
            if (hasta) {
                where.fecha_movimiento[Op.lte] = new Date(hasta);
            }
        }

        const resumen = await Movimiento.findAll({
            where,
            attributes: [
                'tipo_movimiento',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad'],
                [Sequelize.fn('SUM', Sequelize.col('cantidad')), 'total']
            ],
            group: ['tipo_movimiento'],
            raw: true
        });

        res.json(resumen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
