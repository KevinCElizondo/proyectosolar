# Solar Fluidity - Plataforma Integral SaaS para Empresas Solares y Electromecánicas

<p align="center">
  <img src="public/logo-full.png" alt="Solar Fluidity Logo" width="400"/>
</p>

<p align="center">
  <strong>Facturación Electrónica Offline | Gestión de Proyectos | Automatizaciones con Agentes IA</strong>
</p>

<p align="center">
  <a href="#visión-general">Visión General</a> •
  <a href="#arquitectura-tecnológica">Arquitectura</a> •
  <a href="#funcionalidades-clave">Funcionalidades</a> •
  <a href="#configuración-e-instalación">Instalación</a> •
  <a href="#ejecución">Ejecución</a> •
  <a href="#licencia">Licencia</a>
</p>

## 📋 Visión General

Solar Fluidity es una plataforma SaaS diseñada específicamente para empresas costarricenses del sector de proyectos solares y servicios electromecánicos, ofreciendo tres pilares principales:

1.  **Facturación Electrónica Offline**: Genera XML/PDF válidos según la normativa fiscal de Costa Rica sin requerir conexión directa con Hacienda, otorgando mayor autonomía al usuario.
2.  **Gestión de Proyectos Especializada**: Funcionalidades adaptadas a los sectores solar y electromecánico, incluyendo seguimiento de instalaciones, mantenimientos y cotizaciones.
3.  **Automatización con Agentes IA**: Sistema avanzado de agentes de inteligencia artificial basados en LangGraph y Pydantic que automatizan validación de facturas, recordatorios de pago, reportes financieros y seguimiento de proyectos.

### ✨ Principales Diferenciadores

-   **Control Total del Proceso Fiscal**: Genere documentos fiscales válidos sin depender de conexión a servicios externos.
-   **Interfaz Adaptada al Sector**: Diseñada específicamente para proyectos solares y electromecánicos en Costa Rica.
-   **Agentes IA Especializados**: Implementación de IA para automatizar tareas complejas de facturación y gestión.
-   **Integraciones MCP**: Conexión con Gmail, Google Calendar, Airtable y otras herramientas mediante Model Context Protocol.

## 🏗️ Arquitectura Tecnológica

### Stack Técnico

-   **Frontend**: React 18 + TypeScript + Vite
-   **UI/UX**: Tailwind CSS + shadcn/ui + Framer Motion
-   **Backend API (Pagos)**: Node.js + Express (en `backend-api/`)
-   **Base de Datos**: Supabase (PostgreSQL)
-   **Automatizaciones**: Agentes IA (LangGraph + Pydantic + Python en `ai_agents/`)
-   **Servidor MCP (Facturas/Proyectos)**: Python + FastMCP + Supabase (en `src/integrations/mcp/`)
-   **Almacenamiento**: AWS S3 (documentos XML/PDF) - *Configuración pendiente*
-   **Pagos**: PayPal (integrado vía `backend-api`)
-   **Seguridad**: Autenticación Google/Convex, Supabase RLS, HTTPS/SSL
-   **Integraciones Externas**: Model Context Protocol (MCP) para Gmail, Google Calendar, Airtable, GitHub

*(Diagrama de Arquitectura y Tabla de Integraciones omitidos por brevedad - mantener los existentes)*

## ✅ Funcionalidades Clave

*(Secciones de Funcionalidades omitidas por brevedad - mantener las existentes)*

## 🔌 Integraciones con Model Context Protocol (MCP)

*(Sección de MCP omitida por brevedad - mantener la existente)*

## 🛠 Configuración e Instalación

Sigue estos pasos para configurar y poner en marcha el proyecto Solar Fluidity en tu entorno local.

### 1. Requisitos Previos

Asegúrate de tener instalado lo siguiente:

-   **Git:** Para clonar el repositorio.
-   **Node.js:** Versión 16 o superior (incluye npm).
-   **Python:** Versión 3.8 o superior (incluye pip/pip3).
-   **Cuentas de Servicios Externos:**
    -   Google Cloud (para OAuth de Gmail/Calendar)
    -   Supabase (para base de datos principal)
    -   PayPal Developer (para credenciales de API de pagos Sandbox y Live)
    -   (Opcional) OpenAI (para los Agentes IA)
    -   (Opcional) GitHub (si usas ese MCP)
    -   (Opcional) AWS (para S3)
    -   **Docker y Docker Compose:** Para ejecutar servicios contenerizados (ver <a href="#ejecución-con-docker-compose">Ejecución con Docker Compose</a>).

