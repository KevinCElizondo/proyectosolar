# 🔥 SOLAR FLUIDITY 3D – PLATAFORMA DEFINITIVA DE CONFIGURACIÓN 3D MULTI-TIENDA

## Versión Final 5.0 – Modelo Freemium + Pro (Sin Hardware, Sin Comisiones Publicitarias)

> *Documento maestro validado y ajustado para implementación inmediata*

---

## 📌 1. Resumen Ejecutivo

**SolarFluidity 3D** es un SaaS que permite a fabricantes de muebles, diseñadores y carpinteros crear **múltiples tiendas virtuales con configuradores 3D fotorrealistas**, incrustables en cualquier sitio web mediante un simple script (`embed.js`). El modelo es **Freemium**: plan gratis básico y plan Pro a $49/mes (o $490/año) sin comisiones ocultas.

**Cambios estratégicos clave (post-validación):**
- ✅ **Eliminado el hardware** (mini impresoras). En su lugar, se ofrece exportación de archivos `.stl` y alianzas de afiliación.
- ✅ **Publicidad simplificada:** El Plan Pro incluye un panel de banners. El cliente negocia y cobra a sus patrocinadores por fuera; SolarFluidity no interviene en pagos.
- ✅ **CDN + compresión Draco** para modelos 3D, garantizando rendimiento sin costos explosivos.
- ✅ **Iluminación personalizable** en el Plan Pro (HDRI, intensidad, dirección) para que cada marca tenga su estética única.

**Proyección año 1:** 80 usuarios Pro → MRR $3,920 + ingresos afiliación ≈ $45,000 ARR, con margen >90%.

---

## 🧭 2. Filosofía y Público Objetivo

| **Cliente ideal** | Carpinterías, mueblerías, diseñadores industriales, tiendas Print-on-Demand, talleres de muebles modulares. |
|-------------------|-------------------------------------------------------------------------------------------------------------|
| **Dolor que resuelve** | Un configurador 3D profesional cuesta $5,000-$20,000 de desarrollo. SolarFluidity lo ofrece por $49/mes. |
| **Propuesta de valor** | “Muestra tus productos en 3D realista, permite personalizar colores/texturas, y aumenta tus ventas online sin invertir en software caro.” |

**Sobre el nombre «SolarFluidity»:** Si bien el dominio principal mantiene su branding tecnológico, se recomienda adquirir un dominio secundario como `3dconfig.co.cr` o `muebles3d.app` para campañas específicas al nicho de mueblerías, evitando confusiones con energía solar.

---

## 💰 3. Modelo de Monetización (Solo 2 Planes)

| Característica | Plan Gratis | Plan Pro |
|:---|:---|:---|
| **Precio** | $0 / mes | **$49 / mes** o **$490 / año** (2 meses gratis) |
| **Tiendas (dominios/subdominios)** | 1 (subdominio `.solarfluidity.app`) | **Ilimitadas** (dominios personalizados) |
| **Productos por tienda** | Hasta 3 | Ilimitados |
| **Configurador 3D** | Básico (1 textura fija, sin sombras dinámicas) | Avanzado (texturas intercambiables, luces, sombras, HDRI) |
| **Iluminación personalizable** | No (iluminación estándar) | **Sí** (ajuste de HDRI, intensidad, dirección, temperatura de color) |
| **Marca SolarFluidity visible** | Sí (footer “Powered by”) | No (white‑label opcional) |
| **Panel de banners publicitarios** | No | **Sí** (el cliente sube imágenes y enlaces; negocia pagos por fuera) |
| **Exportar videos 360°** | No | Sí |
| **Estadísticas (visitas, conversiones)** | No | Sí (por tienda y producto) |
| **Exportación de archivos `.stl`** | No | Sí (para impresión 3D) |
| **Soporte** | Comunidad (foro) | Prioritario (email + chat) |
| **Cupones de descuento** | No | Sí (hasta 20 códigos activos por tienda) |

**¿Por qué $49?** Es el punto dulce B2B: no requiere aprobación gerencial, pero filtra a usuarios no serios. Un fabricante que venda una sola silla de $200 adicional gracias al configurador ya recupera la inversión del año.

---

## 🏗️ 4. Arquitectura Técnica (Ajustada y Escalable)

### 4.1. Stack Definitivo

