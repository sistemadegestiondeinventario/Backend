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

## Variables de Entorno Necesarias

```
DATABASE_URL=postgresql://usuario:password@localhost:5432/inventario
JWT_SECRET=tu_clave_secreta_muy_segura
NODE_ENV=development
PORT=3000
```

---

## Códigos de Error

- 200: OK
- 201: Creado
- 400: Solicitud inválida
- 401: No autenticado
- 403: Acceso denegado
- 404: No encontrado
- 500: Error interno del servidor
