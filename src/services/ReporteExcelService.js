/**
 * Servicio para generar reportes en Excel (XLS)
 */

const ExcelJS = require('exceljs');
const { Producto, Categoria, Proveedor, Movimiento, Usuario } = require('../models');
const { Op, Sequelize } = require('sequelize');

class ReporteExcelService {

    /**
     * Generar reporte Excel de productos
     */
    async generarReporteProductos() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Productos');

        // Obtener datos
        const productos = await Producto.findAll({
            include: [
                { model: Categoria, as: 'categoria', attributes: ['nombre'] },
                { model: Proveedor, as: 'proveedor', attributes: ['nombre'] }
            ],
            where: { activo: true },
            order: [['nombre', 'ASC']]
        });

        // Headers
        worksheet.columns = [
            { header: 'Código', key: 'codigo', width: 12 },
            { header: 'Nombre', key: 'nombre', width: 25 },
            { header: 'Categoría', key: 'categoria', width: 15 },
            { header: 'Proveedor', key: 'proveedor', width: 15 },
            { header: 'P. Compra', key: 'precio_compra', width: 12 },
            { header: 'P. Venta', key: 'precio_venta', width: 12 },
            { header: 'Stock Actual', key: 'stock_actual', width: 13 },
            { header: 'Stock Mín', key: 'stock_minimo', width: 12 },
            { header: 'Stock Crit', key: 'stock_critico', width: 12 },
            { header: 'Unidad Medida', key: 'unidad_medida', width: 13 },
            { header: 'Ubicación', key: 'ubicacion', width: 15 }
        ];

