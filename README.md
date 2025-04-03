# Solar Fluidity - Plataforma Integral SaaS para Empresas Solares y Electromecánicas

<p align="center">
  <img src="public/logo-full.png" alt="Solar Fluidity Logo" width="400"/>
</p>

<p align="center">
  <strong>Facturación Electrónica Offline | Gestión de Proyectos | Automatizaciones con Agentes IA</strong>
</p>

<p align="center">
  <a href="#facturación-electrónica">Facturación</a> •
  <a href="#gestión-de-proyectos">Proyectos</a> •
  <a href="#automatización-con-agentes-ia">Automatización</a> •
  <a href="#guías-de-uso">Guías</a> •
  <a href="#desarrollo">Desarrollo</a> •
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
-   **Backend y Base de Datos**: Supabase (PostgreSQL)
-   **Automatizaciones**: Agentes IA (LangGraph + Pydantic + FastAPI)
-   **IA & Agentes**: LangGraph + Pydantic + FastAPI
-   **Almacenamiento**: AWS S3 (documentos XML/PDF)
-   **Pagos**: PayPal + Stripe (procesamiento de suscripciones)
-   **Seguridad**: Autenticación Supabase, Row Level Security (RLS), HTTPS/SSL
-   **Integraciones**: Model Context Protocol (MCP) para Gmail, Google Calendar, Airtable, GitHub

### Diagrama de Arquitectura

```mermaid
graph TD
    A[Cliente Web/Móvil] -->|HTTPS| B[Frontend React]
    B -->|API| C[Supabase]
    C -->|SQL| D[PostgreSQL]
    B -->|WebSocket| J[Agentes IA]
    J -->|API| C
    J -->|API| F[Servicios Externos]
    F -->|SMTP| G[Notificaciones Email]
    F -->|Calendar API| H[Google Calendar]
    F -->|HTTPS| I[Airtable]
    C -->|S3 API| K[AWS S3]
    L[MCP Hub] -.->|Protocol| J

    classDef primary fill:#4f46e5,stroke:#312e81,color:white;
    classDef secondary fill:#0ea5e9,stroke:#0369a1,color:white;
    classDef storage fill:#10b981,stroke:#047857,color:white;
    classDef external fill:#f59e0b,stroke:#b45309,color:white;

    class A,B primary;
    class C,D,J secondary;
    class K storage;
    class F,G,H,I,L external;
```

### Integraciones Principales

| Servicio        | Propósito                      | Método de Integración |
| --------------- | ------------------------------ | --------------------- |
| Gmail           | Comunicaciones automatizadas   | MCP / API REST        |
| Google Calendar | Programación de actividades    | MCP / API REST        |
| Airtable        | Gestión de datos estructurados | MCP / API REST        |
| GitHub          | Seguimiento de proyectos       | MCP / API REST        |
| PayPal          | Procesamiento de pagos         | API REST              |
| AWS S3          | Almacenamiento de documentos   | API REST              |

## ✅ Funcionalidades Clave

### Facturación Electrónica

Sistema completo para generar facturas electrónicas válidas sin depender de conexión a internet:

-   **Generación de XML**: Cumple con los estándares UBL 2.1 establecidos por Hacienda en Costa Rica
-   **Representación Gráfica**: PDFs profesionales con todos los elementos requeridos por la ley
-   **Firma Digital**: Integración con firma digital del BCCR
-   **Gestión de Estados**: Seguimiento del ciclo completo (borrador → emitida → aceptada/rechazada)
-   **Validación Offline**: Verificación de estructura y contenido sin necesidad de conexión
-   **Almacenamiento Seguro**: Respaldo cifrado de todos los documentos fiscales

### Gestión de Proyectos

Herramientas especializadas para proyectos solares y electromecánicos:

