const { Usuario } = require('../../src/models');

jest.mock('../../src/models', () => ({
    Usuario: {
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    }
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Importar después de los mocks
const usuarioService = require('../../src/services/UsuarioService');

describe('UsuarioService', () => {
    let mockUsuario;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUsuario = {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            password: 'hashedPassword123',
            rol: 'usuario',
            validarPassword: jest.fn()
        };

        // Configurar variables de entorno
        process.env.JWT_SECRET = 'test-secret-key';
    });

    describe('registrar', () => {
        test('debe registrar un nuevo usuario con datos válidos', async () => {
            Usuario.findOne.mockResolvedValue(null); // Email no existe
            Usuario.create.mockResolvedValue(mockUsuario);

            const resultado = await usuarioService.registrar(
                'Juan Pérez',
                'juan@example.com',
                'password123'
            );

            expect(Usuario.findOne).toHaveBeenCalledWith({
                where: { email: 'juan@example.com' }
            });
            expect(Usuario.create).toHaveBeenCalledWith({
                nombre: 'Juan Pérez',
                email: 'juan@example.com',
                password: 'password123'
            });
            expect(resultado.email).toBe('juan@example.com');
            expect(resultado.id).toBe(1);
            expect(resultado).not.toHaveProperty('password');
        });

        test('debe lanzar error si el email ya existe', async () => {
            Usuario.findOne.mockResolvedValue(mockUsuario); // Email ya existe

            await expect(
                usuarioService.registrar('Otro', 'juan@example.com', 'password123')
            ).rejects.toThrow('El email ya está registrado');

            expect(Usuario.create).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        test('debe retornar token JWT si credenciales son válidas', async () => {
            const jwt = require('jsonwebtoken');

            Usuario.findOne.mockResolvedValue(mockUsuario);
            mockUsuario.validarPassword.mockResolvedValue(true);
            jwt.sign.mockReturnValue('valid-token-123');

            const resultado = await usuarioService.login('juan@example.com', 'password123');

            expect(Usuario.findOne).toHaveBeenCalledWith({
                where: { email: 'juan@example.com' }
            });
            expect(mockUsuario.validarPassword).toHaveBeenCalledWith('password123');
            expect(jwt.sign).toHaveBeenCalled();
            expect(resultado.token).toBe('valid-token-123');
            expect(resultado.usuario.email).toBe('juan@example.com');
        });

        test('debe lanzar error si el usuario no existe', async () => {
            Usuario.findOne.mockResolvedValue(null);

            await expect(
                usuarioService.login('inexistente@example.com', 'password123')
            ).rejects.toThrow('Credenciales inválidas');
        });

        test('debe lanzar error si la contraseña es incorrecta', async () => {
            Usuario.findOne.mockResolvedValue(mockUsuario);
            mockUsuario.validarPassword.mockResolvedValue(false);

            await expect(
                usuarioService.login('juan@example.com', 'wrongpassword')
            ).rejects.toThrow('Credenciales inválidas');
        });

        test('debe lanzar error si JWT_SECRET no está configurado', async () => {
            delete process.env.JWT_SECRET;

            Usuario.findOne.mockResolvedValue(mockUsuario);
            mockUsuario.validarPassword.mockResolvedValue(true);

            await expect(
                usuarioService.login('juan@example.com', 'password123')
            ).rejects.toThrow('JWT_SECRET no configurado');
        });
    });

    describe('obtenerPorId', () => {
        test('debe retornar un usuario por su ID sin la contraseña', async () => {
            Usuario.findByPk = jest.fn().mockResolvedValue(mockUsuario);

            const resultado = await usuarioService.obtenerPorId(1);

            expect(Usuario.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(resultado.id).toBe(1);
            expect(resultado.nombre).toBe('Juan Pérez');
        });

        test('debe lanzar error si el usuario no existe', async () => {
            Usuario.findByPk = jest.fn().mockResolvedValue(null);

            await expect(usuarioService.obtenerPorId(999)).rejects.toThrow('Usuario no encontrado');
        });
    });
});
