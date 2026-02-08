const { Movimiento, Producto, Usuario } = require('../models');
const { Op, Sequelize } = require('sequelize');

class ReporteService {
    async obtenerEstadisticasGenerales() {
        const totalProductos = await Producto.count({ where: { activo: true } });
        const totalMovimientos = await Movimiento.count();
        const stockTotal = await Producto.sum('stock_actual', { where: { activo: true } });
        const valorStockTotal = await Producto.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.literal('stock_actual * precio_venta')), 'valorTotal']
            ],
            where: { activo: true },
            raw: true
        });

        return {
            totalProductos,
            totalMovimientos,
            stockTotal: stockTotal || 0,
            valorStockTotal: valorStockTotal[0]?.valorTotal || 0
        };
    }

    async obtenerMovimientosPorTipo(desde, hasta) {
        const movimientos = await Movimiento.findAll({
            where: {
                fecha_movimiento: {
                    [Op.between]: [new Date(desde), new Date(hasta)]
                }
            },
            attributes: [
                'tipo_movimiento',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad'],
                [Sequelize.fn('SUM', Sequelize.col('cantidad')), 'totalUnidades']
            ],
            group: ['tipo_movimiento'],
            raw: true
        });

        return movimientos;
    }

    async obtenerProductosMasMovidos(limite = 10, desde, hasta) {
        const productos = await Movimiento.findAll({
            attributes: [
                'producto_id',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalMovimientos']
            ],
            where: {
                fecha_movimiento: {
                    [Op.between]: [new Date(desde), new Date(hasta)]
                }
            },
            include: [
                { model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] }
            ],
            group: ['producto_id', 'producto.id'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
            limit: limite,
            subQuery: false,
            raw: true
        });

        return productos;
    }

    async obtenerValorPromedioPorCategoria() {
        const valores = await Producto.findAll({
            attributes: [
                'categoria_id',
                [Sequelize.fn('AVG', Sequelize.col('precio_venta')), 'precioPromedio'],
                [Sequelize.fn('AVG', Sequelize.col('stock_actual')), 'stockPromedio']
            ],
            where: { activo: true },
            group: ['categoria_id'],
            raw: true
        });

        return valores;
    }
}

module.exports = new ReporteService();