### 2. Clonar el Repositorio

```bash
git clone https://github.com/KevinCElizondo/proyectosolar.git
cd proyectosolar
```

### 3. Configurar Variables de Entorno (`.env`)

Existen varios archivos `.env` para los diferentes componentes. Necesitarás crearlos y llenarlos con tus credenciales. **Nunca compartas estos archivos con información sensible.**

**a) Archivo Principal (`./.env`)**

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
nano .env # o usa tu editor preferido
```

Configura las siguientes variables (como mínimo):

```dotenv
# URL del Backend API (creado en backend-api/)
VITE_API_URL=http://localhost:4000 

# Credenciales Convex (si las usas directamente en frontend)
VITE_CONVEX_DEPLOY_KEY=your-convex-deploy-key 

# Credenciales PayPal (SOLO Client ID para el frontend)
VITE_PAYPAL_SANDBOX_CLIENT_ID=YOUR_PAYPAL_SANDBOX_CLIENT_ID 
VITE_PAYPAL_LIVE_CLIENT_ID=YOUR_PAYPAL_LIVE_CLIENT_ID 

# Credenciales Supabase (para frontend y servidor MCP)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-role-key # ¡SECRETO!

# N8N (si aplica)
VITE_N8N_WEBHOOK_URL=your-n8n-webhook-url

# OpenAI (para Agentes IA)
OPENAI_API_KEY=your_openai_api_key # ¡SECRETO!

# Otras variables según .env.example...
```

**b) Backend API (`./backend-api/.env`)**

Crea este archivo dentro de `backend-api/`:

```bash
nano backend-api/.env
```

Añade el siguiente contenido, reemplazando los placeholders:

```dotenv
# Entorno (development para local, production para despliegue)
NODE_ENV=development

# Credenciales PayPal (¡SECRETO!) - Usa Sandbox para local
PAYPAL_CLIENT_ID=YOUR_PAYPAL_SANDBOX_CLIENT_ID
PAYPAL_SECRET=YOUR_PAYPAL_SANDBOX_SECRET

# Credenciales PayPal Live (para producción)
PAYPAL_LIVE_CLIENT_ID=YOUR_PAYPAL_LIVE_CLIENT_ID
PAYPAL_LIVE_SECRET=YOUR_PAYPAL_LIVE_SECRET

# Configuración del Servidor API
PORT=4000
FRONTEND_URL=http://localhost:5173 # URL del frontend local (para CORS)
```

**c) Notificador Slack (`./readme_notifier/.env`)**

Crea este archivo dentro de `readme_notifier/`:

```bash
nano readme_notifier/.env
```

Añade el siguiente contenido, reemplazando los placeholders:

```dotenv
# Token de Bot de Slack (¡SECRETO! - debe empezar con xoxb-)
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token 

# Canal o ID de usuario de Slack para enviar notificaciones
SLACK_CHANNEL=#developers 

# Directorio a observar (relativo a la raíz del proyecto)
WATCHED_DIR=backend-api 
```

**d) Agentes IA (`./ai_agents/.env`)**

Si existe un `.env.example` en `ai_agents/`, cópialo y edítalo:

```bash
cp ai_agents/.env.example ai_agents/.env
nano ai_agents/.env 
```
Asegúrate de que contenga la `OPENAI_API_KEY` si no está en el `.env` principal.

### 4. Instalar Dependencias

Puedes instalar todas las dependencias usando el script principal o manualmente:

**Opción A: Usando el Script (Recomendado)**

```bash
./start_solar_fluidity.sh --install-deps 
```
*(Nota: Este comando puede necesitar ajustes para incluir la instalación de dependencias de `readme_notifier` si no lo hace ya).*

**Opción B: Manualmente**

```bash
# Dependencias del Frontend (root)
npm install

# Dependencias del Backend API
cd backend-api
npm install
cd ..

# Dependencias de Agentes IA
cd ai_agents
pip install -r requirements.txt # o pip3
cd ..

