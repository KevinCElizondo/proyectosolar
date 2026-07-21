# 💳 Guía: Conexión Correcta de PayPal con Make.com

**Fecha:** Julio 2026 · **Versión:** Solar Fluidity 3D v5.3.0

---

## Contexto

Solar Fluidity 3D usa **PayPal Subscriptions** para las suscripciones Pro del SaaS. Make.com se conecta a PayPal para:
1. Detectar nuevas suscripciones y activar el plan Pro en Supabase
2. Detectar cancelaciones y revocar el acceso Pro
3. Enviar emails automáticos de bienvenida, factura y churn

---

## Arquitectura de la integración

```
Usuario → /upgrade (Next.js)
    → PayPal Checkout (SDK)
    → PayPal confirma pago
    → PayPal envía Webhook → Make.com (Escenario 6: PayPal events)
        → Supabase: actualizar profiles.plan = 'pro'
        → Resend: enviar email de bienvenida
        → MailerLite: mover a grupo "Clientes Pro"
```

> ⚠️ **IMPORTANTE**: El proyecto también tiene un webhook nativo en `/api/webhooks/paypal` (Next.js). Puedes elegir una de las dos estrategias o usarlas en paralelo para redundancia.

---

## Opción A — Webhook directo PayPal → Make.com (Recomendado)

Esta es la forma más directa y elimina la necesidad del endpoint Next.js para la mayoría de casos.

### Paso 1: Crear el Escenario en Make.com

