"""
Script para configurar las tablas necesarias en Supabase para Solar Fluidity
Este script crea las tablas requeridas para la gestión de facturas electrónicas
y proyectos solares/electromecánicos.
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
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_tables():
    """Crear las tablas necesarias en Supabase."""
    print("Configurando tablas en Supabase para Solar Fluidity...")
    
    # SQL para crear la tabla de facturas
    facturas_sql = """
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
    
    # SQL para crear la tabla de líneas de factura
    factura_lineas_sql = """
    CREATE TABLE IF NOT EXISTS factura_lineas (
        id SERIAL PRIMARY KEY,
        factura_id INTEGER REFERENCES facturas(id),
        descripcion TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL
    );
    """
    
    # SQL para crear la tabla de proyectos
    proyectos_sql = """
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
    
    try:
        # Ejecutar las sentencias SQL
        print("Creando tabla 'facturas'...")
        supabase.table("facturas").select("id").limit(1).execute()
        print("La tabla 'facturas' ya existe.")
    except Exception:
        print("Creando tabla 'facturas'...")
        supabase.rpc("exec_sql", {"query": facturas_sql}).execute()
        print("Tabla 'facturas' creada exitosamente.")
    
    try:
        print("Verificando tabla 'factura_lineas'...")
        supabase.table("factura_lineas").select("id").limit(1).execute()
        print("La tabla 'factura_lineas' ya existe.")
    except Exception:
        print("Creando tabla 'factura_lineas'...")
        supabase.rpc("exec_sql", {"query": factura_lineas_sql}).execute()
        print("Tabla 'factura_lineas' creada exitosamente.")
    
    try:
        print("Verificando tabla 'proyectos'...")
        supabase.table("proyectos").select("id").limit(1).execute()
        print("La tabla 'proyectos' ya existe.")
    except Exception:
        print("Creando tabla 'proyectos'...")
        supabase.rpc("exec_sql", {"query": proyectos_sql}).execute()
        print("Tabla 'proyectos' creada exitosamente.")
    
    print("Configuración de tablas completada.")

def insert_sample_data():
    """Insertar datos de muestra en las tablas."""
    print("\nInsertando datos de muestra...")
    
    # Verificar si ya existen datos
    facturas_result = supabase.table("facturas").select("*").execute()
    if facturas_result.data and len(facturas_result.data) > 0:
        print("Ya existen datos en la tabla 'facturas'. No se insertarán datos de muestra.")
        return
    
    # Factura de muestra
    factura_data = {
        "cliente_nombre": "Empresa de Energías Renovables, S.A.",
        "cliente_cedula": "3101456789",
        "subtotal": 420000,
        "impuesto": 54600,
        "monto_total": 474600,
        "estado": "Pendiente de firma"
    }
    
    # Insertar factura
    print("Insertando factura de muestra...")
    factura_result = supabase.table("facturas").insert(factura_data).execute()
    factura_id = factura_result.data[0]["id"]
    
    # Líneas de factura
    lineas_data = [
        {
            "factura_id": factura_id,
            "descripcion": "Panel solar fotovoltaico 450W",
            "cantidad": 2,
            "precio_unitario": 150000,
            "subtotal": 300000
        },
        {
            "factura_id": factura_id,
            "descripcion": "Servicio de instalación",
            "cantidad": 1,
            "precio_unitario": 120000,
            "subtotal": 120000
        }
    ]
    
    # Insertar líneas
    print("Insertando líneas de factura de muestra...")
    supabase.table("factura_lineas").insert(lineas_data).execute()
    
    # Proyecto de muestra
    proyecto_data = {
        "nombre": "Instalación Residencial Modelo",
        "cliente_nombre": "Carlos Rodríguez Monge",
        "cliente_cedula": "107890123",
        "tipo": "Solar",
        "descripcion": "Instalación de sistema solar fotovoltaico residencial con 4 paneles",
        "fecha_inicio": "2025-04-10",
        "estado": "Nuevo"
    }
    
    # Insertar proyecto
    print("Insertando proyecto de muestra...")
    supabase.table("proyectos").insert(proyecto_data).execute()
    
    print("Datos de muestra insertados exitosamente.")

if __name__ == "__main__":
    try:
        create_tables()
        insert_sample_data()
        print("\n¡Configuración completada exitosamente!")
        print("La base de datos de Solar Fluidity está lista para ser utilizada.")
    except Exception as e:
        print(f"\nError durante la configuración: {str(e)}")
        sys.exit(1)
