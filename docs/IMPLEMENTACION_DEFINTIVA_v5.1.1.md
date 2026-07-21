# ☀️ Solar Fluidity 3D Pro – Plan Estratégico Definitivo (v5.1.1)

**Documento maestro de implementación, negocio y tecnología.**  
Versión congelada para producción. Infraestructura de costo $0/mes.  
Cada detalle ha sido analizado y blindado para la ejecución inmediata.

---

## 📌 1. Resumen Ejecutivo

Solar Fluidity 3D es un ecosistema digital compuesto por:

1. **SaaS de configurador 3D paramétrico** para pequeños fabricantes (carpinterías, herrerías, diseñadores de mobiliario). Permite crear, editar y embeber modelos 3D interactivos en cualquier sitio web. Plan Normal (gratis) y Plan Pro ($99/mes o $990/año).
2. **Tienda propia de hardware** (parrillas híbridas y camas de cultivo elevadas flat‑pack) que utiliza el mismo configurador como escaparate vivo (*dogfooding*). Esta tienda genera flujo de caja inmediato y sirve como prueba social irrefutable para los clientes del SaaS.

**Filosofía:**  
Mantener los costos fijos en cero durante el arranque, centralizar toda la comunicación en Gmail, y utilizar un stack moderno que permita escalar sin reescribir.

---

## 🎯 2. Estrategia de Negocio

### 2.1. Propuesta de valor dual

- **Para el fabricante (cliente B2B):** Un configurador 3D que aumenta la conversión de ventas al permitir que el comprador final vea y personalice el producto en tiempo real. Se incrusta con un simple `<script>` y no requiere conocimientos técnicos.
- **Para el comprador final:** Visualización realista, cambio de dimensiones/colores, y compra directa con confianza.

### 2.2. Modelo de ingresos mixto

| Fuente | Producto | Precio | Margen |
|--------|----------|--------|--------|
| SaaS recurrente | Plan Pro (mensual) | $99/mes | ~99% |
| SaaS recurrente | Plan Pro (anual) | $990/año | ~99% |
| Venta de hardware | Parrilla híbrida | $1,199 | ~$500 |
| Venta de hardware | Cama de cultivo elevada | $350 | ~$200 |

**Proyección conservadora (mes 12):**  
- 18 suscriptores Pro activos → $1,782/mes  
- 6 ventas de hardware al mes → $3,000/mes netos  
- Total: ≈ $4,782/mes ($57,384/año) con costos operativos de $0-6/mes.

### 2.3. Adquisición de early adopters

Se reclutarán **20 early adopters** estratégicos (fabricantes digitales, carpinteros, diseñadores) que recibirán un descuento del 70% durante los primeros 3 meses mediante el plan `PLAN_PRO_EARLYBIRD` en PayPal. A cambio, proporcionan feedback y un testimonio.

### 2.4. Programa de afiliados (crecimiento viral)

Cada cliente Pro recibe un enlace de referido. Por cada nuevo suscriptor que traiga, se le acredita un mes gratis. La lógica se maneja en la tabla `referrals` y se dispara desde el webhook de PayPal al detectar una activación.

---

## 🧱 3. Arquitectura Técnica (Serverless, Zero-Cost)

| Capa | Tecnología | Costo mensual |
|------|------------|---------------|
| Frontend + API | **Next.js 14** (App Router, TypeScript estricto) | $0 (Vercel Hobby) |
| Renderizado 3D | **React Three Fiber** + drei | $0 |
| Modelos 3D base | **FreeCAD** (exportación `.glb` comprimida con Draco) | $0 |
| Base de datos / Auth / Storage | **Supabase** (plan gratuito) | $0 |
| Correos transaccionales | **Resend** (3,000 correos/mes gratis) | $0 |
| Pasarela de pagos | **PayPal Subscriptions** (dos planes) | $0 fijo |
| Dominio y DNS | Vercel + Cloudflare (dominio personalizado) | ~$10/año |
| **Total mensual** | | **$0** |

No se utilizan servidores dedicados, contenedores, ni bases de datos externas. Toda la lógica de negocio reside en funciones serverless de Next.js y en las políticas de Supabase.

---

## 🗄️ 4. Esquema de Base de Datos (SQL definitivo)

Ejecutar este bloque en el **SQL Editor** de Supabase.

```sql
-- Perfil de usuario extendido (1:1 con auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'normal' CHECK (plan IN ('normal','pro')),
  paypal_subscription_id TEXT UNIQUE,
  paypal_plan_id TEXT,          -- 'pro_standard' o 'pro_earlybird'
  subscription_status TEXT DEFAULT 'inactive'
    CHECK (subscription_status IN ('active','trialing','cancelled','past_due','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_paypal_sub ON profiles(paypal_subscription_id);

-- Modelos 3D guardados
CREATE TABLE models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  glb_url TEXT,
  step_url TEXT,
  public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de eventos de PayPal (para auditoría)
CREATE TABLE paypal_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT,
  raw_body JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referidos
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id),
  referred_email TEXT,
  subscription_activated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguridad Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own models" ON models FOR ALL USING (auth.uid() = user_id);
```