| Capa | Tecnología | Costo mensual (inicial) |
|:---|:---|:---|
| Frontend | Next.js + React Three Fiber (R3F) + Drei + Zustand | $0 (Vercel Hobby) |
| Backend / DB | Supabase (PostgreSQL) | $0-25 (Pro cuando escale) |
| Orquestación | n8n (Render Starter) | $7 |
| Email | Resend | $0 |
| Almacenamiento de modelos | Supabase Storage + **Cloudflare R2 (CDN)** | $0 (10GB gratis + tráfico CDN incluido) |
| Compresión 3D | **Draco** (gltf-transform) | $0 |
| **Total fijo** | | **≈$7-10/mes** |

### 4.2. Modelo de Datos (Corregido)

```sql
-- Creación segura de tablas (sintaxis corregida)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2C3E50',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  -- Campos de iluminación personalizable (solo relevantes en pro)
  hdri_url TEXT,
  light_intensity DECIMAL DEFAULT 1.0,
  light_direction JSONB,  -- {x, y, z}
  color_temperature INTEGER DEFAULT 5500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model_url TEXT NOT NULL,          -- GLB optimizado con Draco
  thumbnail_url TEXT,
  base_price DECIMAL(10,2),
  textures JSONB,                   -- { "madera": ["url1", "url2"], "metal": [...] }
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Panel de banners (sin comisiones, solo almacenamiento)
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  position TEXT CHECK (position IN ('sidebar', 'banner_top', 'popup')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cupones (descuentos aplicables a suscripción Pro)
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_percent INT DEFAULT 0,
  free_months INT DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ
);
```

### 4.3. Optimización de Modelos 3D (Compresión Draco)

Para evitar costos de ancho de banda, todos los archivos `.glb` se procesan automáticamente al subirlos:

```bash
# Usando gltf-transform (CLI)
npx gltf-transform draco model_raw.glb model_optimized.glb --compression-level 10
```

Además, se sirven a través de **Cloudflare R2** con caché CDN. Los modelos de 15 MB se reducen a 2-3 MB.

### 4.4. Script de Inserción Multi-Tienda (`embed.js`)