1. Ve a [make.com](https://make.com) → **Create a new scenario**
2. Añade el módulo de gatillo: **Webhooks > Custom Webhook**
3. Haz clic en **Add** → copia la URL del webhook (ej. `https://hook.eu2.make.com/xxxxxxxx`)
4. Guarda esta URL — la usarás en el panel de PayPal

### Paso 2: Configurar el Webhook en PayPal Developer

1. Ve a [developer.paypal.com](https://developer.paypal.com)
2. Selecciona tu app → **Webhooks** → **Add Webhook**
3. **Webhook URL:** pega la URL de Make.com del paso anterior
4. **Event types** a suscribir:

| Evento PayPal | Qué hace |
|---------------|----------|
| `BILLING.SUBSCRIPTION.ACTIVATED` | Plan Pro activado |
| `BILLING.SUBSCRIPTION.CANCELLED` | Plan cancelado → revocar acceso |
| `BILLING.SUBSCRIPTION.EXPIRED` | Suscripción vencida → revocar acceso |
| `BILLING.SUBSCRIPTION.PAYMENT.FAILED` | Pago fallido → alertar al usuario |
| `PAYMENT.SALE.COMPLETED` | Pago exitoso → confirmar en log |

5. Clic en **Save**

### Paso 3: Construir el flujo en Make.com

```
[Webhook: PayPal Event]
    → [JSON Parser: extraer event_type + resource]
    → [Router]
        ├── [BILLING.SUBSCRIPTION.ACTIVATED]
        │       → [Supabase: UPDATE profiles SET plan='pro', subscription_status='active'
        │              WHERE paypal_subscription_id = resource.id]
        │       → [Resend: Email bienvenida Pro]
        │       → [MailerLite: Mover a grupo "Clientes Pro"]
        │
        ├── [BILLING.SUBSCRIPTION.CANCELLED / EXPIRED]
        │       → [Supabase: UPDATE profiles SET plan='normal', subscription_status='cancelled'
        │              WHERE paypal_subscription_id = resource.id]
        │       → [Resend: Email de churn + offerta de retención]
        │
        └── [BILLING.SUBSCRIPTION.PAYMENT.FAILED]
                → [Resend: Email "Hubo un problema con tu pago"]
```

### Paso 4: Conectar Supabase en Make.com

1. En Make.com, añade el módulo **Supabase > Execute a Query**
2. Conecta tu proyecto:
   - **Project URL:** `NEXT_PUBLIC_SUPABASE_URL`
   - **API Key:** `SUPABASE_SERVICE_ROLE_KEY` ← usa la service role, no la anon key
3. Query para activar Pro:

```sql
UPDATE profiles
SET
  plan = 'pro',
  subscription_status = 'active',
  paypal_subscription_id = '{{resource.id}}'
WHERE paypal_subscription_id = '{{resource.id}}'
   OR id = '{{resource.custom_id}}'
RETURNING id, email, plan;
```

> `custom_id` es el `userId` de Supabase que se inyecta en el botón PayPal del frontend (`/upgrade`). Siempre úsalo como identificador primario.

---

## Opción B — Mantener el webhook Next.js + notificar a Make.com

Si quieres conservar el endpoint `/api/webhooks/paypal` para la lógica de seguridad (verificación de firma PayPal), puedes hacer que **ese endpoint llame a Make.com** después de procesar el pago:

```typescript
// src/app/api/webhooks/paypal/route.ts — después de actualizar Supabase:

if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
  // ... lógica existente de Supabase ...

  // Notificar a Make.com para los flujos de marketing
  await fetch(process.env.MAKE_WEBHOOK_PURCHASE!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'subscription_activated',
      userId: profile.id,
      email: profile.email,
      plan: 'pro',
      subscriptionId: event.resource.id,
    }),
  });
}
```

Luego en Make.com, el Escenario 3 recibe ese payload y ejecuta los flujos de email y MailerLite.

---

## Variables de Entorno Requeridas

```env
# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AXxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=EXxxxxxxxxxxxxxx
NEXT_PUBLIC_PAYPAL_PLAN_STANDARD=P-XXXXXXXX
NEXT_PUBLIC_PAYPAL_PLAN_EARLYBIRD=P-YYYYYYYY

# Make.com (Webhooks)
MAKE_WEBHOOK_LEAD_CAPTURE=https://hook.eu2.make.com/xxxxxxxx
MAKE_WEBHOOK_PURCHASE=https://hook.eu2.make.com/yyyyyyyy

# Supabase (para Make.com — usar Service Role, no Anon Key)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## Verificación del flujo

### En Sandbox (desarrollo)

1. Ve a `/upgrade` en `localhost:3000`
2. Usa las credenciales de prueba de PayPal Sandbox
3. Completa la suscripción
4. En Make.com → **History** del escenario → verifica que el webhook fue recibido
5. En Supabase → SQL Editor: `SELECT plan, subscription_status FROM profiles WHERE email='tutest@email.com'`
6. Debe mostrar `plan = 'pro'` y `subscription_status = 'active'`

### Checklist de conexión

- [ ] Webhook creado en Make.com y URL copiada
- [ ] URL pegada en PayPal Developer → Webhooks (app correcta: Sandbox o Live)
- [ ] Eventos seleccionados: ACTIVATED, CANCELLED, EXPIRED, PAYMENT.FAILED
- [ ] Supabase conectado en Make.com con `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `custom_id` inyectado en el botón PayPal del frontend (`userId` de Supabase)
- [ ] Prueba end-to-end con cuenta Sandbox completada
- [ ] Verificación en Supabase: perfil actualizado a `plan = 'pro'`
- [ ] Email de bienvenida recibido en inbox

---

## Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Webhook no recibe eventos | URL incorrecta en PayPal | Verificar URL en PayPal Developer → Webhooks |
| `custom_id` vacío | No se está inyectando el `userId` en el frontend | Revisar el componente de PayPal en `/upgrade` |
| Supabase rechaza la actualización | Usando `anon key` en lugar de `service_role_key` | Make.com debe usar `SUPABASE_SERVICE_ROLE_KEY` |
| Email no enviado | Resend no está conectado en Make | Añadir módulo Resend con API key válida |
| Perfil no encontrado | `paypal_subscription_id` no coincide | Asegurarse de guardar el `subscription_id` al activar |

---

*Última actualización: Julio 2026 — Solar Fluidity 3D v5.3.0*
