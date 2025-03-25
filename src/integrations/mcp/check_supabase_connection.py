"""
Script para verificar la conexión con Supabase y mostrar la información de la base de datos
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Obtener credenciales de Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: No se encontraron las credenciales de Supabase en el archivo .env")
    sys.exit(1)

print(f"URL de Supabase: {SUPABASE_URL}")
print(f"API Key verificada: {'✓' if SUPABASE_KEY else 'ⅹ'}")

# Conectar a Supabase
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Conexión con Supabase establecida correctamente!")
    
    # Verificar si las tablas existen
    try:
        print("\nVerificando tablas existentes:")
        
        # Intentar acceder a la tabla 'facturas'
        facturas_result = supabase.table("facturas").select("count(*)", count="exact").execute()
        print(f"✓ Tabla 'facturas' encontrada. Cantidad de registros: {facturas_result.count if hasattr(facturas_result, 'count') else 'Desconocido'}")
    except Exception as e:
        print(f"ⅹ Tabla 'facturas' no encontrada: {str(e)}")
    
    try:
        # Intentar acceder a la tabla 'factura_lineas'
        lineas_result = supabase.table("factura_lineas").select("count(*)", count="exact").execute()
        print(f"✓ Tabla 'factura_lineas' encontrada. Cantidad de registros: {lineas_result.count if hasattr(lineas_result, 'count') else 'Desconocido'}")
    except Exception as e:
        print(f"ⅹ Tabla 'factura_lineas' no encontrada: {str(e)}")
    
    try:
        # Intentar acceder a la tabla 'proyectos'
        proyectos_result = supabase.table("proyectos").select("count(*)", count="exact").execute()
        print(f"✓ Tabla 'proyectos' encontrada. Cantidad de registros: {proyectos_result.count if hasattr(proyectos_result, 'count') else 'Desconocido'}")
    except Exception as e:
        print(f"ⅹ Tabla 'proyectos' no encontrada: {str(e)}")
    
    print("\nInstrucciones:")
    print("1. Para crear las tablas necesarias, ve a la interfaz web de Supabase:")
    print(f"   {SUPABASE_URL}/project/default/editor")
    print("2. Copia y ejecuta los siguientes scripts SQL:")
    print("\n-- Tabla para facturas")
    print("""CREATE TABLE IF NOT EXISTS facturas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_nombre TEXT NOT NULL,
    cliente_cedula TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    impuesto DECIMAL(10, 2) NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    estado TEXT DEFAULT 'Pendiente de firma',
    xml_generado BOOLEAN DEFAULT FALSE
);""")
    
    print("\n-- Tabla para líneas de factura")
    print("""CREATE TABLE IF NOT EXISTS factura_lineas (
    id SERIAL PRIMARY KEY,
    factura_id INTEGER REFERENCES facturas(id),
    descripcion TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);""")
    
    print("\n-- Tabla para proyectos")
    print("""CREATE TABLE IF NOT EXISTS proyectos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_cedula TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('Solar', 'Electromecánico', 'Híbrido')),
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TEXT DEFAULT 'Nuevo' CHECK (estado IN ('Nuevo', 'En progreso', 'Finalizado', 'Cancelado'))
);""")
    
except Exception as e:
    print(f"Error al conectar con Supabase: {str(e)}")
    sys.exit(1)
