# API Sistema de Gestión de Inventario - Guía de Rutas

## Rutas de Autenticación - `/api/usuarios`

### 1. Registro de Usuario
```
POST /api/usuarios/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "administrador"  // administrador, encargado, consultor
}

Respuesta:
{
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "administrador",
    "activo": true
  },
  "token": "eyJhbGc..."
}
```

### 2. Login
```
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}

Respuesta: (misma que registro)
```

### 3. Obtener Perfil
```
GET /api/usuarios/perfil
Authorization: Bearer {token}
```

### 4. Actualizar Perfil
```
PUT /api/usuarios/perfil
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "email": "juancarlos@example.com",
  "passwordActual": "password123",
  "passwordNueva": "newpassword123"
}
```

### 5. Obtener Permisos por Rol
```
GET /api/usuarios/permisos
Authorization: Bearer {token}
```

---

## Rutas de Productos - `/api/productos`

### 1. Obtener Productos (con filtros y paginación)
```
GET /api/productos?pagina=1&limite=10&categoria=1&proveedor=2&stock=bajo&buscar=producto

Parámetros:
- pagina: número de página (default: 1)
- limite: productos por página (default: 10)
- categoria: id de categoría
- proveedor: id de proveedor
- stock: "bajo" o "critico"
- buscar: término de búsqueda

Respuesta:
{
  "productos": [...],
  "total": 100,
  "pagina": 1,
  "limite": 10,
  "totalPaginas": 10
}
```

### 2. Obtener Producto Individual
```
GET /api/productos/{id}
Authorization: Bearer {token}

Respuesta incluye: historial de 50 últimos movimientos
```

### 3. Crear Producto
```
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json
Rol requerido: administrador, encargado

{
  "codigo": "PROD-001",
  "nombre": "Producto Test",
  "descripcion": "Descripción del producto",
  "categoria_id": 1,
  "proveedor_id": 1,
  "precio_compra": 100.00,
  "precio_venta": 150.00,
  "stock_minimo": 10,
  "stock_critico": 5,
  "unidad_medida": "unidad",
  "ubicacion": "Estante A1",
  "imagen": "url_imagen"
}
```

### 4. Actualizar Producto
```
PUT /api/productos/{id}
Authorization: Bearer {token}
Rol requerido: administrador, encargado

{
  "nombre": "Nuevo nombre",
  "precio_venta": 175.00
}
```

### 5. Eliminar Producto (desactivar)
```
DELETE /api/productos/{id}
Authorization: Bearer {token}
Rol requerido: administrador
```

### 6. Obtener Alertas de Stock
```
GET /api/productos/alertas/stock
Authorization: Bearer {token}

Retorna productos con stock bajo o crítico
```

---

## Rutas de Categorías - `/api/categorias`

### 1. Obtener Categorías
```
GET /api/categorias
```

### 2. Obtener Categoría
```
GET /api/categorias/{id}
```

### 3. Obtener Productos por Categoría
```
GET /api/categorias/{id}/productos?pagina=1&limite=10
```

### 4. Crear Categoría
```
POST /api/categorias
Authorization: Bearer {token}
Rol requerido: administrador

{
  "nombre": "Electrónica",
  "descripcion": "Productos electrónicos"
}
```

### 5. Actualizar Categoría
```
PUT /api/categorias/{id}
Authorization: Bearer {token}
Rol requerido: administrador
```

### 6. Eliminar Categoría
```
DELETE /api/categorias/{id}
Authorization: Bearer {token}
Rol requerido: administrador
```

---

## Rutas de Proveedores - `/api/proveedores`

### 1. Obtener Proveedores
```
GET /api/proveedores?pagina=1&limite=10&buscar=termo
```

### 2. Obtener Proveedor
```
GET /api/proveedores/{id}
```

### 3. Obtener Productos por Proveedor
```
GET /api/proveedores/{id}/productos?pagina=1&limite=10
```

### 4. Crear Proveedor
```
POST /api/proveedores
Authorization: Bearer {token}
Rol requerido: administrador

{
  "nombre": "Proveedor XYZ",
  "contacto": "Contacto principal",
  "telefono": "123456789",
  "email": "proveedor@example.com",
  "direccion": "Calle 123",
  "cuit": "20123456789",
  "condiciones_pago": "Contado"
}
```

### 5. Actualizar Proveedor
```
PUT /api/proveedores/{id}
Authorization: Bearer {token}
Rol requerido: administrador, encargado
```

### 6. Desactivar Proveedor
```
PATCH /api/proveedores/{id}/desactivar
Authorization: Bearer {token}
Rol requerido: administrador
```

---

## Rutas de Movimientos - `/api/movimientos`

### 1. Registrar Movimiento
```
POST /api/movimientos
Authorization: Bearer {token}
Rol requerido: administrador, encargado

{
  "producto_id": 1,
  "tipo_movimiento": "entrada",  // entrada, salida, ajuste
  "cantidad": 50,
  "motivo": "Compra a proveedor",
  "observaciones": "Factura #123"
}
```

### 2. Obtener Movimientos
```
GET /api/movimientos?pagina=1&limite=20&producto_id=1&tipo_movimiento=entrada&desde=2024-01-01&hasta=2024-12-31
Authorization: Bearer {token}
```

### 3. Obtener Historial de Producto
```
GET /api/movimientos/producto/{id}?pagina=1&limite=20
Authorization: Bearer {token}
```

### 4. Obtener Alertas de Stock
```
GET /api/movimientos/alertas/stock
Authorization: Bearer {token}
```

### 5. Obtener Resumen de Movimientos
```
GET /api/movimientos/resumen/general?desde=2024-01-01&hasta=2024-12-31
Authorization: Bearer {token}
```

