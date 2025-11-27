const { Categoria, Producto } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            attributes: ['id', 'nombre', 'descripcion', 'fecha_creacion'],
            order: [['nombre', 'ASC']]
        });

        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una categoría con sus productos
exports.obtenerCategoria = async (req, res) => {
    try {
        const { id } = req.params;

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
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear nueva categoría
exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        const categoria = await Categoria.create({
            nombre,
            descripcion
        });

        res.status(201).json(categoria);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        await categoria.update({ nombre, descripcion });

        res.json(categoria);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la categoría tiene productos
        const productosCount = await Producto.count({
            where: { categoria_id: id, activo: true }
        });

        if (productosCount > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar una categoría con productos asignados'
            });
        }

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        await categoria.destroy();

        res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener productos por categoría con paginación
exports.obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { pagina = 1, limite = 10 } = req.query;
        const offset = (pagina - 1) * limite;

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const { count, rows } = await Producto.findAndCountAll({
            where: { categoria_id: id, activo: true },
            offset,
            limit: parseInt(limite),
            order: [['nombre', 'ASC']]
        });

        res.json({
            categoria,
            productos: rows,
            total: count,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(count / limite)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
