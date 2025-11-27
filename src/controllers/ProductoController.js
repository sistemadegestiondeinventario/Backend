const { Producto, Categoria, Proveedor, Movimiento, Usuario } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Obtener todos los productos con paginación y filtros
exports.obtenerProductos = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, categoria, proveedor, stock, buscar } = req.query;
        const offset = (pagina - 1) * limite;

        const where = { activo: true };

        // Filtro de búsqueda
        if (buscar) {
            where[Op.or] = [
                { nombre: { [Op.iLike]: `%${buscar}%` } },
                { codigo: { [Op.iLike]: `%${buscar}%` } },
                { descripcion: { [Op.iLike]: `%${buscar}%` } }
            ];
        }

        // Filtro por categoría
        if (categoria) {
            where.categoria_id = categoria;
        }

        // Filtro por proveedor
        if (proveedor) {
            where.proveedor_id = proveedor;
        }

        // Filtro por stock
        if (stock === 'bajo') {
            where.stock_actual = { [Op.lt]: Sequelize.literal('stock_minimo') };
        } else if (stock === 'critico') {
            where.stock_actual = { [Op.lt]: Sequelize.literal('stock_critico') };
        }

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

        res.json({
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

// Obtener un producto individual con historial de movimientos
exports.obtenerProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Proveedor, as: 'proveedor' },
                {
                    model: Movimiento,
                    as: 'movimientos',
                    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }],
                    order: [['fecha_movimiento', 'DESC']],
                    limit: 50
                }
            ]
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear nuevo producto
exports.crearProducto = async (req, res) => {
    try {
        const { codigo, nombre, descripcion, categoria_id, proveedor_id, precio_compra, precio_venta, stock_minimo, stock_critico, unidad_medida, ubicacion, imagen } = req.body;

        // Validaciones
        if (!codigo || !nombre || !categoria_id || !proveedor_id || !precio_compra || !precio_venta || !stock_minimo || !stock_critico) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        if (precio_venta < precio_compra) {
            return res.status(400).json({ error: 'El precio de venta debe ser mayor al de compra' });
        }

        if (stock_critico > stock_minimo) {
            return res.status(400).json({ error: 'Stock crítico debe ser menor a stock mínimo' });
        }

        const producto = await Producto.create({
            codigo,
            nombre,
            descripcion,
            categoria_id,
            proveedor_id,
            precio_compra,
            precio_venta,
            stock_minimo,
            stock_critico,
            unidad_medida: unidad_medida || 'unidad',
            ubicacion,
            imagen
        });

        const productoCompleto = await Producto.findByPk(producto.id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Proveedor, as: 'proveedor' }
            ]
        });

        res.status(201).json(productoCompleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizar = req.body;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Validaciones
        if (actualizar.precio_venta && actualizar.precio_compra && actualizar.precio_venta < actualizar.precio_compra) {
            return res.status(400).json({ error: 'El precio de venta debe ser mayor al de compra' });
        }

        await producto.update(actualizar);

        const productoActualizado = await Producto.findByPk(id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Proveedor, as: 'proveedor' }
            ]
        });

        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar (desactivar) producto
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.update({ activo: false });

        res.json({ mensaje: 'Producto desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener productos con stock bajo o crítico
exports.obtenerAlertasStock = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            where: {
                activo: true,
                [Op.or]: [
                    Sequelize.where(Sequelize.col('stock_actual'), Op.lt, Sequelize.col('stock_minimo')),
                    Sequelize.where(Sequelize.col('stock_actual'), Op.lt, Sequelize.col('stock_critico'))
                ]
            },
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Proveedor, as: 'proveedor' }
            ],
            order: [['stock_actual', 'ASC']]
        });

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
