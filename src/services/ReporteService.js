const { Producto, Movimiento, Categoria, Usuario } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class ReporteService {
    async obtenerEstadisticasGenerales() {
        try {
            // Total de productos
            const totalProductos = await Producto.count({ where: { activo: true } });

            // Total de movimientos
            const totalMovimientos = await Movimiento.count();

            // Movimientos por tipo
            const movimientosPorTipo = await Movimiento.findAll({
                attributes: [
                    'tipo_movimiento',
                    [fn('COUNT', col('id')), 'cantidad']
                ],
                group: ['tipo_movimiento'],
                raw: true
            });

            // Productos con stock bajo/crítico
            const productosAlerta = await Producto.count({
                where: {
                    activo: true,
                    [Op.or]: [
                        { stock_actual: { [Op.lte]: literal('stock_critico') } }
                    ]
                }
            });

            // Valor total en inventario
            const valorTotal = await Producto.findOne({
                attributes: [
                    [fn('SUM', fn('*', col('precio_venta'), col('stock_actual'))), 'valor_total']
                ],
                where: { activo: true },
                raw: true
            });

            return {
                totalProductos,
                totalMovimientos,
                movimientosPorTipo: {
                    entrada: movimientosPorTipo.find(m => m.tipo_movimiento === 'entrada')?.cantidad || 0,
                    salida: movimientosPorTipo.find(m => m.tipo_movimiento === 'salida')?.cantidad || 0,
                    ajuste: movimientosPorTipo.find(m => m.tipo_movimiento === 'ajuste')?.cantidad || 0
                },
                productosAlerta,
                valorTotal: parseFloat(valorTotal?.valor_total || 0)
            };
        } catch (error) {
            throw new Error('Error al obtener estadísticas: ' + error.message);
        }
    }

    async obtenerMovimientosPorTipo(desde, hasta) {
        try {
            const movimientos = await Movimiento.findAll({
                where: {
                    fecha_movimiento: {
                        [Op.between]: [new Date(desde), new Date(hasta)]
                    }
                },
                attributes: [
                    'tipo_movimiento',
                    [fn('COUNT', col('id')), 'cantidad'],
                    [fn('SUM', col('cantidad')), 'total_cantidad']
                ],
                group: ['tipo_movimiento'],
                raw: true
            });

            return {
                periodo: { desde, hasta },
                datos: movimientos.map(m => ({
                    tipo: m.tipo_movimiento,
                    cantidad: parseInt(m.cantidad),
                    totalCantidad: parseInt(m.total_cantidad)
                }))
            };
        } catch (error) {
            throw new Error('Error al obtener movimientos por tipo: ' + error.message);
        }
    }

    async obtenerProductosMasMovidos(limite, desde, hasta) {
        try {
            const productos = await Movimiento.findAll({
                where: {
                    fecha_movimiento: {
                        [Op.between]: [new Date(desde), new Date(hasta)]
                    }
                },
                attributes: [
                    'producto_id',
                    [fn('COUNT', col('id')), 'movimientos_count'],
                    [fn('SUM', col('cantidad')), 'cantidad_total']
                ],
                include: [
                    {
                        model: Producto,
                        as: 'producto',
                        attributes: ['id', 'codigo', 'nombre']
                    }
                ],
                group: ['producto_id', 'producto.id'],
                order: [[fn('COUNT', col('id')), 'DESC']],
                limit: parseInt(limite),
                subQuery: false,
                raw: false
            });

            return {
                limite,
                periodo: { desde, hasta },
                datos: productos.map(p => ({
                    producto: p.producto,
                    movimientos: parseInt(p.dataValues.movimientos_count),
                    cantidadTotal: parseInt(p.dataValues.cantidad_total)
                }))
            };
        } catch (error) {
            throw new Error('Error al obtener productos más movidos: ' + error.message);
        }
    }

    async obtenerValorPromedioPorCategoria() {
        try {
            const categorias = await Categoria.findAll({
                attributes: [
                    'id',
                    'nombre',
                    [fn('AVG', col('precio_venta')), 'precio_promedio'],
                    [fn('COUNT', col('id')), 'total_productos'],
                    [fn('SUM', fn('*', col('precio_venta'), col('stock_actual'))), 'valor_total']
                ],
                include: [
                    {
                        model: Producto,
                        as: 'productos',
                        attributes: [],
                        where: { activo: true },
                        required: false
                    }
                ],
                group: ['Categoria.id'],
                subQuery: false,
                raw: true
            });

            return {
                datos: categorias.map(c => ({
                    categoria: {
                        id: c.id,
                        nombre: c.nombre
                    },
                    precioPromedio: parseFloat(c.precio_promedio) || 0,
                    totalProductos: parseInt(c.total_productos),
                    valorTotal: parseFloat(c.valor_total) || 0
                }))
            };
        } catch (error) {
            throw new Error('Error al obtener valor promedio por categoría: ' + error.message);
        }
    }
}

module.exports = new ReporteService();
