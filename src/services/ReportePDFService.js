/**
 * Servicio para generar reportes en PDF
 */

const PDFDocument = require('pdfkit');
const { Producto, Categoria, Proveedor, Movimiento, Usuario } = require('../models');
const { Op, Sequelize } = require('sequelize');

class ReportePDFService {

    /**
     * Generar reporte PDF de estadísticas generales
     */
    async generarReporteEstadisticas() {
        const doc = new PDFDocument({
            bufferPages: true,
            margin: 40,
            size: 'A4'
        });

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('REPORTE DE ESTADÍSTICAS GENERAL', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`, { align: 'center' });
        doc.moveDown();

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

        // Tabla de estadísticas
        doc.fontSize(12).font('Helvetica-Bold').text('Datos Generales', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total de Productos Activos: ${totalProductos}`, { indent: 20 });
        doc.text(`Total de Movimientos Registrados: ${totalMovimientos}`, { indent: 20 });
        doc.text(`Stock Total (unidades): ${stockTotal}`, { indent: 20 });
        doc.text(`Valor Total del Stock: $${parseFloat(valorStockTotal[0]?.valorTotal || 0).toFixed(2)}`, { indent: 20 });

        return doc;
    }

    /**
     * Generar reporte PDF de productos por categoría
     */
    async generarReporteProductosPorCategoria() {
        const doc = new PDFDocument({
            bufferPages: true,
            margin: 40,
            size: 'A4'
        });

        // Header
        doc.fontSize(18).font('Helvetica-Bold').text('REPORTE DE PRODUCTOS POR CATEGORÍA', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`, { align: 'center' });
        doc.moveDown();

        // Obtener datos
        const categorias = await Categoria.findAll({
            include: [{
                model: Producto,
                as: 'productos',
                where: { activo: true },
                required: false,
                attributes: ['id', 'codigo', 'nombre', 'precio_venta', 'stock_actual']
            }],
            order: [['nombre', 'ASC']]
        });

        // Iterar por categorías
        categorias.forEach((categoria, index) => {
            doc.fontSize(12).font('Helvetica-Bold').text(`${categoria.nombre}`, { underline: true });
            doc.moveDown(0.3);

            if (categoria.productos && categoria.productos.length > 0) {
                doc.fontSize(9).font('Helvetica');
                categoria.productos.forEach(prod => {
                    doc.text(`  • ${prod.codigo} - ${prod.nombre} | Stock: ${prod.stock_actual} | Precio: $${parseFloat(prod.precio_venta).toFixed(2)}`, { indent: 20 });
                });
            } else {
                doc.fontSize(9).font('Helvetica').text('  Sin productos', { indent: 20, color: '#999999' });
            }

            doc.moveDown(0.5);

            // Salto de página si es necesario
            if (index < categorias.length - 1) {
                doc.addPage();
            }
        });

        return doc;
    }

    /**
     * Generar reporte PDF de movimientos en rango de fechas
     */
    async generarReporteMovimientos(desde, hasta) {
        const doc = new PDFDocument({
            bufferPages: true,
            margin: 40,
            size: 'A4',
            layout: 'landscape'
        });

        // Header
        doc.fontSize(18).font('Helvetica-Bold').text('REPORTE DE MOVIMIENTOS DE INVENTARIO', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`Período: ${new Date(desde).toLocaleDateString('es-AR')} al ${new Date(hasta).toLocaleDateString('es-AR')}`, { align: 'center' });
        doc.moveDown();

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

        // Tabla de movimientos
        if (movimientos.length > 0) {
            const tableTop = doc.y + 10;
            const rowHeight = 20;
            const colWidth = 180;

            // Headers
            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Fecha', 40, tableTop);
            doc.text('Producto', 40 + colWidth, tableTop);
            doc.text('Tipo', 40 + colWidth * 2, tableTop);
            doc.text('Cantidad', 40 + colWidth * 2.5, tableTop);
            doc.text('Usuario', 40 + colWidth * 3.2, tableTop);

            doc.moveTo(40, tableTop + 15).lineTo(850, tableTop + 15).stroke();

            // Datos
            doc.fontSize(9).font('Helvetica');
            let currentY = tableTop + 20;

            movimientos.forEach(mov => {
                if (currentY > 500) {
                    doc.addPage();
                    currentY = 40;
                }

                const fecha = new Date(mov.fecha_movimiento).toLocaleDateString('es-AR');
                const tipo = mov.tipo_movimiento.toUpperCase();
                const tipoColor = tipo === 'ENTRADA' ? '#00AA00' : tipo === 'SALIDA' ? '#AA0000' : '#0000AA';

                doc.text(fecha, 40, currentY);
                doc.text(mov.producto.nombre, 40 + colWidth, currentY, { width: 150 });
                doc.fillColor(tipoColor).text(tipo, 40 + colWidth * 2, currentY);
                doc.fillColor('#000000').text(mov.cantidad.toString(), 40 + colWidth * 2.5, currentY);
                doc.text(mov.usuario.nombre, 40 + colWidth * 3.2, currentY);

                currentY += rowHeight;
            });
        } else {
            doc.fontSize(12).font('Helvetica').text('No hay movimientos en el período especificado', { align: 'center' });
        }

        return doc;
    }

    /**
     * Generar reporte PDF de alertas de stock
     */
    async generarReporteAlertasStock() {
        const doc = new PDFDocument({
            bufferPages: true,
            margin: 40,
            size: 'A4'
        });

        // Header
        doc.fontSize(18).font('Helvetica-Bold').text('REPORTE DE ALERTAS DE STOCK', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`, { align: 'center' });
        doc.moveDown();

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
            minimo: [],
            normal: []
        };

        productos.forEach(prod => {
            if (prod.stock_actual <= prod.stock_critico) {
                alertas.critico.push(prod);
            } else if (prod.stock_actual <= prod.stock_minimo) {
                alertas.minimo.push(prod);
            } else {
                alertas.normal.push(prod);
            }
        });

        // Stock Crítico
        doc.fontSize(12).font('Helvetica-Bold').text('🔴 STOCK CRÍTICO', { color: '#AA0000', underline: true });
        doc.moveDown(0.3);
        if (alertas.critico.length > 0) {
            doc.fontSize(9).font('Helvetica');
            alertas.critico.forEach(prod => {
                doc.text(`  ${prod.codigo} - ${prod.nombre} | Stock: ${prod.stock_actual}/${prod.stock_critico} | Categoría: ${prod.categoria.nombre}`, { indent: 20, color: '#AA0000' });
            });
        } else {
            doc.fontSize(9).font('Helvetica').text('  ✓ Sin alertas críticas', { indent: 20, color: '#00AA00' });
        }
        doc.moveDown(0.5);

        // Stock Mínimo
        doc.fontSize(12).font('Helvetica-Bold').text('🟡 STOCK MÍNIMO', { color: '#FFAA00', underline: true });
        doc.moveDown(0.3);
        if (alertas.minimo.length > 0) {
            doc.fontSize(9).font('Helvetica');
            alertas.minimo.forEach(prod => {
                doc.text(`  ${prod.codigo} - ${prod.nombre} | Stock: ${prod.stock_actual}/${prod.stock_minimo} | Categoría: ${prod.categoria.nombre}`, { indent: 20, color: '#FFAA00' });
            });
        } else {
            doc.fontSize(9).font('Helvetica').text('  ✓ Sin alertas de mínimo', { indent: 20, color: '#00AA00' });
        }

        return doc;
    }
}

module.exports = new ReportePDFService();
