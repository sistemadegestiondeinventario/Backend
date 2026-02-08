# Sistema de Gestión de Inventario - Backend

API RESTful desarrollada en Node.js con Express para la gestión integral de inventario, incluyendo productos, categorías, proveedores, movimientos de stock y control de usuarios con roles diferenciados.

## 🎯 Funcionalidades Principales

### ✅ Gestión de Productos
- Alta, baja, modificación y consulta de productos
- Búsqueda avanzada con filtros (categoría, proveedor, stock)
- Visualización individual con historial de movimientos
- Paginación de listados

### ✅ Gestión de Categorías
- Administración completa de categorías
- Asignación de productos a categorías
- Visualización de productos por categoría

### ✅ Gestión de Proveedores
- Registro y administración de proveedores
- Visualización de productos por proveedor
- Información de contacto y condiciones comerciales

### ✅ Control de Stock
- Registro de entradas y salidas de mercadería
- Alertas automáticas para stock mínimo y crítico
- Historial de movimientos por producto
- Ajustes de inventario

### ✅ Sistema de Usuarios
- Roles diferenciados (Administrador, Encargado, Consultor)
- Gestión de permisos por rol
- Perfil de usuario editable
- Autenticación con JWT

### ✅ Generación de Reportes
- **Reportes en JSON**: Estadísticas y análisis de datos estructurados
- **Reportes en PDF**: Documentos profesionales listos para imprimir
  - Estadísticas generales con totales
  - Productos por categoría con precios y stock
  - Movimientos en rango de fechas
  - Alertas de stock crítico y mínimo
- **Reportes en Excel**: Hojas de cálculo para análisis avanzado
  - Listado completo de productos
  - Movimientos con filtros de fecha
  - Alertas de stock en hojas separadas
  - Estadísticas con gráficos preparados

### ✅ Seguridad
- Protección de API_KEY en todos los endpoints
- Tokens JWT con 24 horas de validación
- Validación de entrada con express-validator
- Control de roles y permisos granulares

## 🏗️ Arquitectura

```
Backend (Node.js + Express)
    ├── API RESTful
    ├── Autenticación JWT
    ├── Control de Roles y Permisos
    └── PostgreSQL Database

Frontend (React)
    └── Single Page Application

Deploy
    ├── Backend: Render
    └── Frontend: Vercel
```

## 📊 Modelo de Datos

### Usuarios
```javascript
{
  id, nombre, email, password (hasheado), rol, fecha_creacion, activo
}
```

### Productos
```javascript
{
  id, codigo, nombre, descripcion, categoria_id, proveedor_id,
  precio_compra, precio_venta, stock_actual, stock_minimo, stock_critico,
  unidad_medida, ubicacion, imagen, fecha_creacion, activo
}
```

### Categorías
```javascript
{
  id, nombre, descripcion, fecha_creacion
}
```

### Proveedores
```javascript
{
  id, nombre, contacto, telefono, email, direccion, cuit,
  condiciones_pago, fecha_creacion, activo
}
```

