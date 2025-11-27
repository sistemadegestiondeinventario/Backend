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

// Rutas de usuarios (registro / login)
app.post('/api/usuarios/register', UsuarioController.registrarUsuario);
app.post('/api/usuarios/login', UsuarioController.login);

// Rutas básicas de usuarios (lista/actualizar/desactivar)
app.get('/api/usuarios', UsuarioController.obtenerUsuarios);
app.put('/api/usuarios/:id', UsuarioController.actualizarUsuario);
app.patch('/api/usuarios/:id/desactivar', UsuarioController.desactivarUsuario);

// Categorias
app.get('/api/categorias', CategoriaController.obtenerCategorias);
app.get('/api/categorias/:id', CategoriaController.obtenerCategoria);
app.post('/api/categorias', CategoriaController.crearCategoria);
app.put('/api/categorias/:id', CategoriaController.actualizarCategoria);
app.delete('/api/categorias/:id', CategoriaController.eliminarCategoria);
app.get('/api/categorias/:id/productos', CategoriaController.obtenerProductosPorCategoria);

// Proveedores
app.get('/api/proveedores', require('./controllers/ProveedorController').obtenerProveedores);
app.get('/api/proveedores/:id', require('./controllers/ProveedorController').obtenerProveedor);
app.post('/api/proveedores', require('./controllers/ProveedorController').crearProveedor);
app.put('/api/proveedores/:id', require('./controllers/ProveedorController').actualizarProveedor);
app.delete('/api/proveedores/:id', require('./controllers/ProveedorController').desactivarProveedor);

// Productos
app.get('/api/productos', ProductoController.obtenerProductos);
app.get('/api/productos/:id', ProductoController.obtenerProducto);
app.post('/api/productos', ProductoController.crearProducto);
app.put('/api/productos/:id', ProductoController.actualizarProducto);
app.delete('/api/productos/:id', ProductoController.eliminarProducto);
app.get('/api/productos/alertas/stock', ProductoController.obtenerAlertasStock);

// Movimientos
app.get('/api/movimientos', require('./controllers/MovimientoController').obtenerMovimientos || ((req, res) => res.status(501).json({ error: 'No implementado' })));
app.post('/api/movimientos', require('./controllers/MovimientoController').registrarMovimiento || ((req, res) => res.status(501).json({ error: 'No implementado' })));

module.exports = app;