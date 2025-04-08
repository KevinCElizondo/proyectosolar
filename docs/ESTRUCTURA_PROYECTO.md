# Estructura del Proyecto Solar Fluidity

Este documento detalla la organización y estructura del código fuente de la plataforma Solar Fluidity, enfocada en generación de estructura de facturación electrónica (XML para Hacienda CR) para empresas costarricenses, gestión de proyectos solares/electromecánicos y automatizaciones con Agentes IA / Python.

## Estructura de Directorios Principal

```
proyectosolar/
├── ai_agents/              # Módulo de agentes IA para automatización de tareas
├── docs/                   # Documentación del proyecto
│   ├── screenshots/        # Capturas de pantalla organizadas por sección
│   ├── Afiliados/          # Documentación del programa de afiliados
│   ├── Artículos/          # Artículos de recursos sobre facturación y proyectos solares
│   ├── Automatizacion/     # Guías sobre flujos de automatización con Agentes IA / Python
│   └── Integraciones/      # Documentación de integraciones con servicios externos
├── mcp-python-sdk/         # SDK para Model Context Protocol (MCP)
├── public/                 # Archivos estáticos públicos
├── scripts/                # Scripts de utilidad y automatización
├── src/                    # Código fuente principal
│   ├── assets/             # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── components/         # Componentes React reutilizables
│   ├── config/             # Archivos de configuración
│   ├── context/            # Contextos de React para gestión de estado
│   ├── hooks/              # Custom hooks de React
│   ├── integrations/       # Integraciones con servicios externos y MCP
│   ├── layouts/            # Componentes de layout
│   ├── pages/              # Páginas de la aplicación
│   ├── services/           # Servicios y lógica de negocio
│   ├── styles/             # Estilos globales y utilidades CSS
│   ├── types/              # Definiciones de tipos TypeScript
│   └── utils/              # Funciones de utilidad
└── webapp/                 # Versión estática/alternativa de la web
```

## Detalles por Directorio

### `/ai_agents`

Contiene la implementación de los agentes IA basados en LangGraph y Pydantic que automatizan tareas específicas.

```
ai_agents/
├── agents/                 # Implementación de agentes especializados
│   ├── facturacion.py      # Agente de facturación electrónica
│   ├── proyectos.py        # Agente de gestión de proyectos
│   ├── comunicacion.py     # Agente de comunicación con clientes
│   ├── automatizacion.py   # Agente de automatización con Agentes IA / Python
│   ├── prompts.py          # Definiciones de prompts para agentes
│   └── utils.py            # Funciones de utilidad para agentes
├── graph.py                # Implementación del grafo de agentes paralelos
├── main.py                 # Punto de entrada y servidor FastAPI
├── requirements.txt        # Dependencias de Python
├── demo.py                 # Demo para probar la funcionalidad de agentes
└── ui.py                   # Interfaz simple para demostración
```

### `/src`

El código fuente principal de la aplicación web React.

#### Componentes (`/src/components`)

```
components/
├── ui/                     # Componentes UI básicos (botones, inputs, etc.)
├── InvoiceForm/            # Formulario de creación de facturas
├── InvoiceViewer/          # Visor de facturas generadas (XML/PDF)
├── ProjectDashboard/       # Dashboard de proyectos
├── ProjectTimeline/        # Línea de tiempo de proyectos
├── AutomationBuilder/      # Constructor visual de flujos de automatización
├── CalendarView/           # Vista de calendario integrado
├── PaymentButton/          # Integración de botones de pago
└── charts/                 # Componentes de visualización de datos
```

#### Páginas (`/src/pages`)

```
pages/
├── auth/                   # Páginas de autenticación
│   ├── Login.tsx
│   └── Register.tsx
├── Dashboard.tsx           # Panel principal
├── invoices/               # Páginas de facturación
│   ├── InvoiceList.tsx     # Lista de facturas
│   └── InvoiceCreate.tsx   # Creación de facturas
├── projects/               # Páginas de proyectos
│   ├── ProjectList.tsx     # Lista de proyectos
│   └── ProjectDetail.tsx   # Detalle de proyecto
├── payment/                # Páginas de pago
│   ├── Checkout.tsx        # Proceso de pago
│   ├── Plans.tsx           # Planes de suscripción
│   └── Success.tsx         # Confirmación de pago
└── settings/               # Páginas de configuración
    ├── Profile.tsx         # Perfil de usuario
    ├── Company.tsx         # Información de empresa
    └── Billing.tsx         # Gestión de facturación
```

#### Integraciones (`/src/integrations`)

```
integrations/
├── mcp/                    # Integración con Model Context Protocol
│   ├── solar_fluidity_mcp_server.py   # Servidor MCP personalizado
│   ├── create_supabase_tables.py      # Script para creación de tablas
│   └── install_and_test_mcp.py        # Utilidad de instalación y prueba
├── supabase/               # Integraciones con Supabase
│   ├── auth.ts             # Autenticación
│   ├── db.ts               # Operaciones de base de datos
│   └── storage.ts          # Gestión de almacenamiento
├── Agentes IA / Python/                    # Integraciones con Agentes IA / Python
│   ├── api.ts              # Cliente de API para Agentes IA / Python
│   └── templates.ts        # Plantillas de flujos predefinidos
└── payment/                # Integraciones de pago
    ├── paypal.ts           # Integración con PayPal
    └── stripe.ts           # Integración con Stripe
```

### `/docs`

Documentación detallada del proyecto, incluyendo capturas de pantalla organizadas por sección.

