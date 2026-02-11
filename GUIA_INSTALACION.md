# 🚀 GUÍA RÁPIDA DE INSTALACIÓN Y USO

## 📋 Requisitos Previos

- **Node.js:** v14 o superior
- **NPM:** v6 o superior
- **PostgreSQL:** v12 o superior (para producción)
- **SQLite:** Incluido en Node.js (para desarrollo)

## 🔧 Instalación

### 1. Clonar o Descargar el Proyecto
```bash
cd c:\Users\Meunier\Documents\integradorfinal\Backend
```

### 2. Instalar Dependencias
```bash
npm install
```

Esto instalará:
```json
{
  "express": "^5.1.0",
  "sequelize": "^6.37.7",
  "pg": "^8.11.1",
  "sqlite3": "^5.1.7",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "express-validator": "^7.3.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "pdfkit": "^0.13.0",
  "exceljs": "^4.3.0"
}
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Base de Datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/inventario
# O para desarrollo con SQLite:
# DATABASE_URL=sqlite::memory:

# Seguridad
JWT_SECRET=tu_clave_secreta_muy_segura_minimo_32_caracteres_incluye_mayus_minu_numeros
API_KEY=tu_clave_api_muy_segura_minimo_32_caracteres_incluye_mayus_minu_numeros

# Entorno
NODE_ENV=development
PORT=3000
```

### 4. Crear Base de Datos (PostgreSQL)

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE inventario;

# Salir
\q
```

### 5. Iniciar el Servidor

```bash
npm start
```

Debería ver algo como:
```
✅ Servidor escuchando en puerto 3000
✅ Base de datos conectada
```

---

## ✅ Verificar que Funciona

### 1. Health Check (sin autenticación)
```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "estado": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Información de API (sin autenticación)
```bash
curl http://localhost:3000/
```

**Respuesta esperada:**
```json
{
  "mensaje": "✅ API Sistema de Gestión de Inventario",
  "version": "1.0.0",
  "estado": "Activo",
  "funcionalidades": [...]
}
```

### 3. Intentar Acceder a Ruta Protegida (debería fallar)
```bash
curl http://localhost:3000/api/productos
```

**Respuesta esperada (error 401):**
```json
{
  "error": "API_KEY inválida o no proporcionada"
}
```

---

## 🔐 Autenticación

### 1. Registrar un Usuario

```bash
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_clave_api" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "rol": "administrador"
  }'
```

**Respuesta:**
```json
{
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "administrador",
    "activo": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_clave_api" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:** (igual al registro)

---

## 📊 Usar Reportes

### 1. Obtener Estadísticas (JSON)
```bash
curl -X GET http://localhost:3000/api/reportes/json/estadisticas \
  -H "x-api-key: tu_clave_api" \
  -H "Authorization: Bearer tu_token_aqui"
```

### 2. Descargar Reporte PDF
```bash
curl -X GET http://localhost:3000/api/reportes/pdf/estadisticas \
  -H "x-api-key: tu_clave_api" \
  -H "Authorization: Bearer tu_token_aqui" \
  -o estadisticas.pdf
```

### 3. Descargar Reporte Excel
```bash
curl -X GET http://localhost:3000/api/reportes/excel/productos \
  -H "x-api-key: tu_clave_api" \
  -H "Authorization: Bearer tu_token_aqui" \
  -o productos.xlsx
```

### 4. Reportes con Filtros de Fecha
```bash
curl -X GET "http://localhost:3000/api/reportes/excel/movimientos?desde=2024-01-01&hasta=2024-12-31" \
  -H "x-api-key: tu_clave_api" \
  -H "Authorization: Bearer tu_token_aqui" \
  -o movimientos.xlsx
