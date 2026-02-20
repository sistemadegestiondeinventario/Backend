jest.mock('../../src/models', () => ({
    Proveedor: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    },
    Producto: {}
}));

const proveedorService = require('../../src/services/ProveedorService');

describe('ProveedorService', () => {
    let mockProveedor;

    beforeEach(() => {
        jest.clearAllMocks();

        mockProveedor = {
            id: 1,
            nombre: 'Proveedor A',
            cuit: '20-12345678-9',
            email: 'prov@example.com',
            update: jest.fn()
        };
    });

    describe('obtenerTodos', () => {
        test('debe retornar proveedores con paginación', async () => {
            const { Proveedor } = require('../../src/models');
            Proveedor.findAndCountAll.mockResolvedValue({ count: 2, rows: [mockProveedor, mockProveedor] });

            const resultado = await proveedorService.obtenerTodos({ pagina: 1, limite: 10 });

            expect(Proveedor.findAndCountAll).toHaveBeenCalled();
            expect(resultado.proveedores.length).toBe(2);
            expect(resultado.total).toBe(2);
        });

        test('debe aplicar filtro de búsqueda', async () => {
            const { Proveedor } = require('../../src/models');
            Proveedor.findAndCountAll.mockResolvedValue({ count: 1, rows: [mockProveedor] });

            const resultado = await proveedorService.obtenerTodos({ buscar: 'Proveedor' });

            expect(Proveedor.findAndCountAll).toHaveBeenCalled();
            expect(resultado.proveedores.length).toBe(1);
        });
    });

    describe('obtenerPorId', () => {
        test('debe retornar proveedor por id', async () => {
            const { Proveedor } = require('../../src/models');
            Proveedor.findByPk.mockResolvedValue(mockProveedor);

            const resultado = await proveedorService.obtenerPorId(1);

            expect(Proveedor.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(resultado.id).toBe(1);
        });

        test('debe lanzar error si no existe', async () => {
            const { Proveedor } = require('../../src/models');
            Proveedor.findByPk.mockResolvedValue(null);
            await expect(proveedorService.obtenerPorId(999)).rejects.toThrow('Proveedor no encontrado');
        });
    });

    describe('crear', () => {
        test('debe crear proveedor con datos válidos', async () => {
            const { Proveedor } = require('../../src/models');
            const datos = { nombre: 'Nuevo', cuit: '20-00000000-0' };
            Proveedor.create.mockResolvedValue({ id: 2, ...datos });

            const resultado = await proveedorService.crear(datos);

            expect(Proveedor.create).toHaveBeenCalledWith(datos);
            expect(resultado.nombre).toBe('Nuevo');
        });

        test('debe lanzar error si faltan nombre o cuit', async () => {
            await expect(proveedorService.crear({})).rejects.toThrow('Nombre y CUIT son requeridos');
        });
    });

    describe('actualizar', () => {
        test('debe actualizar proveedor existente', async () => {
            const { Proveedor } = require('../../src/models');
            Proveedor.findByPk.mockResolvedValue(mockProveedor);
            mockProveedor.update.mockResolvedValue(mockProveedor);

            const resultado = await proveedorService.actualizar(1, { nombre: 'Mod' });

            expect(Proveedor.findByPk).toHaveBeenCalledWith(1);
            expect(mockProveedor.update).toHaveBeenCalledWith({ nombre: 'Mod' });
        });

        test('debe lanzar error si no existe', async () => {
            const { Proveedor } = require('../../src/models');
            Proveedor.findByPk.mockResolvedValue(null);
            await expect(proveedorService.actualizar(999, {})).rejects.toThrow('Proveedor no encontrado');
        });
    });

    describe('eliminar', () => {
        test('debe desactivar proveedor existente', async () => {
            const { Proveedor } = require('../../src/models');
            Proveedor.findByPk.mockResolvedValue(mockProveedor);
            mockProveedor.update.mockResolvedValue({ ...mockProveedor, activo: false });

            const resultado = await proveedorService.eliminar(1);

            expect(Proveedor.findByPk).toHaveBeenCalledWith(1);
            expect(mockProveedor.update).toHaveBeenCalledWith({ activo: false });
            expect(resultado).toHaveProperty('mensaje');
        });
    });
});