-   **Planificación**: Diseño de proyectos con estimación de capacidad, equipos y costos
-   **Seguimiento**: Control de avance con hitos y etapas predefinidas para el sector
-   **Calendario Integrado**: Programación de instalaciones, visitas y mantenimientos
-   **Gestión de Recursos**: Asignación de personal técnico y equipos
-   **Cotizaciones**: Generación de propuestas comerciales con plantillas profesionales
-   **Documentación Técnica**: Repositorio de planos, permisos y especificaciones

### Automatización con Agentes IA

Sistema de inteligencia artificial basado en LangGraph y Pydantic para automatizar procesos complejos:

-   **Agentes Especializados**: IAs dedicadas para facturación, proyectos y comunicaciones
-   **Procesamiento de Lenguaje Natural**: Instrucciones en lenguaje conversacional para automatizar tareas
-   **Validación Inteligente**: Verificación avanzada de la integridad de datos mediante modelos Pydantic
-   **Flujos Cognitivos**: Generación y distribución automática de reportes con análisis contextual
-   **Integraciones MCP**: Conexión nativa con servicios externos mediante Model Context Protocol
-   **Ejecución Paralela**: Procesamiento simultáneo de tareas mediante grafos de agentes LangGraph

### Reportes y Análisis

Dashboards y reportes detallados para la toma de decisiones:

-   **Panel Financiero**: Resumen de ingresos, gastos y rentabilidad por proyecto
-   **Proyecciones**: Estimaciones de facturación y flujo de caja
-   **Análisis de Eficiencia**: Métricas de rendimiento de proyectos y equipos
-   **Exportación**: Descarga en Excel, PDF y otros formatos estándar
-   **Reportes Personalizados**: Crea tus propios informes según tus necesidades
-   **Visualizaciones**: Gráficos interactivos para entender tendencias

## 🔌 Integraciones con Model Context Protocol (MCP)

Solar Fluidity utiliza el protocolo MCP para conectarse con servicios externos de manera flexible y potente:

### Gmail MCP

Gestión completa de comunicaciones por correo electrónico:

-   **Envío Automático**: Distribución programada de facturas, cotizaciones y reportes
-   **Plantillas Personalizables**: Mensajes profesionales con tu imagen corporativa
-   **Seguimiento**: Monitoreo de apertura y respuesta de correos importantes
-   **Notificaciones**: Alertas sobre eventos críticos del proyecto o facturación
-   **Flujos de Comunicación**: Secuencias de emails para diferentes etapas del proyecto
-   **Archivo Digital**: Respaldo centralizado de todas las comunicaciones con clientes

### Google Calendar MCP

Programación y seguimiento temporal de todas las actividades:

-   **Agenda Compartida**: Calendarios para equipo técnico y administrativo
-   **Programación Inteligente**: Optimización de rutas para visitas técnicas
-   **Recordatorios**: Notificaciones automáticas para hitos y entregas
-   **Disponibilidad**: Control de recursos técnicos y equipamiento
-   **Sincronización**: Mantén actualizados todos los calendarios automáticamente
-   **Confirmaciones**: Gestión de asistencia para citas y reuniones

### Airtable MCP

Base de datos flexible para gestión de información estructurada:

-   **Catálogo de Productos**: Gestión de equipos, precios y especificaciones
-   **Directorio de Clientes**: Información completa y actualizada de tu cartera
-   **Inventario**: Control de existencias y ubicación de equipos
-   **Plantillas de Proyectos**: Bases predefinidas para diferentes tipos de instalaciones
-   **Formularios**: Captura de datos en campo para técnicos e instaladores
-   **Vistas Personalizadas**: Paneles adaptados a diferentes roles y necesidades

### GitHub MCP

Seguimiento de proyectos con metodologías ágiles:

-   **Issues Automáticos**: Creación de tareas basadas en hitos del proyecto
-   **Seguimiento**: Estado actualizado de cada componente del proyecto
-   **Colaboración**: Trabajo coordinado entre equipos técnicos y administrativos
-   **Documentación**: Repositorio centralizado de información técnica
-   **Integraciones**: Conexión con herramientas de CI/CD para implementaciones
-   **Historico**: Registro completo de cambios y decisiones en cada proyecto

