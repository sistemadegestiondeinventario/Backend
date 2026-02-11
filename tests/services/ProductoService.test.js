const { Producto } = require('../../src/models');
const { Op } = require('sequelize');

jest.mock('../../src/models', () => ({
    Producto: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    },
    Categoria: {},
    Proveedor: {},
    Movimiento: {},
    Usuario: {}
}));

// Importar después de los mocks
const productoService = require('../../src/services/ProductoService');

describe('ProductoService', () => {
    let mockProducto;

    beforeEach(() => {
        jest.clearAllMocks();

        mockProducto = {
            id: 1,
            codigo: 'PROD001',
            nombre: 'Laptop',
            precio_venta: 999.99,
            stock_actual: 10,
            activo: true
        };
    });

    describe('obtenerTodos', () => {
        test('debe retornar productos con paginación', async () => {
            const mockProductos = [
                { id: 1, nombre: 'Producto A', codigo: 'P001' },
                { id: 2, nombre: 'Producto B', codigo: 'P002' }
            ];

            Producto.findAndCountAll.mockResolvedValue({
                count: 2,
                rows: mockProductos
            });

            const resultado = await productoService.obtenerTodos({
                pagina: 1,
                limite: 10
            });

            expect(resultado.productos).toEqual(mockProductos);
            expect(resultado.total).toBe(2);
            expect(resultado.pagina).toBe(1);
            expect(resultado.limite).toBe(10);
            expect(resultado.totalPaginas).toBe(1);
        });

        test('debe retornar array vacío si no hay productos', async () => {
            Producto.findAndCountAll.mockResolvedValue({
                count: 0,
                rows: []
            });

            const resultado = await productoService.obtenerTodos();

            expect(resultado.productos).toEqual([]);
            expect(resultado.total).toBe(0);
        });

        test('debe aplicar filtros de búsqueda', async () => {
            Producto.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: [mockProducto]
            });

            const resultado = await productoService.obtenerTodos({
                buscar: 'Laptop',
                pagina: 1,
                limite: 10
            });

            expect(Producto.findAndCountAll).toHaveBeenCalled();
            const callArgs = Producto.findAndCountAll.mock.calls[0][0];
            expect(callArgs.where).toHaveProperty('activo', true);
            expect(resultado.productos.length).toBe(1);
        });

        test('debe calcular correctamente el total de páginas', async () => {
            Producto.findAndCountAll.mockResolvedValue({
                count: 25,
                rows: Array(10).fill(mockProducto)
            });

            const resultado = await productoService.obtenerTodos({
                pagina: 1,
                limite: 10
            });

            expect(resultado.totalPaginas).toBe(3); // 25 items / 10 por página = 3 páginas
        });
    });

    describe('obtenerPorId', () => {
        test('debe retornar un producto por su ID', async () => {
            Producto.findByPk.mockResolvedValue(mockProducto);

            const resultado = await productoService.obtenerPorId(1);

            expect(Producto.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(resultado.id).toBe(1);
            expect(resultado.nombre).toBe('Laptop');
        });

        test('debe lanzar error si el producto no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            await expect(productoService.obtenerPorId(999)).rejects.toThrow('Producto no encontrado');
        });
    });

    describe('crear', () => {
        test('debe crear un producto con datos válidos', async () => {
            const datos = {
                codigo: 'PROD002',
                nombre: 'Mouse',
                precio_venta: 25.99,
                stock_actual: 100,
                categoria_id: 1,
                proveedor_id: 1,
                precio_compra: 15.00
            };

            const productoCreado = { id: 2, ...datos };
            Producto.create.mockResolvedValue(productoCreado);
            Producto.findByPk.mockResolvedValue(productoCreado);

            const resultado = await productoService.crear(datos);

            expect(Producto.create).toHaveBeenCalledWith(datos);
            expect(resultado.nombre).toBe('Mouse');
            expect(resultado.id).toBe(2);
        });

        test('debe lanzar error si falta código o nombre', async () => {
            const datosInvalidos = {
                precio_venta: 25.99,
                stock_actual: 100
            };

            await expect(productoService.crear(datosInvalidos)).rejects.toThrow();
        });
    });
});
