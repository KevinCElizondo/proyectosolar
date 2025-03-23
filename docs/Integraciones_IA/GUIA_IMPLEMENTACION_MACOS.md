# Guía de Implementación: Anthropic MCP + n8n + Supabase en macOS

**Versión 1.0 | Marzo 2025**

## Introducción

Esta guía detallada te ayudará a configurar el entorno completo de integración entre Anthropic MCP (Model Control Protocol), n8n y Supabase en tu MacBook Air para el proyecto Solar Fluidity. Seguiremos un enfoque paso a paso para asegurar una implementación correcta y funcional.

## Requisitos Previos

- macOS Ventura (14.0) o superior
- Acceso administrativo a tu MacBook
- Conexión a Internet estable
- Terminal de macOS
- [Homebrew](https://brew.sh/) instalado
- Cuenta de Anthropic con API key (para acceso a Claude)
- Cuenta en Supabase
- Node.js v18 o superior

## Índice

1. [Instalación y Configuración del Entorno](#1-instalación-y-configuración-del-entorno)
2. [Configuración de n8n](#2-configuración-de-n8n)
3. [Configuración de Servidores MCP](#3-configuración-de-servidores-mcp)
4. [Integración con Supabase](#4-integración-con-supabase)
5. [Creación de Flujos de Trabajo](#5-creación-de-flujos-de-trabajo)
6. [Escenarios Prácticos](#6-escenarios-prácticos)
7. [Solución de Problemas](#7-solución-de-problemas)
8. [Recursos Adicionales](#8-recursos-adicionales)

## 1. Instalación y Configuración del Entorno

### 1.1 Instalación de Dependencias Básicas

```bash
# Actualizar Homebrew
brew update

# Instalar Node.js y npm si no están instalados
brew install node@18

# Instalar Docker Desktop para macOS (necesario para algunos servidores MCP)
brew install --cask docker

# Instalar Python y pip (para servidores MCP basados en Python)
brew install python@3.11

# Instalar uvicorn para servidores MCP basados en Python
pip3 install uvicorn
```

### 1.2 Configuración de Variables de Entorno

Añade estas líneas a tu archivo `~/.zshrc` (o `~/.bash_profile` si utilizas bash):

```bash
# Añadir al final de tu archivo .zshrc
export ANTHROPIC_API_KEY="tu-api-key-de-anthropic"
export SUPABASE_URL="https://tu-proyecto.supabase.co"
export SUPABASE_KEY="tu-api-key-de-supabase"
export N8N_PORT=5678
export N8N_PROTOCOL=http
export N8N_HOST=localhost

# MCP servers
export MCP_SERVERS_PATH="$HOME/mcp-servers"
```

Aplica los cambios:

```bash
source ~/.zshrc
```

### 1.3 Creación de Directorios de Trabajo

```bash
# Crear estructura de directorios para el proyecto
mkdir -p ~/mcp-servers
mkdir -p ~/mcp-servers/logs
mkdir -p ~/n8n-data
mkdir -p ~/solarfluidity-integration
```

## 2. Configuración de n8n

### 2.1 Instalación de n8n

```bash
# Instalar n8n globalmente
npm install -g n8n

# Para una instalación más estable, puedes usar Docker
docker pull n8nio/n8n
```

### 2.2 Inicio y Configuración Básica

```bash
# Iniciar n8n con configuración persistente
n8n start --tunnel
```

Accede a la interfaz web de n8n en: http://localhost:5678

### 2.3 Instalación del Nodo Comunitario de MCP para n8n

```bash
# En el directorio de datos de n8n
cd ~/.n8n
npm install n8n-nodes-anthropic-mcp
```

Alternativamente, puedes instalar el nodo desde la interfaz de n8n:
1. Ve a Configuración > Comunidad
2. Busca "anthropic mcp"
3. Haz clic en Instalar

## 3. Configuración de Servidores MCP

### 3.1 Servidor MCP para Sistema de Archivos

```bash
# Clonar el repositorio
cd ~/mcp-servers
git clone https://github.com/anthropics/anthropic-cookbook.git
cd anthropic-cookbook/model-context-protocol/servers/typescript/filesystem

# Instalar dependencias
npm install

# Iniciar el servidor
npx tsx server.ts
```

El servidor estará disponible en: http://localhost:8191

### 3.2 Servidor MCP para Brave Search

```bash
# Clonar el repositorio
cd ~/mcp-servers
git clone https://github.com/brave/brave-search-mcp.git
cd brave-search-mcp

# Configurar API key
echo "BRAVE_API_KEY=tu-api-key-brave" > .env

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El servidor estará disponible en: http://localhost:8193

### 3.3 Servidor MCP para Supabase

```bash
# Clonar el repositorio
cd ~/mcp-servers
git clone https://github.com/supabase-community/supabase-mcp.git
cd supabase-mcp

# Configurar credenciales
cat > .env << EOL
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_KEY=${SUPABASE_KEY}
EOL

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El servidor estará disponible en: http://localhost:8194

### 3.4 Configuración de Stagehand (Navegador Automatizado)

```bash
# Obtener API key en https://browserbase.com
cd ~/mcp-servers
git clone https://github.com/browser-base/stagehand-mcp.git
cd stagehand-mcp

# Configurar API key
echo "STAGEHAND_API_KEY=tu-api-key-stagehand" > .env

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El servidor estará disponible en: http://localhost:8195

### 3.5 Script para Iniciar Todos los Servidores

Crea un archivo `~/mcp-servers/start-all.sh`:

```bash
#!/bin/bash

# Start all MCP servers
cd ~/mcp-servers/anthropic-cookbook/model-context-protocol/servers/typescript/filesystem
npx tsx server.ts > ~/mcp-servers/logs/filesystem.log 2>&1 &
echo "Filesystem MCP server started"

cd ~/mcp-servers/brave-search-mcp
npm start > ~/mcp-servers/logs/brave.log 2>&1 &
echo "Brave Search MCP server started"

cd ~/mcp-servers/supabase-mcp
npm start > ~/mcp-servers/logs/supabase.log 2>&1 &
echo "Supabase MCP server started"

cd ~/mcp-servers/stagehand-mcp
npm start > ~/mcp-servers/logs/stagehand.log 2>&1 &
echo "Stagehand MCP server started"

echo "All MCP servers started. Check logs in ~/mcp-servers/logs/"
```

Haz el script ejecutable:

```bash
chmod +x ~/mcp-servers/start-all.sh
```

## 4. Integración con Supabase

### 4.1 Configuración de Base de Datos en Supabase

1. Inicia sesión en [Supabase](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Configura las siguientes tablas:

```sql
-- Tabla de Preguntas de Soporte
CREATE TABLE public.support_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    question TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de Facturas Electrónicas
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    invoice_number TEXT NOT NULL,
    xml_content TEXT,
    status TEXT DEFAULT 'draft',
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de Proyectos Solares
CREATE TABLE public.solar_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    project_name TEXT NOT NULL,
    location TEXT,
    capacity DECIMAL(10, 2),
    status TEXT DEFAULT 'planning',
    estimated_completion DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 4.2 Configuración de Row Level Security (RLS)

```sql
-- Activar RLS en todas las tablas
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_projects ENABLE ROW LEVEL SECURITY;

-- Políticas para support_requests
CREATE POLICY "Users can view their own support requests"
    ON public.support_requests
    FOR SELECT
    USING (auth.uid() = user_id);

-- Políticas para invoices
CREATE POLICY "Users can view their own invoices"
    ON public.invoices
    FOR SELECT
    USING (auth.uid() = user_id);

-- Políticas para solar_projects
CREATE POLICY "Users can view their own projects"
    ON public.solar_projects
    FOR SELECT
    USING (auth.uid() = user_id);
```

### 4.3 Configuración de Webhooks

En la interfaz de Supabase:
1. Ve a Database > Hooks
2. Crea un nuevo webhook para cada tabla que desees monitorear
3. Configura la URL de destino como: `http://localhost:5678/webhook/[nombre-del-evento]`
4. Selecciona los eventos (INSERT, UPDATE, DELETE) que deseas escuchar

## 5. Creación de Flujos de Trabajo

Crea los siguientes flujos de trabajo en n8n:

### 5.1 Flujo para Procesar Consultas de Facturación

1. Abre la interfaz de n8n (http://localhost:5678)
2. Crea un nuevo flujo
3. Añade un nodo "Webhook" como trigger
4. Configura la ruta como `/webhook/new-support-question`
5. Añade un nodo "Supabase" para obtener detalles de la consulta
6. Añade un nodo "Anthropic MCP" con la siguiente configuración:
   - Servidor: `http://localhost:8191` (filesystem)
   - Herramienta: `search_files`
   - Prompt: Consulta sobre facturación electrónica en Costa Rica
   - Restricciones MCP: `no_specific_advice`
7. Añade otro nodo "Anthropic MCP" con:
   - Servidor: `http://localhost:8193` (brave-search)
   - Herramienta: `search`
   - Query: "{{$node["Webhook"].json.question}} facturación electrónica Costa Rica"
8. Añade un nodo "Function" para combinar resultados
9. Añade un nodo "Anthropic" para generar respuesta final
10. Añade un nodo "Supabase" para guardar la respuesta
11. Añade un nodo "Send Email" para enviar la respuesta al usuario

### 5.2 Flujo para Automatizar Procesamiento de Facturas XML

Similar al flujo anterior, pero utilizando los servidores MCP adecuados para procesar archivos XML.

## 6. Escenarios Prácticos

### 6.1 Asistente Virtual de Facturación

Este escenario implementa un asistente que:
1. Recibe preguntas sobre facturación electrónica en Costa Rica
2. Busca información relevante utilizando Brave Search MCP
3. Consulta documentación interna mediante Filesystem MCP
4. Genera respuestas precisas respetando las restricciones legales

#### Implementación en n8n

[Diagrama y configuración detallada del flujo]

### 6.2 Procesador Inteligente de Documentos Fiscales

Este escenario implementa:
1. Un sistema para analizar facturas XML/PDF
2. Extracción de datos clave mediante Claude + MCP
3. Almacenamiento estructurado en Supabase
4. Validación y detección de errores comunes

#### Implementación en n8n

[Diagrama y configuración detallada del flujo]

## 7. Solución de Problemas

### 7.1 Servidor MCP no responde

```bash
# Verificar que el servidor está funcionando
curl -v http://localhost:[puerto]

# Reiniciar el servidor
cd ~/mcp-servers/[servidor]
npm start

# Verificar logs
cat ~/mcp-servers/logs/[servidor].log
```

### 7.2 n8n no conecta con servidor MCP

- Verifica que la URL del servidor sea correcta
- Asegúrate de que no haya un firewall bloqueando la conexión
- Reinicia n8n: `n8n stop && n8n start --tunnel`

### 7.3 Errores comunes con la API de Claude

| Código | Descripción | Solución |
|--------|-------------|----------|
| 401    | API Key inválida | Verifica tu ANTHROPIC_API_KEY |
| 429    | Rate limit excedido | Implementa throttling o espera |
| 500    | Error del servidor | Intenta nuevamente más tarde |

## 8. Recursos Adicionales

- [Repositorio de GitHub para MCP](https://github.com/anthropics/anthropic-cookbook/tree/main/model-context-protocol)
- [Documentación de n8n](https://docs.n8n.io/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Foro de Soporte de Solar Fluidity](https://soporte.solarfluidity.com)

---

## Apéndice: Lista de Verificación de Implementación

- [ ] Entorno básico instalado (Node.js, Python, Docker)
- [ ] Variables de entorno configuradas
- [ ] Servidores MCP instalados y funcionando
- [ ] n8n instalado y configurado
- [ ] Tablas de Supabase creadas con RLS
- [ ] Webhooks de Supabase configurados
- [ ] Flujos básicos implementados y probados
- [ ] Script de inicio automático configurado

---

*Documento preparado por el equipo técnico de Solar Fluidity*
*Última actualización: Marzo 2025*