### Movimientos
```javascript
{
  id, producto_id, tipo_movimiento (entrada/salida/ajuste),
  cantidad, usuario_id, motivo, fecha_movimiento, observaciones
}
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js v14+ 
- PostgreSQL v12+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repositorio-url>
cd Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

### 4. Crear base de datos
```bash
createdb inventario_db
```

### 5. Ejecutar migraciones/sincronizar modelos
```bash
# Los modelos se sincronizan automáticamente con la BD
npm start
```

## 📦 Dependencias Principales

```json
{
  "express": "^4.x",           // Framework web
  "sequelize": "^6.x",         // ORM para base de datos
  "pg": "^8.x",                // Driver PostgreSQL
  "bcrypt": "^5.x",            // Hash de contraseñas
  "jsonwebtoken": "^9.x",      // Autenticación JWT
  "cors": "^2.x",              // CORS middleware
  "dotenv": "^16.x"            // Variables de entorno
}
```

## 🔐 Autenticación y Autorización

### Flujo de Autenticación
1. Usuario se registra o realiza login
2. Sistema retorna JWT token
3. Token se incluye en header: `Authorization: Bearer {token}`
4. API valida token en cada solicitud

### Roles y Permisos

#### Administrador
```javascript
{
  productos: ['crear', 'leer', 'actualizar', 'eliminar'],
  categorias: ['crear', 'leer', 'actualizar', 'eliminar'],
  proveedores: ['crear', 'leer', 'actualizar', 'eliminar'],
  movimientos: ['crear', 'leer'],
  usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
  reportes: ['acceso_total']
}
```

#### Encargado de Depósito
```javascript
{
  productos: ['leer', 'actualizar'],
  categorias: ['leer'],
  proveedores: ['leer'],
  movimientos: ['crear', 'leer'],
  usuarios: ['leer_propio', 'actualizar_propio'],
  reportes: ['acceso_inventario']
}
```

#### Consultor
```javascript
{
  productos: ['leer'],
  categorias: ['leer'],
  proveedores: ['leer'],
  movimientos: ['leer'],
  usuarios: ['leer_propio', 'actualizar_propio'],
  reportes: ['acceso_consulta']
}
```

## 📡 Endpoints Principales

Ver `API_RUTAS.md` para documentación completa de todos los endpoints.

### Usuarios
- `POST /api/usuarios/registro` - Registrar usuario
- `POST /api/usuarios/login` - Login
- `GET /api/usuarios/perfil` - Obtener perfil
- `PUT /api/usuarios/perfil` - Actualizar perfil

### Productos
- `GET /api/productos` - Listar con filtros
- `GET /api/productos/:id` - Obtener producto
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Categorías
- `GET /api/categorias` - Listar
- `GET /api/categorias/:id` - Obtener
- `POST /api/categorias` - Crear
- `PUT /api/categorias/:id` - Actualizar
- `DELETE /api/categorias/:id` - Eliminar

### Proveedores
- `GET /api/proveedores` - Listar
- `GET /api/proveedores/:id` - Obtener
- `POST /api/proveedores` - Crear
- `PUT /api/proveedores/:id` - Actualizar

### Movimientos
- `POST /api/movimientos` - Registrar movimiento
- `GET /api/movimientos` - Listar movimientos
- `GET /api/movimientos/producto/:id` - Historial por producto

## 🔄 Flujos Principales

### 1. Alta de Producto
```
1. Admin/Encargado crea producto
2. Sistema valida datos (precios, stock crítico < mínimo)
3. Producto se crea con stock_actual = 0
4. Primera entrada de stock vía movimiento
```

### 2. Movimiento de Stock
```
1. Usuario registra movimiento (entrada/salida/ajuste)
2. Sistema valida disponibilidad
3. Stock del producto se actualiza
4. Se registra quién, cuándo y por qué
```

### 3. Alertas
```
1. Sistema detecta stock_actual <= stock_crítico
2. Alerta enviada al endpoint /alertas/stock
3. Dashboard muestra alertas en rojo
```

## 📝 Estructura de Carpetas

```
src/
├── models/
│   ├── Usuario.js
│   ├── Producto.js
│   ├── Categoria.js
│   ├── Proveedor.js
│   ├── Movimiento.js
│   └── index.js
├── controllers/
│   ├── UsuarioController.js
│   ├── ProductoController.js
│   ├── CategoriaController.js
│   ├── ProveedorController.js
│   └── MovimientoController.js
├── routes/
│   ├── usuarios.js
│   ├── productos.js
│   ├── categorias.js
│   ├── proveedores.js
│   ├── movimientos.js
│   └── index.js
├── middleware/
│   └── auth.js
├── config/
│   └── database.js
├── app.js
└── server.js
```

## 🧪 Testing

(Próxima implementación)

```bash
npm test
```

## 🌐 Deploy

### Render (Backend)
1. Crear cuenta en render.com
2. Conectar repositorio Git
3. Configurar variables de entorno
4. Deployer automático con cada push

### Vercel (Frontend)
1. Crear cuenta en vercel.com
2. Importar proyecto de frontend
3. Configurar URL base de API
4. Deploy automático

## 📈 Mejoras Futuras

- [ ] Reportes avanzados en PDF/Excel
- [ ] Sistema de notificaciones por email
- [ ] Importación de productos vía CSV
- [ ] Historial de cambios de precios
- [ ] Sugerencias automáticas de reorden
- [ ] Dashboard con gráficos en tiempo real
- [ ] API GraphQL

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT

## 👨‍💻 Desarrollado por

Sistema de Gestión de Inventario - 2024

---

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

**Documentación de Rutas:** Ver `API_RUTAS.md`
