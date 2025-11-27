const { Proveedor, Producto } = require('../models');
const { Op } = require('sequelize');

class ProveedorService {
    async obtenerTodos(filtros = {}) {
        const { pagina = 1, limite = 10, buscar } = filtros;
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

        return {
            proveedores: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        };
    }

    async obtenerPorId(id) {
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
            throw new Error('Proveedor no encontrado');
        }

        return proveedor;
    }

    async crear(datos) {
        if (!datos.nombre || !datos.cuit) {
            throw new Error('Nombre y CUIT son requeridos');
        }

        const proveedor = await Proveedor.create(datos);
        return proveedor;
    }

    async actualizar(id, datos) {
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }

        await proveedor.update(datos);
        return proveedor;
    }

    async eliminar(id) {
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }

        await proveedor.update({ activo: false });
        return { mensaje: 'Proveedor desactivado correctamente' };
    }
}

module.exports = new ProveedorService();
