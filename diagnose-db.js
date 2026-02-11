require('dotenv').config();
const sequelize = require('./src/config/database');
const { Usuario, Categoria, Proveedor, Producto, Movimiento } = require('./src/models');

async function diagnose() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado a BD');

        // Contar registros
        const usuariosCount = await Usuario.count();
        const categoriasCount = await Categoria.count();
        const proveedoresCount = await Proveedor.count();
        const productosCount = await Producto.count();
        const movimientosCount = await Movimiento.count();

        console.log('📊 Registros en BD:');
        console.log('- Usuarios:', usuariosCount);
        console.log('- Categorías:', categoriasCount);
        console.log('- Proveedores:', proveedoresCount);
        console.log('- Productos:', productosCount);
        console.log('- Movimientos:', movimientosCount);

        if (usuariosCount === 0) {
            console.log('\n⚠️  No hay usuarios. Ejecutando seed...');
            const inicializarDatos = require('./src/config/seed');
            await inicializarDatos();
            console.log('✅ Seed ejecutado');
        } else {
            console.log('\n✅ BD contiene datos');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

diagnose();
