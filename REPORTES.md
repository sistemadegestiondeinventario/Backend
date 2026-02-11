# Documentación de Reportes - API Backend

## Resumen
El sistema proporciona reportes en tres formatos: **JSON**, **PDF** y **Excel (XLS)**

---

## 🔐 Autenticación Requerida
Todos los endpoints de reportes requieren:
- **API_KEY**: En header `x-api-key` o query param `api_key`
- **JWT Token**: En header `Authorization: Bearer <token>`

---

## 📊 Reportes JSON

### 1. Estadísticas Generales
```
GET /api/reportes/json/estadisticas
```
**Retorna:**
- Total de productos activos
- Total de movimientos registrados
- Movimientos por tipo (entrada, salida, ajuste)

**Respuesta:**
```json
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

### 2. Movimientos por Tipo
```
GET /api/reportes/json/movimientos-por-tipo?desde=2024-01-01&hasta=2024-12-31
```
**Parámetros:**
- `desde`: Fecha de inicio (YYYY-MM-DD)
- `hasta`: Fecha de fin (YYYY-MM-DD)

### 3. Productos Más Movidos
```
GET /api/reportes/json/productos-mas-movidos?desde=2024-01-01&hasta=2024-12-31&limite=10
```
**Parámetros:**
- `desde`: Fecha de inicio (YYYY-MM-DD)
- `hasta`: Fecha de fin (YYYY-MM-DD)
- `limite`: Cantidad de productos (default: 10)

### 4. Valor Promedio por Categoría
```
GET /api/reportes/json/valor-promedio-categoria
```
**Retorna:** Valor promedio de productos por cada categoría

---

## 📄 Reportes PDF

### 1. PDF - Estadísticas Generales
```
GET /api/reportes/pdf/estadisticas
```
**Descarga:** `estadisticas.pdf`
**Contenido:**
- Totales generales
- Movimientos por tipo
- Resumen ejecutivo

### 2. PDF - Productos por Categoría
```
GET /api/reportes/pdf/productos-por-categoria
```
**Descarga:** `productos-por-categoria.pdf`
**Contenido:**
- Productos agrupados por categoría
- Información de precios y stock
- Datos del proveedor

### 3. PDF - Movimientos
```
GET /api/reportes/pdf/movimientos?desde=2024-01-01&hasta=2024-12-31
```
**Descarga:** `movimientos.pdf`
**Parámetros:**
- `desde`: Fecha de inicio (YYYY-MM-DD) - Requerido
- `hasta`: Fecha de fin (YYYY-MM-DD) - Requerido

**Contenido:**
- Tabla de movimientos en rango de fechas
- Detalles de entrada/salida/ajuste
- Usuario que realizó el movimiento

### 4. PDF - Alertas de Stock
```
GET /api/reportes/pdf/alertas-stock
```
**Descarga:** `alertas-stock.pdf`
**Contenido:**
- Productos con stock crítico (rojo)
- Productos con stock mínimo (amarillo)
- Recomendaciones de reorden

---

## 📊 Reportes Excel

### 1. Excel - Productos
```
GET /api/reportes/excel/productos
```
**Descarga:** `productos.xlsx`
**Contenido:**
- Código, nombre, categoría, proveedor
- Precios de compra y venta
- Stock actual, mínimo, crítico
- Unidad de medida y ubicación
- Formato: 1 hoja con 11 columnas

### 2. Excel - Movimientos
```
GET /api/reportes/excel/movimientos?desde=2024-01-01&hasta=2024-12-31
```
**Descarga:** `movimientos.xlsx`
**Parámetros:**
- `desde`: Fecha de inicio (YYYY-MM-DD) - Requerido
- `hasta`: Fecha de fin (YYYY-MM-DD) - Requerido

**Contenido:**
- Fecha, producto, tipo, cantidad
- Usuario que realizó el movimiento
- Motivo y observaciones
- Colores por tipo: Verde (entrada), Rojo (salida), Azul (ajuste)

### 3. Excel - Alertas de Stock
```
GET /api/reportes/excel/alertas-stock
```
**Descarga:** `alertas-stock.xlsx`
**Contenido:**
- 2 hojas: "Stock Crítico" y "Stock Mínimo"
- Formato: Código, nombre, stock actual, stock límite, categoría, proveedor
- Colores: Rojo para crítico, Amarillo para mínimo

### 4. Excel - Estadísticas Generales
```
GET /api/reportes/excel/estadisticas
```
**Descarga:** `estadisticas.xlsx`
**Contenido:**
- Resumen de métricas principales
- Total de productos, movimientos, stock
- Valor total del stock
- Desglose de movimientos por tipo

---

## 📌 Ejemplos de Uso

### Ejemplo 1: Descargar PDF de Movimientos
```bash
curl -X GET "http://localhost:3000/api/reportes/pdf/movimientos?desde=2024-01-01&hasta=2024-12-31" \
  -H "x-api-key: tu_api_key" \
  -H "Authorization: Bearer tu_jwt_token" \
  -o movimientos.pdf
```

### Ejemplo 2: Obtener Estadísticas en JSON
```bash
curl -X GET "http://localhost:3000/api/reportes/json/estadisticas" \
  -H "x-api-key: tu_api_key" \
  -H "Authorization: Bearer tu_jwt_token"
```

### Ejemplo 3: Descargar Excel de Productos
```bash
curl -X GET "http://localhost:3000/api/reportes/excel/productos" \
  -H "x-api-key: tu_api_key" \
  -H "Authorization: Bearer tu_jwt_token" \
  -o productos.xlsx
```

---

## 🔒 Notas de Seguridad

1. **API_KEY**: Todos los endpoints requieren API_KEY válida
2. **JWT Token**: Requerido para autenticación
3. **Permisos**: Los usuarios con rol "consultor" pueden ver reportes
4. **Rate Limiting**: Considere implementar límites de velocidad para descargas masivas
5. **Auditoría**: Se recomienda registrar las descargas de reportes

---

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 401 Unauthorized | API_KEY inválida o faltante | Verificar `x-api-key` en headers |
| 401 Unauthorized | JWT token expirado | Generar nuevo token de login |
| 400 Bad Request | Parámetros desde/hasta faltantes | Incluir parámetros de fecha |
| 500 Server Error | Error en generación de reporte | Verificar logs del servidor |

---

## 🚀 Mejoras Futuras

1. Filtros adicionales por categoría/proveedor
2. Exportación a CSV
3. Reportes programados por email
4. Generación de reportes en segundo plano para grandes volúmenes
5. Gráficos interactivos en PDF
6. Comparativas período a período

---

**Última actualización:** 2024
**Versión:** 2.0