### Browserbase Stagehand MCP

Automatización de navegación web para tareas repetitivas:

-   **Extracción de Datos**: Obtención automática de información de portales gubernamentales
-   **Verificación de Estados**: Consulta automática del estado de facturas en Hacienda
-   **Llenado de Formularios**: Automatización de presentaciones y trámites online
-   **Monitoreo**: Seguimiento automático de plataformas de clientes y proveedores
-   **Captura de Recibos**: Obtención y archivo de comprobantes digitales
-   **Validaciones**: Verificación de datos en sistemas externos

## 🛠 Configuración del Proyecto

### Requisitos Previos

-   Node.js (v16+) y npm/yarn
-   Python (v3.8+) y pip
-   Cuenta en Supabase
-   Cuenta AWS (para S3) o servicio de almacenamiento alternativo
-   Cuenta de PayPal Business (para procesamiento de pagos)
-   Cuenta de Google con API habilitadas para Gmail y Google Calendar
-   Cuenta en Airtable para bases de datos complementarias
-   Configuración de MCPs (Model Context Protocol) para integraciones con servicios externos

### Instalación

```sh
# Clonar el repositorio
git clone https://github.com/KevinCElizondo/proyectosolar.git

# Navegar al directorio del proyecto
cd proyectosolar

# Instalar dependencias (Node.js y Python)
./start_solar_fluidity.sh --install-deps # (O ejecutar npm install y pip install manualmente)

# Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env con tus credenciales

# Iniciar el servidor de desarrollo
npm run dev
```

### Configuración de Supabase

La aplicación utiliza Supabase como backend. Sigue estos pasos para configurar la base de datos:

