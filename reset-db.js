require('dotenv').config();
const { sequelize } = require('./src/models');

async function resetarDB() {
    try {
        console.log('🗑️  Eliminando todas las tablas...');
        await sequelize.drop();
        console.log('✅ Tablas eliminadas');
        
        console.log('🔄 Sincronizando base de datos...');
        await sequelize.sync({ force: true });
        console.log('✅ Sincronización completa');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetarDB();
