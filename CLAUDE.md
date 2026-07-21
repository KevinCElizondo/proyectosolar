# SolarFluidity — Contexto para Claude

## Stack
- Next.js 16.2.9 (App Router, TypeScript estricto)
- React 19, Tailwind CSS v4
- Supabase (Auth, PostgreSQL, RLS)
- PayPal Subscriptions API
- Resend (emails transaccionales)
- Make.com (orquestador central de automatizaciones — ventas, marketing, entrega)
- Three.js / React Three Fiber (configurador 3D)
- Vercel (despliegue producción)

## Prefijos de variables de entorno
- Variables públicas (cliente): `NEXT_PUBLIC_*`
- Variables privadas (servidor): sin prefijo

## Rutas principales
- `/` — Landing B2B
- `/login` — Supabase Auth (Magic Link)
- `/dashboard` — Panel autenticado
- `/upgrade` — Planes PayPal
- `/embed/grill` — Visor 3D embebible
- `/api/webhooks/paypal` — Webhook PayPal → activa plan Pro

## Automatizaciones (Make.com — reemplaza n8n completamente)
- Escenario 1: Captura de lead → MailerLite
- Escenario 2: Secuencia de emails 7 días (MailerLite)
- Escenario 3: Compra Stripe → entrega producto + upsell
- Escenario 4: Carritos abandonados
- Escenario 5: Sistema de referidos automático

## Reglas críticas
- NO usar `VITE_*` — este proyecto es Next.js, no Vite
- NO usar n8n — Make.com es el orquestador de automatizaciones
- Respetar RLS de Supabase; solo el webhook usa `SUPABASE_SERVICE_ROLE_KEY`
- El trigger `trg_enforce_plan_limit` limita modelos a 3 para plan Free
- Leer `node_modules/next/dist/docs/` antes de tocar APIs de Next.js
