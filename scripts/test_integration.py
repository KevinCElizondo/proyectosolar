#!/usr/bin/env python3
"""
Script para probar la integración completa de Solar Fluidity.
Este script verifica la conexión entre todos los componentes:
- Frontend
- Base de datos (Supabase)
- Agentes IA
- Servidores MCP
"""

import os
import sys
import json
import time
import subprocess
import requests
from dotenv import load_dotenv
from urllib.parse import urljoin

# Colores para los mensajes
GREEN = '\033[0;32m'
BLUE = '\033[0;34m'
YELLOW = '\033[1;33m'
RED = '\033[0;31m'
NC = '\033[0m'  # No Color

def print_header(text):
    """Imprime un encabezado formateado."""
    print(f"\n{BLUE}{'=' * 80}{NC}")
    print(f"{BLUE}= {text.center(76)} ={NC}")
    print(f"{BLUE}{'=' * 80}{NC}")

def print_success(text):
    """Imprime un mensaje de éxito."""
    print(f"{GREEN}✅ {text}{NC}")

def print_error(text):
    """Imprime un mensaje de error."""
    print(f"{RED}❌ {text}{NC}")

def print_info(text):
    """Imprime un mensaje informativo."""
    print(f"{YELLOW}ℹ️ {text}{NC}")

def run_command(command, cwd=None, timeout=10):
    """Ejecuta un comando y devuelve su salida."""
    print_info(f"Ejecutando: {command}")
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print_error(f"Error al ejecutar comando: {e}")
        if e.stdout:
            print(f"Salida estándar: {e.stdout}")
        if e.stderr:
            print(f"Error estándar: {e.stderr}")
        return None
    except subprocess.TimeoutExpired:
        print_error(f"Timeout al ejecutar el comando: {command}")
        return None

def check_env_file():
    """Verifica si existe el archivo .env y contiene las variables necesarias."""
    print_header("Verificando archivo .env")

    # Cargar variables de entorno
    load_dotenv()

    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_KEY",
        "OPENAI_API_KEY",
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ]

    missing_vars = []
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)

    if missing_vars:
        print_error(f"Faltan las siguientes variables en .env: {', '.join(missing_vars)}")
        return False

    print_success("Archivo .env contiene todas las variables requeridas")
    return True

def test_supabase_connection():
    """Prueba la conexión con Supabase."""
    print_header("Probando conexión con Supabase")

    # Obtener credenciales de Supabase
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")

    try:
        # Importar Supabase client
        from supabase import create_client

        # Intentar conectar
        print_info(f"Conectando a Supabase: {supabase_url}")
        client = create_client(supabase_url, supabase_key)

        # Probar con una consulta simple
        print_info("Ejecutando consulta de prueba...")
        response = client.table("facturas").select("*").limit(1).execute()

        if response:
            print_success("Conexión con Supabase establecida correctamente")
            return True
        else:
            print_error("No se recibió respuesta de Supabase")
            return False

    except ImportError:
        print_error("No se pudo importar 'supabase'. Intenta instalar con: pip install supabase")
        return False
    except Exception as e:
        print_error(f"Error al conectar con Supabase: {str(e)}")
        return False

