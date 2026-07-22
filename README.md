# 🔥 SOLARFLUIDITY PRO – Propuesta de Valor Definitiva de Alto Calibre

**Versión:** 7.0.0 (Élite Edition & Cumplimiento Fiscal Costa Rica)  
**Framework:** Next.js (App Router)  
**Stack:** Next.js · TypeScript · Tailwind CSS v4 · Supabase · Three.js · Netlify  
**Propietario:** Kevin Cordero · `kevincordero@solarfluidity.com`

---

## 🎯 1. Propuesta de Valor de Alto Impacto

SolarFluidity Pro es la **vitrina 3D de alto calibre** que convierte archivos técnicos (.stl, .glb) en una máquina de ventas sin código, sin comisiones y con facturación integrada.

> **"Súbelo, previsualízalo, véndelo. Sin comisiones, con factura electrónica y correo corporativo incluido."**

| Elemento de valor | Cómo se traduce en ingresos |
|------------------|-----------------------------|
| **Visor 3D interactivo** | Aumenta la conversión de ventas del cliente final. |
| **Previsualización sin código** | Reduce la fricción del creador; más conversión a Pro ($49/mes). |
| **Sin comisiones sobre ventas** | El creador retiene el 100%, justificando la suscripción. |
| **Facturación electrónica (CR)** | Diferencia regulatoria para clientes costarricenses con Factúrele. |
| **Correos personalizados** | `solarfluidity.com` transmite imagen corporativa de autoridad. |
| **Embed en webs externas** | Multiplica la exposición del SaaS mediante backlinks orgánicos. |

---

## 💰 2. Análisis de Márgenes de Ingresos de Élite

### 2.1. Estructura de costos (operación mensual)

| Concepto | Costo |
|----------|-------|
| Hosting frontend + API (Netlify) | $0 (plan gratuito) |
| Base de datos, Auth, Storage (Supabase) | $0 (plan gratuito 500 MB) |
| Correos transaccionales (Resend) | $0 (3,000 correos/mes) |
| Pasarela de pagos (PayPal) | 2.9% + $0.30 por transacción |
| Dominio `solarfluidity.com` | ~$10/año |
| **Total mensual fijo** | **$0 / mes** |

### 2.2. Margen neto del SaaS (>99%)

| Clientes Pro | Ingreso mensual | Margen neto |
|--------------|-----------------|-------------|
| 10 | $490 | **100%** |
| 30 | $1,470 | **100%** |
| 50 | $2,450 | **100%** |

### 2.3. Ingresos por Productos Propios (Hardware)
- **Cama VerDECER:** $490 venta | ~$230 margen (47%)
- **Parrilla Híbrida:** $1,000 venta | ~$500 margen (50%)

**Total proyectado Año 1:** **~$17,800 USD** (SaaS + Hardware) con margen neto >85%.

---

## 🏛️ 3. Correos Corporativos y Facturación Electrónica

### Alias en Google Workspace (`solarfluidity.com`)
- `kevincordero@solarfluidity.com` – Fundador & Principal
- `facturacion@solarfluidity.com` – Emisión de facturas electrónicas
- `ventas@solarfluidity.com` – Atención comercial
- `soporte@solarfluidity.com` – Soporte técnico
- `administracion@solarfluidity.com` – Gestión administrativa
- `no-reply@solarfluidity.com` – Envíos automáticos

### Flujo de Facturación Electrónica (Factúrele + Make)
1. Cliente adquiere producto o suscripción en la web.
2. Webhook procesa la venta y envía datos a **Make.com**.
3. Make genera la factura en **Factúrele** (proveedor autorizado por Ministerio de Hacienda CR).
4. Se distribuye automáticamente el PDF y XML firmado al cliente con copia a `facturacion@solarfluidity.com`.

---

## 🌐 4. Guía de Despliegue en Netlify

El proyecto se encuentra 100% optimizado para **Netlify**:

```bash
# 1. Probar compilación local
npm run build

# 2. Conectar repositorio GitHub en Netlify:
#    Site Settings -> Import existing project -> GitHub -> proyectosolar

# 3. Configurar variables de entorno en Netlify:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    SUPABASE_SERVICE_ROLE_KEY
#    RESEND_API_KEY
#    NEXT_PUBLIC_PAYPAL_CLIENT_ID
#    PAYPAL_CLIENT_SECRET
```

Cada push a `main` actualizará tu sitio automáticamente en Netlify en menos de 60 segundos. 🚀
