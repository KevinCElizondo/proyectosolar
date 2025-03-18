# Solar Fluidity - Gestión de Proyectos y Facturación Electrónica Offline

## 1. Visión General

Solar Fluidity es una plataforma SaaS diseñada para empresas del sector de proyectos solares y servicios electromecánicos, ofreciendo una solución integral para la gestión de proyectos y facturación electrónica offline. A diferencia de otras soluciones, Solar Fluidity permite generar documentos fiscales válidos (XML/PDF) sin requerir conexión directa con la autoridad tributaria, otorgando mayor autonomía al usuario mientras cumple con la normativa fiscal.

### Principales Diferenciadores

- **Facturación Electrónica Offline**: Genera XML/PDF válidos según la normativa fiscal sin envío automático a la autoridad tributaria.
- **Gestión de Proyectos Especializada**: Funcionalidades adaptadas a los sectores solar y electromecánico.
- **Automatización con n8n**: Flujos de trabajo automatizados para validación de facturas, recordatorios de pago y reportes financieros.
- **Enfoque en Autonomía**: El usuario mantiene el control completo de su proceso fiscal.

## 2. Arquitectura Tecnológica

### 2.1 Stack Técnico

- **Frontend**: React + TypeScript + Vite
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Backend y Base de Datos**: Supabase (PostgreSQL)
- **Automatizaciones**: n8n
- **Almacenamiento**: AWS S3 (documentos XML/PDF)
- **Pagos**: PayPal (procesamiento de suscripciones)
- **Seguridad**: Autenticación Supabase, Row Level Security (RLS), HTTPS/SSL

### 2.2 Diagrama de Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Frontend React │<────>│ Supabase APIs   │<────>│  PostgreSQL DB  │
│                 │      │                 │      │                 │
└────────┬────────┘      └─────────────────┘      └─────────────────┘
         │                        ↑                        ↑
         │                        │                        │
         │                ┌───────┴────────┐      ┌───────┴────────┐
         │                │                │      │                │
         └───────────────>│      n8n       │<────>│     AWS S3     │
                          │                │      │                │
                          └───────┬────────┘      └────────────────┘
                                  │
                                  ↓
                          ┌───────────────┐
                          │   Servicios   │
                          │   Externos    │
                          │  (PayPal, etc)│
                          └───────────────┘
```

## 3. Funcionalidades Clave

### 3.1 Gestión de Proyectos

- Planificación de proyectos solares y electromecánicos
- Seguimiento de costos e hitos
- Calendario de actividades
- Gestión de recursos y personal

### 3.2 Facturación Electrónica Offline

- Generación de XML según estándares fiscales locales
- Creación de PDF con representación gráfica validada
- Almacenamiento seguro de documentos fiscales
- Control de estados de facturas (generada, enviada, aceptada)

### 3.3 Automatizaciones con n8n

- Validación de datos en facturas
- Recordatorios de pago para facturas pendientes
- Generación y distribución de reportes financieros
- Gestión de suscripciones y cobros recurrentes

### 3.4 Reportes Financieros

- Resumen de ingresos y pagos pendientes
- Proyección de facturación
- Análisis de rentabilidad por proyecto
- Exportación a formatos estándar (Excel, PDF)

## 4. Configuración del Proyecto

### 4.1 Requisitos Previos

- Node.js (v16+) y npm/yarn
- Cuenta en Supabase
- Cuenta en n8n (autohosting o cloud)
- Cuenta AWS (para S3) o servicio de almacenamiento alternativo
- Cuenta de PayPal Business (para procesamiento de pagos)

### 4.2 Instalación

```sh
# Clonar el repositorio
git clone https://github.com/KevinCElizondo/proyectosolar.git

# Navegar al directorio del proyecto
cd proyectosolar

# Instalar dependencias
npm install

# Configurar variables de entorno (copiar y editar el archivo de ejemplo)
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### 4.3 Variables de Entorno

Configurar el archivo `.env` con las siguientes variables:

