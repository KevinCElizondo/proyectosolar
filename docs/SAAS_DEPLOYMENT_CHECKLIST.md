# SaaS Deployment Checklist: Solar Fluidity

Este documento detalla exhaustivamente todos los requisitos técnicos, credenciales, configuraciones y desarrollos pendientes para llevar **Solar Fluidity** desde su estado actual (fundación UI/3D) a un SaaS completamente funcional en producción.

---

## 1. Configuración de Base de Datos y Autenticación (Supabase)
Actualmente, el proyecto no tiene implementadas las rutas de autenticación ni la conexión activa a base de datos.

### Qué falta por hacer:
- [ ] **Crear Proyecto en Supabase**: Acceder a [supabase.com](https://supabase.com) y crear un nuevo proyecto.
- [ ] **Aplicar Esquema**: Ejecutar el archivo `schema.sql` en el SQL Editor de Supabase (o usar el **Supabase MCP** para automatizarlo: `apply_migration` o `execute_sql`).
- [ ] **Configurar Autenticación**: Habilitar "Email providers" en Supabase Auth (específicamente Magic Link o contraseñas).
- [ ] **Desarrollo Frontend**:
  - Crear página de Login/Registro (`/src/app/login/page.tsx`).
  - Crear el contexto de usuario (`UserContext` o Zustand) para proteger rutas de la aplicación.
  - Sincronizar perfiles de usuario logueados con la tabla `profiles`.

### Claves y APIs Necesarias:
Añadir estas variables a `.env.local` y Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto de Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública para el cliente (browser).
- `SUPABASE_SERVICE_ROLE_KEY`: Clave privada para el backend (ej: Webhooks), **nunca** exponer en el frontend.

---

## 2. Pasarela de Pagos (PayPal)
La integración con PayPal para cobrar planes de suscripción no está implementada.

### Qué falta por hacer:
- [ ] **Configurar PayPal Developer**: Crear una App en el portal de desarrolladores de PayPal (Sandbox y luego Live).
- [ ] **Crear Planes de Suscripción**: Configurar el plan "Pro" o mensualidades dentro de PayPal.
- [ ] **Desarrollo Frontend**:
  - Construir la página de precios/upgrade (`/src/app/upgrade/page.tsx`).
  - Integrar el script/botón de PayPal (`<PayPalScriptProvider>`).
- [ ] **Desarrollo Backend (Webhook)**:
  - Crear la ruta `/src/app/api/paypal-webhook/route.ts` para recibir confirmaciones de pago, cancelaciones y actualizaciones.
  - Actualizar el estado del usuario a "Pro" en la tabla `profiles` usando la `SUPABASE_SERVICE_ROLE_KEY`.

### Claves y APIs Necesarias:
- `VITE_PAYPAL_SANDBOX_CLIENT_ID` / `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `VITE_PAYPAL_SANDBOX_SECRET` / `PAYPAL_SECRET` (Solo backend)
- *Alternativa (Stripe)*: Si decides cambiar a Stripe, puedes usar el **Stripe MCP** para generar la implementación, usando las claves `STRIPE_PUBLISHABLE_KEY` y `STRIPE_SECRET_KEY`.

---

## 3. Correos Transaccionales (Resend)
Para enviar correos de bienvenida, facturas o notificaciones automáticas a los usuarios.

### Qué falta por hacer:
- [ ] **Crear Cuenta en Resend**: Obtener la API key en [resend.com](https://resend.com).
- [ ] **Verificar Dominio**: Configurar los registros DNS para asegurar alta tasa de entrega de correos.
- [ ] **Desarrollo Backend**:
  - Enlazar la acción de envío de correo en el Webhook de PayPal.
  - Crear plantillas de correo (ej: usando `react-email`).

### Claves y APIs Necesarias:
- `RESEND_API_KEY`: Clave privada para enviar correos desde tu backend.

---

## 4. Arquitectura de Incrustación (Embed / Widget)
El núcleo de tu SaaS es permitir a otras tiendas incrustar el visor 3D en sus webs.

### Qué falta por hacer:
- [ ] **Desarrollo de Ruta Embed**: Crear `/src/app/embed/[storeId]/page.tsx`. Esta página no debe tener headers, footers ni navegación, solo el Canvas 3D.
- [ ] **Script Público**: Crear un script ligero en `public/embed.js` que el cliente de la tienda pueda copiar y pegar en su HTML (ej: `<script src="https://tudominio.com/embed.js" data-store-id="123"></script>`).
- [ ] **Seguridad**: Configurar políticas CORS si es necesario para restringir el uso del widget solo a dominios autorizados (según la tabla `models`).

---

## 5. Herramientas MCP y Agentes (Opcional pero Recomendado)
Si vas a continuar desarrollando con agentes de IA (como Windsurf/Cursor/Claude):
- **Supabase MCP**: Necesitarás instalar y configurar el MCP de Supabase para permitirle al agente consultar las tablas, ejecutar migraciones o leer logs de la base de datos de manera autónoma.
- **Stripe MCP**: Si te pasas a Stripe, el MCP ayudará a navegar la documentación y generar código de Checkout.

---

## 6. Despliegue en Producción (Vercel)
### Qué falta por hacer:
- [ ] **Conectar Repositorio**: Vincular el repo de GitHub a Vercel.
- [ ] **Variables de Entorno**: Trasladar TODAS las claves (Supabase, PayPal/Stripe, Resend) a la pestaña Settings > Environment Variables de Vercel.
- [ ] **Dominio Personalizado**: Configurar el dominio real (ej: `solarfluidity.com`).
- [ ] **Pruebas E2E**: Verificar que el Magic Link, el pago y la carga 3D funcionen en el entorno de producción antes de lanzar a los early adopters.

---

## Resumen del Estado Actual
- **Framework**: ✅ Next.js 16 + React 19 configurado.
- **Visualizador 3D**: ✅ Base interactiva con React Three Fiber + Tailwind lista.
- **Backend / DB**: ❌ Pendiente crear proyecto y añadir `.env`.
- **Auth**: ❌ Pendiente UI y lógica.
- **Pagos**: ❌ Pendiente botones y Webhook.
- **Emails**: ❌ Pendiente Resend API.