---

## Permisos por Rol

### Administrador
- Crear, leer, actualizar, eliminar productos, categorías, proveedores
- Gestionar usuarios y roles
- Registrar movimientos
- Acceso a todos los reportes

### Encargado de Depósito
- Leer y actualizar productos
- Leer categorías y proveedores
- Registrar movimientos (entradas, salidas, ajustes)
- Acceso a reportes de inventario

### Consultor
- Leer productos, categorías, proveedores
- Leer historial de movimientos
- Acceso a reportes de consulta

---

## Rutas de Reportes - `/api/reportes`

### Reportes JSON (Datos Estructurados)

#### 1. Estadísticas Generales
```
GET /api/reportes/json/estadisticas
Authorization: Bearer {token}
x-api-key: tu_api_key

Respuesta:
{
  "totalProductos": 45,
  "totalMovimientos": 234,
  "movimientosPorTipo": {
    "entrada": 120,
    "salida": 100,
    "ajuste": 14
  }
}
```

#### 2. Movimientos por Tipo
```
GET /api/reportes/json/movimientos-por-tipo?desde=2024-01-01&hasta=2024-12-31
Authorization: Bearer {token}
x-api-key: tu_api_key

Parámetros:
- desde: Fecha inicio (YYYY-MM-DD) - Requerido
- hasta: Fecha fin (YYYY-MM-DD) - Requerido
```

#### 3. Productos Más Movidos
```
GET /api/reportes/json/productos-mas-movidos?desde=2024-01-01&hasta=2024-12-31&limite=10
Authorization: Bearer {token}
x-api-key: tu_api_key

Parámetros:
- desde: Fecha inicio (YYYY-MM-DD) - Requerido
- hasta: Fecha fin (YYYY-MM-DD) - Requerido
- limite: Cantidad de productos (default: 10)
```

#### 4. Valor Promedio por Categoría
```
GET /api/reportes/json/valor-promedio-categoria
Authorization: Bearer {token}
x-api-key: tu_api_key
```

### Reportes PDF (Documentos Descargables)

#### 1. PDF - Estadísticas Generales
```
GET /api/reportes/pdf/estadisticas
Authorization: Bearer {token}
x-api-key: tu_api_key

Retorna: archivo PDF - estadisticas.pdf
Contenido: Totales generales, movimientos por tipo, resumen ejecutivo
```

#### 2. PDF - Productos por Categoría
```
GET /api/reportes/pdf/productos-por-categoria
Authorization: Bearer {token}
x-api-key: tu_api_key

Retorna: archivo PDF - productos-por-categoria.pdf
Contenido: Productos agrupados, precios, stock, datos de proveedor
```

#### 3. PDF - Movimientos
```
GET /api/reportes/pdf/movimientos?desde=2024-01-01&hasta=2024-12-31
Authorization: Bearer {token}
x-api-key: tu_api_key

Parámetros:
- desde: Fecha inicio (YYYY-MM-DD) - Requerido
- hasta: Fecha fin (YYYY-MM-DD) - Requerido

Retorna: archivo PDF - movimientos.pdf
Contenido: Tabla de movimientos, entrada/salida/ajuste, usuario
```

#### 4. PDF - Alertas de Stock
```
GET /api/reportes/pdf/alertas-stock
Authorization: Bearer {token}
x-api-key: tu_api_key

Retorna: archivo PDF - alertas-stock.pdf
Contenido: Stock crítico (rojo), mínimo (amarillo), recomendaciones
```

### Reportes Excel (Hojas de Cálculo)

#### 1. Excel - Productos
```
GET /api/reportes/excel/productos
Authorization: Bearer {token}
x-api-key: tu_api_key

Retorna: archivo XLSX - productos.xlsx
Contenido: Código, nombre, categoría, proveedor, precios, stocks
Columnas: 11 (código, nombre, categoría, proveedor, p.compra, p.venta, stock actual, stock mín, stock crit, unidad, ubicación)
```

#### 2. Excel - Movimientos
```
GET /api/reportes/excel/movimientos?desde=2024-01-01&hasta=2024-12-31
Authorization: Bearer {token}
x-api-key: tu_api_key

Parámetros:
- desde: Fecha inicio (YYYY-MM-DD) - Requerido
- hasta: Fecha fin (YYYY-MM-DD) - Requerido

Retorna: archivo XLSX - movimientos.xlsx
Contenido: Fecha, producto, tipo, cantidad, usuario, motivo
Colores: Verde (entrada), Rojo (salida), Azul (ajuste)
```

#### 3. Excel - Alertas de Stock
```
GET /api/reportes/excel/alertas-stock
Authorization: Bearer {token}
x-api-key: tu_api_key

Retorna: archivo XLSX - alertas-stock.xlsx
Contenido: 2 hojas (Stock Crítico, Stock Mínimo)
Colores: Rojo (crítico), Amarillo (mínimo)
```

#### 4. Excel - Estadísticas
```
GET /api/reportes/excel/estadisticas
Authorization: Bearer {token}
x-api-key: tu_api_key

Retorna: archivo XLSX - estadisticas.xlsx
Contenido: Métricas principales, total stock, desglose por tipo de movimiento
```

---

## Variables de Entorno Necesarias

```
DATABASE_URL=postgresql://usuario:password@localhost:5432/inventario
JWT_SECRET=tu_clave_secreta_muy_segura
API_KEY=tu_api_key_muy_segura
NODE_ENV=development
PORT=3000
```

---

## Códigos de Error

- 200: OK
- 201: Creado
- 400: Solicitud inválida
- 401: No autenticado / API_KEY inválida
- 403: Acceso denegado / Permisos insuficientes
