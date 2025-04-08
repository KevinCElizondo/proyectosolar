# Solar Fluidity

# Plataforma Integral SaaS para Empresas Solares y Electromecánicas

<p align="center">
  <img src="public/logo-full.png" alt="Solar Fluidity Logo" width="400"/>
</p>

<p align="center">
  <strong>Facturación Electrónica Offline | Gestión de Proyectos | Automatizaciones con Agentes IA</strong>
</p>

<p align="center">
  <a href="#descripción-general">Descripción General</a> •
  <a href="#arquitectura-tecnológica">Arquitectura</a> •
  <a href="#estructura-del-proyecto">Estructura</a> •
  <a href="#contenedores-docker-principales">Contenedores</a> •
  <a href="#despliegue">Despliegue</a> •
  <a href="#funcionalidades-clave">Funcionalidades</a> •
  <a href="#integraciones-y-aliases">Integraciones</a> •
  <a href="#pasos-de-instalación">Instalación</a> •
  <a href="#consideraciones-de-seguridad">Seguridad</a> •
  <a href="#contacto-y-soporte">Contacto</a>
</p>

## 1. Descripción General

Solar Fluidity es una plataforma SaaS diseñada para empresas costarricenses de los sectores solar y electromecánico. Ofrece tres pilares principales:

### 1.1 Facturación Electrónica Offline
- Genera documentos XML/PDF válidos siguiendo la normativa fiscal de Costa Rica.
- No requiere conexión directa con Hacienda para la creación de facturas.
- El usuario puede emitir y descargar la factura en cualquier momento, garantizando mayor autonomía.

### 1.2 Gestión de Proyectos Especializada
- Herramientas diseñadas para seguimiento de instalaciones, mantenimientos y cotizaciones.
- Incluye un sistema que replica funcionalidades esenciales de herramientas organizativas como Airtable o Notion, agregando valor al permitir la centralización y administración avanzada de datos y proyectos.

### 1.3 Automatización con Agentes IA
- Sistema interno y confidencial de agentes de IA basados en LangGraph y Pydantic.
- Automatizan validaciones, recordatorios, reportes financieros, seguimientos de proyectos y más.
- Nota: Esta característica es principalmente de uso interno, no se expone públicamente a los clientes.

La plataforma integra múltiples servicios externos para ofrecer una experiencia completa en términos de gestión de proyectos, facturación, almacenamiento seguro y análisis inteligente.

## 2. Arquitectura Tecnológica

### 2.1 Visión General del Stack

- **Frontend**:
  - Framework: React 18
  - Lenguaje: TypeScript
  - Bundler: Vite
  - Estilos: Tailwind CSS
  - Animaciones e Interacción: Framer Motion
  - Autenticación y Base de Datos: Supabase
  - Hospedaje recomendado: Netlify, Vercel o S3+CloudFront
  
- **Backend y Orquestación de Microservicios**:
  - Contenedores Docker orquestados mediante docker-compose.yml
  - API Principal (Node.js + Express): Manejo de endpoints para facturación, validaciones y pagos (PayPal).
  - Agentes IA (Python + FastAPI): Servicios internos de automatización.
    - Basados en LangGraph + Pydantic.
    - Expuestos en contenedores separados.
    - Uso interno, no público.
    
- **Base de Datos**:
  - Supabase (PostgreSQL manejado en la nube).
  - Opción de integración con DB propia en PostgreSQL vía Docker en entornos locales.
  
- **Almacenamiento de Archivos**:
  - AWS S3 para los documentos XML/PDF generados en facturación.
  
- **Integraciones y Servicios Adicionales**:
  - Gmail (con alias): Envío de correos, notificaciones y documentación.
  - PayPal: Procesamiento de pagos y suscripciones.
  - API Gateway / Reverse Proxy (opcional en producción): Traefik o similar.
  - Supabase: Alojamiento principal de la base de datos + autenticación (RLS).
  
