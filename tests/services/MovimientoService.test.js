const { Movimiento } = require('../../src/models');

jest.mock('../../src/models', () => ({
    Movimiento: {
        findByPk: jest.fn(),
        create: jest.fn(),
        findAndCountAll: jest.fn(),
        findAll: jest.fn()
    },
    Producto: {
        findByPk: jest.fn(),
        findAll: jest.fn()
    },
    Usuario: {}
}));

const movimientoService = require('../../src/services/MovimientoService');

describe('MovimientoService', () => {
    let mockProducto;
    let mockMovimiento;

    beforeEach(() => {
        jest.clearAllMocks();

        mockProducto = {
            id: 1,
            codigo: 'P001',
            nombre: 'Producto A',
            stock_actual: 10,
            stock_minimo: 5,
            stock_critico: 2,
            update: jest.fn()
        };

        mockMovimiento = {
            id: 1,
            producto_id: 1,
            tipo_movimiento: 'entrada',
            cantidad: 5,
            usuario_id: 1,
            fecha_movimiento: new Date(),
            producto: mockProducto,
            usuario: { id: 1, nombre: 'User' }
        };
    });

    describe('registrar', () => {
        test('debe registrar una entrada y actualizar stock', async () => {
            const { Producto, Movimiento } = require('../../src/models');

            Producto.findByPk.mockResolvedValue(mockProducto);
            Movimiento.create.mockResolvedValue({ id: 1 });
            Movimiento.findByPk.mockResolvedValue(mockMovimiento);

            const datos = {
                producto_id: 1,
                tipo_movimiento: 'entrada',
                cantidad: 5,
                usuario_id: 1
            };

            const resultado = await movimientoService.registrar(datos);

            expect(Producto.findByPk).toHaveBeenCalledWith(1);
            expect(Movimiento.create).toHaveBeenCalledWith(expect.objectContaining({ producto_id: 1 }));
            expect(mockProducto.update).toHaveBeenCalled();
            expect(resultado).toEqual(mockMovimiento);
        });

        test('debe lanzar error si faltan campos requeridos', async () => {
            await expect(movimientoService.registrar({})).rejects.toThrow('Faltan campos requeridos');
        });

        test('debe lanzar error para tipo inválido', async () => {
            await expect(movimientoService.registrar({ producto_id: 1, tipo_movimiento: 'otro', cantidad: 1, usuario_id: 1 })).rejects.toThrow('Tipo de movimiento inválido');
        });
    });

    describe('obtenerTodos', () => {
        test('debe retornar paginación de movimientos', async () => {
            Movimiento.findAndCountAll.mockResolvedValue({ count: 2, rows: [mockMovimiento, mockMovimiento] });

            const resultado = await movimientoService.obtenerTodos({ pagina: 1, limite: 10 });

            expect(Movimiento.findAndCountAll).toHaveBeenCalled();
            expect(resultado.movimientos.length).toBe(2);
            expect(resultado.total).toBe(2);
        });
    });

    describe('obtenerPorId', () => {
        test('debe retornar movimiento por id', async () => {
            Movimiento.findByPk.mockResolvedValue(mockMovimiento);

            const resultado = await movimientoService.obtenerPorId(1);

            expect(Movimiento.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(resultado.id).toBe(1);
        });

        test('debe lanzar error si no existe', async () => {
            Movimiento.findByPk.mockResolvedValue(null);
            await expect(movimientoService.obtenerPorId(999)).rejects.toThrow('Movimiento no encontrado');
        });
    });

    describe('obtenerHistorialProducto', () => {
        test('debe retornar historial cuando producto existe', async () => {
            const { Producto, Movimiento } = require('../../src/models');
            Producto.findByPk.mockResolvedValue(mockProducto);
            Movimiento.findAndCountAll.mockResolvedValue({ count: 1, rows: [mockMovimiento] });

            const resultado = await movimientoService.obtenerHistorialProducto(1, { pagina: 1, limite: 10 });

            expect(Producto.findByPk).toHaveBeenCalledWith(1);
            expect(resultado.movimientos.length).toBe(1);
            expect(resultado.producto).toEqual(mockProducto);
        });

        test('debe lanzar error si producto no existe', async () => {
            const { Producto } = require('../../src/models');
            Producto.findByPk.mockResolvedValue(null);
            await expect(movimientoService.obtenerHistorialProducto(999)).rejects.toThrow('Producto no encontrado');
        });
    });

    describe('obtenerAlertasStock', () => {
        test('debe retornar alertas según stock mínimo/critico', async () => {
            const { Producto } = require('../../src/models');
            const p1 = { id: 1, codigo: 'P1', nombre: 'A', stock_actual: 2, stock_minimo: 5, stock_critico: 2, activo: true };
            const p2 = { id: 2, codigo: 'P2', nombre: 'B', stock_actual: 10, stock_minimo: 5, stock_critico: 2, activo: true };
            Producto.findAll.mockResolvedValue([p1, p2]);

            const resultado = await movimientoService.obtenerAlertasStock();

            expect(Producto.findAll).toHaveBeenCalled();
            expect(resultado.alertas.length).toBe(1);
            expect(resultado.alertas[0].nivel).toBe('critico');
        });
    });
});
