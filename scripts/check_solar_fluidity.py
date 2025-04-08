#!/usr/bin/env python3
"""
Script para verificar la configuración de Solar Fluidity.
Este script identifica qué configuraciones faltan para poner a funcionar el SaaS:
- Frontend y API
- Base de datos (Supabase)
- Agentes IA
- Servidores MCP
- Configuración de PayPal
"""

import os
import sys
import json
import time
import subprocess
import requests
from pathlib import Path

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

def check_env_files():
    """Verifica si existen los archivos .env y contienen las variables necesarias."""
    print_header("Verificando archivos de configuración")
    
    # Definir archivos .env y variables requeridas
    env_files = {
        ".env": [
            "VITE_API_URL",
            "VITE_AUTH_SECRET", 
            "VITE_PAYPAL_CLIENT_ID",
            "VITE_PAYPAL_SECRET",
            "SUPABASE_URL", 
            "SUPABASE_KEY",
            "PAYPAL_LIVE_CLIENT_ID",
            "PAYPAL_LIVE_SECRET"
        ],
        "agents/.env": [
            "SUPABASE_URL",
            "SUPABASE_KEY",
            "OPENAI_API_KEY",
            "AIRTABLE_API_KEY",
            "AIRTABLE_BASE_ID",
            "AIRTABLE_TABLE_NAME",
            "GITHUB_TOKEN"
        ],
        "src/integrations/mcp/.env": [
            "SUPABASE_URL",
            "SUPABASE_KEY"
        ]
    }
    
    results = {}
    all_ok = True
    
    # Obtener el directorio base del proyecto
    project_root = Path(__file__).parent.parent.absolute()
    
    for env_file, required_vars in env_files.items():
        print_info(f"Verificando {env_file}")
        
        # Verificar que el archivo existe
        file_path = project_root / env_file
        if not file_path.exists():
            print_error(f"No se encontró el archivo {env_file}")
            results[env_file] = {"exists": False}
            all_ok = False
            continue
        
        # Cargar variables específicas del archivo
        env_vars = {}
        with open(file_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value
        
        # Verificar variables requeridas
        missing_vars = []
        placeholder_vars = []
        for var in required_vars:
            if var not in env_vars:
                missing_vars.append(var)
            elif any(placeholder in env_vars[var].lower() for placeholder in ["tu_key", "tu_token", "tu_base", "tu_tabla"]):
                placeholder_vars.append(var)
        
        # Guardar resultados
        results[env_file] = {
            "exists": True,
            "missing_vars": missing_vars,
            "placeholder_vars": placeholder_vars
        }
        
        if missing_vars:
            print_error(f"Faltan las siguientes variables en {env_file}: {', '.join(missing_vars)}")
            all_ok = False
        
        if placeholder_vars:
            print_error(f"Las siguientes variables en {env_file} tienen valores de marcador de posición: {', '.join(placeholder_vars)}")
            all_ok = False
            
        if not missing_vars and not placeholder_vars:
            print_success(f"Archivo {env_file} contiene todas las variables requeridas con valores correctos")
    
    return all_ok, results

def test_supabase():
    """Prueba la conexión con Supabase y verifica las tablas requeridas."""
    print_header("Verificando conexión con Supabase")
    
    # Obtener el directorio base del proyecto
    project_root = Path(__file__).parent.parent.absolute()
    env_path = project_root / ".env"
    
    # Obtener credenciales de Supabase
    supabase_url = None
    supabase_key = None
    
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    if key == "SUPABASE_URL":
                        supabase_url = value
                    elif key == "SUPABASE_KEY":
                        supabase_key = value
    
    if not supabase_url or not supabase_key:
        print_error("No se encontraron credenciales de Supabase en .env")
        return False, {"connection": False, "error": "Credenciales no encontradas"}
    
    # Verificar si supabase-py está instalado
    try:
        from supabase import create_client
    except ImportError:
        print_error("Biblioteca 'supabase-py' no está instalada. No se pueden verificar las tablas.")
        return False, {"connection": False, "error": "Biblioteca supabase-py no instalada"}
    
    try:
        # Intentar conectar
        print_info(f"Conectando a Supabase: {supabase_url}")
        client = create_client(supabase_url, supabase_key)
        
        # Verificar tablas requeridas
        required_tables = [
            "facturas", 
            "factura_lineas", 
            "proyectos", 
            "proyecto_hitos", 
            "clientes", 
            "usuarios"
        ]
        
        print_info("Verificando tablas requeridas...")
        
        existing_tables = []
        missing_tables = []
        
        # Intentar hacer consultas para verificar tablas
        for table in required_tables:
            try:
                response = client.table(table).select("count(*)").limit(1).execute()
                existing_tables.append(table)
            except Exception as e:
                missing_tables.append(table)
                print_error(f"Error al acceder a la tabla '{table}': {str(e)}")
        
        if missing_tables:
            print_error(f"Faltan las siguientes tablas en Supabase: {', '.join(missing_tables)}")
        else:
            print_success("Todas las tablas requeridas existen en Supabase")
        
        result = {
            "connection": True,
            "existing_tables": existing_tables,
            "missing_tables": missing_tables
        }
        
        return len(missing_tables) == 0, result
    
    except Exception as e:
        print_error(f"Error al conectar con Supabase: {str(e)}")
        return False, {"connection": False, "error": str(e)}

def check_ai_agents():
    """Verifica la configuración de los agentes IA."""
    print_header("Verificando configuración de agentes IA")
    
    # Obtener el directorio base del proyecto
    project_root = Path(__file__).parent.parent.absolute()
    env_path = project_root / "agents" / ".env"
    
    if not env_path.exists():
        print_error("No se encontró el archivo agents/.env")
        return False, {"env_file": False}
    
    # Verificar las claves necesarias
    env_vars = {}
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
    
    required_keys = [
        "OPENAI_API_KEY",
        "SUPABASE_KEY",
        "SUPABASE_URL",
        "GITHUB_TOKEN"
    ]
    
    missing_keys = []
    placeholder_keys = []
    
    for key in required_keys:
        if key not in env_vars:
            missing_keys.append(key)
        elif any(placeholder in env_vars[key].lower() for placeholder in ["tu_key", "tu_token"]):
            placeholder_keys.append(key)
    
    if missing_keys:
        print_error(f"Faltan las siguientes claves en agents/.env: {', '.join(missing_keys)}")
    
    if placeholder_keys:
        print_error(f"Las siguientes claves tienen valores genéricos en agents/.env: {', '.join(placeholder_keys)}")
    
    # Verificar si el servicio de agentes está en ejecución
    agent_url = "http://localhost:8000"
    try:
        print_info(f"Verificando si los agentes IA están en ejecución en {agent_url}")
        response = requests.get(f"{agent_url}/health", timeout=2)
        if response.status_code == 200:
            print_success("El servidor de agentes IA está en ejecución")
            server_running = True
        else:
            print_error(f"El servidor de agentes IA está activo pero devuelve estado {response.status_code}")
            server_running = False
    except requests.RequestException:
        print_error("El servidor de agentes IA no está en ejecución")
        server_running = False
    
    result = {
        "env_file": True,
        "missing_keys": missing_keys,
        "placeholder_keys": placeholder_keys,
        "server_running": server_running
    }
    
    return (not missing_keys and not placeholder_keys and server_running), result

def check_mcp_server():
    """Verifica la configuración del servidor MCP."""
    print_header("Verificando configuración del servidor MCP")
    
    # Obtener el directorio base del proyecto
    project_root = Path(__file__).parent.parent.absolute()
    config_path = project_root / "src" / "integrations" / "mcp" / ".env"
    
    if not config_path.exists():
        print_error("No se encontró el archivo de configuración MCP")
        return False, {"config_file": False}
    
    # Verificar las claves
    env_vars = {}
    with open(config_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
    
    required_keys = [
        "SUPABASE_URL",
        "SUPABASE_KEY"
    ]
    
    missing_keys = []
    placeholder_keys = []
    
    for key in required_keys:
        if key not in env_vars:
            missing_keys.append(key)
        elif any(placeholder in env_vars[key].lower() for placeholder in ["tu_key", "tu_token"]):
            placeholder_keys.append(key)
    
    if missing_keys:
        print_error(f"Faltan las siguientes claves en la configuración MCP: {', '.join(missing_keys)}")
    
    if placeholder_keys:
        print_error(f"Las siguientes claves tienen valores genéricos en la configuración MCP: {', '.join(placeholder_keys)}")
    
    # Verificar si hay servidores MCP activados
    mcp_running = False
    try:
        print_info("Verificando si hay servidores MCP en ejecución")
        # Verificamos por procesos de nodejs con MCP
        result = subprocess.run(
            "ps aux | grep 'server-' | grep -v grep", 
            shell=True, 
            capture_output=True, 
            text=True
        )
        
        if result.returncode == 0 and result.stdout:
            print_success("Servidores MCP detectados en ejecución")
            mcp_running = True
        else:
            print_error("No se detectaron servidores MCP en ejecución")
            mcp_running = False
    except Exception as e:
        print_error(f"Error al verificar servidores MCP: {str(e)}")
        mcp_running = False
    
    result = {
        "config_file": True,
        "missing_keys": missing_keys,
        "placeholder_keys": placeholder_keys,
        "server_running": mcp_running
    }
    
    return (not missing_keys and not placeholder_keys and mcp_running), result

def check_frontend():
    """Verifica el estado del frontend y el API backend."""
    print_header("Verificando frontend y API backend")
    
    # Obtener el directorio base del proyecto
    project_root = Path(__file__).parent.parent.absolute()
    env_path = project_root / ".env"
    
    frontend_url = "http://localhost:8080"  # Vite suele usar 8080 por defecto
    api_url = None
    
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    if key == "VITE_API_URL":
                        api_url = value
    
    # Verificar si el frontend está en ejecución
    print_info(f"Verificando si el frontend está disponible en: {frontend_url}")
    frontend_running = False
    try:
        response = requests.get(frontend_url, timeout=2)
        if response.status_code == 200:
            print_success("Frontend disponible correctamente")
            frontend_running = True
        else:
            print_error(f"Frontend devuelve estado inesperado: {response.status_code}")
            frontend_running = False
    except requests.RequestException as e:
        print_error(f"Frontend no está en ejecución: {str(e)}")
        frontend_running = False
    
    # Verificar el API backend si está configurado
    api_running = False
    if api_url:
        print_info(f"Verificando si el API backend está disponible en: {api_url}")
        try:
            response = requests.get(api_url, timeout=2)
            if response.status_code < 500:  # Aceptamos incluso 404, indica que está corriendo
                print_success(f"API backend disponible correctamente (estado: {response.status_code})")
                api_running = True
            else:
                print_error(f"API backend devuelve error: {response.status_code}")
                api_running = False
        except requests.RequestException as e:
            print_error(f"API backend no está en ejecución: {str(e)}")
            api_running = False
    else:
        print_info("No se ha configurado la URL del API backend (VITE_API_URL)")
    
    result = {
        "frontend_url": frontend_url,
        "frontend_running": frontend_running,
        "api_url": api_url,
        "api_running": api_running if api_url else None
    }
    
    return frontend_running and (not api_url or api_running), result

def check_paypal():
    """Verifica la configuración de PayPal."""
    print_header("Verificando configuración de PayPal")
    
    # Obtener el directorio base del proyecto
    project_root = Path(__file__).parent.parent.absolute()
    env_path = project_root / ".env"
    
    if not env_path.exists():
        print_error("No se encontró el archivo .env")
        return False, {"env_file": False}
    
    # Leer las variables de PayPal
    paypal_vars = {}
    required_vars = [
        "VITE_PAYPAL_CLIENT_ID",
        "VITE_PAYPAL_SECRET",
        "PAYPAL_LIVE_CLIENT_ID",
        "PAYPAL_LIVE_SECRET"
    ]
    
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                if key in required_vars:
                    paypal_vars[key] = value
    
    missing_vars = [var for var in required_vars if var not in paypal_vars]
    
    if missing_vars:
        print_error(f"Faltan las siguientes variables de PayPal en .env: {', '.join(missing_vars)}")
        return False, {"missing_vars": missing_vars}
    
    # Verificar credenciales no vacías
    empty_vars = [var for var, value in paypal_vars.items() if not value]
    if empty_vars:
        print_error(f"Las siguientes variables de PayPal están vacías: {', '.join(empty_vars)}")
        return False, {"empty_vars": empty_vars}
    
    print_success("Configuración de PayPal completa")
    return True, {"config_complete": True}

def main():
    """Función principal del script."""
    # Imprimir banner
    print(f"{BLUE}")
    print("  _____       _             _______ _       _     _ _ _          ")
    print(" / ____|     | |           |__   __| |     (_)   | (_) |         ")
    print("| (___   ___ | | __ _ _ __    | |  | |_   _ _  __| |_| |_ _   _ ")
    print(" \\___ \\ / _ \\| |/ _` | '__|   | |  | | | | | |/ _` | | __| | | |")
    print(" ____) | (_) | | (_| | |      | |  | | |_| | | (_| | | |_| |_| |")
    print("|_____/ \\___/|_|\\__,_|_|      |_|  |_|\\__,_|_|\\__,_|_|\\__|\\__, |")
    print("                                                           __/ |")
    print("                                                          |___/ ")
    print(f"{NC}")
    print(f"{YELLOW}Verificador de Configuración de Solar Fluidity{NC}")
    print("-" * 60)
    
    # Resultados
    results = {}
    
    # Verificar archivos .env
    env_success, results["env_files"] = check_env_files()
    
    # Verificar Supabase
    supabase_success, results["supabase"] = test_supabase()
    
    # Verificar agentes IA
    ai_success, results["ai_agents"] = check_ai_agents()
    
    # Verificar servidor MCP
    mcp_success, results["mcp_server"] = check_mcp_server()
    
    # Verificar frontend
    frontend_success, results["frontend"] = check_frontend()
    
    # Verificar configuración de PayPal
    paypal_success, results["paypal"] = check_paypal()
    
    # Comprobar el estado general
    status = {
        "Archivos de Configuración": env_success,
        "Conexión a Supabase": supabase_success,
        "Agentes IA": ai_success,
        "Servidor MCP": mcp_success,
        "Frontend": frontend_success,
        "Configuración PayPal": paypal_success
    }
    
    all_success = all(status.values())
    
    # Resumen
    print_header("Resumen de las verificaciones")
    
    for component, is_ok in status.items():
        if is_ok:
            print_success(f"{component}: OK")
        else:
            print_error(f"{component}: Requiere configuración")
    
    # Generar informe de acciones necesarias
    print_header("Acciones necesarias para completar la configuración")
    
    # Lista para acciones requeridas
    required_actions = []
    
    # Verificar variables de entorno
    if not env_success:
        for env_file, info in results["env_files"].items():
            if info.get("exists", False):
                if info.get("missing_vars"):
                    required_actions.append(f"Agregar las variables faltantes en {env_file}: {', '.join(info['missing_vars'])}")
                if info.get("placeholder_vars"):
                    required_actions.append(f"Reemplazar los valores de marcador de posición en {env_file} para: {', '.join(info['placeholder_vars'])}")
            else:
                required_actions.append(f"Crear el archivo {env_file} con las variables requeridas")
    
    # Verificar Supabase
    if not supabase_success:
        if not results["supabase"].get("connection", False):
            required_actions.append("Configurar correctamente las credenciales de Supabase en .env")
        elif results["supabase"].get("missing_tables"):
            required_actions.append(f"Crear las tablas faltantes en Supabase: {', '.join(results['supabase']['missing_tables'])}")
    
    # Verificar configuración de agentes IA
    if not ai_success:
        if not results["ai_agents"].get("env_file", False):
            required_actions.append("Crear el archivo agents/.env con la configuración necesaria")
        elif results["ai_agents"].get("missing_keys"):
            required_actions.append(f"Agregar las variables faltantes en agents/.env: {', '.join(results['ai_agents']['missing_keys'])}")
        elif results["ai_agents"].get("placeholder_keys"):
            required_actions.append(f"Reemplazar los valores de marcador de posición en agents/.env para: {', '.join(results['ai_agents']['placeholder_keys'])}")
        if not results["ai_agents"].get("server_running", False):
            required_actions.append("Iniciar el servidor de agentes IA (python ai_agents/main.py)")
    
    # Verificar configuración de MCP
    if not mcp_success:
        if not results["mcp_server"].get("config_file", False):
            required_actions.append("Crear el archivo de configuración para el servidor MCP")
        elif results["mcp_server"].get("missing_keys"):
            required_actions.append(f"Agregar las variables faltantes en la configuración MCP: {', '.join(results['mcp_server']['missing_keys'])}")
        elif results["mcp_server"].get("placeholder_keys"):
            required_actions.append(f"Reemplazar los valores genéricos en la configuración MCP para: {', '.join(results['mcp_server']['placeholder_keys'])}")
        if not results["mcp_server"].get("server_running", False):
            required_actions.append("Iniciar los servidores MCP según la documentación")
    
    # Verificar frontend y API
    if not frontend_success:
        if not results["frontend"].get("frontend_running", False):
            required_actions.append("Iniciar el servidor frontend con 'npm run dev'")
        if results["frontend"].get("api_url") and not results["frontend"].get("api_running", False):
            required_actions.append(f"Iniciar el servidor API en {results['frontend']['api_url']}")
    
    # Verificar configuración de PayPal
    if not paypal_success:
        if results["paypal"].get("missing_vars"):
            required_actions.append(f"Agregar las variables de PayPal faltantes en .env: {', '.join(results['paypal']['missing_vars'])}")
        elif results["paypal"].get("empty_vars"):
            required_actions.append(f"Completar las variables de PayPal vacías en .env: {', '.join(results['paypal']['empty_vars'])}")
    
    # Mostrar acciones requeridas
    if required_actions:
        for i, action in enumerate(required_actions, 1):
            print_info(f"{i}. {action}")
        print(f"\n{YELLOW}Para poner a funcionar Solar Fluidity, debes completar las {len(required_actions)} acciones listadas arriba.{NC}")
    else:
        print(f"\n{GREEN}¡Todas las configuraciones están completas!{NC}")
        print(f"{GREEN}Solar Fluidity está listo para funcionar correctamente.{NC}")
    
    # Guardar resultados detallados en un archivo JSON
    try:
        with open(os.path.join(os.path.dirname(__file__), "config_status.json"), "w") as f:
            json.dump({
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "status": status,
                "details": results,
                "required_actions": required_actions
            }, f, indent=2)
        print_info("Se ha generado un informe detallado en 'scripts/config_status.json'")
    except Exception as e:
        print_error(f"Error al guardar el informe: {str(e)}")
    
    return 0 if all_success else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\nVerificación interrumpida por el usuario.")
        sys.exit(130)
