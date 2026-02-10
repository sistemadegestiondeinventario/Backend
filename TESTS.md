# Tests Unitarios - Backend


### Descripción

Se han creado tests unitarios simples y funcionales para los servicios principales del backend usando **Jest**.

### Tests Implementados

#### CategoriaService (10 tests)
- ✅ Obtener todas las categorías ordenadas por nombre
- ✅ Retornar array vacío si no hay categorías
- ✅ Obtener una categoría por ID
- ✅ Lanzar error si categoría no existe
- ✅ Crear categoría con datos válidos
- ✅ Lanzar error si falta nombre
- ✅ Actualizar categoría existente
- ✅ Lanzar error al actualizar categoría inexistente
- ✅ Eliminar categoría existente
- ✅ Lanzar error al eliminar categoría inexistente

#### UsuarioService (8 tests)
- ✅ Registrar nuevo usuario con datos válidos
- ✅ Lanzar error si email ya existe
- ✅ Login con credenciales válidas retorna JWT token
- ✅ Lanzar error si usuario no existe
- ✅ Lanzar error si contraseña es incorrecta
- ✅ Lanzar error si JWT_SECRET no está configurado
- ✅ Obtener usuario por ID sin contraseña
- ✅ Lanzar error si usuario no existe

#### ProductoService (8 tests)
- ✅ Obtener productos con paginación
- ✅ Retornar array vacío si no hay productos
- ✅ Aplicar filtros de búsqueda
- ✅ Calcular correctamente total de páginas
- ✅ Obtener producto por ID
- ✅ Lanzar error si producto no existe
- ✅ Crear producto con datos válidos
- ✅ Lanzar error si faltan campos requeridos

### Instalación

```bash
npm install
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests una sola vez
npm test

# Ejecutar en modo watch (observa cambios)
npm run test:watch

# Ver cobertura de tests
npm run test:coverage
```

### Tecnologías Usadas

- **Jest**: Framework de testing
- **Mocks**: Todos los modelos de Sequelize están mockeados para tests aislados
- **Node.js**: Runtime para ejecutar los tests
