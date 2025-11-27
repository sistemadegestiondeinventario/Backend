const { Movimiento, Producto, Usuario } = require('../models');
const { Op } = require('sequelize');

class MovimientoService {
    async registrar(datos) {
        const { producto_id, tipo_movimiento, cantidad, usuario_id, motivo, observaciones } = datos;

        if (!producto_id || !tipo_movimiento || !cantidad) {
            throw new Error('Faltan campos requeridos');
        }

        if (!['entrada', 'salida', 'ajuste'].includes(tipo_movimiento)) {
            throw new Error('Tipo de movimiento inválido');
        }

        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

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
                await movimiento.destroy();
                throw new Error('Stock insuficiente para la salida');
            }
            nuevoStock -= cantidad;
        } else if (tipo_movimiento === 'ajuste') {
            nuevoStock = cantidad;
        }

        await producto.update({ stock_actual: nuevoStock });

        return await this.obtenerPorId(movimiento.id);
    }

    async obtenerTodos(filtros = {}) {
        const { pagina = 1, limite = 20, producto_id, tipo_movimiento, desde, hasta } = filtros;
        const offset = (pagina - 1) * limite;

        const where = {};

        if (producto_id) where.producto_id = producto_id;
        if (tipo_movimiento) where.tipo_movimiento = tipo_movimiento;

        if (desde || hasta) {
            where.fecha_movimiento = {};
            if (desde) where.fecha_movimiento[Op.gte] = new Date(desde);
            if (hasta) where.fecha_movimiento[Op.lte] = new Date(hasta);
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

        return {
            movimientos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        };
    }

    async obtenerPorId(id) {
        const movimiento = await Movimiento.findByPk(id, {
            include: [
                { model: Producto, as: 'producto' },
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
            ]
        });

        if (!movimiento) {
            throw new Error('Movimiento no encontrado');
        }

        return movimiento;
    }

    async obtenerHistorialProducto(producto_id, filtros = {}) {
        const { pagina = 1, limite = 20 } = filtros;
        const offset = (pagina - 1) * limite;

        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        const { count, rows } = await Movimiento.findAndCountAll({
            where: { producto_id },
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
            ],
            offset,
            limit: parseInt(limite),
            order: [['fecha_movimiento', 'DESC']]
        });

        return {
            producto,
            movimientos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        };
    }
}

module.exports = new MovimientoService();
