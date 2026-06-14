# Estado y Estructura del Proyecto: Solar Fluidity 3D (Versión 5.1.1 - Production Ready)

Este documento centraliza la nueva arquitectura para **Solar Fluidity 3D**, basada en Next.js (App Router), con un enfoque en coste de infraestructura $0/mes, renderizado paramétrico sin dependencias de terceros y escalabilidad modular.

---

## 🏗️ 1. Arquitectura y Stack Actual

El proyecto ha sido rediseñado como un ecosistema de dos frentes (SaaS de configurador 3D y tienda propia de hardware) bajo la siguiente pila tecnológica de última generación:

### Tecnologías Core
- **Frontend y API:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Motor 3D:** `@react-three/fiber` (R3F), `@react-three/drei`, `three.js`.
- **Backend, Base de Datos y Auth:** Supabase (Plan Gratuito) - PostgreSQL y Row Level Security (RLS).
- **Correos Transaccionales:** Resend (Hasta 3,000 correos/mes gratuitos).
- **Pagos Recurrentes:** PayPal Subscriptions con Webhooks e integrados vía `custom_id` para saltar políticas RLS con seguridad.
- **Modelado 3D:** FreeCAD (Exportación a `.glb` por piezas) + Escalado dinámico modular.

---

## 📂 2. Estructura Maestra de Archivos

A continuación, la estructura lógica para la versión Next.js:

```text
proyectosolar/
├── .env.local                  # Variables de entorno (Supabase, PayPal, Resend)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing y Demo 3D
│   │   ├── upgrade/
│   │   │   └── page.tsx        # Integración con Botones de Suscripción PayPal
│   │   └── api/
│   │       └── paypal-webhook/
│   │           └── route.ts    # Webhook seguro de PayPal (Usa Service Role Key)
│   ├── components/
│   │   ├── 3d/                 # Componentes de React Three Fiber (GrillAssembly, etc.)
│   │   └── ui/                 # Componentes visuales genéricos
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase
│   │   └── resend.ts           # Cliente Resend
│   ├── context/
│   │   └── UserContext.tsx     # Contexto de Usuario / Autenticación
│   └── global.d.ts             # Declaración de variables globales (Window.paypal)
├── public/
│   └── models/                 # Modelos 3D (.glb, .gltf)
└── docs/
    ├── ESTRUCTURA_PROYECTO.md               # Este documento
    └── IMPLEMENTACION_DEFINTIVA_v5.1.1.md   # Documento técnico detallado y esquema SQL
```

---

## 🔗 3. Integraciones Estratégicas y Estado

### A. Autenticación y Base de Datos (Supabase)
- **Estado:** Migrado a arquitectura robusta con perfiles unificados (`profiles`) y almacenamiento de modelos paramétricos (`models`).
- **Seguridad:** Uso de Row Level Security (RLS) combinado con `SUPABASE_SERVICE_ROLE_KEY` en webhooks para actualizaciones de sistema.

### B. Módulo de Renderizado 3D Modular (React Three Fiber)
- **Estado:** Se implementa un escalado 3D sin huecos. Se escalan los cuerpos centrales en el eje X mientras los rieles laterales y accesorios se desplazan según parámetros ingresados, sin deformarse.

### C. Suscripciones y Pagos (PayPal)
- **Estado:** Componente de Upgrade utilizando `<Script>` de Next.js para asegurar que `window.paypal` cargue sin condiciones de carrera. 
- **Flujo Webhook:** El sistema captura eventos `BILLING.SUBSCRIPTION.ACTIVATED` y enlaza de forma segura usando el `custom_id` proveniente de Supabase.

### D. Correos Transaccionales (Resend)
- **Estado:** Integrado directamente en las rutas de la API de Next.js. Se envían notificaciones transaccionales (ej. Bienvenida a plan Pro, Cancelaciones) inmediatamente tras confirmar el webhook.

---

## 📝 4. Checklist para "Continuar Otro Día"

Para asegurar que todo funcione como se espera:

1. [ ] **Verificar Base de Datos:** Entrar a Supabase y aplicar el esquema SQL documentado en `IMPLEMENTACION_DEFINTIVA_v5.1.1.md`.
2. [ ] **Variables de Entorno:** Configurar correctamente `.env.local` con las llaves de Supabase, PayPal y Resend.
3. [ ] **Levantar Entorno Dev:** Ejecutar `npm run dev` y validar que el Canvas 3D renderice sin errores de importación.
4. [ ] **Testear Pago Local (Sandbox):** Usar ngrok (o herramientas similares) para exponer `http://localhost:3000/api/paypal-webhook` a PayPal Developer y simular una suscripción exitosa.
