# ☀️ SolarFluidity — Plataforma SaaS de Diseño 3D Paramétrico

**Versión:** 5.2.0  
**Framework:** Next.js 16.2.9 (App Router · Turbopack)  
**Stack:** Next.js · TypeScript · Tailwind CSS v4 · Supabase · PayPal · Three.js · Framer Motion · n8n  
**Propietario:** Kevin Cordero · `kevincordero@solarfluidity.com`

---

## ¿Qué es SolarFluidity?

SolarFluidity es una plataforma SaaS B2B que permite a **fabricantes e instaladores** ofrecer a sus clientes un configurador de productos en **3D interactivo** incrustable en cualquier sitio web. Los clientes finales pueden ajustar dimensiones, ver el producto en tiempo real, y el fabricante recibe pedidos ya configurados.

**Casos de uso:**
- Parrillas y estructuras metálicas a medida
- Paneles solares y sistemas de montaje
- Muebles y productos paramétricos por catálogo

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local
# Llenar los valores reales en .env.local

# 3. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:3000

# 4. Build de producción
npm run build
npm run start
```

---

## 📁 Estructura del Proyecto

```
proyectosolar/
├── src/
│   ├── app/                        # Next.js App Router (páginas y rutas)
│   │   ├── page.tsx                # Landing page principal (B2B)
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── globals.css             # Variables CSS + utilidades globales
│   │   ├── login/                  # Autenticación (Supabase Auth)
│   │   ├── dashboard/              # Panel de usuario autenticado
│   │   │   ├── page.tsx            # Resumen / KPIs
│   │   │   ├── billing/            # Gestión de suscripción PayPal
│   │   │   ├── settings/           # Código embed + configuraciones
│   │   │   └── affiliates/         # Programa de referidos
│   │   ├── upgrade/                # Página de planes (Free → Pro)
│   │   ├── checkout/               # Flujo de compra
│   │   ├── store/                  # Tienda pública de modelos
│   │   ├── embed/grill/            # Visor 3D embebible (iframe)
│   │   ├── auth/callback/          # Callback OAuth de Supabase
│   │   └── api/
│   │       ├── order/              # API de pedidos
│   │       └── webhooks/paypal/    # Webhooks de PayPal (activar suscripciones)
│   ├── components/
│   │   ├── GrillConfigurator.tsx   # Configurador 3D paramétrico (Three.js)
│   │   └── BackgroundConstellation.tsx  # Fondo animado Canvas
│   └── utils/
│       └── supabase/               # Clientes Supabase (server/client/middleware)
├── scripts/
│   ├── 01_setup_limits_and_roles.sql   # Roles, trigger de límites, superusuario
│   └── 02_superuser_private_slots.sql  # Slots privados del propietario (no público)
├── docs/                           # Documentación técnica
├── public/                         # Assets estáticos
├── schema.sql                      # Schema base de datos inicial
├── .env.example                    # Plantilla de variables de entorno
├── .env.local                      # Variables locales (NO comitear)
└── .env                            # Variables globales (NO comitear)
```

---

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfil extendido del usuario (plan, rol, suscripción PayPal) |
| `models` | Modelos 3D guardados por cada usuario |
| `paypal_events` | Log de webhooks PayPal (auditoría) |
| `referrals` | Sistema de referidos |
| `superuser_slots` | **PRIVADO** — 20 slots personales del propietario |

### Roles del Sistema

| Rol | Límite de Modelos | Descripción |
|-----|------------------|-------------|
| `user` + `plan = normal` | **3 modelos** | Plan gratuito |
| `user` + `plan = pro` | **Ilimitado** | Suscripción Pro activa |
| `superuser` | **Ilimitado** | Propietario del sistema |

### Ejecutar Scripts SQL (en orden)

```
1. schema.sql                       → Tablas base + RLS
2. scripts/01_setup_limits_and_roles.sql → Roles + trigger + superusuario
3. scripts/02_superuser_private_slots.sql → Slots privados (opcional)
```

---

## 🔑 Variables de Entorno Requeridas

Copia `.env.example` a `.env.local` y completa:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ypaoqvbjdduumwdhuqjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>

# PayPal (Sandbox para desarrollo, Live para producción)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<tu-client-id>
PAYPAL_CLIENT_SECRET=<tu-secret>
NEXT_PUBLIC_PAYPAL_PLAN_STANDARD=<plan-id-paypal>
NEXT_PUBLIC_PAYPAL_PLAN_EARLYBIRD=<plan-id-earlybird>

# Email (Resend)
RESEND_API_KEY=<tu-resend-key>
ADMIN_EMAIL=kevincordero@solarfluidity.com

# n8n Automatizaciones
VITE_N8N_WEBHOOK_URL=https://n8n-production-9ac9.up.railway.app/webhook
```

> ⚠️ **Nunca** comitees `.env`, `.env.local` ni archivos de configuración MCP. Están en `.gitignore`.

---

## 💳 Sistema de Pagos (PayPal)

- **Suscripciones recurrentes** via PayPal Subscriptions API
- Webhook en `/api/webhooks/paypal` activa automáticamente el plan Pro en Supabase
- Cupón de descuento `EARLY70` → 70% off por 3 meses
- Afiliados: se rastrea con `?ref=<codigo>` en la URL

---

## 🤖 Automatizaciones (n8n)

La instancia de n8n en Railway (`n8n-production-9ac9.up.railway.app`) gestiona:
- Emails de bienvenida
- Notificaciones de suscripción
- Alertas al propietario

**MCP Server n8n** configurado para integración con el IDE (config local, no en repo).

---

## 🎨 Diseño y Estética

- **Fondo:** `#07090F` (espacio negro profundo)
- **Primario:** `#FF5A1F` (Brand Orange — confianza y energía)
- **Acento Tecnológico:** `#38BDF8` (Sky Blue)
- **Premium:** `#F59E0B` (Amber/Dorado)
- **Animaciones:** Framer Motion con curvas bezier `[0.22, 1, 0.36, 1]`
- **Fondo interactivo:** Canvas con constelación de partículas sutiles

---

## 🛡️ Seguridad

- **Row Level Security (RLS)** activo en todas las tablas de Supabase
- **Trigger PostgreSQL** que limita modelos según plan (Free: 3, Pro: ilimitado)
- **Superusuario RLS** protege la tabla `superuser_slots` — solo accesible por `kevincordero@solarfluidity.com`
- Tokens y secretos excluidos del repositorio via `.gitignore`
- Webhook de PayPal verifica firma antes de procesar

---

## 🔜 Roadmap Próximas Versiones

- [ ] **v5.3** — Panel Admin Superusuario (`/dashboard/admin`)
- [ ] **v5.3** — Sistema de Showcase con moderación (aprobar/rechazar sitios Pro)
- [ ] **v5.3** — Galería pública `/showcase` con badge "Hecho con SolarFluidity"
- [ ] **v5.4** — Modelos 3D reales desde FreeCAD (`.glb` en `public/models/`)
- [ ] **v5.4** — Contador animado de fabricantes en Hero

---

## 📋 Historial de Versiones

| Versión | Descripción |
|---------|-------------|
| v5.1.1 | Arquitectura definitiva: Auth, PayPal, Supabase, Embed, Afiliados |
| v5.2.0 | Rediseño B2B landing, constelación, corrección vercel/netlify, SQL roles |

---

*© 2024-2025 SolarFluidity Studio. Todos los derechos reservados.*
