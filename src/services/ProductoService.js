const { Producto, Categoria, Proveedor } = require('../models');
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
}

module.exports = new ProductoService();
