# Arquitectura Detallada de Solar Fluidity

## Visión General de la Arquitectura

Solar Fluidity está construido como una plataforma SaaS especializada en tres pilares fundamentales: **facturación electrónica offline**, **gestión de proyectos solares/electromecánicos** y **automatizaciones con n8n**. Utilizando una arquitectura moderna de microservicios con un frontend desacoplado, el sistema está diseñado para operar en entornos con conectividad limitada o intermitente, garantizando la continuidad de operaciones críticas incluso sin acceso a internet.

A continuación se presenta un diagrama de la arquitectura general del sistema:

```
┌─────────────────────┐    ┌────────────────────┐    ┌───────────────────┐
│                     │    │                    │    │                   │
│  Frontend           │<-->│  Supabase APIs     │<-->│  PostgreSQL DB    │
│  (React + Vite)     │    │  (Autenticación y  │    │  (Datos de        │
│                     │    │   APIs RESTful)    │    │   aplicación)     │
└─────────┬───────────┘    └──────────┬─────────┘    └───────────────────┘
          │                           │                        ↑
          │                           │                        │
          │                           ↓                        │
          │               ┌─────────────────────┐             │
          │               │                     │             │
          │               │     Funciones       │             │
          │               │     PostgreSQL      │-------------┘
          │               │                     │
          │               └─────────┬───────────┘
          │                         │
          │                         ↓
          │               ┌─────────────────────┐    ┌───────────────────┐
          └-------------->│                     │    │                   │
                          │        n8n          │<-->│     AWS S3        │
                          │  (Automatizaciones) │    │  (Almacenamiento  │
                          │                     │    │   de documentos)  │
                          └─────────┬───────────┘    └───────────────────┘
                                    │
                                    ↓
                          ┌───────────────────────────────┐
                          │     Servicios Externos        │
                          │ (PayPal, Email, Hacienda CR)  │
                          │                               │
                          └───────────────────────────────┘
```

## Componentes Principales

### 1. Frontend con Capacidades Offline

El frontend de Solar Fluidity está implementado como una Progressive Web Application (PWA) con robustas capacidades offline, permitiendo la generación de facturas electrónicas y gestión de proyectos solares incluso sin conectividad a internet.

#### Tecnologías Utilizadas:

- **Framework Principal**: React 18+ con TypeScript
- **Build Tool**: Vite para un desarrollo más rápido y eficiente
- **UI Framework**: Combinación de shadcn-ui (componentes) y Tailwind CSS (estilos)
- **Gestión de Estado**: React Context y Custom Hooks
- **Routing**: React Router v6+
- **Formularios**: React Hook Form con validación mediante Zod
- **Gráficos y Visualizaciones**: Chart.js/Recharts

#### Estructura del Frontend:

```
src/
├── components/         # Componentes reutilizables
│   ├── ui/             # Componentes de UI básicos (shadcn)
│   ├── layouts/        # Layouts y contenedores
│   ├── forms/          # Componentes de formulario
│   └── dashboard/      # Componentes específicos del dashboard
├── pages/              # Páginas de la aplicación
│   ├── auth/           # Páginas de autenticación
│   ├── dashboard/      # Panel principal
│   ├── projects/       # Gestión de proyectos
│   ├── invoices/       # Facturación electrónica
│   ├── reports/        # Reportes financieros
│   └── settings/       # Configuración de cuenta
├── hooks/              # Custom hooks
├── contexts/           # Contextos React
├── lib/                # Utilidades y librerías
│   ├── supabase.ts     # Cliente Supabase
│   ├── validation.ts   # Esquemas de validación
│   └── api.ts          # Funciones de API
├── services/           # Servicios para lógica de negocio
│   ├── invoice.ts      # Servicios de facturación
│   ├── project.ts      # Servicios de proyectos
│   └── n8n.ts          # Integración con n8n
└── styles/             # Estilos globales
```

#### Optimizaciones:

- **Code Splitting**: Carga perezosa de componentes y rutas
- **Memoización**: Uso de React.memo, useMemo y useCallback
- **Caché**: SWR para manejo eficiente de datos remotos
- **Prefetching**: Precarga de datos en navegación

