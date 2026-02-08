# Especificaciones Técnicas de Reportes

## Estructura de Datos por Reporte

### 📄 REPORTES JSON

#### 1. GET /api/reportes/json/estadisticas
**Respuesta:**
```json
{
  "totalProductos": 45,
  "totalMovimientos": 234,
  "totalStock": 1500,
  "movimientosPorTipo": {
    "entrada": 120,
    "salida": 100,
    "ajuste": 14
  },
  "productosAlerta": {
    "critico": 3,
    "minimo": 7
  }
}
```

#### 2. GET /api/reportes/json/movimientos-por-tipo?desde=...&hasta=...
**Respuesta:**
```json
{
  "periodo": {
    "desde": "2024-01-01",
    "hasta": "2024-12-31"
  },
  "resumen": {
    "total": 234,
    "entrada": 120,
    "salida": 100,
    "ajuste": 14
  },
  "detalle": [
    {
      "tipo": "entrada",
      "cantidad": 120,
      "porcentaje": 51.28
    },
    {
      "tipo": "salida",
      "cantidad": 100,
      "porcentaje": 42.74
    },
    {
      "tipo": "ajuste",
      "cantidad": 14,
      "porcentaje": 5.98
    }
  ]
}
```

#### 3. GET /api/reportes/json/productos-mas-movidos?desde=...&hasta=...&limite=10
**Respuesta:**
```json
{
  "periodo": {
    "desde": "2024-01-01",
    "hasta": "2024-12-31"
  },
  "productos": [
    {
      "id": 5,
      "codigo": "PROD-001",
      "nombre": "Producto X",
      "totalMovimientos": 45,
      "entradas": 20,
      "salidas": 25,
      "categoria": "Electrónica",
      "proveedor": "Proveedor A"
    },
    {
      "id": 8,
      "codigo": "PROD-008",
      "nombre": "Producto Y",
      "totalMovimientos": 38,
      "entradas": 15,
      "salidas": 23,
      "categoria": "Herramientas",
      "proveedor": "Proveedor B"
    }
  ]
}
```

#### 4. GET /api/reportes/json/valor-promedio-categoria
**Respuesta:**
```json
{
  "categorias": [
    {
      "id": 1,
      "nombre": "Electrónica",
      "productos": 12,
      "precioPromedio": 850.50,
      "stockPromedio": 45,
      "valorTotalStock": 10260.00
    },
    {
      "id": 2,
      "nombre": "Herramientas",
      "productos": 18,
      "precioPromedio": 245.75,
      "stockPromedio": 65,
      "valorTotalStock": 15996.75
    }
  ]
}
```

---

## 📊 REPORTES PDF

### Estructura General de PDFs
Todos los PDFs incluyen:
- **Encabezado**: Logo, nombre del negocio, fecha de generación
- **Título**: Tipo de reporte
- **Período**: Si aplica (desde/hasta)
- **Contenido**: Tabla o gráfico según tipo
- **Pie de página**: Página X de Y, fecha/hora

### 1. PDF - Estadísticas Generales (estadisticas.pdf)
**Dimensiones:** A4 (210 x 297 mm)
**Orientación:** Vertical
**Secciones:**
- Resumen ejecutivo (totales principales)
- Gráfico de movimientos por tipo
- Tabla de alertas
- Fecha y hora de generación

