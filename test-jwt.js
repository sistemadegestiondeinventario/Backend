const jwt = require('jsonwebtoken');

// Simular el JWT_SECRET del .env
const JWT_SECRET = 'abcd1234efgh5678ijkl9012mnopqrst';

// Crear un token con los datos que UsuarioService.login() genera
const token = jwt.sign(
    { id: 1, email: 'admin@inventario.com', rol: 'administrador' },
    JWT_SECRET,
    { expiresIn: '24h' }
);

console.log('🔐 Token generado:', token);
console.log('\n📝 Token decodificado:');

// Decodificar el token
try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    console.log('\n✅ ID del usuario:', decoded.id);
} catch (error) {
    console.error('❌ Error decodificando token:', error.message);
}