### 2. Backend y Sistema de Base de Datos Sincronizable

Solar Fluidity utiliza Supabase como capa de backend principal, complementada con un sistema de almacenamiento local para operación offline, permitiendo la generación de documentos fiscales sin conexión a internet y la gestión local de proyectos solares/electromecánicos.

#### Arquitectura de Base de Datos Híbrida:

- **PostgreSQL (Supabase)**: Almacenamiento principal en la nube para todos los datos de aplicación
- **IndexedDB (Navegador)**: Almacenamiento local para operaciones offline
- **Sistema de Sincronización**: Motor que reconcilia cambios offline cuando se recupera la conectividad
- **Control de Conflictos**: Algoritmo de resolución de conflictos basado en timestamps y reglas de negocio

#### Características Principales:

- **Autenticación Offline**: Sistema que permite sesión persistente sin conectividad mediante tokens JWT almacenados localmente
- **Row Level Security (RLS)**: Políticas de seguridad a nivel de fila que se aplican tanto en nube como en sincronización offline
- **Cola de Sincronización**: Sistema para ordenar y priorizar operaciones pendientes cuando se restablece la conectividad
- **Edge Functions**: Funciones serverless para validaciones fiscales y cálculos especializados del sector solar
- **Storage con Cache Local**: Almacenamiento de documentos con capacidad de trabajar sin conexión

#### Modelo de Base de Datos:

El esquema de base de datos incluye las siguientes tablas principales:

```sql
-- Perfiles de usuario
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  company_name TEXT,
  tax_id TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proyectos
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending',
  budget DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tareas de proyecto
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES profiles(id),
  due_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facturas
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  project_id UUID REFERENCES projects(id),
  client_name TEXT NOT NULL,
  client_tax_id TEXT,
  client_email TEXT,
  client_address TEXT,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'draft',
  xml_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ítems de factura
CREATE TABLE invoice_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(4,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suscripciones
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  payment_provider TEXT NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Políticas de Seguridad RLS:

Ejemplos de políticas de Row Level Security:

```sql
-- Política para proyectos: los usuarios solo pueden ver sus propios proyectos
CREATE POLICY "Usuarios pueden ver sus propios proyectos" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Política para facturas: los usuarios solo pueden modificar sus propias facturas
CREATE POLICY "Usuarios pueden editar sus propias facturas" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);
```

### 3. Motor de Automatización (n8n)

n8n es el componente central de automatización en Solar Fluidity, implementado con capacidades de ejecución local y programación de tareas diferidas para entornos con conectividad intermitente. Este motor gestiona los procesos críticos relacionados con facturación electrónica offline y flujos de trabajo especializados para proyectos solares/electromecánicos.

#### Características Principales:

- **Interfaz Visual Adaptada**: Creación de flujos de trabajo sin código con plantillas específicas para el sector solar y fiscal
- **Integraciones Especializadas**: Conexión con servicios fiscales de Costa Rica y proveedores de equipos solares
- **Ejecución Offline**: Capacidad para ejecutar flujos críticos sin conexión y sincronizar posteriormente
- **Personalización Avanzada**: JavaScript para cálculos de dimensionamiento solar y validaciones fiscales
- **Sistema de Cola**: Gestión de operaciones pendientes con prioridad y políticas de reintentos

#### Flujos de Trabajo Especializados:

1. **Facturación Electrónica Offline**:
   - Detecta automáticamente modo offline y ajusta el proceso
   - Genera documentos XML con indicadores de contingencia cuando corresponde
   - Utiliza certificados digitales almacenados localmente para firma
   - Implementa marca de agua y códigos de verificación especiales
   - Crea cola de documentos pendientes para sincronización posterior
   - Gestiona la transmisión al Ministerio de Hacienda cuando se restablece conectividad

2. **Gestión de Proyectos Solares**:
   - Automatiza cálculos de dimensionamiento basados en consumo y ubicación
   - Genera presupuestos detallados incluyendo equipos, mano de obra e instalación
   - Programa mantenimientos preventivos y correctivos
   - Monitorea rendimiento de instalaciones con alertas de bajo desempeño
   - Integra datos meteorológicos para predicciones de producción energética

3. **Integración con Proveedores Solares**:
   - Consulta automática de stock y precios de equipos solares
   - Generación de órdenes de compra basadas en requerimientos de proyecto
   - Seguimiento de envíos y notificaciones de entrega
   - Actualización de catálogo de productos y especificaciones técnicas

4. **Sincronización Inteligente**:
   - Detecta recuperación de conectividad automáticamente
   - Prioriza documentos fiscales críticos para envío inmediato
   - Gestiona respuestas y rechazos de Hacienda
   - Actualiza estados y genera notificaciones de sincronización

### 4. Almacenamiento (AWS S3)

AWS S3 se utiliza para almacenar documentos generados como facturas XML/PDF, archivos de proyecto y otros documentos importantes.

#### Estructura de Buckets:

```
solar-fluidity-docs/
├── invoices/
│   ├── <user_id>/
│   │   ├── <invoice_id>_invoice.xml
│   │   └── <invoice_id>_invoice.pdf
├── projects/
│   ├── <project_id>/
│   │   ├── documents/
│   │   └── attachments/
└── reports/
    └── <user_id>/
