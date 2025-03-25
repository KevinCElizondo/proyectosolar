"""
Script para instalar y probar la conexión con el servidor MCP de Solar Fluidity.
"""

import os
import sys
import subprocess
import tempfile
import json

def print_header(text):
    """Imprime un encabezado formateado."""
    print("\n" + "="*80)
    print(f" {text} ".center(80, "="))
    print("="*80)

def print_success(text):
    """Imprime un mensaje de éxito."""
    print(f"✅ {text}")

def print_error(text):
    """Imprime un mensaje de error."""
    print(f"❌ {text}")

def print_info(text):
    """Imprime un mensaje informativo."""
    print(f"ℹ️ {text}")

def run_command(command, cwd=None):
    """Ejecuta un comando y devuelve su salida."""
    print_info(f"Ejecutando: {command}")
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            cwd=cwd,
            capture_output=True, 
            text=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print_error(f"Error al ejecutar comando: {e}")
        print(e.stdout)
        print(e.stderr)
        return None

def check_python_version():
    """Verifica la versión de Python."""
    print_header("Verificando versión de Python")
    version = sys.version.split()[0]
    print_info(f"Versión de Python: {version}")
    major, minor, _ = version.split(".")
    if int(major) < 3 or (int(major) == 3 and int(minor) < 8):
        print_error("Se requiere Python 3.8 o superior")
        return False
    print_success("Versión de Python compatible")
    return True

def install_pip_packages():
    """Instala los paquetes pip necesarios."""
    print_header("Instalando dependencias")
    packages = [
        "python-dotenv",
        "supabase",
        "httpx"
    ]
    
    for package in packages:
        output = run_command(f"pip install {package}")
        if output:
            print_success(f"Paquete {package} instalado correctamente")
        else:
            print_error(f"Error al instalar {package}")
            return False
    
    # Instalación de MCP SDK, primero verificar si ya existe
    try:
        import mcp
        print_success("MCP SDK ya está instalado")
    except ImportError:
        print_info("Instalando MCP SDK desde GitHub...")
        # En una situación real, debería clonar desde el repositorio oficial
        # Por simplicidad, verificamos si podemos agregar la ruta de src al path
        mcp_path = os.path.join(os.getcwd(), "src", "integrations", "mcp-python-sdk")
        if os.path.exists(mcp_path):
            sys.path.append(mcp_path)
            try:
                import mcp
                print_success("MCP SDK importado desde ruta local")
            except ImportError:
                print_error("No se pudo importar MCP SDK")
                return False
        else:
            print_error("No se encontró el directorio de MCP SDK")
            print_info("Por favor instala el SDK manualmente")
            return False
    
    return True

def test_supabase_connection():
    """Prueba la conexión con Supabase."""
    print_header("Probando conexión con Supabase")
    
    # Cargar variables de entorno
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print_error("Error al importar python-dotenv")
        return False
    
    # Obtener credenciales de Supabase
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print_info("Variables de entorno no encontradas, usando valores predeterminados")
        supabase_url = "https://rlqvkqaownzqelvxnhzd.supabase.co"
        supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0"
    
    try:
        from supabase import create_client
        client = create_client(supabase_url, supabase_key)
        
        # Intentar hacer una consulta simple
        response = client.table("facturas").select("*").limit(1).execute()
        print_success("Conexión a Supabase establecida")
        print_info(f"Respuesta: {response}")
        return True
    except Exception as e:
        print_error(f"Error al conectar con Supabase: {str(e)}")
        return False

