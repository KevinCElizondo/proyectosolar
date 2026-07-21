# Checklist de Implementación Detallada (12 Semanas)

Este documento desglosa el plan de 12 semanas en tareas técnicas específicas para Solar Fluidity 3D v5.1.1.

## Fase 1: Fundaciones y Visualizador Base (Semanas 1-2)
- [x] Migración a Next.js (App Router) + TypeScript.
- [x] Limpieza de entorno Vite y archivos legacy.
- [x] Configuración de tipados (`global.d.ts` para PayPal).
- [x] Setup de UI Premium (Dark mode, glassmorphism, Framer Motion).
- [x] Integración de React Three Fiber y despliegue del "Cubo Paramétrico" inicial.
- [ ] Refinar escalado dinámico modular del componente `GrillAssembly` (requiere modelo real `.glb`).

## Fase 2: Autenticación y Persistencia (Semanas 3-4)
- [ ] Ejecutar el `schema.sql` en Supabase (Tablas `profiles`, `models`, `paypal_events`).
- [ ] Configurar login Magic Link con Supabase Auth.
- [ ] Sincronizar estado global del usuario logueado en Next.js (`UserContext`).
- [ ] Permitir a los usuarios logueados guardar sus configuraciones de ancho en la base de datos (Tabla `models`).

## Fase 3: PayPal y Planes Pro (Semanas 5-6)
- [ ] Crear planes de suscripción en el Sandbox de PayPal Developer.
- [ ] Configurar variables `.env.local` con Client ID y Secret.
- [ ] Construir página `/upgrade` con el botón de PayPal (`<Script>`).
- [ ] Desarrollar Webhook seguro (`/api/paypal-webhook`) usando `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Enviar correo electrónico transaccional de bienvenida vía Resend al confirmar suscripción.

## Fase 4: Embed y Modelo Separado (Semanas 7-8)
- [ ] Crear ruta `/embed/[storeId]` sin navegación ni barras laterales para incrustación pura.
- [ ] Servir script público `embed.js` desde `public/` para que los clientes lo instalen.
- [ ] Validar que los iframes funcionan correctamente y respetan las variables de entorno.

## Fase 5: Tienda de Hardware Propia (Semanas 9-10)
- [ ] Diseñar Landing Page orientada a la venta del hardware físico (Dogfooding).
- [ ] Formulario de pedido vinculado a Resend para enviar prospectos directo al Gmail del admin.
- [ ] Integrar el configurador propio dentro de la landing de la tienda.

## Fase 6: Early Adopters y Pulido (Semanas 11-12)
- [ ] Lanzar campaña a base de datos de 20 early adopters (Plan EarlyBird).
- [ ] Monitoreo de logs en Vercel y Supabase.
- [ ] Corrección de bugs menores de UI/UX o de carga 3D.
- [ ] Congelar el código final v6.0.0.
