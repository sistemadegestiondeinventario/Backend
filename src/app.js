const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Importar modelos (esto establece las relaciones)
const models = require('./models');

// Importar middlewares
const { autenticar } = require('./middleware/auth');
const { verificarRol } = require('./middleware/autorización');
const { verificarApiKey } = require('./middleware/apiKey');
const {
  validarProducto,
  validarCategoria,
  validarProveedor,
  validarMovimiento,
  manejarErroresValidacion
} = require('./middleware/validaciones');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba (pública)
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

// Ruta de health check (pública)
app.get('/health', (req, res) => {
  res.json({
    estado: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// APLICAR PROTECCIÓN DE API_KEY A TODAS LAS RUTAS DE API
// ============================================
app.use('/api', verificarApiKey);

// Cargar controladores
const UsuarioController = require('./controllers/UsuarioController');
const CategoriaController = require('./controllers/CategoriaController');
const ProductoController = require('./controllers/ProductoController');
const ProveedorController = require('./controllers/ProveedorController');
const MovimientoController = require('./controllers/MovimientoController');
const ReportController = require('./controllers/ReportController');

// Rutas de usuarios (registro / login - públicas)
app.post('/api/usuarios/register', UsuarioController.registrarUsuario);
app.post('/api/usuarios/login', UsuarioController.login);

// Rutas básicas de usuarios (lista/actualizar/desactivar - protegidas)
app.get('/api/usuarios', autenticar, verificarRol('administrador'), UsuarioController.obtenerUsuarios);
app.put('/api/usuarios/:id', autenticar, UsuarioController.actualizarUsuario);
app.patch('/api/usuarios/:id/desactivar', autenticar, verificarRol('administrador'), UsuarioController.desactivarUsuario);

// Categorias (lectura pública, escritura protegida)
app.get('/api/categorias', CategoriaController.obtenerCategorias);
app.get('/api/categorias/:id', CategoriaController.obtenerCategoria);
app.get('/api/categorias/:id/productos', CategoriaController.obtenerProductosPorCategoria);
app.post('/api/categorias', autenticar, verificarRol('administrador', 'encargado'), validarCategoria, manejarErroresValidacion, CategoriaController.crearCategoria);
app.put('/api/categorias/:id', autenticar, verificarRol('administrador', 'encargado'), validarCategoria, manejarErroresValidacion, CategoriaController.actualizarCategoria);
app.delete('/api/categorias/:id', autenticar, verificarRol('administrador'), CategoriaController.eliminarCategoria);

// Proveedores (lectura pública, escritura protegida)
app.get('/api/proveedores', ProveedorController.obtenerProveedores);
app.get('/api/proveedores/:id', ProveedorController.obtenerProveedor);
app.post('/api/proveedores', autenticar, verificarRol('administrador'), validarProveedor, manejarErroresValidacion, ProveedorController.crearProveedor);
app.put('/api/proveedores/:id', autenticar, verificarRol('administrador'), validarProveedor, manejarErroresValidacion, ProveedorController.actualizarProveedor);
app.delete('/api/proveedores/:id', autenticar, verificarRol('administrador'), ProveedorController.desactivarProveedor);

// Productos (lectura pública, escritura protegida)
app.get('/api/productos', ProductoController.obtenerProductos);
app.get('/api/productos/alertas/stock', ProductoController.obtenerAlertasStock);
app.get('/api/productos/:id', ProductoController.obtenerProducto);
app.get('/api/productos/:id/movimientos', ProductoController.obtenerHistorialProducto);
app.post('/api/productos', autenticar, verificarRol('administrador', 'encargado'), validarProducto, manejarErroresValidacion, ProductoController.crearProducto);
app.put('/api/productos/:id', autenticar, verificarRol('administrador', 'encargado'), validarProducto, manejarErroresValidacion, ProductoController.actualizarProducto);
app.delete('/api/productos/:id', autenticar, verificarRol('administrador'), ProductoController.eliminarProducto);

// Movimientos (protegidas - cualquier usuario autenticado)
app.get('/api/movimientos', autenticar, MovimientoController.obtenerMovimientos);
app.post('/api/movimientos', autenticar, validarMovimiento, manejarErroresValidacion, MovimientoController.registrarMovimiento);

// Reportes y Estadísticas (protegidas - usa router con todos los endpoints)
const reportesRoutes = require('./routes/reportes');
app.use('/api/reportes', autenticar, reportesRoutes);

module.exports = app;