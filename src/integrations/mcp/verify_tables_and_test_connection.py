"""
Script para verificar las tablas en Supabase y probar la conexión con el servidor MCP
"""

import os
import sys
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Obtener credenciales de Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: No se encontraron las credenciales de Supabase en el archivo .env")
    print("Por favor, asegúrate de que el archivo .env existe con SUPABASE_URL y SUPABASE_KEY")
    sys.exit(1)

def verify_supabase_tables():
    """Verificar si las tablas necesarias existen en Supabase"""
    print("Verificando conexión a Supabase...")
    try:
        # Conectar a Supabase
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conexión a Supabase establecida correctamente!")
        
        # Verificar tablas
        print("\nVerificando tablas en Supabase:")
        
        # Las tablas que necesitamos
        required_tables = ['facturas', 'factura_lineas', 'proyectos']
        existing_tables = []
        missing_tables = []
        
        # Intentar seleccionar un registro de cada tabla para verificar si existe
        for table in required_tables:
            try:
                # Intentamos seleccionar un registro de la tabla
                result = supabase.table(table).select('*').limit(1).execute()
                print(f"✅ Tabla '{table}' encontrada.")
                existing_tables.append(table)
            except Exception as e:
                print(f"❌ Tabla '{table}' no encontrada.")
                missing_tables.append(table)
        
        # Si faltan tablas, dar instrucciones para crearlas
        if missing_tables:
            print("\n⚠️ Faltan algunas tablas necesarias. Por favor, créalas en la interfaz web de Supabase.")
            print(f"Accede a: {SUPABASE_URL}")
            print("Ve a SQL Editor y ejecuta los siguientes scripts SQL:")
            
            sql_scripts = {
                'facturas': """
CREATE TABLE facturas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_nombre TEXT NOT NULL,
    cliente_cedula TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    impuesto DECIMAL(10, 2) NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    estado TEXT DEFAULT 'Pendiente de firma',
    xml_generado BOOLEAN DEFAULT FALSE
);""",
                'factura_lineas': """
CREATE TABLE factura_lineas (
    id SERIAL PRIMARY KEY,
    factura_id INTEGER REFERENCES facturas(id),
    descripcion TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);""",
                'proyectos': """
CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_cedula TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('Solar', 'Electromecánico', 'Híbrido')),
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TEXT DEFAULT 'Nuevo' CHECK (estado IN ('Nuevo', 'En progreso', 'Finalizado', 'Cancelado'))
);"""
            }
            
            for table in missing_tables:
                print(f"\n-- Crear tabla {table}")
                print(sql_scripts[table])
            
            print("\nUna vez creadas las tablas, ejecuta este script nuevamente para verificar la configuración.")
            return False
        else:
            print("\n✅ ¡Todas las tablas necesarias están creadas en Supabase!")
            return True
    
    except Exception as e:
        print(f"❌ Error al conectar con Supabase: {str(e)}")
        return False

async def test_mcp_server():
    """Probar la conexión con el servidor MCP"""
    print("\nIniciando prueba del servidor MCP...")
    
    # Configuración para conectar con el servidor MCP
    server_params = StdioServerParameters(
        command="python",
        args=["solar_fluidity_mcp_server.py"],
        env={"SUPABASE_URL": SUPABASE_URL, "SUPABASE_KEY": SUPABASE_KEY}
    )
    
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Inicializar conexión
                print("1. Iniciando conexión con el servidor MCP...")
                await session.initialize()
                print("✅ Servidor MCP inicializado correctamente!")
                
                # Listar recursos disponibles
                print("\n2. Listando recursos disponibles...")
                resources = await session.list_resources()
                print(f"✅ Recursos disponibles: {[resource.uri_template for resource in resources]}")
                
                # Listar herramientas disponibles
                print("\n3. Listando herramientas disponibles...")
                tools = await session.list_tools()
                print(f"✅ Herramientas disponibles: {[tool.name for tool in tools]}")
                
                print("\n✅ ¡Prueba del servidor MCP completada correctamente!")
                print("El servidor MCP está configurado y listo para usar con Supabase.")
    except Exception as e:
        print(f"❌ Error durante la prueba del servidor MCP: {str(e)}")

if __name__ == "__main__":
    # Verificar tablas en Supabase
    tables_ok = verify_supabase_tables()
    
    # Si las tablas están bien, probar el servidor MCP
    if tables_ok:
        print("\nLas tablas están configuradas correctamente. Probando el servidor MCP...")
        try:
            asyncio.run(test_mcp_server())
        except Exception as e:
            print(f"❌ Error al ejecutar la prueba del servidor MCP: {str(e)}")
    else:
        print("\nPor favor, crea las tablas faltantes antes de probar el servidor MCP.")
