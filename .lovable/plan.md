
## Objetivo

Desbloquear el despliegue en Vercel y dejar operativo el núcleo del SaaS: Magic Link (ya existe, se refina), subida de modelos 3D a Supabase Storage y visor 3D público. PayPal Subscriptions, Resend branding y Factúrele/Make se abordarán en un turno posterior.

## Diagnóstico del build

`Failed to collect page data for /api/webhooks/paypal` ocurre porque `src/utils/email.ts` ejecuta `new Resend(process.env.RESEND_API_KEY)` en el scope del módulo. Durante el "collect page data" de Next 16, `RESEND_API_KEY` puede estar ausente y el constructor lanza, tumbando cualquier route que importe el módulo (incluido el webhook de PayPal).

## Cambios

### 1) Arreglar el build (bloqueante)
- `src/utils/email.ts`: instanciar Resend de forma perezosa dentro de `sendEmail`, devolver early si falta la API key sin lanzar. Tipos y firma se mantienen.

### 2) Base de datos (Supabase)
- Añadir migración con tabla `profiles` (id → `auth.users`, email, plan `free|pro`, `paypal_subscription_id`, `paypal_plan_id`, `subscription_status`, `is_founder`), tabla `models` (owner, name, `file_url`, `format stl|glb`, `public`, `call_to_action_url`) y `paypal_events` (auditoría).
- GRANTs a `authenticated` y `service_role`; `SELECT` a `anon` solo para `models` públicos.
- RLS: dueño lee/escribe lo suyo; lectura pública de `models` con `public = true`. Trigger `on_auth_user_created` que inserta profile.
- Bucket público `models` vía tool + policies de `storage.objects` para que usuarios autenticados suban a su propio prefijo `{userId}/...`.

### 3) Auth (Magic Link)
- Se conserva `src/app/login/page.tsx` y `src/app/auth/callback/route.ts` ya existentes. Verifico que `emailRedirectTo` apunte a `${origin}/auth/callback` y que el middleware siga protegiendo `/dashboard`.

### 4) Subida de modelos
- `src/app/dashboard/upload/page.tsx`: form con nombre, archivo `.stl|.glb` (máx 50MB) y CTA opcional. Usa cliente browser de Supabase para obtener sesión.
- `src/app/api/upload/route.ts`: valida sesión con `getUser()` server-side (no confía en `userId` del body), sube a `storage/models/{userId}/{uuid}_{name}`, inserta fila en `models`. Usa `SUPABASE_SERVICE_ROLE_KEY` solo del lado servidor.
- Enlace "Subir modelo" en el dashboard.

### 5) Visor 3D y página pública
- `src/components/ProductViewer.tsx`: componente cliente con `@react-three/fiber` + `drei` (`OrbitControls`, `Stage`), carga STL con `STLLoader` y GLB con `useGLTF` según `format`.
- `src/app/p/[userId]/[modelId]/page.tsx` (RSC): fetch del modelo desde Supabase (respetando RLS público), render del visor y botón CTA si existe `call_to_action_url`. Metadatos SEO por modelo.

### 6) Variables de entorno
- Documento `env.example` actualizado (SUPABASE, RESEND). No inserto valores reales.

## Fuera de alcance en este turno (se hace después)
- PayPal Subscriptions (planes, botón, verificación firmada de webhook).
- Verificación de dominio Resend + templates finales.
- Factúrele + Make.
- Conexión de GitHub/Vercel y DNS (los harás tú desde Lovable/Vercel).

## Notas técnicas
- Todas las routes API usan `runtime = 'nodejs'` implícito; nada de secretos en `NEXT_PUBLIC_*` salvo URL/anon key.
- Validación de input con checks explícitos (extensión, tamaño, mimetype defensivo).
- No se toca `src/app/api/webhooks/paypal/route.ts` salvo lo necesario para que compile (import perezoso de email ya lo resuelve).

## Verificación
1. `next build` completa sin errores.
2. Login por Magic Link redirige a `/dashboard`.
3. Subida de un `.glb` real aparece en Storage y en la tabla `models`.
4. `/p/{userId}/{modelId}` renderiza el visor y el CTA cuando existe.
