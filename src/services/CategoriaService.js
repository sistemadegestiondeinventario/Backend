const { Categoria, Producto } = require('../models');

class CategoriaService {
    async obtenerTodos() {
        return await Categoria.findAll({
            order: [['nombre', 'ASC']]
        });
    }

    async obtenerPorId(id) {
        const categoria = await Categoria.findByPk(id, {
            include: [
                {
                    model: Producto,
                    as: 'productos',
                    where: { activo: true },
                    required: false,
                    attributes: ['id', 'codigo', 'nombre', 'precio_venta', 'stock_actual']
                }
            ]
        });

        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }

        return categoria;
    }

    async crear(datos) {
        if (!datos.nombre) {
            throw new Error('El nombre es requerido');
        }

        const categoria = await Categoria.create(datos);
        return categoria;
    }

    async actualizar(id, datos) {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }

        await categoria.update(datos);
        return categoria;
    }

    async eliminar(id) {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }

        const productosCount = await Producto.count({
            where: { categoria_id: id, activo: true }
        });

        if (productosCount > 0) {
            throw new Error('No se puede eliminar una categoría con productos asignados');
        }

        await categoria.destroy();
        return { mensaje: 'Categoría eliminada correctamente' };
    }
}

module.exports = new CategoriaService();
