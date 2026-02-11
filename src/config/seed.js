const { sequelize, Usuario, Categoria, Proveedor, Producto, Movimiento } = require('../models');
const bcrypt = require('bcrypt');

async function inicializarDatos() {
    try {
        // Verificar si ya existen datos ANTES de sincronizar
        const usuariosCount = await Usuario.count();
        
        // Si no hay datos, usamos force: true para limpiar y recrear
        const forceSync = usuariosCount === 0;

        // Sincronizar base de datos
        console.log('🔄 Sincronizando base de datos...');
        await sequelize.sync({ force: forceSync });

        // Si ya existen datos después de sincronizar, no volver a crearlos
        const usuariosCountAfterSync = await Usuario.count();
        if (usuariosCountAfterSync > 0) {
            console.log('✅ Base de datos ya contiene datos. Saltando inicialización.');
            return;
        }

        console.log('📝 Creando datos de ejemplo...');

        // Crear usuarios
        const usuario1 = await Usuario.create({
            nombre: 'Administrador',
            email: 'admin@inventario.com',
            password: 'admin123',
            rol: 'administrador'
        });

        if (!usuario1 || !usuario1.id) {
            throw new Error('No se pudo crear usuario1 correctamente');
        }

        const usuario2 = await Usuario.create({
            nombre: 'Juan Encargado',
            email: 'juan@inventario.com',
            password: 'juan123',
            rol: 'encargado'
        });

        if (!usuario2 || !usuario2.id) {
            throw new Error('No se pudo crear usuario2 correctamente');
        }

        const usuario3 = await Usuario.create({
            nombre: 'Carlos Consultor',
            email: 'carlos@inventario.com',
            password: 'carlos123',
            rol: 'consultor'
        });

        if (!usuario3 || !usuario3.id) {
            throw new Error('No se pudo crear usuario3 correctamente');
        }

        console.log(`✅ Usuarios creados (IDs: ${usuario1.id}, ${usuario2.id}, ${usuario3.id})`);

        // Crear categorías
        const categoria1 = await Categoria.create({
            nombre: 'Electrónica',
            descripcion: 'Productos electrónicos y componentes'
        });

        const categoria2 = await Categoria.create({
            nombre: 'Herramientas',
            descripcion: 'Herramientas manuales y eléctricas'
        });

        const categoria3 = await Categoria.create({
            nombre: 'Repuestos',
            descripcion: 'Repuestos y accesorios varios'
        });

        console.log('✅ Categorías creadas');

        // Crear proveedores
        const proveedor1 = await Proveedor.create({
            nombre: 'Tech Supplies S.A.',
            contacto: 'Pedro López',
            telefono: '011-1234-5678',
            email: 'ventas@techsupplies.com',
            direccion: 'Av. Corrientes 1234, CABA',
            cuit: '20123456789',
            condiciones_pago: 'Contado'
        });

        const proveedor2 = await Proveedor.create({
            nombre: 'Industrial Tools Inc.',
            contacto: 'María García',
            telefono: '011-9876-5432',
            email: 'info@industrialtools.com',
            direccion: 'Calle 9 de Julio 5678, CABA',
            cuit: '20987654321',
            condiciones_pago: '30 días'
        });

        console.log('✅ Proveedores creados');

        // Crear productos
        const producto1 = await Producto.create({
            codigo: 'PROD-001',
            nombre: 'Monitor LED 24"',
            descripcion: 'Monitor LED 24 pulgadas Full HD',
            categoria_id: categoria1.id,
            proveedor_id: proveedor1.id,
            precio_compra: 150.00,
            precio_venta: 220.00,
            stock_actual: 15,
            stock_minimo: 5,
            stock_critico: 2,
            unidad_medida: 'unidad',
            ubicacion: 'Estante A1',
            imagen: null
        });

        const producto2 = await Producto.create({
            codigo: 'PROD-002',
            nombre: 'Teclado Mecánico RGB',
            descripcion: 'Teclado mecánico con iluminación RGB',
            categoria_id: categoria1.id,
            proveedor_id: proveedor1.id,
            precio_compra: 80.00,
            precio_venta: 120.00,
            stock_actual: 3,
            stock_minimo: 10,
            stock_critico: 5,
            unidad_medida: 'unidad',
            ubicacion: 'Estante A2',
            imagen: null
        });

        const producto3 = await Producto.create({
            codigo: 'PROD-003',
            nombre: 'Martillo de goma',
            descripcion: 'Martillo de goma de 500g',
            categoria_id: categoria2.id,
            proveedor_id: proveedor2.id,
            precio_compra: 15.00,
            precio_venta: 25.00,
            stock_actual: 50,
            stock_minimo: 20,
            stock_critico: 10,
            unidad_medida: 'unidad',
            ubicacion: 'Estante B1',
            imagen: null
        });

        const producto4 = await Producto.create({
            codigo: 'PROD-004',
            nombre: 'Cable USB tipo C',
            descripcion: 'Cable USB tipo C de 2 metros',
            categoria_id: categoria3.id,
            proveedor_id: proveedor1.id,
            precio_compra: 5.00,
            precio_venta: 12.00,
            stock_actual: 1,
            stock_minimo: 30,
            stock_critico: 15,
            unidad_medida: 'unidad',
            ubicacion: 'Estante C1',
            imagen: null
        });

        console.log('✅ Productos creados');

        // Crear movimientos de ejemplo
        await Movimiento.create({
            producto_id: producto1.id,
            tipo_movimiento: 'entrada',
            cantidad: 15,
            usuario_id: usuario1.id,
            motivo: 'Compra inicial',
            observaciones: 'Factura #001'
        });

        await Movimiento.create({
            producto_id: producto2.id,
            tipo_movimiento: 'entrada',
            cantidad: 10,
            usuario_id: usuario1.id,
            motivo: 'Compra',
            observaciones: 'Factura #002'
        });

        await Movimiento.create({
            producto_id: producto2.id,
            tipo_movimiento: 'salida',
            cantidad: 7,
            usuario_id: usuario2.id,
            motivo: 'Venta',
            observaciones: 'Pedido #100'
        });

        await Movimiento.create({
            producto_id: producto3.id,
            tipo_movimiento: 'entrada',
            cantidad: 50,
            usuario_id: usuario1.id,
            motivo: 'Compra inicial',
            observaciones: 'Factura #003'
        });

        await Movimiento.create({
            producto_id: producto4.id,
            tipo_movimiento: 'entrada',
            cantidad: 100,
            usuario_id: usuario1.id,
            motivo: 'Compra inicial',
            observaciones: 'Factura #004'
        });

        await Movimiento.create({
            producto_id: producto4.id,
            tipo_movimiento: 'salida',
            cantidad: 99,
            usuario_id: usuario2.id,
            motivo: 'Venta',
            observaciones: 'Pedido #101'
        });

        console.log('✅ Movimientos creados');

        console.log('\n✅ ¡Base de datos inicializada correctamente!');
        console.log('\n📋 Usuarios de prueba:');
        console.log('   Admin: admin@inventario.com / admin123');
        console.log('   Encargado: juan@inventario.com / juan123');
        console.log('   Consultor: carlos@inventario.com / carlos123');

    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
        process.exit(1);
    }
}

module.exports = inicializarDatos;