**Nota sobre RLS y el webhook:**  
El webhook de PayPal utiliza la `SUPABASE_SERVICE_ROLE_KEY`, que omite todas las políticas de seguridad, permitiendo actualizar la tabla `profiles` sin restricciones.

---

## 🧩 5. Integración de PayPal (doble plan + custom_id)

### 5.1. Planes de suscripción en PayPal Developer

Se crean dos planes dentro de la misma aplicación REST API:

- **Plan Pro Estándar (`PLAN_PRO_STANDARD`):** $99/mes o $990/año.
- **Plan Pro Early Bird (`PLAN_PRO_EARLYBIRD`):** Periodo de prueba de 3 meses a $29.70/mes, luego $99/mes automático.

### 5.2. Flujo de pago en el frontend

El usuario autenticado accede a `/upgrade`. Si ingresa el código `EARLY70`, se selecciona el plan Early Bird; de lo contrario, el estándar.

Se utiliza el componente `Script` de Next.js con `onLoad` para montar el botón de PayPal de forma segura, y se inyecta el `custom_id` con el `userId` del perfil de Supabase.

### 5.3. Declaración de tipos global (TypeScript)

Crea el archivo `src/global.d.ts` para evitar errores con `window.paypal`.

### 5.4. Webhook de PayPal

Archivo `app/api/webhooks/paypal/route.ts`. Usa `custom_id` para identificar al usuario y la clave de servicio para saltar RLS. Además envía correo de bienvenida con Resend.

---

## ✉️ 6. Correos Transaccionales con Resend

Se utiliza la librería `resend` (HTTP POST) para evitar los timeouts de SMTP en funciones serverless.

Cualquier ruta de API que necesite enviar correo (bienvenida, pedido de tienda, recuperación de acceso) llamará a `resend.emails.send`. Los correos salen desde un dominio verificado en Resend y se entregan en bandeja de entrada.

---

## 🖼️ 7. Renderizado 3D Modular (sin deformaciones)

Los modelos se diseñan en FreeCAD y se exportan en piezas separadas a un único archivo `.glb` con nombres de malla (`CenterBody`, `LeftRail`, `RightRail`, `Wheels`).  
En React Three Fiber, el cambio de ancho se logra **escalando solo el eje X del cuerpo central** y desplazando los rieles laterales. De esta forma, las ruedas y manivelas mantienen sus proporciones.

---

## 🗓️ 8. Plan de Implementación por Semanas

| Semana | Entregable principal | Tareas técnicas |
|--------|----------------------|----------------|
| **1‑2** | Prototipo 3D interactivo | Next.js + R3F, cubo paramétrico con sliders, despliegue en Vercel. |
| **3‑4** | Autenticación y persistencia | Supabase Auth (Magic Link), tabla `models`, guardado de parámetros. |
| **5‑6** | Integración de pagos | Planes en PayPal, botón con `custom_id`, webhook, correo de bienvenida. |
| **7‑8** | Embed y modelo real | Ruta `/embed/[storeId]`, script `embed.js`, carga del modelo modular de la parrilla. |
| **9‑10** | Tienda de hardware | Landing `solarfluiditystudio.store`, formulario de pedido → Resend a Gmail. |
| **11‑12** | Lanzamiento con early adopters | 20 cupones Early Bird, recogida de feedback, ajustes de UI, página de testimonios. |

---

## 🔧 9. Configuración del Entorno de Desarrollo

### 9.1. Variables de entorno (`.env.local`)

Copia este template y rellena con tus credenciales reales.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
NEXT_PUBLIC_PAYPAL_PLAN_STANDARD=P-XXXXXXXXXX
NEXT_PUBLIC_PAYPAL_PLAN_EARLYBIRD=P-YYYYYYYYYY

RESEND_API_KEY=re_123456...
ADMIN_EMAIL=tu@gmail.com
```

### 9.2. Instalación y arranque

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La interfaz 3D Premium debe cargar sin errores.

---

## 📋 10. Checklist de Configuración Inicial (One-Time Setup)

- [ ] Crear proyecto en Supabase y ejecutar el SQL de la sección 4.
- [ ] Configurar las variables de entorno en Vercel (producción) y `.env.local` (desarrollo).
- [ ] Crear los dos planes de suscripción en PayPal Developer.
- [ ] Configurar el webhook de PayPal apuntando a `https://tudominio.com/api/webhooks/paypal`.
- [ ] Verificar el dominio en Resend y obtener la API Key.
- [ ] Exportar los modelos 3D de FreeCAD como `.glb` separado y colocarlos en `public/models/`.
- [ ] Probar el flujo de suscripción completo en el sandbox de PayPal.

---

## 📈 11. Proyección Financiera y Punto de Equilibrio

Con un costo fijo de $0, el punto de equilibrio se alcanza con el **primer cliente Pro**. Cada venta adicional de hardware es beneficio neto para reinvertir en publicidad o contratar un asistente.

---

## 🧠 12. Conclusión

La versión v5.1.1 de Solar Fluidity 3D es la culminación de múltiples iteraciones de diseño, donde se han eliminado todos los riesgos técnicos conocidos.
El repositorio ya está preparado para producción. Sigue la checklist de configuración inicial y luego avanza semana a semana según el plan. La primera línea de código ya está escrita; ahora toca ejecutar.
