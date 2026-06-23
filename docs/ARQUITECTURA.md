# Documentación Técnica — SolarFluidity v5.2.0

## Arquitectura General

```
Usuario Final
    │
    ▼
Landing Page (Next.js SSR)
    │
    ├── /login          → Supabase Auth (Magic Link / OAuth)
    ├── /upgrade        → Página de planes + PayPal Subscriptions
    ├── /dashboard/*    → Panel autenticado (requiere sesión)
    ├── /embed/grill    → Visor 3D embebible (público, iframe)
    ├── /store          → Catálogo de modelos
    └── /api/*
        ├── /order              → Creación de pedidos
        └── /webhooks/paypal    → Webhook PayPal → activa plan Pro en Supabase
```

---

## Flujo de Autenticación

```
1. Usuario visita /login
2. Ingresa email → Supabase envía Magic Link
3. Supabase redirige a /auth/callback?code=xxx
4. El callback intercambia el code por sesión → cookie httpOnly
5. Usuario llega al /dashboard con sesión activa
6. Middleware (src/middleware.ts) protege rutas con requiresAuth
```

---

## Flujo de Suscripción PayPal

```
1. Usuario va a /upgrade
2. Selecciona plan (Standard $99/mes o EarlyBird $29.70 con cupón EARLY70)
3. PayPal abre checkout → usuario confirma
4. PayPal llama a POST /api/webhooks/paypal con evento "BILLING.SUBSCRIPTION.ACTIVATED"
5. El webhook verifica la firma y actualiza profiles.plan = 'pro' en Supabase
6. Usuario accede a todas las funciones Pro en el Dashboard
```

---

## Sistema de Roles y Límites

### Tabla: `profiles`

```sql
id                    UUID (FK → auth.users)
email                 TEXT UNIQUE
plan                  TEXT  -- 'normal' | 'pro'
role                  TEXT  -- 'user' | 'superuser'
paypal_subscription_id TEXT
subscription_status   TEXT  -- 'active' | 'trialing' | 'cancelled' | 'inactive'
created_at            TIMESTAMPTZ
```

### Reglas de Negocio (Trigger PostgreSQL)

| Condición | Límite |
|-----------|--------|
| `role = 'superuser'` | Sin límite |
| `plan = 'pro'` | Sin límite |
| `plan = 'normal'` (Free) | 3 modelos máximo |

El trigger `trg_enforce_plan_limit` se ejecuta `BEFORE INSERT` en la tabla `models`.
Si el usuario free intenta guardar un 4º modelo, PostgreSQL lanza una excepción descriptiva.

---

## Slots Privados del Propietario (Uso Interno)

> ⚠️ Esta funcionalidad es **completamente privada** y no se expone en el SaaS público.

Kevin Cordero (`kevincordero@solarfluidity.com`) dispone de **20 slots de proyecto** en la tabla `superuser_slots`. Cada slot puede representar:

- Un nuevo dominio/SaaS independiente desarrollado para un cliente
- Un proyecto cedido a otro desarrollador o empresa
- Un proyecto propio de investigación y desarrollo

### Gestión de Slots (vía SQL Editor de Supabase)

```sql
-- Ver todos los slots
SELECT * FROM superuser_slots_status;

-- Asignar un slot
UPDATE superuser_slots
  SET project_name = 'NombreProyecto',
      domain = 'proyecto.com',
      assigned_to_email = 'cliente@empresa.com',
      assigned_at = NOW()
WHERE slot_number = 1;

-- Liberar un slot
UPDATE superuser_slots
  SET project_name = NULL,
      domain = NULL,
      assigned_to_email = NULL,
      assigned_at = NULL
WHERE slot_number = 1;
```

### Protección RLS

La tabla `superuser_slots` tiene RLS habilitado. Solo se puede leer/escribir si `auth.uid()` corresponde a un usuario con `role = 'superuser'`. **Ningún endpoint público expone esta tabla.**

---

## Configurador 3D (GrillConfigurator)

Ubicado en `src/components/GrillConfigurator.tsx`. Usa:
- `@react-three/fiber` — React renderer para Three.js
- `@react-three/drei` — Helpers (OrbitControls, etc.)
- `three` — Motor 3D

**Modelo paramétrico:** Escala dinámicamente el cuerpo central mientras los rieles y accesorios mantienen sus dimensiones originales (sin deformarse).

**Embed público:** El visor se puede incrustar en cualquier sitio con:
```html
<iframe src="https://solarfluidity.com/embed/grill?w=0.9&h=1.2" />
```

---

## Automatizaciones n8n

Instancia: `https://n8n-production-9ac9.up.railway.app`

Webhooks activos (a configurar en n8n):
- `POST /webhook/welcome-email` → Email de bienvenida al nuevo usuario
- `POST /webhook/subscription-activated` → Notificación al admin cuando alguien se suscribe
- `POST /webhook/subscription-cancelled` → Alerta de churn

**MCP Server** de n8n configurado para integración con el IDE de desarrollo (config en `n8n-mcp-config.json`, excluido del repo por seguridad).

---

## Paleta de Colores y Sistema de Diseño

```css
--background:    #07090F   /* Negro espacial profundo */
--solar-primary: #FF5A1F   /* Brand Orange — CTA principal */
--solar-accent:  #38BDF8   /* Sky Blue — tecnología */
--solar-gold:    #F59E0B   /* Amber — valor premium */
--panel-bg:      rgba(12, 18, 35, 0.75)  /* Glassmorphism */
```

**Tipografía:** Inter (Google Fonts) — pesos 400, 500, 600, 800  
**Animaciones:** `framer-motion` con `transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }`

---

## Scripts de Base de Datos (Orden de Ejecución)

```
1. schema.sql
   → Crea tablas: profiles, models, paypal_events, referrals
   → Activa RLS en profiles y models
   → Crea políticas básicas de acceso

2. scripts/01_setup_limits_and_roles.sql
   → Agrega columna 'role' a profiles
   → Crea función enforce_plan_limit()
   → Crea trigger trg_enforce_plan_limit en models
   → Asigna superusuario a kevincordero@solarfluidity.com

3. scripts/02_superuser_private_slots.sql  (PRIVADO)
   → Crea tabla superuser_slots con RLS estricto
   → Inserta 20 slots vacíos numerados del 1 al 20
   → Crea vista superuser_slots_status para consultas rápidas
```

---

## Despliegue

### Local (Desarrollo)
```bash
npm run dev   # http://localhost:3000
```

### Producción (Vercel — recomendado para Next.js)
1. Conectar repo `KevinCElizondo/proyectosolar` en [vercel.com](https://vercel.com)
2. Configurar variables de entorno en Vercel Dashboard
3. Deploy automático en cada push a `main`

### Alternativa (Netlify)
- `netlify.toml` configurado para Next.js (`command = "npm run build"`, `publish = ".next"`)

---

*Última actualización: Junio 2025 — v5.2.0*
