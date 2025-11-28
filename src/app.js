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

// Cargar controladores
const UsuarioController = require('./controllers/UsuarioController');
const CategoriaController = require('./controllers/CategoriaController');
const ProductoController = require('./controllers/ProductoController');
const ProveedorController = require('./controllers/ProveedorController');
const MovimientoController = require('./controllers/MovimientoController');

// RUTAS DE USUARIOS 
app.post('/api/usuarios/register', UsuarioController.registrar);
app.post('/api/usuarios/login', UsuarioController.login);
app.get('/api/usuarios', UsuarioController.obtenerTodos);
app.get('/api/usuarios/:id', UsuarioController.obtenerPorId);
app.put('/api/usuarios/:id', UsuarioController.actualizar);
app.delete('/api/usuarios/:id', UsuarioController.eliminar);

// RUTAS DE CATEGORÍAS 
app.get('/api/categorias', CategoriaController.obtenerTodos);
app.get('/api/categorias/:id', CategoriaController.obtenerPorId);
app.post('/api/categorias', CategoriaController.crear);
app.put('/api/categorias/:id', CategoriaController.actualizar);
app.delete('/api/categorias/:id', CategoriaController.eliminar);

//  RUTAS DE PROVEEDORES 
app.get('/api/proveedores', ProveedorController.obtenerTodos);
app.get('/api/proveedores/:id', ProveedorController.obtenerPorId);
app.post('/api/proveedores', ProveedorController.crear);
app.put('/api/proveedores/:id', ProveedorController.actualizar);
app.delete('/api/proveedores/:id', ProveedorController.eliminar);

// RUTAS DE PRODUCTOS 
app.get('/api/productos', ProductoController.obtenerTodos);
app.get('/api/productos/:id', ProductoController.obtenerPorId);
app.post('/api/productos', ProductoController.crear);
app.put('/api/productos/:id', ProductoController.actualizar);
app.delete('/api/productos/:id', ProductoController.eliminar);

// RUTAS DE MOVIMIENTOS 
app.get('/api/movimientos', MovimientoController.obtenerTodos);
app.get('/api/movimientos/:id', MovimientoController.obtenerPorId);
app.post('/api/movimientos', MovimientoController.registrar);

module.exports = app;