- **Plataformas de Despliegue**:
  - Netlify / Vercel: Para hosting del frontend (sitio estático).
  - AWS (Elastic Beanstalk, ECS, EC2 o Lightsail, según el caso): Para contenedores Docker de la API, Agentes IA, etc.
  - Supabase: Base de datos PostgreSQL + servicios serverless integrados.

## 3. Estructura del Proyecto

La estructura propuesta facilita la organización del código, la extensibilidad y la implementación de buenas prácticas de DevOps. A continuación, una vista general (simplificada) de los directorios:

```
proyectosolar/
├── docker-compose.yml       # Orquestación de contenedores en desarrollo/producción
├── .env.example             # Variables de entorno de ejemplo
├── src/
│   ├── components/          # Componentes React reutilizables
│   ├── pages/               # Rutas principales (React Router)
│   │   ├── auth/            # Login, registro y recuperación de cuentas
│   │   ├── dashboard/       # Panel principal
│   │   ├── projects/        # Gestión de proyectos
│   │   ├── invoices/        # Facturación electrónica
│   │   ├── reports/         # Reportes financieros
│   │   └── settings/        # Configuración del usuario
│   ├── services/            # Conexiones con APIs (supabase, paypal, etc.)
│   ├── hooks/               # Custom hooks de React
│   ├── context/             # Contextos React
│   ├── utils/               # Helpers y funciones auxiliares
│   ├── styles/              # Configuración de Tailwind y estilos globales
│   └── integrations/        # Código adicional de integración
│       └── mcp/             # MCP (Model Context Protocol) - opcional
├── ai_agents/               # Código Python para Agentes IA (internos)
│   ├── agents/              # Lógica de agentes especializados
│   ├── main.py              # Servidor FastAPI
│   ├── graph.py             # Definición de LangGraph
│   └── requirements.txt     # Dependencias Python
├── scripts/                 # Scripts de automatización (ej. migraciones, backups, etc.)
├── docs/                    # Documentación detallada (guías, manuales, políticas)
└── ...
```

## 4. Contenedores Docker Principales

Para orquestar los diferentes servicios, se sugiere un docker-compose.yml con varios contenedores. A continuación, una lista de contenedores principales:

1. **frontend**
   - Build de la aplicación React con Vite.
   - Sirve contenido estático.

2. **backend-api**
   - Contiene la lógica Node.js (Express) para la API principal.
   - Expone los endpoints de facturación, pagos, etc.

3. **ai-agents**
   - Servidor FastAPI que maneja los agentes IA.
   - Uso interno. No se expone públicamente.

4. **db** (opcional en entornos locales)
   - Contenedor de PostgreSQL para pruebas locales (en producción se usa Supabase).

5. **adminer / pgAdmin** (opcional)
   - Herramienta de administración de base de datos.

6. **support-dashboard** (opcional)
   - Interfaz interna para soporte y monitoreo.
   - Nota: En producción, evitar exponer sockets del host.

En producción, cada uno puede ser desplegado en infraestructura distinta (por ejemplo, ECS para backend-api y ai-agents, Netlify para el frontend estático, y Supabase como DB).

## 5. Despliegue

### 5.1 Despliegue del Frontend en Netlify

1. Compilar el proyecto:
```bash
npm install
npm run build
```

2. Subir la carpeta dist/ (generada por Vite) a Netlify o configurarlo para ejecutar los comandos de build automáticamente desde el repo.
3. Configurar variables de entorno en Netlify para conectarse con la API (VITE_API_URL, VITE_SUPABASE_URL, etc.).

### 5.2 Despliegue de la API Principal y Agentes IA

- **Opción A: AWS ECS o Elastic Beanstalk**
  - Definir tareas ECS para cada contenedor (backend-api, ai-agents).
  - Almacenar imágenes en ECR (Elastic Container Registry).
  - Configurar seguridad (VPC, SG, etc.).

- **Opción B: Docker en EC2 o Lightsail**
  - Subir el repositorio al servidor.
  - Configurar .env de producción con secretos.
  - Ejecutar docker-compose up -d --build.

