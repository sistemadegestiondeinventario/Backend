#!/bin/bash

# ============================================================
# Script de Ejemplo para Usar los Reportes de la API
# ============================================================

# Configuración
API_URL="http://localhost:3000/api"
API_KEY="tu_api_key_aqui"
JWT_TOKEN="tu_jwt_token_aqui"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== EJEMPLOS DE USO DE REPORTES ===${NC}\n"

# ============================================================
# REPORTES JSON
# ============================================================

echo -e "${YELLOW}1. Obteniendo Estadísticas en JSON...${NC}"
curl -X GET "$API_URL/reportes/json/estadisticas" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nStatus: %{http_code}\n\n"

echo -e "${YELLOW}2. Obteniendo Movimientos por Tipo (JSON)...${NC}"
curl -X GET "$API_URL/reportes/json/movimientos-por-tipo?desde=2024-01-01&hasta=2024-12-31" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nStatus: %{http_code}\n\n"

echo -e "${YELLOW}3. Obteniendo Productos Más Movidos (JSON)...${NC}"
curl -X GET "$API_URL/reportes/json/productos-mas-movidos?desde=2024-01-01&hasta=2024-12-31&limite=5" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nStatus: %{http_code}\n\n"

echo -e "${YELLOW}4. Obteniendo Valor Promedio por Categoría (JSON)...${NC}"
curl -X GET "$API_URL/reportes/json/valor-promedio-categoria" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -w "\nStatus: %{http_code}\n\n"

# ============================================================
# REPORTES PDF
# ============================================================

echo -e "${YELLOW}5. Descargando PDF de Estadísticas...${NC}"
curl -X GET "$API_URL/reportes/pdf/estadisticas" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "estadisticas_$(date +%Y%m%d_%H%M%S).pdf" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: estadisticas_$(date +%Y%m%d_%H%M%S).pdf${NC}\n"

echo -e "${YELLOW}6. Descargando PDF de Productos por Categoría...${NC}"
curl -X GET "$API_URL/reportes/pdf/productos-por-categoria" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "productos_por_categoria_$(date +%Y%m%d_%H%M%S).pdf" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: productos_por_categoria_$(date +%Y%m%d_%H%M%S).pdf${NC}\n"

echo -e "${YELLOW}7. Descargando PDF de Movimientos...${NC}"
curl -X GET "$API_URL/reportes/pdf/movimientos?desde=2024-01-01&hasta=2024-12-31" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "movimientos_$(date +%Y%m%d_%H%M%S).pdf" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: movimientos_$(date +%Y%m%d_%H%M%S).pdf${NC}\n"

echo -e "${YELLOW}8. Descargando PDF de Alertas de Stock...${NC}"
curl -X GET "$API_URL/reportes/pdf/alertas-stock" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "alertas_stock_$(date +%Y%m%d_%H%M%S).pdf" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: alertas_stock_$(date +%Y%m%d_%H%M%S).pdf${NC}\n"

# ============================================================
# REPORTES EXCEL
# ============================================================

echo -e "${YELLOW}9. Descargando Excel de Productos...${NC}"
curl -X GET "$API_URL/reportes/excel/productos" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "productos_$(date +%Y%m%d_%H%M%S).xlsx" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: productos_$(date +%Y%m%d_%H%M%S).xlsx${NC}\n"

echo -e "${YELLOW}10. Descargando Excel de Movimientos...${NC}"
curl -X GET "$API_URL/reportes/excel/movimientos?desde=2024-01-01&hasta=2024-12-31" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "movimientos_$(date +%Y%m%d_%H%M%S).xlsx" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: movimientos_$(date +%Y%m%d_%H%M%S).xlsx${NC}\n"

echo -e "${YELLOW}11. Descargando Excel de Alertas de Stock...${NC}"
curl -X GET "$API_URL/reportes/excel/alertas-stock" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "alertas_stock_$(date +%Y%m%d_%H%M%S).xlsx" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: alertas_stock_$(date +%Y%m%d_%H%M%S).xlsx${NC}\n"

echo -e "${YELLOW}12. Descargando Excel de Estadísticas...${NC}"
curl -X GET "$API_URL/reportes/excel/estadisticas" \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o "estadisticas_$(date +%Y%m%d_%H%M%S).xlsx" \
  -w "\nStatus: %{http_code}\n"
echo -e "${GREEN}Descargado a: estadisticas_$(date +%Y%m%d_%H%M%S).xlsx${NC}\n"

echo -e "${GREEN}=== Todos los reportes se han descargado correctamente ===${NC}\n"

# ============================================================
# EJEMPLO CON PYTHON
# ============================================================

echo -e "${BLUE}=== EJEMPLO CON PYTHON ===${NC}\n"

cat > test_reportes.py << 'EOF'
#!/usr/bin/env python3
"""
Script para descargar reportes usando Python
Requiere: pip install requests
"""

import requests
import json
from datetime import datetime, timedelta

# Configuración
API_URL = "http://localhost:3000/api"
API_KEY = "tu_api_key_aqui"
JWT_TOKEN = "tu_jwt_token_aqui"

headers = {
    "x-api-key": API_KEY,
    "Authorization": f"Bearer {JWT_TOKEN}"
}

def descargar_reporte_pdf(endpoint, filename):
    """Descarga un reporte PDF"""
    try:
        response = requests.get(f"{API_URL}/reportes/pdf/{endpoint}", headers=headers)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"✓ PDF descargado: {filename}")
        else:
            print(f"✗ Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"✗ Error al descargar PDF: {e}")

def descargar_reporte_excel(endpoint, filename):
    """Descarga un reporte Excel"""
    try:
        response = requests.get(f"{API_URL}/reportes/excel/{endpoint}", headers=headers)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"✓ Excel descargado: {filename}")
        else:
            print(f"✗ Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"✗ Error al descargar Excel: {e}")

def obtener_reporte_json(endpoint):
    """Obtiene un reporte en formato JSON"""
    try:
        response = requests.get(f"{API_URL}/reportes/json/{endpoint}", headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"✗ Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Error al obtener reporte JSON: {e}")
        return None

# Ejemplos de uso
print("=== REPORTES JSON ===\n")

# Estadísticas
stats = obtener_reporte_json("estadisticas")
if stats:
    print("Estadísticas Generales:")
    print(json.dumps(stats, indent=2))
    print()

# PDFs
print("\n=== REPORTES PDF ===\n")
descargar_reporte_pdf("estadisticas", "estadisticas.pdf")
descargar_reporte_pdf("alertas-stock", "alertas_stock.pdf")

# Excel
print("\n=== REPORTES EXCEL ===\n")
descargar_reporte_excel("productos", "productos.xlsx")
descargar_reporte_excel("estadisticas", "estadisticas.xlsx")

# Con parámetros de fecha
print("\n=== REPORTES CON FILTROS DE FECHA ===\n")
fecha_inicio = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
fecha_fin = datetime.now().strftime("%Y-%m-%d")

params = f"desde={fecha_inicio}&hasta={fecha_fin}"
descargar_reporte_pdf(f"movimientos?{params}", "movimientos_30dias.pdf")
descargar_reporte_excel(f"movimientos?{params}", "movimientos_30dias.xlsx")

print("\n✓ Proceso completado")
EOF

chmod +x test_reportes.py
echo -e "${GREEN}Script Python creado: test_reportes.py${NC}\n"