        // Formatear header
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };

        // Agregar datos
        productos.forEach(prod => {
            worksheet.addRow({
                codigo: prod.codigo,
                nombre: prod.nombre,
                categoria: prod.categoria.nombre,
                proveedor: prod.proveedor.nombre,
                precio_compra: parseFloat(prod.precio_compra).toFixed(2),
                precio_venta: parseFloat(prod.precio_venta).toFixed(2),
                stock_actual: prod.stock_actual,
                stock_minimo: prod.stock_minimo,
                stock_critico: prod.stock_critico,
                unidad_medida: prod.unidad_medida,
                ubicacion: prod.ubicacion
            });
        });

        // Formatear números
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
                row.getCell('precio_compra').numFmt = '$#,##0.00';
                row.getCell('precio_venta').numFmt = '$#,##0.00';
                row.getCell('stock_actual').alignment = { horizontal: 'center' };
            }
        });

        return workbook;
    }

    /**
     * Generar reporte Excel de movimientos
     */
    async generarReporteMovimientos(desde, hasta) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Movimientos');

        // Obtener datos
        const movimientos = await Movimiento.findAll({
            where: {
                fecha_movimiento: {
                    [Op.between]: [new Date(desde), new Date(hasta)]
                }
            },
            include: [
                { model: Producto, as: 'producto', attributes: ['codigo', 'nombre'] },
                { model: Usuario, as: 'usuario', attributes: ['nombre'] }
            ],
            order: [['fecha_movimiento', 'DESC']]
        });

        // Headers
        worksheet.columns = [
            { header: 'Fecha', key: 'fecha_movimiento', width: 15 },
            { header: 'Producto', key: 'producto_nombre', width: 25 },
            { header: 'Código', key: 'producto_codigo', width: 12 },
            { header: 'Tipo', key: 'tipo_movimiento', width: 12 },
            { header: 'Cantidad', key: 'cantidad', width: 12 },
            { header: 'Usuario', key: 'usuario_nombre', width: 15 },
            { header: 'Motivo', key: 'motivo', width: 20 },
            { header: 'Observaciones', key: 'observaciones', width: 30 }
        ];

        // Formatear header
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };

        // Agregar datos
        movimientos.forEach(mov => {
            const row = worksheet.addRow({
                fecha_movimiento: new Date(mov.fecha_movimiento).toLocaleDateString('es-AR'),
                producto_nombre: mov.producto.nombre,
                producto_codigo: mov.producto.codigo,
                tipo_movimiento: mov.tipo_movimiento.toUpperCase(),
                cantidad: mov.cantidad,
                usuario_nombre: mov.usuario.nombre,
                motivo: mov.motivo,
                observaciones: mov.observaciones
            });

            // Color por tipo de movimiento
            const tipoCell = row.getCell('tipo_movimiento');
            if (mov.tipo_movimiento === 'entrada') {
                tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD4EDDA' } };
            } else if (mov.tipo_movimiento === 'salida') {
                tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8D7D7' } };
            } else if (mov.tipo_movimiento === 'ajuste') {
                tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCFE2FF' } };
            }

            row.getCell('cantidad').alignment = { horizontal: 'center' };
        });

        return workbook;
    }

    /**
     * Generar reporte Excel de alertas de stock
     */
    async generarReporteAlertasStock() {
        const workbook = new ExcelJS.Workbook();

        // Obtener datos
        const productos = await Producto.findAll({
            include: [
                { model: Categoria, as: 'categoria', attributes: ['nombre'] },
                { model: Proveedor, as: 'proveedor', attributes: ['nombre'] }
            ],
            where: { activo: true }
        });

        // Separar por alerta
        const alertas = {
            critico: [],
            minimo: []
        };

        productos.forEach(prod => {
            if (prod.stock_actual <= prod.stock_critico) {
                alertas.critico.push(prod);
            } else if (prod.stock_actual <= prod.stock_minimo) {
                alertas.minimo.push(prod);
            }
        });

        // Sheet de alertas críticas
        if (alertas.critico.length > 0) {
            const sheet1 = workbook.addWorksheet('Stock Crítico');
            sheet1.columns = [
                { header: 'Código', key: 'codigo', width: 12 },
                { header: 'Nombre', key: 'nombre', width: 25 },
                { header: 'Stock Actual', key: 'stock_actual', width: 13 },
                { header: 'Stock Crítico', key: 'stock_critico', width: 13 },
                { header: 'Categoría', key: 'categoria', width: 15 },
                { header: 'Proveedor', key: 'proveedor', width: 15 },
                { header: 'P. Venta', key: 'precio_venta', width: 12 }
            ];

            sheet1.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            sheet1.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFAA0000' } };

            alertas.critico.forEach(prod => {
                const row = sheet1.addRow({
                    codigo: prod.codigo,
                    nombre: prod.nombre,
                    stock_actual: prod.stock_actual,
                    stock_critico: prod.stock_critico,
                    categoria: prod.categoria.nombre,
                    proveedor: prod.proveedor.nombre,
                    precio_venta: parseFloat(prod.precio_venta).toFixed(2)
                });
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE0E0' } };
            });
        }

        // Sheet de alertas de mínimo
        if (alertas.minimo.length > 0) {
            const sheet2 = workbook.addWorksheet('Stock Mínimo');
            sheet2.columns = [
                { header: 'Código', key: 'codigo', width: 12 },
                { header: 'Nombre', key: 'nombre', width: 25 },
                { header: 'Stock Actual', key: 'stock_actual', width: 13 },
                { header: 'Stock Mínimo', key: 'stock_minimo', width: 13 },
                { header: 'Categoría', key: 'categoria', width: 15 },
                { header: 'Proveedor', key: 'proveedor', width: 15 },
                { header: 'P. Venta', key: 'precio_venta', width: 12 }
            ];

            sheet2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            sheet2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9800' } };

            alertas.minimo.forEach(prod => {
                const row = sheet2.addRow({
                    codigo: prod.codigo,
                    nombre: prod.nombre,
                    stock_actual: prod.stock_actual,
                    stock_minimo: prod.stock_minimo,
                    categoria: prod.categoria.nombre,
                    proveedor: prod.proveedor.nombre,
                    precio_venta: parseFloat(prod.precio_venta).toFixed(2)
                });
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF80' } };
            });
        }

        return workbook;
    }

    /**
     * Generar reporte Excel de estadísticas generales
     */
    async generarReporteEstadisticas() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Estadísticas');

        // Obtener datos
        const totalProductos = await Producto.count({ where: { activo: true } });
        const totalMovimientos = await Movimiento.count();
        const stockTotal = await Producto.sum('stock_actual', { where: { activo: true } }) || 0;
        const valorStockTotal = await Producto.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.literal('stock_actual * precio_venta')), 'valorTotal']
            ],
            where: { activo: true },
            raw: true
        });

        // Movimientos por tipo
        const movimientosPorTipo = await Movimiento.findAll({
            attributes: [
                'tipo_movimiento',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad']
            ],
            group: ['tipo_movimiento'],
            raw: true
        });

        // Agregar datos generales
        worksheet.columns = [
            { header: 'Métrica', key: 'metrica', width: 30 },
            { header: 'Valor', key: 'valor', width: 20 }
        ];

        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };

        worksheet.addRow({ metrica: 'Total Productos Activos', valor: totalProductos });
        worksheet.addRow({ metrica: 'Total Movimientos Registrados', valor: totalMovimientos });
        worksheet.addRow({ metrica: 'Stock Total (unidades)', valor: stockTotal });
        worksheet.addRow({ metrica: 'Valor Total Stock', valor: `$${parseFloat(valorStockTotal[0]?.valorTotal || 0).toFixed(2)}` });

        // Agregar datos de movimientos por tipo
        worksheet.moveDown(2);
        const tipoRow = worksheet.addRow({
            metrica: 'MOVIMIENTOS POR TIPO',
            valor: ''
        });
        tipoRow.font = { bold: true };

        movimientosPorTipo.forEach(mov => {
            worksheet.addRow({
                metrica: `  ${mov.tipo_movimiento.charAt(0).toUpperCase() + mov.tipo_movimiento.slice(1)}`,
                valor: mov.cantidad
            });
        });

        return workbook;
    }
}

module.exports = new ReporteExcelService();