**Colores:**
- Encabezado: Azul (#1F4E78)
- Crítico: Rojo (#AA0000)
- Mínimo: Amarillo (#FF9800)
- Fondo: Blanco

### 2. PDF - Productos por Categoría (productos-por-categoria.pdf)
**Dimensiones:** A4 (210 x 297 mm)
**Orientación:** Vertical
**Contenido por Categoría:**
| Campo | Ancho |
|-------|-------|
| Código | 15% |
| Nombre | 25% |
| Precio Compra | 15% |
| Precio Venta | 15% |
| Stock Actual | 12% |
| Ubicación | 18% |

**Saltos de Página:** Una categoría por página si es necesario
**Orden:** Alfabético por categoría, luego por nombre de producto

### 3. PDF - Movimientos (movimientos.pdf)
**Dimensiones:** A4 (210 x 297 mm)
**Orientación:** Horizontal (Landscape)
**Columnas:**
| Campo | Ancho | Descripción |
|-------|-------|-------------|
| Fecha | 12% | dd/mm/yyyy |
| Producto | 20% | Nombre producto |
| Código | 10% | Código único |
| Tipo | 10% | Entrada/Salida/Ajuste |
| Cantidad | 10% | Número |
| Usuario | 15% | Quien registró |
| Motivo | 15% | Razón del movimiento |
| Observaciones | 18% | Notas adicionales |

**Colores por Tipo:**
- Entrada: Verde (#D4EDDA)
- Salida: Rojo (#F8D7D7)
- Ajuste: Azul (#CFE2FF)

**Orden:** Cronológico descendente (más recientes primero)

### 4. PDF - Alertas de Stock (alertas-stock.pdf)
**Dimensiones:** A4 (210 x 297 mm)
**Orientación:** Vertical
**Secciones:**

#### Stock Crítico (Rojo)
| Campo | Contenido |
|-------|-----------|
| Nombre Sección | PRODUCTOS EN STOCK CRÍTICO |
| Fondo | Rojo (#AA0000) |
| Tabla | Código, Nombre, Stock Actual, Stock Crítico, Proveedor |

#### Stock Mínimo (Amarillo)
| Campo | Contenido |
|-------|-----------|
| Nombre Sección | PRODUCTOS CON STOCK MÍNIMO |
| Fondo | Amarillo (#FF9800) |
| Tabla | Código, Nombre, Stock Actual, Stock Mínimo, Proveedor |

---

## 📊 REPORTES EXCEL

### 1. Excel - Productos (productos.xlsx)
**Hojas:** 1 (Productos)
**Formato:** .xlsx (OpenXML)

**Columnas:**
```
A: Código (Texto, Ancho: 12)
B: Nombre (Texto, Ancho: 25)
C: Categoría (Texto, Ancho: 15)
D: Proveedor (Texto, Ancho: 15)
E: P. Compra (Moneda, Ancho: 12)
F: P. Venta (Moneda, Ancho: 12)
G: Stock Actual (Número, Ancho: 13)
H: Stock Mín (Número, Ancho: 12)
I: Stock Crit (Número, Ancho: 12)
J: Unidad Medida (Texto, Ancho: 13)
K: Ubicación (Texto, Ancho: 15)
```

**Estilos:**
- Encabezado: Azul (#1F4E78), texto blanco, negrita
- Precios: Formato $#,##0.00
- Stock: Centrado
- Orden: Alfabético por nombre

### 2. Excel - Movimientos (movimientos.xlsx)
**Hojas:** 1 (Movimientos)
**Formato:** .xlsx

**Columnas:**
```
A: Fecha (Fecha dd/mm/yyyy, Ancho: 15)
B: Producto (Texto, Ancho: 25)
C: Código (Texto, Ancho: 12)
D: Tipo (Texto, Ancho: 12)
E: Cantidad (Número, Ancho: 12)
F: Usuario (Texto, Ancho: 15)
G: Motivo (Texto, Ancho: 20)
H: Observaciones (Texto, Ancho: 30)
```

**Estilos:**
- Encabezado: Azul (#1F4E78), texto blanco, negrita
- Tipo "entrada": Fondo verde (#D4EDDA)
- Tipo "salida": Fondo rojo (#F8D7D7)
- Tipo "ajuste": Fondo azul (#CFE2FF)
- Orden: Descendente por fecha

### 3. Excel - Alertas de Stock (alertas-stock.xlsx)
**Hojas:** 2 (Stock Crítico, Stock Mínimo)
**Formato:** .xlsx

**Hoja 1 - Stock Crítico:**
```
Encabezado: Rojo (#FFAA0000), texto blanco
Columnas:
  A: Código (Texto, 12)
  B: Nombre (Texto, 25)
  C: Stock Actual (Número, 13)
  D: Stock Crítico (Número, 13)
  E: Categoría (Texto, 15)
  F: Proveedor (Texto, 15)
  G: P. Venta (Moneda, 12)

Filas de datos: Fondo rojo claro (#FFFFE0E0)
```

**Hoja 2 - Stock Mínimo:**
```
Encabezado: Naranja (#FFFF9800), texto blanco
Columnas: Idénticas a Stock Crítico
Filas de datos: Fondo amarillo claro (#FFFFFFF80)
```

### 4. Excel - Estadísticas (estadisticas.xlsx)
**Hojas:** 1 (Estadísticas)
**Formato:** .xlsx

**Contenido:**
```
Sección 1: Métricas Principales
  Row 1: Encabezado (Métrica | Valor)
  Row 2: Total Productos Activos | {número}
  Row 3: Total Movimientos Registrados | {número}
  Row 4: Stock Total (unidades) | {número}
  Row 5: Valor Total Stock | ${valor}

Sección 2: Movimientos por Tipo (separada por línea)
  Row 8: Encabezado (negrita)
  Row 9-11: Detalle por tipo (Entrada, Salida, Ajuste)

Formato:
  Columna A: Métrica (Ancho: 30)
  Columna B: Valor (Ancho: 20)
  Encabezados: Azul (#1F4E78), negrita, texto blanco
  Valores: Centrados (números)
```

---

## 🔒 Seguridad

### Datos Sensibles Excluidos de Reportes
- Contraseñas de usuarios
- Tokens JWT
- API Keys
- Datos personales completos (solo nombre)
- Configuración del servidor

### Información Incluida
- Solo datos públicos del negocio
- Información de stock y movimientos autorizados
- Datos de empleados (solo nombre)
- Información de proveedores pública

---

## ⚡ Rendimiento

### Límites Recomendados
- Máximo de movimientos por reporte: 10,000
- Máximo de productos: 5,000
- Período máximo: 12 meses
- Tamaño máximo PDF: 50 MB
- Tamaño máximo Excel: 10 MB

### Optimización
- Se recomienda usar reportes JSON para volúmenes muy grandes
- PDFs generados bajo demanda (no cacheados)
- Excel optimizado con formatos nativos

---

## 📝 Validaciones

### Validaciones de Entrada
```
desde/hasta:
  - Formato: YYYY-MM-DD
  - Obligatorio: Sí (excepto en algunos reportes)
  - Validación: desde <= hasta
  - Rango máximo: 12 meses

limite:
  - Tipo: Número
  - Rango: 1-100
  - Default: 10
```

### Validaciones de Seguridad
```
API_KEY:
  - Longitud mínima: 32 caracteres
  - Ubicación: Header x-api-key o query api_key
  - Validación: Comparación exacta

JWT Token:
  - Formato: Bearer {token}
  - Validación: Firma y expiración
  - Expiración: 24 horas desde emisión
```