```

#### Seguridad de Almacenamiento:

- **Políticas de Acceso**: Permisos específicos para cada tipo de documento
- **Encriptación**: Encriptación en tránsito y en reposo
- **Ciclo de Vida**: Reglas para archivar documentos antiguos
- **URLs Prefirmadas**: Acceso temporal a documentos mediante URLs seguras

### 5. Integración con Servicios Externos

#### Ministerio de Hacienda Costa Rica (Facturación Electrónica)

- **API de Validación Fiscal**: Integración con sistemas ATV (Administración Tributaria Virtual)
- **Capacidades Offline**:
  - Validación local de documentos fiscales según normativa vigente
  - Generación de documentos en modo contingencia durante desconexiones
  - Sistema de sincronización y validación posterior
- **Gestión de Certificados Digitales**:
  - Almacenamiento seguro local de certificados para firma offline
  - Rotación automática antes de vencimiento
  - Alertas de renovación y verificación de estado
- **Validación Avanzada**: 
  - Comprobación estructural y semántica de documentos XML
  - Validación local con esquemas XSD actualizados
  - Verificación de requisitos fiscales según tipo de documento

#### Proveedores de Equipos Solares

- **Integración con Catálogos**:
  - Actualización automática de precios y disponibilidad
  - Acceso a especificaciones técnicas detalladas
  - Comparador de rendimiento y compatibilidad
- **Sistema de Pedidos**:
  - Generación automática de órdenes de compra basadas en diseños
  - Seguimiento de estado y tiempos de entrega
  - Alertas de cambios en precios o disponibilidad
- **Bases de Datos Técnicas**:
  - Acceso a hojas de especificaciones y manuales de instalación
  - Cálculos de compatibilidad entre componentes
  - Simuladores de rendimiento energético

#### Servicios Meteorológicos

- **Datos Climatológicos**:
  - Integración con servicios locales e internacionales
  - Estadísticas históricas de radiación solar por ubicación
  - Pronósticos para planificación de instalaciones y mantenimiento
- **Análisis Predictivo**:
  - Estimación de producción energética basada en condiciones meteorológicas
  - Alertas de condiciones adversas para instalaciones
  - Optimización de mantenimientos preventivos

#### Pasarelas de Pago

- **Integración con Múltiples Proveedores**:
  - PayPal (API REST v2)
  - Stripe
  - Procesadores locales costarricenses (BNCR, BCR)
- **Flujos Específicos para Proyectos Solares**:
  - Pagos parciales por avance de obra
  - Financiamiento especializado para energía solar
  - Retenciones de garantía
- **Conciliación Automática**:
  - Vinculación entre pagos y documentos fiscales
  - Seguimiento de cuentas por cobrar
  - Reportes financieros especializados

## Seguridad Especializada

### Autenticación y Autorización con Soporte Offline

- **JWT con Persistencia Local**: Tokens JWT almacenados localmente para operación sin conexión
- **Refresh Tokens Offline**: Sistema que permite renovar credenciales incluso sin conectividad
- **2FA Adaptativo**: Autenticación de dos factores con opciones offline (códigos de reserva preautorizados)
- **Roles y Permisos Especializados**: 
  - Perfiles para contadores con acceso fiscal
  - Perfiles para técnicos solares con permisos de campo
  - Administradores de proyectos con vista global
  - Clientes con acceso restringido a sus instalaciones

### Protección de Datos Fiscales y Técnicos

- **Encriptación de Documentos Fiscales**: Sistema de cifrado para documentos XML y certificados digitales
- **Protección de Certificados Digitales**: 
  - Almacenamiento seguro incluso en modo offline
  - Acceso protegido por PIN o patrón
  - Imposibilidad de extracción en texto plano
- **HTTPS con Certificados Pinning**: SSL/TLS reforzado para comunicaciones con Hacienda y servicios críticos
- **Sanitización Fiscal**: Validación rigurosa de datos fiscales conforme a normativa costarricense
- **Protección de Propiedad Intelectual**: Seguridad para diseños y especificaciones de proyectos solares
- **CORS y CSP Reforzados**: Políticas estrictas para prevenir ataques de inyección en aplicaciones fiscales

### Auditoría y Logging

- **Logs de Actividad**: Registro de acciones importantes
- **Auditoría de DB**: Seguimiento de cambios en datos críticos
- **Alertas**: Notificaciones sobre actividades sospechosas

## Escalabilidad y Rendimiento

### Estrategias de Escalabilidad

- **Horizontal**: Múltiples instancias detrás de balanceador de carga
- **Vertical**: Incremento de recursos en instancias según demanda
- **Caché**: Implementación de Redis para datos frecuentes
- **CDN**: Distribución de contenido estático mediante CDN

### Optimización de Base de Datos

- **Índices**: Optimización mediante índices adecuados
- **Consultas**: Optimización de queries complejas
- **Particionamiento**: División de tablas grandes según criterios específicos

## Monitoreo y Operaciones

### Herramientas de Monitoreo

- **Métricas de Aplicación**: Tiempo de respuesta, uso de memoria, CPU
- **Alertas Automáticas**: Notificaciones para eventos críticos
- **Dashboards**: Visualización de estado del sistema

### Mantenimiento y Backups

- **Backups Diarios**: Copias completas de la base de datos
- **Backups Incrementales**: Actualizaciones constantes
- **Plan de Recuperación**: Estrategia documentada para desastres

## Consideraciones de Cumplimiento Normativo

### Facturación Electrónica Offline en Costa Rica

- **Normativa de Contingencia**: Conformidad con la resolución DGT-R-033-2019 y subsecuentes del Ministerio de Hacienda
- **Proceso de Contingencia Automatizado**:
  - Detección automática de fallas de conectividad
  - Generación de documentos con indicadores de contingencia
  - Numeración y secuencia de contingencia según normativa
  - Proceso de transición de contingencia a normal
- **Validaciones Locales Rigurosas**: 
  - Comprobaciones automáticas de estructura XML según esquemas XSD actuales
  - Validación de requisitos fiscales por tipo de documento
  - Control de secuencias numéricas en modo offline
- **Actualizaciones Normativas**: 
  - Proceso automático de descarga y almacenamiento local de cambios regulatorios
  - Adaptación inmediata a nuevos esquemas XSD
  - Notificaciones de cambios fiscales relevantes

### Normativa Solar y Energética

- **Cumplimiento con Código Eléctrico**: Validación automática de diseños según NEC y regulaciones costarricenses
- **Permisos Ambientales**: Integración de requisitos SETENA para proyectos solares
- **Certificaciones de Equipos**: Verificación de homologaciones y certificaciones requeridas
- **Interconexiones a Red**: Cumplimiento con normativa de interconexiones del ICE y distribuidoras

### Protección de Datos

- **GDPR**: Aunque Costa Rica no está bajo GDPR, se implementan mejores prácticas
- **Leyes Locales**: Cumplimiento con normativa costarricense de protección de datos
- **Retención**: Políticas de retención y eliminación de datos
