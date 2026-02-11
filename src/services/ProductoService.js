const { Producto, Categoria, Proveedor, Movimiento, Usuario } = require('../models');
const { Op } = require('sequelize');

class ProductoService {
    async obtenerTodos(filtros = {}) {
        const { pagina = 1, limite = 10, buscar, categoria_id, proveedor_id } = filtros;
        const offset = (pagina - 1) * limite;

        const where = { activo: true };

        if (buscar) {
            where[Op.or] = [
                { nombre: { [Op.iLike]: `%${buscar}%` } },
                { codigo: { [Op.iLike]: `%${buscar}%` } }
            ];
        }

        if (categoria_id) where.categoria_id = categoria_id;
        if (proveedor_id) where.proveedor_id = proveedor_id;

        const { count, rows } = await Producto.findAndCountAll({
            where,
            include: [
                { model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] },
                { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
            ],
            offset,
            limit: parseInt(limite),
            order: [['fecha_creacion', 'DESC']]
        });

        return {
            productos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        };
    }

    async obtenerPorId(id) {
        const producto = await Producto.findByPk(id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Proveedor, as: 'proveedor' }
            ]
        });

        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        return producto;
    }

    async crear(datos) {
        if (!datos.codigo || !datos.nombre || !datos.categoria_id || !datos.proveedor_id) {
            throw new Error('Faltan campos requeridos');
        }

        if (datos.precio_venta < datos.precio_compra) {
            throw new Error('El precio de venta debe ser mayor al de compra');
        }

        const producto = await Producto.create(datos);

        return await this.obtenerPorId(producto.id);
    }

    async actualizar(id, datos) {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        if (datos.precio_venta && datos.precio_compra && datos.precio_venta < datos.precio_compra) {
            throw new Error('El precio de venta debe ser mayor al de compra');
        }

        await producto.update(datos);

        return await this.obtenerPorId(id);
    }

    async eliminar(id) {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        await producto.update({ activo: false });
        return { mensaje: 'Producto eliminado correctamente' };
    }

    async obtenerAlertasStock() {
        const productos = await Producto.findAll({
            include: [
                { model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] },
                { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
            ],
            where: { activo: true },
            raw: false
        });

        const alertas = {
            critico: [],
            minimo: [],
            normal: []
        };

        productos.forEach(producto => {
            if (producto.stock_actual <= producto.stock_critico) {
                alertas.critico.push({
                    id: producto.id,
                    codigo: producto.codigo,
                    nombre: producto.nombre,
                    stock_actual: producto.stock_actual,
                    stock_critico: producto.stock_critico,
                    categoria: producto.categoria.nombre,
                    proveedor: producto.proveedor.nombre
                });
            } else if (producto.stock_actual <= producto.stock_minimo) {
                alertas.minimo.push({
                    id: producto.id,
                    codigo: producto.codigo,
                    nombre: producto.nombre,
                    stock_actual: producto.stock_actual,
                    stock_minimo: producto.stock_minimo,
                    categoria: producto.categoria.nombre,
                    proveedor: producto.proveedor.nombre
                });
            } else {
                alertas.normal.push({
                    id: producto.id,
                    codigo: producto.codigo,
                    nombre: producto.nombre,
                    stock_actual: producto.stock_actual
                });
            }
        });

        return alertas;
    }

    async obtenerHistorialProducto(producto_id, filtros = {}) {
        const { pagina = 1, limite = 20, tipo_movimiento } = filtros;
        const offset = (pagina - 1) * limite;

        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        const where = { producto_id };
        if (tipo_movimiento) where.tipo_movimiento = tipo_movimiento;

        const { count, rows } = await Movimiento.findAndCountAll({
            where,
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
            ],
            offset,
            limit: parseInt(limite),
            order: [['fecha_movimiento', 'DESC']]
        });

        return {
            producto: {
                id: producto.id,
                codigo: producto.codigo,
                nombre: producto.nombre,
                stock_actual: producto.stock_actual
            },
            movimientos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        };
    }
}

module.exports = new ProductoService();