```javascript
(function() {
  const storeId = document.currentScript.getAttribute('data-store');
  if (!storeId) return;

  const container = document.querySelector('.solar-fluidity-configurator');
  if (!container) return;

  const iframe = document.createElement('iframe');
  iframe.src = `https://app.solarfluidity.com/embed/${storeId}`;
  iframe.style.width = '100%';
  iframe.style.height = container.getAttribute('data-height') || '600px';
  iframe.style.border = 'none';
  container.appendChild(iframe);
})();
```

**Uso en la tienda del cliente:**
```html
<script src="https://cdn.solarfluidity.com/embed.js" data-store="mi-tienda"></script>
<div class="solar-fluidity-configurator" data-product="silla-123"></div>
```

---

## 🎨 5. Iluminación Personalizable (Ventaja Competitiva del Plan Pro)

Uno de los diferenciadores más poderosos frente a Zakeke o configuradores genéricos es que el Plan Pro permite **ajustar la iluminación 3D** para que coincida con la estética de la marca.

**Parámetros configurables desde el panel:**
- **HDRI (mapa de entorno):** El cliente puede subir su propio archivo `.hdr` o elegir entre 5 preajustes (estudio, exterior nublado, atardecer, interior cálido, luz de día).
- **Intensidad de la luz principal:** De 0.5 a 2.0.
- **Dirección:** Ángulos en X, Y, Z.
- **Temperatura de color:** 3000K (cálido) a 6500K (frío).

**Impacto comercial:** Una mueblería de alta gama puede mostrar sus sillas de teca con una iluminación cálida y sombras suaves, transmitiendo lujo. Una tienda de muebles industriales puede usar luz fría y contrastes marcados. La personalización de la iluminación es un argumento de venta directo para justificar el upgrade a Pro.

---

## 🚀 6. Plan de Implementación (4 Semanas)

### Semana 1 – Base Multi-Tienda (MVP funcional)
- [ ] Configurar Supabase con las tablas `stores`, `products`.
- [ ] Autenticación con Magic Links.
- [ ] Panel simple para crear una tienda (nombre, subdominio).
- [ ] Script `embed.js` básico que carga un iframe con el storeId.

### Semana 2 – Configurador 3D Genérico
- [ ] Componente R3F que recibe `productId` y carga modelo GLB (con Draco ya aplicado).
- [ ] Implementar cambio de texturas (mockup con 2 opciones).
- [ ] Soportar parámetros de iluminación desde la tabla `stores`.

### Semana 3 – Plan Pro, Banners y Exportación
- [ ] Integrar Stripe (suscripción $49/mes o $490/año).
- [ ] Middleware que protege rutas Pro (panel de banners, exportación .stl).
- [ ] Panel de banners: subir imagen, enlace, posición. Sin lógica de pagos.
- [ ] Botón “Exportar .stl” (usa `gltf-transform` para extraer la geometría).

### Semana 4 – Cupones, Landing Page y Lanzamiento
- [ ] Tabla `coupons` y validación en checkout.
- [ ] Landing page pública (`solarfluidity.com`) con demo en vivo.
- [ ] Generar 20 cupones VIP (50% descuento primeros 3 meses) y contactar prospectos.

---

## 📈 7. Proyección Financiera (Año 1)

| Mes | Usuarios Gratis | Usuarios Pro | MRR Pro ($49) | Ingresos Afiliación* | Total Mes | Acumulado |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | 30 | 2 | $98 | $0 | $98 | $98 |
| 2 | 60 | 5 | $245 | $20 | $265 | $363 |
| 3 | 100 | 12 | $588 | $50 | $638 | $1,001 |
| 4 | 150 | 20 | $980 | $80 | $1,060 | $2,061 |
| 5 | 180 | 30 | $1,470 | $120 | $1,590 | $3,651 |
| 6 | 200 | 40 | $1,960 | $200 | $2,160 | $5,811 |
| 9 | 250 | 60 | $2,940 | $400 | $3,340 | $15,000 |
| 12 | 300 | 80 | $3,920 | $600 | $4,520 | $45,000 |

*Ingresos por afiliación (ej. comisiones por referir a Bambu Lab o vender planos `.stl` en un marketplace futuro). Sin hardware, sin complicaciones logísticas.

**Margen operativo:** >90% (costos fijos ~$50/mes).  
**Punto de equilibrio:** Mes 4.

---

## ✅ 8. Conclusión y Llamada a la Acción

**SolarFluidity 3D versión 5.0** es el resultado de un proceso de validación riguroso:

- **Modelo Freemium** que atrae usuarios, **Pro** que genera ingresos recurrentes.
- **Sin hardware, sin comisiones publicitarias** → cero fricción operativa.
- **Iluminación personalizable** como ventaja competitiva frente a alternativas genéricas.
- **Script `embed.js`** que permite a cualquier negocio integrar el configurador en minutos.

**Próximo paso inmediato:**  
Configura tu primera tienda gratuita en `prueba.solarfluidity.app` con 2-3 modelos 3D descargados de Sketchfab (licencia creative commons). Luego, contacta a 5 carpinteros locales y ofréceles el plan Pro con los primeros cupones VIP.

---

## 📁 9. Estructura y Arquitectura de Archivos Actual

Esta es la organización maestra de archivos de Solar Fluidity, diseñada para escalar eficientemente como plataforma SaaS Multi-Tenant.

```text
.env
.env.example
.env.production
.github/workflows/aws.yml
.gitignore
.gitignore.bak
Dockerfile.frontend
README.md
cleanup.sh
components.json
docker-compose.full.yml
docs/ESTRUCTURA_PROYECTO.md
docs/GUIA_DESPLIEGUE_VERCEL.md
eslint.config.js
index.html
netlify.toml
nginx.conf
package-lock.json
package.json
postcss.config.js
public/favicon.ico
public/images/solar-products-banner.jpg
public/og-image.png
public/placeholder.svg
scripts/check_solar_fluidity.py
scripts/config_status.json
scripts/final-test.cjs
scripts/start_mcp_server.sh
scripts/test-both-environments.cjs
scripts/test-paypal.cjs
scripts/test-paypal.js
scripts/test-service.cjs
scripts/test_integration.py
scripts/verify-paypal-oauth.cjs
scripts/verify-paypal-oauth.js
scripts/verify-paypal.js
scripts/verify-paypal.mjs
scripts/verify-sandbox.cjs
src/App.css
src/App.tsx
src/components/AffiliateAdvisorSection.tsx
src/components/AmazonAffiliateSection.tsx
src/components/AutomationSection.tsx
src/components/Blog.tsx
src/components/Contact.tsx
src/components/Features.tsx
src/components/GoogleAuthButton.tsx
src/components/Hero.tsx
src/components/Logo.tsx
src/components/OptimizedBackground.tsx
src/components/ParticleBackground.tsx
src/components/PaymentButton/PayPalButton.tsx
src/components/PaymentWidget/InvoicePaymentWidget.tsx
src/components/Pricing.tsx
src/components/amazon-affiliate/AmazonBanner.tsx
src/components/amazon-affiliate/ShopPromotion.tsx
src/components/lazy-section.tsx
src/components/ui/accordion.tsx
src/components/ui/alert-dialog.tsx
src/components/ui/alert.tsx
src/components/ui/aspect-ratio.tsx
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/breadcrumb.tsx
src/components/ui/button.tsx
src/components/ui/calendar.tsx
src/components/ui/card.tsx
src/components/ui/carousel.tsx
src/components/ui/chart.tsx
src/components/ui/checkbox.tsx
src/components/ui/collapsible.tsx
src/components/ui/command.tsx
src/components/ui/context-menu.tsx
src/components/ui/dialog.tsx
src/components/ui/drawer.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/form.tsx
src/components/ui/hover-card.tsx
src/components/ui/input-otp.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/menubar.tsx
src/components/ui/navigation-menu.tsx
src/components/ui/optimized-image-fallback.tsx
src/components/ui/optimized-image.tsx
src/components/ui/pagination.tsx
src/components/ui/popover.tsx
src/components/ui/progress.tsx
src/components/ui/radio-group.tsx
src/components/ui/resizable.tsx
src/components/ui/scroll-area.tsx
src/components/ui/select.tsx
src/components/ui/separator.tsx
src/components/ui/sheet.tsx
src/components/ui/sidebar.tsx
src/components/ui/skeleton.tsx
src/components/ui/slider.tsx
src/components/ui/sonner.tsx
src/components/ui/switch.tsx
src/components/ui/table.tsx
src/components/ui/tabs.tsx
src/components/ui/textarea.tsx
src/components/ui/toast.tsx
src/components/ui/toaster.tsx
src/components/ui/toggle-group.tsx
src/components/ui/toggle.tsx
src/components/ui/tooltip.tsx
src/components/ui/use-toast.ts
src/config/constants.ts
src/config/environment.ts
src/config/integrations.ts
src/context/AuthContext.tsx
src/hooks/use-mobile.tsx
src/hooks/use-toast.ts
src/i18n/config.ts
src/index.css
src/integrations/mcp-python-sdk/mcp/__init__.py
src/integrations/mcp/.env
src/integrations/mcp/check_supabase_connection.py
src/integrations/mcp/create_supabase_tables.py
src/integrations/mcp/install_and_test_mcp.py
src/integrations/mcp/setup_supabase_db.py
src/integrations/mcp/solar_fluidity_mcp_server.py
src/integrations/mcp/supabase_config.example.env
src/integrations/mcp/test_mcp_server.py
src/integrations/mcp/verify_tables_and_test_connection.py
src/layouts/MainLayout.tsx
src/lib/utils.ts
src/main.tsx
src/pages/Dashboard.tsx
src/pages/Index.tsx
src/pages/NotFound.tsx
src/pages/Profile.tsx
src/pages/Settings.tsx
src/pages/articles/ApiIntegrationGuide.tsx
src/pages/auth/Login.tsx
src/pages/auth/Register.tsx
src/pages/inventory/Inventory.tsx
src/pages/invoices/InvoiceDetail.tsx
src/pages/invoices/Invoices.tsx
src/pages/invoicing/InvoiceDetailPage.tsx
src/pages/payment/CheckoutPage.tsx
src/pages/payment/PaymentCancelPage.tsx
src/pages/payment/PaymentSuccessPage.tsx
src/pages/projects/ProjectDetail.tsx
src/pages/projects/Projects.tsx
src/pages/quotations/QuotationDetail.tsx
src/pages/quotations/Quotations.tsx
src/pages/shop/index.tsx
src/routes/paymentRoutes.tsx
src/services/api.ts
src/services/convex/convexService.ts
src/services/payment/paypal.ts
src/services/payment/subscriptionPlans.ts
src/services/payment/subscriptionService.ts
src/services/payment/test-paypal-connection.ts
src/types/index.ts
src/utils/googleAuth.ts
src/utils/withLazyLoading.tsx
src/vite-env.d.ts
tailwind.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vercel.json
vite.config.ts
webapp/css/styles.css
webapp/index.html
webapp/js/main.js
windsurf_deployment.yaml
```
