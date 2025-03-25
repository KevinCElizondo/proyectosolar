"""
Script para crear las tablas necesarias en Supabase para Solar Fluidity
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

# Conectar a Supabase
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Conexión con Supabase establecida correctamente!")
    
    # Crear tablas
    print("\nCreando tablas en Supabase...")
    
    # Crear tabla de facturas
    print("1. Creando tabla 'facturas'...")
    response = supabase.rpc(
        'query', 
        {
            'query_text': """
            CREATE TABLE IF NOT EXISTS facturas (
                id SERIAL PRIMARY KEY,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                cliente_nombre TEXT NOT NULL,
                cliente_cedula TEXT NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                impuesto DECIMAL(10, 2) NOT NULL,
                monto_total DECIMAL(10, 2) NOT NULL,
                estado TEXT DEFAULT 'Pendiente de firma',
                xml_generado BOOLEAN DEFAULT FALSE
            );
            """
        }
    ).execute()
    print("✓ Tabla 'facturas' creada o ya existente")
    
    # Crear tabla de líneas de factura
    print("2. Creando tabla 'factura_lineas'...")
    response = supabase.rpc(
        'query', 
        {
            'query_text': """
            CREATE TABLE IF NOT EXISTS factura_lineas (
                id SERIAL PRIMARY KEY,
                factura_id INTEGER REFERENCES facturas(id),
                descripcion TEXT NOT NULL,
                cantidad INTEGER NOT NULL,
                precio_unitario DECIMAL(10, 2) NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL
            );
            """
        }
    ).execute()
    print("✓ Tabla 'factura_lineas' creada o ya existente")
    
    # Crear tabla de proyectos
    print("3. Creando tabla 'proyectos'...")
    response = supabase.rpc(
        'query', 
        {
            'query_text': """
            CREATE TABLE IF NOT EXISTS proyectos (
                id SERIAL PRIMARY KEY,
                nombre TEXT NOT NULL,
                cliente_nombre TEXT NOT NULL,
                cliente_cedula TEXT NOT NULL,
                tipo TEXT CHECK (tipo IN ('Solar', 'Electromecánico', 'Híbrido')),
                descripcion TEXT,
                fecha_inicio DATE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estado TEXT DEFAULT 'Nuevo' CHECK (estado IN ('Nuevo', 'En progreso', 'Finalizado', 'Cancelado'))
            );
            """
        }
    ).execute()
    print("✓ Tabla 'proyectos' creada o ya existente")
    
    print("\n¡Tablas creadas exitosamente!")
    print("La base de datos de Solar Fluidity está lista para ser utilizada.")
    
except Exception as e:
    print(f"Error: {str(e)}")
    print("\nNOTA: Si ves un error relacionado con 'query', esto significa que no tienes una función RPC llamada 'query' en tu base de datos.")
    print("Para solucionar esto, debes crear las tablas manualmente a través del Editor SQL en la interfaz web de Supabase.")
    print(f"Accede a: {SUPABASE_URL}/project/default/editor")
    print("Y ejecuta los siguientes scripts SQL:")
    
    # Imprimir los scripts SQL para crear las tablas
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
    
    sys.exit(1)