```env
# Supabase
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# PayPal
VITE_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_SECRET=tu_secret
PAYPAL_WEBHOOK_URL=tu_webhook_url

# AWS S3
VITE_AWS_BUCKET_NAME=nombre_bucket
VITE_AWS_REGION=region
AWS_ACCESS_KEY_ID=access_key
AWS_SECRET_ACCESS_KEY=secret_key

# Email
VITE_SMTP_HOST=tu_smtp_host
VITE_SMTP_PORT=tu_smtp_port
VITE_SMTP_USER=tu_smtp_user
VITE_SMTP_PASSWORD=tu_smtp_password

# n8n
VITE_N8N_WEBHOOK_URL=tu_webhook_url
VITE_N8N_API_KEY=tu_api_key
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
│   │   └── n8n.ts         # Integración con n8n
│   ├── hooks/             # Custom hooks
│   ├── context/           # Contextos React
│   ├── utils/             # Utilidades y helpers
│   └── styles/            # Estilos y configuración de Tailwind
├── public/                # Archivos estáticos
├── docs/                  # Documentación
├── n8n/                   # Flujos de trabajo n8n
│   ├── workflows/         # JSON de workflows
│   └── templates/         # Plantillas para facturas XML/PDF
└── supabase/              # Configuración de Supabase
    ├── migrations/        # Scripts SQL para estructura de BD
    └── functions/         # Funciones Edge/Database
```

## 6. Configuración de Base de Datos (Supabase)

### 6.1 Tablas Principales

```sql
-- Usuarios y perfiles
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
  total_amount DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facturas
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  project_id UUID REFERENCES projects(id),
  invoice_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_tax_id TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'draft',
  xml_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 Políticas de Seguridad (RLS)

```sql
-- Políticas para Perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para Proyectos
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para Facturas
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);
```

## 7. Configuración de n8n

### 7.1 Escenario de Generación de Facturas (Offline)

Configurar un workflow en n8n con los siguientes nodos:

1. **Trigger**: Webhook que recibe datos de factura desde el frontend
2. **Validación**: Función JavaScript para validar campos obligatorios
3. **Generación XML**: Función HTTP Request o CustomTool para generar XML según plantilla
4. **Generación PDF**: Función para crear PDF basado en datos y plantilla
5. **Almacenamiento S3**: Subir XML y PDF a bucket de AWS S3
6. **Actualización DB**: Actualizar registro en Supabase con URLs de los documentos
7. **Respuesta**: Devolver al frontend URLs y estatus

Importar el workflow desde `n8n/workflows/invoice_generation.json`

### 7.2 Escenario de Recordatorios de Pago

Configurar un workflow con los siguientes nodos:

1. **Trigger**: Timer (diario)
2. **Consulta DB**: Obtener facturas vencidas sin pagar
3. **Loop**: Iterar sobre facturas vencidas
4. **Plantilla Email**: Generar contenido del recordatorio
5. **Envío Email**: Enviar recordatorio al cliente
6. **Actualización DB**: Marcar recordatorio como enviado

Importar el workflow desde `n8n/workflows/payment_reminders.json`

### 7.3 Escenario de Reportes Financieros

Configurar un workflow con los siguientes nodos:

1. **Trigger**: Timer (semanal/mensual) o webhook manual
2. **Consulta DB**: Obtener datos de facturas en período seleccionado
3. **Procesamiento**: Calcular totales, pendientes, pagados
4. **Generación Excel/PDF**: Crear archivo de reporte
5. **Almacenamiento S3**: Guardar reporte en S3
6. **Envío Email**: Distribuir reporte a usuarios autorizados

Importar el workflow desde `n8n/workflows/financial_reports.json`

## 8. Pantallas Principales

### 8.1 Página de Inicio (Marketing)

- Hero section con propuesta de valor
- Características destacadas
- Planes y precios
- Testimonios
- Formulario de contacto

### 8.2 Dashboard

- Resumen de proyectos activos
- Facturas pendientes
- Ingresos del mes
- Alertas y notificaciones

### 8.3 Gestión de Proyectos

- Listado de proyectos
- Detalles de proyecto (información, hitos, costos)
- Calendario de actividades
- Documentos asociados

### 8.4 Facturación Electrónica

- Creación de facturas
- Historial de facturas emitidas
- Estado de facturas (pendiente, pagada, vencida)
- Descarga de XML/PDF

### 8.5 Reportes

- Ingresos por período
- Facturas pendientes de cobro
- Rentabilidad por proyecto
- Exportación a Excel/PDF

## 9. Plan de Implementación

### Fase 1: MVP (4-6 semanas)

- Autenticación y perfiles de usuario
- Gestión básica de proyectos
- Generación de facturas offline (XML/PDF)
- Dashboard simple
- Integración básica con n8n

### Fase 2: Automatizaciones (4-6 semanas)

- Recordatorios de pago
- Reportes financieros automatizados
- Integración con PayPal para suscripciones
- Mejoras en UX/UI

### Fase 3: Especialización (8-10 semanas)

- Módulos específicos para proyectos solares
- Herramientas para proyectos electromecánicos
- Funcionalidad offline extendida
- Mejoras de seguridad y rendimiento

## 10. Análisis de Mercado y Propuesta de Valor

### 10.1 Contexto en Costa Rica

Desde 2018, la facturación electrónica es obligatoria para todos los contribuyentes en Costa Rica. Las empresas de los sectores solar y electromecánico necesitan una solución que les permita cumplir con esta obligación mientras gestionan sus proyectos específicos.

### 10.2 Propuesta de Valor Diferenciada

- **Autonomía en Facturación**: Generación de documentos fiscales válidos sin dependencia de APIs externas.
- **Especialización Sectorial**: Funcionalidades diseñadas para proyectos solares y electromecánicos.
- **Automatización Inteligente**: Flujos de trabajo que ahorran tiempo en tareas administrativas.
- **Cumplimiento Legal**: Documentos generados bajo normativa fiscal vigente.

## 11. Responsabilidades del Usuario (Modo Offline)

- Enviar manualmente la factura a la autoridad tributaria
- Firma digital del XML si lo requiere la normativa
- Registro de aceptación o rechazo en la plataforma
- Presentación de declaraciones tributarias según la ley

## 12. Soporte y Documentación

- **Guías de usuario**: Disponibles en `/docs/user_guides/`
- **Documentación técnica**: Disponible en `/docs/technical/`
- **Soporte vía email**: support@solarfluidity.com
- **Actualizaciones**: Notificadas vía newsletter y en el dashboard

## 13. Contribución y Desarrollo

### 13.1 Guía de Contribución

1. Clonar el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit de tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Crear Pull Request

### 13.2 Estándares de Código

- Seguir guías de estilo ESLint
- Documentar funciones y componentes
- Escribir tests para nuevas funcionalidades
- Usar commits semánticos

## 14. Licencia

Este proyecto está licenciado bajo términos propietarios. Todos los derechos reservados.

1. **Preparación del Entorno**
```bash
# Instalar dependencias
npm install