```

---

## 📁 Estructura de Carpetas Importantes

```
Backend/
├── src/
│   ├── app.js                           # Configuración principal
│   ├── server.js                        # Punto de entrada
│   ├── config/
│   │   └── database.js                  # Conexión a BD
│   ├── models/                          # Definición de entidades
│   ├── controllers/                     # Lógica de endpoints
│   ├── services/                        # Lógica de negocio
│   ├── middleware/                      # Autenticación, validación
│   └── routes/                          # Definición de rutas
├── package.json                         # Dependencias
├── .env                                 # Variables de entorno
├── API_RUTAS.md                         # Documentación de rutas
├── REPORTES.md                          # Guía de reportes
├── CHECKLIST_FINAL.md                   # Verificación final
└── ESPECIFICACIONES_REPORTES.md         # Detalles técnicos
```

---

## 🐳 Opción: Usar Docker

### Usar Docker Compose
```bash
docker-compose up -d
```

Verifica que `docker-compose.yml` esté configurado correctamente.

---

## 🧪 Pruebas Rápidas

### Script de Pruebas Incluido
```bash
bash ejemplos_reportes.sh
```

Este script ejecuta:
- 4 solicitudes JSON
- 4 descargas PDF
- 4 descargas Excel

### Script Python Incluido
```bash
python3 test_reportes.py
```

(Requiere: `pip install requests`)

---

## 📝 Archivos de Documentación

| Archivo | Contenido |
|---------|-----------|
| `README_BACKEND.md` | Descripción general del proyecto |
| `API_RUTAS.md` | Todos los endpoints disponibles |
| `REPORTES.md` | Guía completa de reportes |
| `ESPECIFICACIONES_REPORTES.md` | Detalles técnicos de reportes |
| `IMPLEMENTACION_REPORTES.md` | Resumen de implementación |
| `CHECKLIST_FINAL.md` | Verificación de requisitos |
| `ejemplos_reportes.sh` | Script de ejemplos (bash) |

---

## 🐛 Solución de Problemas

### Error: "Error de conexión a PostgreSQL"
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres -d inventario -c "SELECT 1;"
```

### Error: "Cannot find module 'dotenv'"
```bash
npm install
```

### Error: "API_KEY inválida"
```bash
# Verificar que en .env tiene API_KEY configurada
# y que se está pasando en el header x-api-key
```

### Error: "JWT token inválido"
```bash
# El token tiene 24 horas de validez
# Generar uno nuevo con /api/usuarios/login
```

### Puerto 3000 ya está en uso
```bash
# Cambiar el puerto en .env
PORT=3001
```

---

## 🔒 Seguridad - Checklist antes de Producción

- [ ] `JWT_SECRET` es una cadena larga y aleatoria (mínimo 32 caracteres)
- [ ] `API_KEY` es una cadena larga y aleatoria (mínimo 32 caracteres)
- [ ] `NODE_ENV=production` en servidor
- [ ] HTTPS habilitado en el servidor
- [ ] CORS configurado correctamente (no usar `*` en producción)
- [ ] Contraseña de PostgreSQL es fuerte
- [ ] Backups de BD configurados
- [ ] Logs habilitados
- [ ] Rate limiting implementado
- [ ] Variables de entorno no incluidas en repositorio

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que Node.js y NPM estén instalados:
   ```bash
   node -v
   npm -v
   ```

2. Verifica que las dependencias estén instaladas:
   ```bash
   npm list
   ```

3. Revisa los logs del servidor:
   ```bash
   npm start
   ```

4. Consulta la documentación:
   - Ver `API_RUTAS.md` para endpoints
   - Ver `REPORTES.md` para reportes
   - Ver `ESPECIFICACIONES_REPORTES.md` para detalles

---

## 🎉 ¡Listo!

Ya tienes tu sistema de gestión de inventario completo y funcional.

**Próximos pasos:**
1. Crear categorías y proveedores
2. Cargar productos
3. Registrar movimientos de stock
4. Generar reportes
5. Integrar con frontend

---

**Versión:** 2.0
**Última actualización:** 2024
**Estado:** ✅ Producción