def test_mcp_server():
    """Prueba el servidor MCP."""
    print_header("Probando servidor MCP")
    
    # Verificar que existe el archivo del servidor
    server_path = os.path.join("src", "integrations", "mcp", "solar_fluidity_mcp_server.py")
    if not os.path.exists(server_path):
        print_error(f"No se encontró el servidor MCP en: {server_path}")
        return False
    
    # Probar ejecución del servidor
    try:
        env = os.environ.copy()
        env["SUPABASE_URL"] = os.environ.get("SUPABASE_URL", "https://rlqvkqaownzqelvxnhzd.supabase.co")
        env["SUPABASE_KEY"] = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0")
        
        # Crear un script temporal para probar el servidor
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write("""
import asyncio
import json
import subprocess
import sys
from asyncio import StreamReader, StreamWriter

async def read_json(reader: StreamReader):
    line = await reader.readline()
    if not line:
        return None
    return json.loads(line)

async def write_json(writer: StreamWriter, obj):
    writer.write(json.dumps(obj).encode() + b'\\n')
    await writer.drain()

async def main():
    # Iniciar el servidor MCP
    server_process = subprocess.Popen(
        ["python", "src/integrations/mcp/solar_fluidity_mcp_server.py"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Crear streams para comunicación
    reader = StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    writer_transport, writer_protocol = await asyncio.get_event_loop().connect_write_pipe(
        lambda: protocol, server_process.stdout
    )
    writer = StreamWriter(writer_transport, writer_protocol, reader, asyncio.get_event_loop())
    
    # Inicialización
    await write_json(writer, {"jsonrpc": "2.0", "method": "initialize", "params": {}, "id": 1})
    response = await read_json(reader)
    print(f"Inicialización: {response}")
    
    # Listar recursos
    await write_json(writer, {"jsonrpc": "2.0", "method": "mcp/listResources", "params": {}, "id": 2})
    response = await read_json(reader)
    print(f"Recursos disponibles: {response}")
    
    # Listar herramientas
    await write_json(writer, {"jsonrpc": "2.0", "method": "mcp/listTools", "params": {}, "id": 3})
    response = await read_json(reader)
    print(f"Herramientas disponibles: {response}")
    
    # Cerrar el servidor
    server_process.terminate()
    print("Prueba completada")

if __name__ == "__main__":
    asyncio.run(main())
            """)
        
        # Ejecutar el script de prueba
        result = run_command(f"python {f.name}")
        if "Inicialización" in result and "Recursos disponibles" in result and "Herramientas disponibles" in result:
            print_success("Servidor MCP funciona correctamente")
            return True
        else:
            print_error("El servidor MCP no respondió como se esperaba")
            return False
            
    except Exception as e:
        print_error(f"Error al probar el servidor MCP: {str(e)}")
        return False
    finally:
        # Eliminar el archivo temporal
        if 'f' in locals() and os.path.exists(f.name):
            os.unlink(f.name)

def generate_n8n_workflow():
    """Genera un archivo JSON para importar en n8n."""
    print_header("Generando workflow para n8n")
    
    workflow = {
        "nodes": [
            {
                "parameters": {
                    "command": "python",
                    "arguments": "src/integrations/mcp/solar_fluidity_mcp_server.py",
                    "environmentVariables": {
                        "SUPABASE_URL": "https://rlqvkqaownzqelvxnhzd.supabase.co",
                        "SUPABASE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0"
                    }
                },
                "id": "1",
                "name": "MCP Client",
                "type": "n8n-nodes-base.mcpClient",
                "typeVersion": 1,
                "position": [250, 300]
            },
            {
                "parameters": {
                    "resource": "invoices://list"
                },
                "id": "2",
                "name": "MCP Read Resource",
                "type": "n8n-nodes-base.mcpReadResource",
                "typeVersion": 1,
                "position": [450, 300]
            },
            {
                "parameters": {
                    "httpMethod": "GET",
                    "path": "invoices",
                    "responseMode": "responseNode"
                },
                "id": "3",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [50, 300]
            },
            {
                "parameters": {
                    "respondWith": "json",
                    "responseBody": "={{$node[\"MCP Read Resource\"].json.result}}"
                },
                "id": "4",
                "name": "Respond to Webhook",
                "type": "n8n-nodes-base.respondToWebhook",
                "typeVersion": 1,
                "position": [650, 300]
            }
        ],
        "connections": {
            "Webhook": {
                "main": [
                    [
                        {
                            "node": "MCP Client",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "MCP Client": {
                "main": [
                    [
                        {
                            "node": "MCP Read Resource",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "MCP Read Resource": {
                "main": [
                    [
                        {
                            "node": "Respond to Webhook",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "name": "Solar Fluidity - Listar Facturas",
        "active": false
    }
    
    # Guardar workflow
    workflow_path = os.path.join("src", "integrations", "n8n", "workflows")
    os.makedirs(workflow_path, exist_ok=True)
    
    with open(os.path.join(workflow_path, "listar_facturas.json"), "w") as f:
        json.dump(workflow, f, indent=2)
    
    print_success(f"Workflow generado: {os.path.join(workflow_path, 'listar_facturas.json')}")
    print_info("Importa este archivo en n8n para probar la integración")
    
    return True

def main():
    """Función principal."""
    print_header("Diagnóstico de Solar Fluidity MCP + n8n")
    
    # Verificar versión de Python
    if not check_python_version():
        return
    
    # Instalar dependencias
    if not install_pip_packages():
        return
    
    # Probar conexión con Supabase
    supabase_ok = test_supabase_connection()
    
    # Probar servidor MCP
    mcp_ok = test_mcp_server()
    
    # Generar workflow para n8n
    if supabase_ok and mcp_ok:
        generate_n8n_workflow()
    
    # Resumen
    print_header("Resumen del diagnóstico")
    print_info(f"Conexión con Supabase: {'✅' if supabase_ok else '❌'}")
    print_info(f"Servidor MCP: {'✅' if mcp_ok else '❌'}")
    
    if supabase_ok and mcp_ok:
        print_success("¡Todo funciona correctamente! Puedes importar el workflow en n8n")
    else:
        print_error("Hay problemas que debes resolver antes de continuar")

if __name__ == "__main__":
    main()
