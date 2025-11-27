const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Importar modelos (esto establece las relaciones)
const models = require('./models');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: '✅ API Sistema de Gestión de Inventario',
    version: '1.0.0',
    estado: 'Activo',
    funcionalidades: [
      'Gestión de Productos',
      'Control de Categorías',
      'Administración de Proveedores',
      'Control de Stock y Movimientos',
      'Sistema de Usuarios con Roles'
    ]
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    estado: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Importar y usar rutas
const routes = require('./routes');
app.use('/api', routes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

module.exports = app;