1.  Crea una cuenta en [Supabase](https://supabase.com)
2.  Crea un nuevo proyecto
3.  Obtiene la URL y la clave anónima de tu proyecto
4.  Añade estas credenciales a tu archivo `.env`:
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
    SUPABASE_URL=https://tu-proyecto.supabase.co
    SUPABASE_KEY=tu-clave-de-servicio # Service Role Key
    ```
5.  Ejecuta el script de creación de tablas:
    ```bash
    ./start_solar_fluidity.sh --setup
    ```

    Si el script falla, puedes crear las tablas manualmente en el Editor SQL de Supabase:

    ```sql
    -- Tabla para facturas
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

    -- Tabla para líneas de factura
    CREATE TABLE IF NOT EXISTS factura_lineas (
        id SERIAL PRIMARY KEY,
        factura_id INTEGER REFERENCES facturas(id),
        descripcion TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL
    );

    -- Tabla para proyectos
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
    ```

### Configuración de MCPs

El sistema utiliza Model Context Protocol (MCP) para integrar servicios externos. Este protocolo permite una comunicación estandarizada y segura con diferentes APIs y servicios.

Para configurar el MCP Hub y las integraciones, sigue estos pasos:

#### 4.3.1 Gmail MCP

```sh
# Crear directorio para credenciales de Gmail
mkdir -p ~/.gmail-mcp

# Copiar archivo de credenciales OAuth de Google
mv /ruta/del/archivo/gcp-oauth.keys.json ~/.gmail-mcp/

# Ejecutar autenticación
npx @gongrzhe/server-gmail-autoauth-mcp auth
```

#### 4.3.2 Google Calendar MCP

```sh
# Instalar el MCP de Google Calendar
npx @takumi0706/mcp-google-calendar
```

#### 4.3.3 Airtable MCP

Configurar la variable de entorno con la API key de Airtable en el archivo de configuración de MCPs.

#### 4.3.4 Archivo mcp_config.json

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "tu_token_personal_de_github"
      }
    },
    "gmail": {
      "command": "npx",
      "args": [
        "-y",
        "@gongrzhe/server-gmail-autoauth-mcp"
      ]
    },
    "google-calendar": {
      "command": "npx",
      "args": [
        "-y",
        "@takumi0706/mcp-google-calendar"
      ]
    },
    "airtable": {
      "command": "npx",
      "args": [
        "-y",
        "@felores/airtable-mcp-server"
      ],
      "env": {
        "AIRTABLE_API_KEY": "tu_api_key_de_airtable"
      }
    }
  }
}
```

## 🤖 Agentes IA y Automatizaciones

Solar Fluidity implementa un sistema avanzado de agentes de IA paralelos que reemplaza soluciones tradicionales de automatización. Estos agentes, construidos con LangGraph y Pydantic, procesan consultas en lenguaje natural y ejecutan acciones complejas de manera autónoma.

### Arquitectura de Agentes

```mermaid
graph TD
    A[Usuario] -->|Consulta| B[Agente Recopilador de Información]
    B -->|Datos Estructurados| C[Distribución Paralela]
    C -->|Facturas| D[Agente de Facturación]
    C -->|Proyectos| E[Agente de Proyectos]
    C -->|Comunicaciones| F[Agente de Comunicación]
    C -->|Automatizaciones| G[Agente de Automatización]
    D -->|Resultado| H[Agente Sintetizador]
    E -->|Resultado| H
    F -->|Resultado| H
    G -->|Resultado| H
    H -->|Respuesta Final| A

    classDef primary fill:#4f46e5,stroke:#312e81,color:white;
    classDef user fill:#f97316,stroke:#c2410c,color:white;
    classDef agents fill:#10b981,stroke:#047857,color:white;

    class A user;
    class B,H primary;
    class C,D,E,F,G agents;
```

### Configuración de Agentes IA

```bash
# Navegar al directorio de agentes IA
cd ai_agents

# Instalar dependencias de Python
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar con tu clave de API de OpenAI

# Iniciar el servidor de agentes
python main.py
```

### Prompts Especializados

Cada agente utiliza prompts específicos para cumplir su función. Puedes encontrar estos prompts en el archivo `ai_agents/agents/prompts.py`. Algunos ejemplos son:

#### Prompt para Facturación Electrónica

```
Tu especialidad es la creación y gestión de facturas electrónicas siguiendo la normativa fiscal de Costa Rica.

DETALLES IMPORTANTES:
- Documentos XML deben seguir el esquema UBL 2.1 establecido por el Ministerio de Hacienda
- Es obligatorio incluir el detalle completo de impuestos (IVA del 13% general, con excepciones)
- La factura debe incluir la identificación fiscal del emisor y receptor
- Se debe especificar la condición de venta y el medio de pago
```

#### Prompt para Gestión de Proyectos

```
Tu especialidad es ayudar en la planificación, seguimiento y gestión de proyectos solares y electromecánicos.

DATO CLAVE: En Costa Rica, 1 kWp produce aproximadamente 4-5 kWh/día
```

## 📘 Guías de Uso

### 4.3 Variables de Entorno

Configurar el archivo `.env` con las siguientes variables:

```env
# Supabase
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# OpenAI (para Agentes IA)
OPENAI_API_KEY=tu_clave_api_openai

# PayPal
VITE_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_SECRET=tu_secret
PAYPAL_WEBHOOK_URL=tu_webhook_url

# AWS S3
VITE_AWS_BUCKET_NAME=nombre_bucket
VITE_AWS_REGION=region
AWS_ACCESS_KEY_ID=access_key
AWS_SECRET_ACCESS_KEY=secret_key

# Email (si no usas Gmail MCP)
VITE_SMTP_HOST=tu_smtp_host
VITE_SMTP_PORT=tu_smtp_port
VITE_SMTP_USER=tu_smtp_user
VITE_SMTP_PASSWORD=tu_smtp_password
```

## 5. Estructura del Proyecto

```
proyectosolar/
├── src/
│   ├── components/        # Componentes React reutilizables
│   ├── pages/             # Páginas de la aplicación
│   │   ├── auth/          # Autenticación (login, registro)
│   │   ├── dashboard/     # Panel principal
│   │   ├── projects/      # Gestión de proyectos
│   │   ├── invoices/      # Facturación electrónica
│   │   ├── reports/       # Reportes financieros
│   │   └── settings/      # Configuración de cuenta
│   ├── services/          # Servicios y APIs
│   │   ├── supabase.ts    # Cliente Supabase
│   │   ├── invoice.ts     # Servicios de facturación
│   │   ├── project.ts     # Servicios de proyectos
│   │   └── ai_agent.ts    # Interacción con Agentes IA
│   ├── hooks/             # Custom hooks
│   ├── context/           # Contextos React
│   ├── utils/             # Utilidades y helpers
│   └── styles/            # Estilos y configuración de Tailwind
├── public/                # Archivos estáticos
├── docs/                  # Documentación
├── ai_agents/             # Código de los Agentes IA (Python/FastAPI)
│   ├── agents/            # Lógica de cada agente especializado
│   ├── main.py            # Servidor FastAPI
│   ├── graph.py           # Definición del grafo LangGraph
│   └── requirements.txt   # Dependencias Python
├── supabase/              # Configuración de Supabase
│   ├── migrations/        # Scripts SQL para estructura de BD
│   └── functions/         # Funciones Edge/Database
└── scripts/               # Scripts de utilidad (tests, etc.)
```

## 6. Configuración de Base de Datos (Supabase)

### 6.1 Tablas Principales

-   `facturas`: Almacena información general de las facturas.
-   `factura_lineas`: Detalle de productos/servicios por factura.
-   `proyectos`: Información general de los proyectos.
-   `proyecto_hitos`: Hitos y seguimiento de proyectos.
-   `clientes`: Información de clientes.
-   `usuarios`: Usuarios de la plataforma.

### 6.2 Seguridad (Row Level Security - RLS)

Se implementan políticas RLS para asegurar que los usuarios solo puedan acceder a la información de su propia organización.

## 7. Roadmap y Futuras Funcionalidades

### Corto Plazo (Próximos 3 meses)

-   [x] Integración completa de Agentes IA para automatización
-   [x] Módulo de reportes financieros avanzado
-   [ ] Dashboard personalizable por usuario
-   [ ] Integración con firma digital del BCCR

### Mediano Plazo (3-6 meses)

-   [ ] Aplicación móvil (React Native)
-   [ ] Módulo de inventario de equipos
-   [ ] Integración con software contable (QuickBooks, Xero)
-   [ ] Portal del cliente para seguimiento de proyectos

### Largo Plazo (6+ meses)

-   [ ] Mercado de plantillas de proyectos
-   [ ] Funcionalidades de colaboración en tiempo real
-   [ ] Optimización de rutas para equipos técnicos
-   [ ] Predicción de demanda energética basada en IA

## 🚀 Despliegue

### 8.1 Preparación

-   Asegurar que todas las variables de entorno estén configuradas para producción.
-   Compilar el frontend: `npm run build`
-   Configurar un servidor para alojar el frontend estático (Vercel, Netlify, S3+CloudFront).
-   Desplegar el servidor de Agentes IA (Docker, Kubernetes, servicio PaaS).
-   Configurar Supabase para producción (backups, escalabilidad).

### 8.2 Checklist de Despliegue

-   [ ] Variables de entorno de producción configuradas
-   [ ] Frontend compilado y desplegado
-   [ ] Servidor de Agentes IA desplegado y accesible
-   [ ] Base de datos Supabase configurada para producción
-   [ ] Configuración de DNS y HTTPS
-   [ ] Pruebas de integración en entorno de producción
-   [ ] Configuración de monitoreo y alertas

### 8.3 Consideraciones de Seguridad

-   Utilizar claves de API seguras y rotarlas periódicamente.
-   Configurar reglas de firewall adecuadas.
-   Implementar políticas RLS estrictas en Supabase.
-   Mantener actualizadas todas las dependencias.
-   Realizar auditorías de seguridad periódicas.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue las guías de estilo y envía Pull Requests detallados.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para soporte o consultas, contacta a [soporte@solarfluidity.com](mailto:soporte@solarfluidity.com).
