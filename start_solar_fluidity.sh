#!/bin/bash

# Script para iniciar todos los componentes de Solar Fluidity
# Autor: Solar Fluidity Team
# Uso: ./start_solar_fluidity.sh [opción]
#   opciones:
#     --full: Inicia todos los servicios (web, agentes IA, MCPs)
#     --web: Inicia solo el servidor web
#     --agents: Inicia solo los agentes IA
#     --mcp: Inicia solo los MCPs

set -e

# Colores para los mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con formato
print_header() {
    echo -e "\n${BLUE}=============================================================================${NC}"
    echo -e "${BLUE}= $1${NC}"
    echo -e "${BLUE}=============================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para verificar dependencias
check_dependencies() {
    print_header "Verificando dependencias"

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js v16 o superior."
        exit 1
    fi

    node_version=$(node -v | cut -d 'v' -f 2)
    print_info "Versión de Node.js: $node_version"

    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado."
        exit 1
    fi

    npm_version=$(npm -v)
    print_info "Versión de npm: $npm_version"

    # Verificar Python
    if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
        print_error "Python no está instalado. Se requiere Python 3.8 o superior."
        exit 1
    fi

    # Determinar comando de Python
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    else
        PYTHON_CMD="python"
    fi

    python_version=$($PYTHON_CMD --version | cut -d ' ' -f 2)
    print_info "Versión de Python: $python_version"

    # Verificar pip
    if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
        print_error "pip no está instalado."
        exit 1
    fi

    # Determinar comando de pip
    if command -v pip3 &> /dev/null; then
        PIP_CMD="pip3"
    else
        PIP_CMD="pip"
    fi

    pip_version=$($PIP_CMD --version | awk '{print $2}')
    print_info "Versión de pip: $pip_version"

    # Verificar si .env existe
    if [ ! -f .env ]; then
        print_info "Archivo .env no encontrado, creando desde .env.example"

        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Archivo .env creado desde .env.example"
            print_info "⚠️ Por favor, edita el archivo .env con tus configuraciones"
        else
            print_error "No se encontró .env.example"
            exit 1
        fi
    fi

    print_success "Todas las dependencias están instaladas"
}

# Función para instalar dependencias del proyecto
install_dependencies() {
    print_header "Instalando dependencias del proyecto"

    # Instalar dependencias de Node.js
    print_info "Instalando dependencias de Node.js..."
    npm install
    print_success "Dependencias de Node.js instaladas"

    # Instalar dependencias de Python para agentes IA
    print_info "Instalando dependencias de Python para agentes IA..."
    cd ai_agents
    $PIP_CMD install -r requirements.txt
    cd ..
    print_success "Dependencias de Python para agentes IA instaladas"

    print_success "Todas las dependencias del proyecto instaladas"
}

# Función para iniciar el servidor web
start_web_server() {
    print_header "Iniciando servidor web"
    npm run dev &
    WEB_PID=$!
    print_success "Servidor web iniciado (PID: $WEB_PID)"
}

# Función para iniciar los agentes IA
start_ai_agents() {
    print_header "Iniciando agentes IA"
    cd ai_agents
    $PYTHON_CMD main.py &
    AGENTS_PID=$!
    cd ..
    print_success "Agentes IA iniciados (PID: $AGENTS_PID)"
}

# Función para iniciar los MCP
start_mcp_servers() {
    print_header "Iniciando servidores MCP"

    # Verificar que existe el script de MCP
    if [ ! -f src/integrations/mcp/solar_fluidity_mcp_server.py ]; then
        print_error "No se encontró el servidor MCP"
        exit 1
    fi

    # Iniciar el servidor MCP de Solar Fluidity
    cd src/integrations/mcp
    $PYTHON_CMD solar_fluidity_mcp_server.py &
    MCP_PID=$!
    cd ../../..
    print_success "Servidor MCP iniciado (PID: $MCP_PID)"
}

# Función para crear las tablas en Supabase
setup_supabase() {
    print_header "Configurando tablas en Supabase"

    if [ -f src/integrations/mcp/create_supabase_tables.py ]; then
        cd src/integrations/mcp
        $PYTHON_CMD create_supabase_tables.py
        cd ../../..
        print_success "Tablas de Supabase configuradas correctamente"
    else
        print_info "Script de creación de tablas no encontrado, asegúrate de configurar las tablas manualmente"
    fi
}

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./start_solar_fluidity.sh [opción]"
    echo "Opciones:"
    echo "  --full     Inicia todos los servicios (web, agentes IA, MCPs)"
    echo "  --web      Inicia solo el servidor web"
    echo "  --agents   Inicia solo los agentes IA"
    echo "  --mcp      Inicia solo los MCPs"
    echo "  --setup    Configura las tablas de Supabase"
    echo "  --help     Muestra esta ayuda"
}

# Función principal
main() {
    # Imprimir banner
    echo -e "${BLUE}"
    echo "  _____       _             ______ _       _     _ _ _          "
    echo " / ____|     | |           |  ____| |     (_)   | (_) |         "
    echo "| (___   ___ | | __ _ _ __ | |__  | |_   _ _  __| |_| |_ _   _ "
    echo " \___ \ / _ \| |/ _\` | '__||  __| | | | | | |/ _\` | | __| | | |"
    echo " ____) | (_) | | (_| | |   | |    | | |_| | | (_| | | |_| |_| |"
    echo "|_____/ \___/|_|\__,_|_|   |_|    |_|\__,_|_|\__,_|_|\__|\__, |"
    echo "                                                           __/ |"
    echo "                                                          |___/ "
    echo -e "${NC}"

    # Verificar dependencias primero
    check_dependencies

    # Procesar argumentos
    case "$1" in
        --full)
            install_dependencies
            setup_supabase
            start_web_server
            start_ai_agents
            start_mcp_servers
            ;;
        --web)
            install_dependencies
            start_web_server
            ;;
        --agents)
            install_dependencies
            start_ai_agents
            ;;
        --mcp)
            install_dependencies
            start_mcp_servers
            ;;
        --setup)
            setup_supabase
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            print_info "No se especificó opción, iniciando solo el servidor web"
            install_dependencies
            start_web_server
            ;;
    esac

    print_header "Solar Fluidity está en funcionamiento"
    print_info "Presiona Ctrl+C para detener todos los servicios"

    # Mantener el script en ejecución y manejar la terminación de procesos
    trap 'kill $WEB_PID $AGENTS_PID $MCP_PID 2>/dev/null' EXIT
    wait
}

# Ejecutar la función principal
main "$@"