# Dependencias del Notificador Slack
cd readme_notifier
pip install -r requirements.txt # o pip3
cd ..
```

### 5. Configurar Base de Datos (Supabase)

**Opción A: Usando el Script**

```bash
./start_solar_fluidity.sh --setup
```

**Opción B: Manualmente**

Si el script falla, ejecuta el SQL proporcionado en la sección "Configuración de Supabase" del README anterior (líneas 248-284) directamente en el editor SQL de tu proyecto Supabase.

### 6. Configurar MCPs (Opcional)

Si planeas usar las integraciones MCP (Gmail, Calendar, Airtable, GitHub):

1.  Asegúrate de tener `npx` (viene con Node.js).
2.  Sigue las instrucciones específicas para cada MCP listadas en la sección "Configuración de MCPs" del README anterior (líneas 292-357). Esto puede implicar crear archivos de credenciales y ejecutar comandos `npx`.
3.  Crea o actualiza el archivo de configuración de MCPs (por ejemplo, `.roo/mcp.json` o similar, dependiendo de cómo los inicies) con tus tokens y configuraciones.

## 🚀 Ejecución

Puedes iniciar los diferentes componentes del proyecto de forma individual, usando el script `start_solar_fluidity.sh`, o utilizando Docker Compose para los servicios soportados.

### Ejecución con Docker Compose (Recomendado para Agentes IA y Dashboard)

Docker Compose gestiona los servicios `ai-agents` y `support-dashboard`. Asegúrate de haber configurado los archivos `.env` correspondientes como se indica en la [Guía de Despliegue](docs/GUIA_DESPLIEGUE.md).

```bash
# Construir (si es necesario) e iniciar los servicios en segundo plano
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Detener los servicios
docker-compose down
```

Servicios disponibles:
-   **AI Agents API:** `http://localhost:8001`
-   **Support Dashboard:** `http://localhost:9999`

Consulta la [Guía de Despliegue](docs/GUIA_DESPLIEGUE.md) para más detalles.

### Iniciar Todos los Servicios (Script)

El script `start_solar_fluidity.sh` puede intentar iniciar varios componentes (puede requerir ajustes).

```bash
./start_solar_fluidity.sh --full
```

### Iniciar Componentes Individualmente (Manual)

Si no usas Docker Compose para los agentes o necesitas iniciar otros componentes manualmente:

-   **Frontend:**
    ```bash
    npm run dev
    ```
    (Accede en `http://localhost:5173`)

-   **Backend API:**
    ```bash
    cd backend-api
    npm start
    ```
    (API disponible en `http://localhost:4000`)

-   **Agentes IA (si no usas Docker):**
    ```bash
    # Asegúrate de tener las dependencias: pip install -r ai_agents/requirements.txt
    # Asegúrate de que ai_agents/.env esté configurado
    python ai_agents/main.py
    ```
    (API disponible en `http://localhost:8000`)

-   **Servidor MCP (Facturas/Proyectos):**
    ```bash
    # Asegúrate de tener las dependencias y variables de entorno (SUPABASE_URL, SUPABASE_KEY)
    python src/integrations/mcp/solar_fluidity_mcp_server.py
    ```

-   **Notificador Slack:**
    ```bash
    # Asegúrate de tener las dependencias y readme_notifier/.env configurado
    python readme_notifier/main.py
    ```

-   **MCPs Externos (Gmail, Calendar, etc.):**
    Inícialos según la configuración de tu hub MCP.

## 🤖 Agentes IA y Automatizaciones

*(Sección omitida por brevedad - mantener la existente)*

## 📘 Guías de Uso y Despliegue

-   **Guía de Usuario:** [docs/GUIA_USUARIO.md](docs/GUIA_USUARIO.md)
-   **Guía de Despliegue (Docker):** [docs/GUIA_DESPLIEGUE.md](docs/GUIA_DESPLIEGUE.md)
-   **Guía de Despliegue (Vercel):** [docs/GUIA_DESPLIEGUE_VERCEL.md](docs/GUIA_DESPLIEGUE_VERCEL.md)
-   **Documentación de Arquitectura:** [docs/DOCUMENTO_MAESTRO_ARQUITECTURA.md](docs/DOCUMENTO_MAESTRO_ARQUITECTURA.md)
-   **Estructura del Proyecto:** [docs/ESTRUCTURA_PROYECTO.md](docs/ESTRUCTURA_PROYECTO.md)

## 🚀 Despliegue en Vercel

Solar Fluidity está optimizado para ser desplegado fácilmente en Vercel. Para realizar el despliegue:

1. **Crea una cuenta en Vercel** si aún no tienes una.
2. **Importa tu repositorio de GitHub** desde el panel de Vercel.
3. **Configura las Variables de Entorno** en Vercel según lo definido en `.env.production`.
4. **Despliega** la aplicación con la configuración por defecto.

Para más detalles, consulta la [Guía de Despliegue en Vercel](docs/GUIA_DESPLIEGUE_VERCEL.md).

## 📄 Licencia

*(Sección omitida por brevedad - mantener la existente)*

## 📞 Contacto

*(Sección omitida por brevedad - mantener la existente)*
