# Integración de Google y Convex en Solar Fluidity

Este documento describe cómo configurar y utilizar las integraciones de Google (Gmail, Drive, Calendar) y Convex en Solar Fluidity.

## Configuración de Google OAuth

Solar Fluidity utiliza la autenticación OAuth 2.0 de Google para acceder a los servicios de Google (Gmail, Drive y Calendar) en nombre de los usuarios. Esto permite a los usuarios conectar sus cuentas de Google para automatizar tareas como:

- Enviar correos electrónicos de facturas desde Gmail
- Almacenar facturas y documentos en Google Drive
- Programar visitas y reuniones en Google Calendar

### Credenciales de Google OAuth

Las credenciales de OAuth 2.0 están configuradas con los siguientes parámetros:

- **Client ID**: `882669729813-p4mjqfiv1jg9456hd1prgltep03q2pr3.apps.googleusercontent.com`
- **Scopes utilizados**:
  - `https://www.googleapis.com/auth/gmail.send` (Enviar correos)
  - `https://www.googleapis.com/auth/calendar` (Gestionar calendario)
  - `https://www.googleapis.com/auth/drive` (Acceder a Drive)
  - `https://www.googleapis.com/auth/userinfo.email` (Email del usuario)
  - `https://www.googleapis.com/auth/userinfo.profile` (Perfil del usuario)

### Origen JavaScript autorizado

Para que la autenticación funcione correctamente, se han autorizado los siguientes orígenes JavaScript en la consola de Google Cloud:

- `https://agile-bee-457.convex.cloud`
- `https://agile-bee-457.convex.site`
- `http://localhost:3000` (para desarrollo local)

### URIs de redirección autorizados

Las siguientes URIs de redirección están configuradas:

- `https://agile-bee-457.convex.cloud/auth/callback`
- `https://agile-bee-457.convex.site/auth/callback`
- `http://localhost:3000/auth/callback` (para desarrollo local)

## Configuración de Convex

Convex es utilizado como backend serverless para mejorar las capacidades de automatización de Solar Fluidity. La integración con Convex permite:

- Sincronizar datos en tiempo real entre clientes
- Ejecutar funciones serverless para la generación de facturas
- Integrarse con servicios externos como Google

### Credenciales de Convex

Las credenciales de Convex están configuradas con los siguientes parámetros:

- **Deployment URL**: `https://agile-bee-457.convex.cloud`
- **HTTP Action URL**: `https://agile-bee-457.convex.site`
- **Deploy Key**: `prod:agile-bee-457|eyJ2MiI6ImM2NWM1NTI1OTUzNTQyYTU4OTZjYWUxOTk3OTJmOGJlIn0=`

## Cómo usar las integraciones

### 1. Botón de autenticación de Google

El componente `GoogleAuthButton` ha sido creado para permitir a los usuarios conectar sus cuentas de Google. Para utilizarlo:

```tsx
import GoogleAuthButton from '../components/GoogleAuthButton';

// En tu componente
const handleAuthSuccess = (credentials) => {
  console.log('Usuario autenticado exitosamente', credentials);
  // Guardar o procesar las credenciales
};

const handleAuthFailure = (error) => {
  console.error('Error en la autenticación', error);
  // Mostrar mensaje de error
};

// En el render
<GoogleAuthButton 
  onAuthSuccess={handleAuthSuccess}
  onAuthFailure={handleAuthFailure}
  buttonText="Conectar Google para automatizar tareas"
/>
```

### 2. Servicios de Google

Después de autenticar al usuario, puedes utilizar los tokens para acceder a los servicios de Google:

#### Ejemplo de uso de Gmail

```typescript
import { getTokenFromStorage } from '../utils/auth';

// Función para enviar un correo con una factura
export const sendInvoiceEmail = async (to: string, subject: string, invoiceData: any) => {
  const token = getTokenFromStorage();
  if (!token) {
    throw new Error('Usuario no autenticado con Google');
  }

  // Crear el contenido del correo
  const emailContent = `
    <h1>Factura Electrónica</h1>
    <p>Estimado cliente,</p>
    <p>Adjuntamos su factura electrónica.</p>
    <p>Monto total: ₡${invoiceData.monto_total}</p>
  `;

  // Enviar el correo usando la API de Gmail
  const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: btoa(
        `To: ${to}\r\n` +
        `Subject: ${subject}\r\n` +
        'Content-Type: text/html; charset=utf-8\r\n\r\n' +
        emailContent
      ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    })
  });

  return response.json();
};
```

#### Ejemplo de uso de Google Calendar

```typescript
import { getTokenFromStorage } from '../utils/auth';

// Función para programar una visita
export const scheduleVisit = async (clientName: string, address: string, date: Date, duration: number) => {
  const token = getTokenFromStorage();
  if (!token) {
    throw new Error('Usuario no autenticado con Google');
  }

  const endTime = new Date(date);
  endTime.setMinutes(endTime.getMinutes() + duration);

  const event = {
    summary: `Visita técnica: ${clientName}`,
    location: address,
    description: 'Visita técnica para proyecto solar/electromecánico',
    start: {
      dateTime: date.toISOString(),
      timeZone: 'America/Costa_Rica'
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'America/Costa_Rica'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 }
      ]
    }
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });

  return response.json();
};
```

### 3. Servicios de Convex

El servicio de Convex puede ser utilizado para:

```typescript
import { 
  executeConvexFunction, 
  executeConvexMutation, 
  subscribeToConvexQuery 
} from '../services/convex/convexService';

// Ejemplo de consulta a Convex
const getProjects = async () => {
  try {
    const projects = await executeConvexFunction('projects/getAll');
    return projects;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
};

// Ejemplo de mutación en Convex
const createInvoice = async (invoiceData) => {
  try {
    const result = await executeConvexMutation('invoices/create', invoiceData);
    return result;
  } catch (error) {
    console.error('Error al crear factura:', error);
    throw error;
  }
};

// Ejemplo de suscripción en tiempo real
const subscribeToInvoices = (callback) => {
  return subscribeToConvexQuery('invoices/getAll', {}, (invoices) => {
    callback(invoices);
  });
};
```

## Integración con Supabase

Solar Fluidity también está integrado con Supabase para almacenar datos. La configuración es:

- **URL de Supabase**: `https://rlqvkqaownzqelvxnhzd.supabase.co`
- **Clave API anónima**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0`

## Flujos de trabajo automatizados

Combinando todas estas integraciones, Solar Fluidity puede ofrecer flujos de trabajo automatizados como:

1. **Ciclo de facturación automático**:
   - Crear factura en Supabase
   - Generar XML de factura con el servidor MCP
   - Almacenar factura en Google Drive
   - Enviar factura por correo usando Gmail

2. **Gestión de proyectos solares**:
   - Crear proyecto en Supabase
   - Programar visitas técnicas en Google Calendar
   - Notificar al cliente por correo electrónico
   - Sincronizar datos en tiempo real con Convex

## Seguridad y mejores prácticas

- **Tokens de autenticación**: Los tokens de OAuth se almacenan en localStorage y se refrescan automáticamente.
- **Permisos de alcance limitado**: Solo se solicitan los permisos necesarios en el OAuth.
- **Validación de datos**: Todos los datos se validan antes de enviarlos a las APIs.
- **Manejo de errores**: Implementación de captura y registro de errores en todas las llamadas a API.

## Próximos pasos

1. Implementar la actualización automática de tokens
2. Completar la integración con Hacienda (pendiente de firma digital)
3. Expandir las capacidades de automatización con n8n