# Configurar base de datos
npm run setup:db

# Importar workflows de n8n
npm run setup:n8n
```

2. **Configuración de Certificados**
```bash
# Crear directorio de certificados
mkdir certs
# Copiar certificado de Hacienda
cp /ruta/certificado.p12 certs/
```

3. **Iniciar Servicios**
```bash
# Iniciar todos los servicios con Docker
docker-compose up -d

# O iniciar servicios individualmente
npm run start:api
npm run start:n8n
npm run start:web
```

### 7. Verificación del Sistema

Lista de verificación para asegurar la correcta integración:

- [ ] Conexión exitosa con Supabase
- [ ] Workflows de n8n funcionando
- [ ] Integración con PayPal activa
- [ ] Comunicación con Hacienda establecida
- [ ] Envío de emails configurado
- [ ] Certificados instalados correctamente
- [ ] Backups automatizados configurados

### 8. Mantenimiento y Monitoreo

#### 8.1 Logs y Monitoreo
- Configurar logging en `/api/src/utils/logger.ts`
- Monitorear endpoints críticos en `/api/src/monitoring/health.ts`

#### 8.2 Backups
- Configurar respaldos automáticos de:
  - Base de datos
  - Certificados
  - Configuraciones de n8n

### 9. Documentación Adicional

Para información más detallada, consultar:

- `/docs/ARQUITECTURA_TECNICA.md` - Detalles técnicos y diagramas
- `/docs/GUIA_UX_UI.md` - Guías de diseño y experiencia de usuario
- `/docs/API.md` - Documentación completa de la API
- `/docs/SEGURIDAD.md` - Políticas y procedimientos de seguridad

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia [Especificar tipo de licencia]. Ver el archivo `LICENSE` para más detalles.

## Contacto

Kevin Cordero Elizondo - [Información de contacto]

Project Link: [https://github.com/KevinCElizondo/proyectosolar](https://github.com/KevinCElizondo/proyectosolar)
