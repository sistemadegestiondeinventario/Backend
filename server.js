const app = require('./src/app');
const { sequelize } = require('./src/models');
const inicializarDatos = require('./src/config/seed');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Iniciar servidor y sincronizar base de datos
async function iniciarServidor() {
  try {
    // Verificar conexión con base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos exitosa');

    // Inicializar datos de ejemplo (si no existen)
    await inicializarDatos();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API disponible en http://localhost:${PORT}/api`);
      console.log(`📖 Documentación en README_BACKEND.md y API_RUTAS.md\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();