```
docs/
├── screenshots/            # Capturas de pantalla organizadas por sección
│   ├── hero_section/       # Sección principal del sitio
│   ├── facturacion/        # Funcionalidad de facturación electrónica
│   ├── proyectos/          # Gestión de proyectos
│   ├── automatizaciones/   # Flujos de automatización con Agentes IA / Python
│   ├── integraciones/      # Integraciones con servicios externos
│   ├── reportes/           # Dashboards y reportes
│   └── ui_components/      # Componentes de interfaz de usuario
### Amazon Affiliates Integration

The Amazon Affiliates program is integrated to provide additional revenue streams through affiliate marketing. This integration is managed within the `/src/components/AmazonAffiliateSection.tsx` and is documented in the `/docs/Afiliados/SECCION_AFILIADOS_AMAZON.md` file.
├── Afiliados/              # Documentación del programa de afiliados
├── Artículos/              # Artículos de recursos
│   ├── facturacion_electronica.md     # Guía sobre facturación electrónica en Costa Rica
│   ├── proyectos_solares.md           # Guía sobre proyectos solares
│   └── automatizacion_Agentes IA / Python.md          # Guía sobre automatización con Agentes IA / Python
├── Automatizacion/         # Guías detalladas sobre flujos de automatización
├── Funcionalidad/          # Documentación de características principales
├── Integraciones/          # Documentación de integraciones
│   └── INTEGRACION_MCP_API.md         # Guía de integración con MCP y APIs
├── Integraciones_IA/       # Documentación de integraciones con IA
├── Optimizacion/           # Guías de optimización de rendimiento
├── Precios/                # Información sobre planes y precios
├── GUIA_USUARIO.md         # Guía completa para usuarios finales
├── ESTRUCTURA_PROYECTO.md  # Este documento
└── README.md               # Resumen general y enlaces a documentación detallada
```

## Funcionalidades Principales y su Implementación

### 1. Generación de Estructura de Factura Electrónica (XML)

La implementación de facturación electrónica se encuentra principalmente en:

- **Frontend**: `/src/pages/invoices/` y `/src/components/InvoiceForm/`
- **Backend**: `/src/integrations/supabase/db.ts` (almacenamiento) y `/src/services/facturacion/`
- **Lógica de negocio**: `/src/services/facturacion/xmlGenerator.ts` para generación de XML
- **Agentes IA**: `/ai_agents/agents/facturacion.py` para asistencia en facturación

La generación de la estructura de factura electrónica sigue estos pasos:
1. Captura de datos a través de formularios React
2. Validación en frontend y backend
3. Generación de estructura XML según estándar UBL 2.1
4. Creación de representación PDF
5. Almacenamiento en Supabase
6. (Futuro) Opción de firma digital
7. Gestión de estado (pendiente, generado, descargado)

### 2. Gestión de Proyectos Solares/Electromecánicos

La gestión de proyectos se implementa en:

- **Frontend**: `/src/pages/projects/` y `/src/components/ProjectDashboard/`
- **Backend**: `/src/integrations/supabase/db.ts` y `/src/services/proyectos/`
- **Calendario**: `/src/components/CalendarView/` para programación de actividades
- **Agentes IA**: `/ai_agents/agents/proyectos.py` para asistencia en gestión

La implementación incluye:
1. Creación y configuración de proyectos
2. Seguimiento de avance en etapas
3. Gestión de recursos (personal, equipamiento)
4. Calendario de actividades integrado
5. Notificaciones y recordatorios automáticos
6. Generación de reportes de avance

### 3. Automatización con Agentes IA / Python

La integración con Agentes IA / Python se implementa en:

- **Frontend**: `/src/pages/automations/` y `/src/components/AutomationBuilder/`
- **API Client**: `/src/integrations/Agentes IA / Python/api.ts` para comunicación con Agentes IA / Python
- **Plantillas**: `/src/integrations/Agentes IA / Python/templates.ts` con flujos predefinidos
- **Agentes IA**: `/ai_agents/agents/automatizacion.py` para asistencia en automatización

Características principales:
1. Constructor visual de flujos
2. Plantillas predefinidas para casos de uso comunes
3. Integración con servicios externos (Gmail, Google Calendar, etc.)
4. Automatización de recordatorios, notificaciones y reportes
5. Sincronización bidireccional con la base de datos principal

## Integración MCP (Model Context Protocol)

La integración con MCP permite conectar con servicios externos de manera estandarizada:

- **Servidor MCP**: `/src/integrations/mcp/solar_fluidity_mcp_server.py`
- **SDK**: `/mcp-python-sdk/` (biblioteca completa para interacción con MCP)
- **Configuración**: `/src/config/mcp.ts` para la configuración de conexiones

Los principales servidores MCP utilizados son:
1. Gmail MCP - Para comunicaciones automáticas
2. Google Calendar MCP - Para gestión de agenda
3. GitHub MCP - Para seguimiento de proyectos
4. Browser Tools MCP - Para automatización web

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL, Autenticación, Storage)
- **IA**: OpenAI API, LangGraph, Pydantic, FastAPI
- **Automatización**: Agentes IA / Python
- **MCP**: Model Context Protocol (diversas implementaciones de clientes y servidores)
- **Despliegue**: Vercel (frontend), Supabase (backend), Docker (MCP servers)

## Flujo de Datos

1. El cliente interactúa con la interfaz React
2. Las operaciones CRUD se realizan a través de la API de Supabase
3. Los documentos XML/PDF se almacenan en Supabase Storage
4. Los agentes IA procesan solicitudes complejas a través de un servidor FastAPI
5. Las automatizaciones con Agentes IA / Python se activan por eventos o programación
6. Las integraciones con servicios externos se realizan a través de MCP

Este enfoque garantiza una arquitectura desacoplada, mantenible y escalable que puede adaptarse a las necesidades cambiantes de los usuarios.