def test_ai_agents():
    """Prueba la conexión con los agentes IA."""
    print_header("Probando agentes IA")

    agent_url = "http://localhost:8000"

    # Intentar iniciar el servidor de agentes en segundo plano
    try:
        # Verificar si ya está en ejecución
        try:
            response = requests.get(f"{agent_url}/health", timeout=5)
            if response.status_code == 200:
                print_info("El servidor de agentes ya está en ejecución")
                server_running = True
            else:
                server_running = False
        except requests.RequestException:
            server_running = False

        # Si no está en ejecución, iniciarlo
        if not server_running:
            print_info("Iniciando servidor de agentes IA...")
            agent_process = subprocess.Popen(
                ["python", "main.py"],
                cwd="ai_agents",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            # Esperar a que se inicie
            time.sleep(5)

        # Probar la API de agentes
        print_info("Enviando consulta de prueba a los agentes...")
        response = requests.post(
            f"{agent_url}/chat",
            json={
                "message": "¿Puedes generar una factura de prueba?",
                "agent_type": "facturacion"
            },
            timeout=10
        )

        if response.status_code == 200:
            print_success("Respuesta del agente recibida correctamente")
            print_info(f"Respuesta: {response.json().get('response', '')[:100]}...")
            return True
        else:
            print_error(f"Error en la respuesta del agente: {response.status_code}")
            print_info(f"Detalles: {response.text}")
            return False

    except requests.RequestException as e:
        print_error(f"Error de conexión con los agentes: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Error al probar los agentes IA: {str(e)}")
        return False
    finally:
        # Si iniciamos el proceso, terminarlo
        if not server_running and 'agent_process' in locals():
            agent_process.terminate()

def test_mcp_server():
    """Prueba la conexión con el servidor MCP."""
    print_header("Probando servidor MCP")

    mcp_script_path = os.path.join("src", "integrations", "mcp", "solar_fluidity_mcp_server.py")

    # Verificar que existe el script
    if not os.path.exists(mcp_script_path):
        print_error(f"No se encontró el script del servidor MCP en: {mcp_script_path}")
        return False

    # Intentar iniciar el servidor MCP en segundo plano
    try:
        print_info("Iniciando servidor MCP...")
        mcp_process = subprocess.Popen(
            ["python", mcp_script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        # Dar tiempo para que se inicie
        time.sleep(3)

        # Crear un script temporal para probar la comunicación
        test_script = """
import json
import subprocess
import sys
import time

def main():
    # Iniciar el servidor MCP
    process = subprocess.Popen(
        ["python", "src/integrations/mcp/solar_fluidity_mcp_server.py"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Dar tiempo para inicializar
    time.sleep(1)

    # Enviar mensaje de inicialización
    init_msg = {"jsonrpc": "2.0", "method": "initialize", "params": {}, "id": 1}
    process.stdin.write(json.dumps(init_msg) + "\\n")
    process.stdin.flush()

    # Leer respuesta
    response = json.loads(process.stdout.readline())
    print(json.dumps(response))

    # Listar recursos
    list_msg = {"jsonrpc": "2.0", "method": "mcp/listResources", "params": {}, "id": 2}
    process.stdin.write(json.dumps(list_msg) + "\\n")
    process.stdin.flush()

    # Leer respuesta
    response = json.loads(process.stdout.readline())
    print(json.dumps(response))

    # Terminar el proceso
    process.terminate()
    return 0

if __name__ == "__main__":
    sys.exit(main())
"""

        # Guardar el script temporal
        with open("temp_mcp_test.py", "w") as f:
            f.write(test_script)

        # Ejecutar el script de prueba
        result = run_command("python temp_mcp_test.py", timeout=15)

        # Limpiar
        os.remove("temp_mcp_test.py")

        if result:
            print_success("Servidor MCP funcionando correctamente")
            print_info(f"Respuesta: {result[:100]}...")
            return True
        else:
            print_error("No se pudo comunicar con el servidor MCP")
            return False

    except Exception as e:
        print_error(f"Error al probar el servidor MCP: {str(e)}")
        return False
    finally:
        # Terminar el proceso del MCP si existe
        if 'mcp_process' in locals():
            mcp_process.terminate()

def test_frontend():
    """Prueba la conexión con el frontend."""
    print_header("Probando conexión con el frontend")

    frontend_url = "http://localhost:3000"

    try:
        # Verificar si el frontend está en ejecución
        print_info(f"Verificando si el frontend está disponible en: {frontend_url}")
        response = requests.get(frontend_url, timeout=5)

        if response.status_code == 200:
            print_success("Frontend disponible correctamente")
            return True
        else:
            print_error(f"Error en la respuesta del frontend: {response.status_code}")
            print_info("Intenta iniciar el frontend con: npm run dev")
            return False

    except requests.RequestException as e:
        print_error(f"Error de conexión con el frontend: {str(e)}")
        print_info("¿Está el servidor de desarrollo en ejecución? Intenta con: npm run dev")
        return False

def main():
    """Función principal."""
    # Imprimir banner
    print(f"{BLUE}")
    print("  _____       _             ______ _       _     _ _ _          ")
    print(" / ____|     | |           |  ____| |     (_)   | (_) |         ")
    print("| (___   ___ | | __ _ _ __ | |__  | |_   _ _  __| |_| |_ _   _ ")
    print(" \___ \ / _ \| |/ _` | '__||  __| | | | | | |/ _` | | __| | | |")
    print(" ____) | (_) | | (_| | |   | |    | | |_| | | (_| | | |_| |_| |")
    print("|_____/ \___/|_|\__,_|_|   |_|    |_|\__,_|_|\__,_|_|\__|\__, |")
    print("                                                           __/ |")
    print("                                                          |___/ ")
    print(f"{NC}")
    print("Test de Integración del Sistema")
    print("-" * 50)

    # Resultados
    results = {}

    # Verificar .env
    results["env_file"] = check_env_file()

    # Probar Supabase
    results["supabase"] = test_supabase_connection()

    # Probar agentes IA
    results["ai_agents"] = test_ai_agents()

    # Probar servidor MCP
    results["mcp_server"] = test_mcp_server()

    # Probar frontend
    results["frontend"] = test_frontend()

    # Resumen
    print_header("Resumen de las pruebas")

    all_success = True
    for component, status in results.items():
        if status:
            print_success(f"{component.replace('_', ' ').title().replace('Ai', 'AI')}: OK")
        else:
            print_error(f"{component.replace('_', ' ').title().replace('Ai', 'AI')}: Fallo")
            all_success = False

    if all_success:
        print(f"\n{GREEN}¡Todas las pruebas completadas con éxito!{NC}")
        print(f"{GREEN}El sistema Solar Fluidity está integrado correctamente.{NC}")
    else:
        print(f"\n{YELLOW}Algunas pruebas fallaron. Revisa los mensajes de error anteriores.{NC}")
        print(f"{YELLOW}Consulta la documentación para solucionar los problemas.{NC}")

    return 0 if all_success else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\nPrueba interrumpida por el usuario.")
        sys.exit(130)
