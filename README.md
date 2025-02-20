# SolarFluidity

SolarFluidity es un Software as a Service (SaaS) diseñado para la gestión integral de proyectos solares, permitiendo a las empresas del sector administrar cotizaciones, inventarios, facturación, reportes y automatizaciones de manera eficiente y escalable.

## Características Principales

- Gestión de cotizaciones y proyectos solares
- Sistema de inventario integrado
- Facturación electrónica (integración con Hacienda CR)
- Reportes automatizados
- Panel de administración intuitivo
- Planes personalizados para empresas

## Tecnologías Utilizadas

- Frontend: React + TypeScript + Vite
- UI/UX: shadcn-ui + Tailwind CSS
- Backend: Node.js
- Base de Datos: PostgreSQL/Supabase
- Automatizaciones: n8n/gum Loop
- Pagos: PayPal, Stripe
- Despliegue: AWS/GCP/Azure

## Configuración del Proyecto

### Requisitos Previos

- Node.js & npm - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Base de datos PostgreSQL
- Cuenta de PayPal Business (para procesamiento de pagos)

### Instalación

```sh
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Navegar al directorio del proyecto
cd proyectosolar

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

```
proyectosolar/
├── src/
│   ├── components/    # Componentes React reutilizables
│   ├── pages/        # Páginas principales de la aplicación
│   ├── services/     # Servicios y APIs
│   ├── utils/        # Utilidades y helpers
│   └── styles/       # Estilos y configuración de Tailwind
├── public/           # Archivos estáticos
└── docs/            # Documentación adicional
```

## Documentación

Para información detallada sobre la arquitectura, configuración y guías de desarrollo, consulta los siguientes documentos en la carpeta `docs/`:

- Manual de Identidad Visual
- Guía de Experiencia de Usuario y Diseño de Interfaz
- Arquitectura Técnica y Modelo de Base de Datos
- Manual de Operaciones y Administración
- Política de Privacidad y Términos de Uso

## Guía de Integración del Sistema

### 1. Configuración del Entorno

#### 1.1 Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# PayPal
PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_SECRET=tu_secret
PAYPAL_WEBHOOK_URL=tu_webhook_url

# Hacienda/CRLibre
HACIENDA_API_URL=url_api_hacienda
HACIENDA_USER=usuario_hacienda
HACIENDA_PASSWORD=password_hacienda

# OpenAI (opcional)
OPENAI_API_KEY=tu_api_key

# Email
SMTP_HOST=tu_smtp_host
SMTP_PORT=tu_smtp_port
SMTP_USER=tu_smtp_user
SMTP_PASSWORD=tu_smtp_password

# n8n
N8N_WEBHOOK_URL=tu_webhook_url
N8N_API_KEY=tu_api_key
```

#### 1.2 Certificados Digitales
Crear el directorio `/certs` y almacenar:
- Certificado digital (.p12) para Hacienda
- Certificados SSL si se requieren

### 2. Configuración de Base de Datos (Supabase)

#### 2.1 Tablas Requeridas
Ejecutar las migraciones en orden:

1. `supabase/migrations/00_initial_schema.sql`
2. `supabase/migrations/01_users.sql`
3. `supabase/migrations/02_invoices.sql`
4. `supabase/migrations/03_certificates.sql`
5. `supabase/migrations/04_payments.sql`

#### 2.2 Políticas de Seguridad
Configurar Row Level Security (RLS) en Supabase:
```sql
-- Ejemplo para tabla de facturas
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);
```

### 3. Configuración de n8n

#### 3.1 Flujos de Trabajo Principales
Importar los siguientes workflows en n8n:

1. **Onboarding de Cliente** (`/n8n/workflows/onboarding.json`)
   - Trigger: Nuevo registro de usuario
   - Acciones:
     - Crear registro en Supabase
     - Enviar email de bienvenida
     - Configurar plan inicial

2. **Facturación Electrónica** (`/n8n/workflows/invoice_generation.json`)
   - Trigger: Solicitud de nueva factura
   - Acciones:
     - Generar XML con CRLibre
     - Firmar documento
     - Enviar a Hacienda
     - Actualizar estado en Supabase

3. **Procesamiento de Pagos** (`/n8n/workflows/payment_processing.json`)
   - Trigger: Webhook de PayPal
   - Acciones:
     - Verificar pago
     - Actualizar estado de factura
     - Generar comprobante
     - Notificar al cliente

### 4. Integración de APIs

#### 4.1 PayPal
1. Configurar en `/src/services/payment.ts`:
```typescript
import { PayPalClient } from '@paypal/checkout-server-sdk';

const paypalClient = new PayPalClient({
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_SECRET,
    environment: 'production' // o 'sandbox' para pruebas
});
```

#### 4.2 Hacienda/CRLibre
1. Configurar en `/src/services/hacienda.ts`:
```typescript
import { CRLibreClient } from './crlibre';

const haciendaClient = new CRLibreClient({
    apiUrl: process.env.HACIENDA_API_URL,
    certificatePath: '/certs/certificate.p12',
    password: process.env.HACIENDA_PASSWORD
});
```

### 5. Archivos Críticos del Sistema

#### 5.1 Frontend
- `/src/services/api.ts` - Cliente API principal
- `/src/contexts/AuthContext.tsx` - Contexto de autenticación
- `/src/pages/Dashboard/InvoiceGenerator.tsx` - Generador de facturas

#### 5.2 Backend
- `/api/src/middlewares/auth.ts` - Middleware de autenticación
- `/api/src/services/invoice.ts` - Servicio de facturación
- `/api/src/utils/encryption.ts` - Utilidades de encriptación

### 6. Pasos de Implementación

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
