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

// Middlewares globales
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

// Cargar controladores
const UsuarioController = require('./controllers/UsuarioController');
const CategoriaController = require('./controllers/CategoriaController');
const ProductoController = require('./controllers/ProductoController');
const ProveedorController = require('./controllers/ProveedorController');
const MovimientoController = require('./controllers/MovimientoController');
const ReportController = require('./controllers/ReportController');

// ============================================
// RUTAS PÚBLICAS (SIN PROTECCIÓN)
// ============================================

// Rutas de autenticación (registro / login - públicas, sin API_KEY ni JWT)
app.post('/api/usuarios/registro', UsuarioController.registrar);
app.post('/api/usuarios/login', UsuarioController.login);
app.get('/api/usuarios', UsuarioController.obtenerTodos);
app.get('/api/usuarios/:id', UsuarioController.obtenerPorId);
app.put('/api/usuarios/:id', UsuarioController.actualizar);
app.delete('/api/usuarios/:id', UsuarioController.eliminar);

// ============================================
// APLICAR PROTECCIÓN DE API_KEY A TODAS LAS OTRAS RUTAS DE API
// ============================================
app.use('/api', verificarApiKey);

// ============================================
// RUTAS PROTEGIDAS (REQUIEREN API_KEY + JWT)
// ============================================

// Rutas básicas de usuarios
app.get('/api/usuarios', autenticar, verificarRol('administrador'), UsuarioController.obtenerUsuarios);
app.get('/api/usuarios/perfil', autenticar, UsuarioController.obtenerPerfil);
app.put('/api/usuarios/perfil', autenticar, UsuarioController.actualizarUsuario);
app.put('/api/usuarios/:id', autenticar, UsuarioController.actualizarUsuario);
app.patch('/api/usuarios/:id/desactivar', autenticar, verificarRol('administrador'), UsuarioController.desactivarUsuario);

// Categorias (lectura sin JWT, escritura con JWT + rol)
app.get('/api/categorias', CategoriaController.obtenerTodos);
app.get('/api/categorias/:id', CategoriaController.obtenerPorId);
app.get('/api/categorias/:id/productos', CategoriaController.obtenerProductosPorCategoria);
app.post('/api/categorias', autenticar, verificarRol('administrador', 'encargado'), validarCategoria, manejarErroresValidacion, CategoriaController.crear);
app.put('/api/categorias/:id', autenticar, verificarRol('administrador', 'encargado'), validarCategoria, manejarErroresValidacion, CategoriaController.actualizar);
app.delete('/api/categorias/:id', autenticar, verificarRol('administrador'), CategoriaController.eliminar);

// Proveedores
app.get('/api/proveedores', ProveedorController.obtenerTodos);
app.get('/api/proveedores/:id', ProveedorController.obtenerPorId);
app.get('/api/proveedores/:id/productos', ProveedorController.obtenerProductosPorProveedor);
app.post('/api/proveedores', autenticar, verificarRol('administrador'), validarProveedor, manejarErroresValidacion, ProveedorController.crear);
app.put('/api/proveedores/:id', autenticar, verificarRol('administrador'), validarProveedor, manejarErroresValidacion, ProveedorController.actualizar);
app.patch('/api/proveedores/:id/desactivar', autenticar, verificarRol('administrador'), ProveedorController.eliminar);
app.delete('/api/proveedores/:id', autenticar, verificarRol('administrador'), ProveedorController.eliminar);

// Productos
app.get('/api/productos', ProductoController.obtenerTodos);
app.get('/api/productos/alertas/stock', ProductoController.obtenerAlertasStock);
app.get('/api/productos/:id', ProductoController.obtenerPorId);
app.get('/api/productos/:id/movimientos', ProductoController.obtenerHistorialProducto);
app.post('/api/productos', autenticar, verificarRol('administrador', 'encargado'), validarProducto, manejarErroresValidacion, ProductoController.crear);
app.put('/api/productos/:id', autenticar, verificarRol('administrador', 'encargado'), validarProducto, manejarErroresValidacion, ProductoController.actualizar);
app.delete('/api/productos/:id', autenticar, verificarRol('administrador'), ProductoController.eliminar);

// Movimientos
app.get('/api/movimientos', autenticar, MovimientoController.obtenerTodos);
app.get('/api/movimientos/alertas/stock', autenticar, MovimientoController.obtenerAlertasStock);
app.get('/api/movimientos/resumen/general', autenticar, MovimientoController.obtenerResumen);
app.get('/api/movimientos/producto/:producto_id', autenticar, MovimientoController.obtenerHistorialProducto);
app.post('/api/movimientos', autenticar, validarMovimiento, manejarErroresValidacion, MovimientoController.registrar);

// Reportes y Estadísticas
const reportesRoutes = require('./routes/reportes');
app.use('/api/reportes', autenticar, reportesRoutes);

module.exports = app;