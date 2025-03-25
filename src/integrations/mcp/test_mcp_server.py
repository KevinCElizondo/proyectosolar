"""
Script de prueba para el servidor MCP de Solar Fluidity
Este script te permite probar la conexión con Supabase y las funcionalidades
del servidor MCP para la gestión de facturas y proyectos.
"""

import os
import asyncio
import json
from dotenv import load_dotenv
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Verificar que las variables de entorno necesarias estén presentes
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Error: Variables SUPABASE_URL y SUPABASE_KEY no encontradas.")
    print("Por favor, crea un archivo .env basado en supabase_config.example.env")
    exit(1)

# Configuración para conectar con el servidor MCP
server_params = StdioServerParameters(
    command="python",
    args=["solar_fluidity_mcp_server.py"],
    env={"SUPABASE_URL": supabase_url, "SUPABASE_KEY": supabase_key}
)

async def test_server():
    """Probar las funcionalidades del servidor MCP."""
    print("Iniciando pruebas del servidor MCP para Solar Fluidity...")
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Inicializar conexión
            print("\n1. Inicializando conexión con el servidor MCP...")
            await session.initialize()
            
            # Listar herramientas disponibles
            print("\n2. Listando herramientas disponibles...")
            tools = await session.list_tools()
            print(f"Herramientas disponibles: {[tool.name for tool in tools]}")
            
            # Listar recursos disponibles
            print("\n3. Listando recursos disponibles...")
            resources = await session.list_resources()
            print(f"Recursos disponibles: {[resource.uri_template for resource in resources]}")
            
            # Prueba de lectura de facturas
            print("\n4. Probando recurso 'invoices://list'...")
            try:
                content, mime_type = await session.read_resource("invoices://list")
                print("Contenido del recurso:")
                print(content)
            except Exception as e:
                print(f"Error al leer facturas: {str(e)}")
            
            # Prueba de lectura de proyectos
            print("\n5. Probando recurso 'projects://list'...")
            try:
                content, mime_type = await session.read_resource("projects://list")
                print("Contenido del recurso:")
                print(content)
            except Exception as e:
                print(f"Error al leer proyectos: {str(e)}")
            
            # Demostración de creación de factura (comentada por defecto)
            """
            print("\n6. Probando creación de factura...")
            try:
                # Ejemplo de datos para una factura
                factura_result = await session.call_tool(
                    "create_invoice",
                    arguments={
                        "cliente_nombre": "Empresa de Prueba, S.A.",
                        "cliente_cedula": "3101123456",
                        "lineas": [
                            {
                                "descripcion": "Instalación de panel solar 500W",
                                "cantidad": 2,
                                "precio_unitario": 350000
                            },
                            {
                                "descripcion": "Servicio de instalación",
                                "cantidad": 1,
                                "precio_unitario": 75000
                            }
                        ]
                    }
                )
                print("Resultado de creación de factura:")
                print(factura_result)
            except Exception as e:
                print(f"Error al crear factura: {str(e)}")
            """
            
            # Demostración de creación de proyecto (comentada por defecto)
            """
            print("\n7. Probando creación de proyecto...")
            try:
                # Ejemplo de datos para un proyecto
                proyecto_result = await session.call_tool(
                    "create_project",
                    arguments={
                        "nombre": "Instalación Residencial Valle del Sol",
                        "cliente_nombre": "Juan Pérez Rodríguez",
                        "cliente_cedula": "108760432",
                        "tipo": "Solar",
                        "descripcion": "Instalación de sistema solar fotovoltaico para residencia de 150m2",
                        "fecha_inicio": "2025-04-15"
                    }
                )
                print("Resultado de creación de proyecto:")
                print(proyecto_result)
            except Exception as e:
                print(f"Error al crear proyecto: {str(e)}")
            """
            
            print("\nPruebas completadas. Descomenta las pruebas adicionales para crear nuevos registros.")

if __name__ == "__main__":
    asyncio.run(test_server())