- **Opción C: Otros PaaS (Heroku, Fly.io, etc.)**
  - Ajustar la configuración del Dockerfile.
  - Subir la imagen en contenedor según los lineamientos del proveedor.

### 5.3 Base de Datos con Supabase

- Crear proyecto en Supabase y obtener:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
- Configurar reglas RLS para limitar el acceso a cada usuario/organización.
- Ejecutar migraciones (si las hubiera) o scripts de creación de tablas.

### 5.4 Almacenamiento de Documentos (AWS S3)

1. Crear un bucket S3.
2. Configurar políticas de acceso (lectura/escritura limitada).
3. Agregar las credenciales (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) en el archivo .env.
4. Verificar que la ruta de subida de archivos PDF/XML sea la correcta (VITE_AWS_BUCKET_NAME).

## 6. Funcionalidades Clave

### 6.1 Facturación Electrónica Offline
- Generación de XML/PDF según la normativa fiscal de Costa Rica (UBL 2.1).
- Operación Offline: No requiere comunicación directa con Hacienda para la emisión.
- Firma Digital (opcional) para validación con BCCR.
- Download Inmediato: El usuario puede descargar la factura al momento.
- Historial de facturas emitidas, con estados ("Pendiente de firma", "Emitida", etc.).
- Seguridad: Almacenamiento cifrado de documentos en S3.

### 6.2 Gestión de Proyectos Especializada
- Planificación y Seguimiento de instalaciones, mantenimientos y cotizaciones.
- Calendarios y Hitos para proyectos de tipo solar, electromecánico o híbrido.
- Reposición de Funcionalidades de Airtable o Notion:
  - Tablas personalizadas, enlaces entre registros, control de versiones básico.
  - Paneles con vistas personalizadas para cada rol (administración, técnicos, etc.).
- Documentación Técnica centralizada (subida de planos, manuales).
- Notificaciones vía correo electrónico (Gmail alias) o a través del panel interno.

### 6.3 Automatización Interna con Agentes IA
- Sistema Interno y Confidencial (no se expone al usuario final).
- Basado en LangGraph + Pydantic:
  - Flujos cognitivos configurables y validación estricta de datos.
  - Manejo de tareas repetitivas, validaciones, recordatorios y reportes.
- Orquestación: Los agentes pueden trabajar en paralelo, utilizando un grafo para procesar datos de facturación, calendario, etc.
- Desencadenantes: Generación de recordatorios de pago, alertas de mantenimiento, reportes de desempeño, etc.
- Registro de Actividad: Logs detallados para control interno.

## 7. Integraciones y Aliases

### 7.1 Integración con Gmail (Aliases)
- Permite el envío de correos automatizados desde diferentes alias (ej. facturacion@tudominio.com, soporte@tudominio.com).
- Se configuran credenciales IMAP/SMTP o se utiliza la API de Gmail.
- Permite notificaciones y envío de documentos a clientes finales.

### 7.2 PayPal
- Procesamiento de pagos recurrentes (suscripciones mensuales/anuales) o pagos únicos.
- Webhooks configurados para registrar el estado de cada transacción.

### 7.3 Otras Integraciones
- Model Context Protocol (MCP): Potencia la conexión con servicios de terceros (Gmail, Google Calendar, Airtable, etc.), si se desea.
- Herramientas Organizativas (replicadas internamente) para proyectos.

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
-   **Documentación de Arquitectura:** [docs/DOCUMENTO_MAESTRO_ARQUITECTURA.md](docs/DOCUMENTO_MAESTRO_ARQUITECTURA.md)
-   **Estructura del Proyecto:** [docs/ESTRUCTURA_PROYECTO.md](docs/ESTRUCTURA_PROYECTO.md)

## 📄 Licencia

*(Sección omitida por brevedad - mantener la existente)*

## 📞 Contacto

*(Sección omitida por brevedad - mantener la existente)*
