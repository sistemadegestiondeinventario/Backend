const { Categoria } = require('../../src/models');

jest.mock('../../src/models', () => ({
    Categoria: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    },
    Producto: {
        count: jest.fn()
    }
}));

// Importar después de los mocks
const categoriaService = require('../../src/services/CategoriaService');

describe('CategoriaService', () => {
    let mockCategoria;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock data
        mockCategoria = {
            id: 1,
            nombre: 'Electrónica',
            descripcion: 'Productos electrónicos',
            update: jest.fn(),
            destroy: jest.fn()
        };

        // Mock the Producto.count
        const { Producto } = require('../../src/models');
        Producto.count.mockResolvedValue(0);
    });

    describe('obtenerTodos', () => {
        test('debe retornar todas las categorías ordenadas por nombre', async () => {
            const mockCategorias = [
                { id: 1, nombre: 'Categoría A' },
                { id: 2, nombre: 'Categoría B' }
            ];

            Categoria.findAll.mockResolvedValue(mockCategorias);

            const resultado = await categoriaService.obtenerTodos();

            expect(Categoria.findAll).toHaveBeenCalledWith({
                order: [['nombre', 'ASC']]
            });
            expect(resultado).toEqual(mockCategorias);
            expect(resultado.length).toBe(2);
        });

        test('debe retornar array vacío si no hay categorías', async () => {
            Categoria.findAll.mockResolvedValue([]);

            const resultado = await categoriaService.obtenerTodos();

            expect(resultado).toEqual([]);
            expect(resultado.length).toBe(0);
        });
    });

    describe('obtenerPorId', () => {
        test('debe retornar una categoría por su ID', async () => {
            Categoria.findByPk.mockResolvedValue(mockCategoria);

            const resultado = await categoriaService.obtenerPorId(1);

            expect(Categoria.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(resultado.id).toBe(1);
            expect(resultado.nombre).toBe('Electrónica');
        });

        test('debe lanzar error si la categoría no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            await expect(categoriaService.obtenerPorId(999)).rejects.toThrow('Categoría no encontrada');
        });
    });

    describe('crear', () => {
        test('debe crear una categoría con datos válidos', async () => {
            const datos = { nombre: 'Nueva Categoría', descripcion: 'Descripción' };
            Categoria.create.mockResolvedValue({ id: 3, ...datos });

            const resultado = await categoriaService.crear(datos);

            expect(Categoria.create).toHaveBeenCalledWith(datos);
            expect(resultado.nombre).toBe('Nueva Categoría');
        });

        test('debe lanzar error si falta el nombre', async () => {
            const datos = { descripcion: 'Sin nombre' };

            await expect(categoriaService.crear(datos)).rejects.toThrow('El nombre es requerido');
        });
    });

    describe('actualizar', () => {
        test('debe actualizar una categoría existente', async () => {
            Categoria.findByPk.mockResolvedValue(mockCategoria);
            mockCategoria.update.mockResolvedValue(mockCategoria);

            const datos = { nombre: 'Categoría Actualizada' };
            await categoriaService.actualizar(1, datos);

            expect(Categoria.findByPk).toHaveBeenCalledWith(1);
            expect(mockCategoria.update).toHaveBeenCalledWith(datos);
        });

        test('debe lanzar error si intenta actualizar categoría inexistente', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            await expect(categoriaService.actualizar(999, { nombre: 'Test' })).rejects.toThrow('Categoría no encontrada');
        });
    });

    describe('eliminar', () => {
        test('debe eliminar una categoría existente', async () => {
            Categoria.findByPk.mockResolvedValue(mockCategoria);
            mockCategoria.destroy.mockResolvedValue(true);

            const resultado = await categoriaService.eliminar(1);

            expect(Categoria.findByPk).toHaveBeenCalledWith(1);
            expect(resultado).toHaveProperty('mensaje');
        });

        test('debe lanzar error si la categoría no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            await expect(categoriaService.eliminar(999)).rejects.toThrow('Categoría no encontrada');
        });
    });
});
