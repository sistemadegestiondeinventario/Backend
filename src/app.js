const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '✅ API Sistema de Gestión de Inventario',
    version: '1.0.0',
    estado: 'Activo'
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    estado: 'OK',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;