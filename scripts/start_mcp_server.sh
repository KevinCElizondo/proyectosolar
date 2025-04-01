#!/bin/bash

# Script para iniciar el servidor MCP de Solar Fluidity

echo "Iniciando servidor MCP de Solar Fluidity..."

# Ruta al directorio de integración MCP
MCP_DIR="../src/integrations/mcp"

# Verificar que estamos en el directorio correcto
if [ ! -d "$MCP_DIR" ]; then
    echo "Error: Directorio de integración MCP no encontrado"
    echo "Ejecute este script desde el directorio scripts/ del proyecto"
    exit 1
fi

# Verificar que el archivo .env existe
if [ ! -f "$MCP_DIR/.env" ]; then
    echo "Error: Archivo .env no encontrado en $MCP_DIR"
    echo "Asegúrese de crear el archivo .env con las credenciales de Supabase:"
    echo "SUPABASE_URL=https://rlqvkqaownzqelvxnhzd.supabase.co"
    echo "SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0"
    exit 1
fi

# Instalar dependencias si es necesario
pip install -r "../requirements.txt" 2>/dev/null
pip install supabase python-dotenv httpx mcp 2>/dev/null

# Crear las tablas necesarias en Supabase
echo "Verificando/creando tablas en Supabase..."
python -c "
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import json

# Cargar variables de entorno
load_dotenv('$MCP_DIR/.env')

# Obtener credenciales
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')

if not supabase_url or not supabase_key:
    print('Error: Credenciales de Supabase no encontradas en .env')
    exit(1)

# Conectar a Supabase
print('Conectando a Supabase...')
supabase = create_client(supabase_url, supabase_key)

# Verificar si las tablas existen
try:
    facturas = supabase.table('facturas').select('*').limit(1).execute()
    print('✓ Tabla facturas ya existe')
except Exception as e:
    print('Creando tabla facturas...')
    try:
        # Crear tabla
        supabase.table('facturas').insert({
            'cliente_nombre': 'Test',
            'cliente_cedula': '123456789',
            'subtotal': 1000,
            'impuesto': 130,
            'monto_total': 1130,
        }).execute()
        print('✓ Tabla facturas creada')
    except Exception as e:
        print(f'Error al crear tabla facturas: {e}')
        print('Por favor, cree manualmente las tablas en Supabase usando el SQL proporcionado')
        exit(1)

print('Configuración de Supabase completada')
"

# Iniciar el servidor MCP
echo "Iniciando servidor MCP..."
cd "$MCP_DIR"
python solar_fluidity_mcp_server.py
