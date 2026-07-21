# ⚡ Solar Fluidity 3D × Make.com — Sistema de Automatización

**Versión:** 1.1.0 · **Estado:** Implementable desde el día 1  
**Orquestador:** [Make.com](https://make.com) (antes Integromat)  
**Objetivo:** Motor de automatización central del ecosistema Solar Fluidity 3D — ventas, marketing, entrega de productos digitales y notificaciones de plataforma.

---

## Make.com como orquestador único

Make.com reemplaza cualquier solución de automatización anterior y gestiona **toda** la lógica de flujos del negocio:

| Área | Escenarios | Tools |
|------|-----------|-------|
| **Ventas y marketing** | Captura de leads, secuencias de email, upsells, referidos | MailerLite, Stripe, Resend |
| **Plataforma** | Notificaciones admin, alertas de suscripción, emails de bienvenida | Resend, Supabase |

---

## 🧱 Herramientas del Stack de Ventas

| Herramienta | Rol | Costo inicial |
|-------------|-----|--------------|
| **Make.com** | Orquestador central de automatizaciones | $0 (1.000 ops/mes gratis) |
| **MailerLite** | Email marketing + secuencias | $0 (hasta 1.000 suscriptores) |
| **Stripe** | Cobros únicos y suscripciones | $0 fijo (% por transacción) |
| **Carrd.co** | Landing page de captura | $0 (dominio `.carrd.co`) / $19/año (dominio propio) |
| **Google Drive** | Alojamiento de productos digitales | $0 |
| **Resend** | Emails transaccionales de Solar Fluidity 3D | Ya instalado |

**Costo total del sistema de ventas: $0/mes en el arranque.**

---

## 🔄 Escenarios Make (Blueprints)

Cada escenario se construye **una sola vez** y corre automáticamente 24/7.

---

### 📥 Escenario 1: Captura de Lead + Entrega de Lead Magnet

**Gatillo:** Webhook Make (URL que se pega en el formulario de Carrd)  
**Frecuencia:** Tiempo real, <2 segundos de latencia

```
[Webhook Make] 
    → [MailerLite: Add/Update Subscriber] (grupo "Leads Automatización")
    → [Router]
        ├── [Es nuevo] → [MailerLite: Tag "nuevo"] + [Enviar lead magnet PDF]
        └── [Ya existe] → [Solo enviar lead magnet, no duplicar]
```

**Variables de entorno necesarias:**
```env
MAKE_WEBHOOK_LEAD_CAPTURE=https://hook.eu2.make.com/xxxxxxxxxxxxxxxx
MAILERLITE_API_KEY=...
MAILERLITE_GROUP_LEADS=123456789
```

---

### 📧 Escenario 2: Secuencia de 7 Días de Venta

**Gatillo:** Suscriptor añadido al grupo "Leads Automatización" (vía Escenario 1)  
**Implementación:** Automatización nativa de MailerLite (activada por API desde Make)

| Día | Asunto | Objetivo |
|-----|--------|----------|
| 0 | "Tu [nombre del recurso] está aquí + algo que no te esperas" | Entregar lead magnet, generar curiosidad |
| 1 | "El problema que [tu producto] resuelve en 10 minutos" | Problema → solución |
| 3 | "Respuestas honestas a las 3 dudas más frecuentes" | Eliminar objeciones |
| 5 | "[Caso de éxito]: cómo X logró Y con este sistema" | Prueba social |
| 7 | "Esta oferta se cierra hoy a medianoche ⏰" | Escasez + CTA final |

**Condición de salida:** Si el usuario compra antes del día 7, Make recibe el webhook de Stripe y llama a MailerLite para sacar al suscriptor de la secuencia automáticamente.

---

### 💳 Escenario 3: Procesamiento de Compra + Entrega del Producto

**Gatillo:** `Stripe > Watch Events` → evento `checkout.session.completed`

```
[Stripe Webhook: checkout.session.completed]
    → [Filtro: pago exitoso + product_id correcto]
    → [MailerLite: Mover a grupo "Clientes"] (quitar de secuencia de ventas)
    → [MailerLite: Añadir tag "comprador"]
    → [Email: Acceso inmediato al producto]
        └── Enlace a carpeta Google Drive / página Notion con el curso
    → [Email: Factura simplificada]
    → [Delay 1 hora]
    → [Email: Upsell — "Antes de irte, solo por hoy…"]
```

**Variables de entorno:**
```env
MAKE_WEBHOOK_PURCHASE=https://hook.eu2.make.com/yyyyyyyyyyyyyyyy
MAILERLITE_GROUP_CLIENTS=987654321
```

---

### 🛒 Escenario 4: Recuperación de Carritos Abandonados

**Gatillo:** `Stripe > Watch Events` → `checkout.session.expired` (o `async_payment_failed`)

```
[Stripe Webhook: checkout.session.expired]
    → [Filtro: tiene email + estado = incompleto]
    → [Delay 2 horas] → [Email: "¿Tuviste algún problema? Tu carrito sigue aquí"]
    → [Delay 22 horas] → [Email: "Última oportunidad + descuento especial 15%"]
```

> **Nota:** Para capturar el email antes del pago, usar un checkout personalizado de Stripe (no Payment Links). El email se captura en la primera pantalla del checkout.

---

### 📊 Escenario 5: Panel de Referidos Automático

**Gatillo:** Nuevo lead desde URL con parámetro `?ref=CODIGO_AFILIADO`

```
[Webhook Make: nuevo lead con ?ref=]
    → [Extraer ref code del query string]
    → [Google Sheets / Supabase: +1 referral al afiliado]
    → [Router: ¿Alcanzó umbral de 5 referidos?]
        ├── [Sí] → [Email: "¡Ganaste una recompensa! Aquí tu cupón"]
        │           + [Stripe: Crear cupón único]
        └── [No] → [No acción]
```

---

## ✉️ Plantillas de Correos Automáticos

### 1. Email de Lead Magnet
```
Asunto: Aquí tienes tu [Kit/Guía/Recurso] ☀️ + algo que te va a sorprender

Hola [Nombre],

Tu [nombre del recurso] está adjunto/enlazado abajo.

Pero antes de que lo descargues, hay algo que quiero que sepas:
[Frase de gancho que conecta el lead magnet con el producto de pago]

→ [Descargar recurso gratuito]
→ [Ver el sistema completo — $X por tiempo limitado]

Nos vemos dentro,
Kevin
```

### 2. Email de Acceso al Producto
```
Asunto: 🎉 Tu acceso inmediato a [Nombre del Producto]

¡Bienvenido/a!

Tu compra fue procesada correctamente. Aquí tienes tu acceso:

→ [ACCEDER AHORA]

Cualquier duda, responde directamente a este correo.
```

### 3. Email de Upsell (1 hora post-compra)
```
Asunto: Antes de que te vayas... solo por las próximas 24h

[Nombre], acabas de tomar una excelente decisión.

Mientras configuras todo, quiero ofrecerte algo que complementa
perfectamente lo que acabas de comprar:

[Nombre del producto complementario]
Precio normal: $67 — Hoy, solo para ti: $37

→ [Añadir a mi compra por $37]

Esta oferta expira en 24 horas. No habrá segunda oportunidad.
```

### 4. Email de Carrito Abandonado
```
Asunto: ¿Tuviste algún problema? Tu carrito sigue aquí 👀

Hola,

Noté que iniciaste el proceso de compra de [Producto] pero no lo completaste.

¿Tuviste algún problema técnico? ¿Alguna duda?

Tu carrito sigue reservado. Puedes retomar tu compra aquí:
→ [Retomar compra]

Si tienes alguna pregunta, responde a este email.
```

---

## 📈 Ruta de Maximización de Ingresos

### 🥇 Ruta 1: Tráfico Orgánico (costo $0)
Crear contenido en Twitter/X, LinkedIn, TikTok respondiendo exactamente al dolor que resuelve el producto. Cada visitante que llega es un lead cualificado. El sistema solo necesita tráfico; el resto lo hace solo.

**Proyección:**
- 1.000 visitas/mes → 200 leads (20% conv.) → 10 ventas (5% conv.) → ~$600/mes
- 10.000 visitas/mes → misma tasa → $6.000/mes

### 🥈 Ruta 2: Upsells y Order Bumps
- **Order bump en checkout:** Producto de $27 con un clic. Ingreso extra sin aumentar tráfico.
- **Upsell post-compra:** $37 por cliente que acepta. Aumenta el valor del cliente en 40-60%.

### 🥉 Ruta 3: Membresía Recurrente
Ofrecer plan de soporte/actualizaciones mensual a $19/mes después de la compra inicial.

**Proyección con 100 clientes + 20% conversión a membresía:**
- $380/mes recurrentes desde el mes 1
- Crece linealmente con cada nuevo cliente

### 🏅 Ruta 4: Programa de Afiliados
- Comisión del 30-50% a microinfluenciadores
- Make gestiona cupones Stripe, calcula comisiones y envía pagos automáticos
- Sin gasto publicitario inicial, alcance exponencial

### 🎯 Combinación Ganadora

```
1 cliente = $67 (producto) + $37 (upsell) + $19/mes (membresía)
         = $104 el primer mes + $19/mes perpetuos
```

**Proyección año 1 con 200 clientes:**
- Ventas únicas: $67 × 200 = $13.400
- Upsells (30% aceptación): $37 × 60 = $2.220
- Membresía al mes 12 (20% conversión): $19 × 40 = $760/mes recurrentes
- **Total: >$15.620 + $9.120/año recurrentes a partir del año 2**

---

## 🗓️ Plan de Implementación (5 Días)

| Día | Tarea | Herramienta |
|-----|-------|-------------|
| **1** | Definir producto digital + subirlo a Google Drive | Canva, Notion |
| **2** | Crear landing en Carrd + Escenario 1 en Make (captura + lead magnet) | Carrd, Make |
| **3** | Crear 7 correos en MailerLite + configurar Stripe (producto + precio) | MailerLite, Stripe |
| **4** | Escenario 3 en Make (compra → entrega + upsell) + prueba con $1 | Make, Stripe |
| **5** | Escenario 4 (carritos abandonados) + programa de referidos básico | Make, Stripe |

**Al final del día 5, el sistema funciona de forma 100% autónoma.**

---

## 📊 Proyección Financiera Conservadora

| Mes | Visitas | Leads (20%) | Ventas (5%) | Upsells (30%) | Ingreso |
|-----|---------|-------------|-------------|----------------|---------|
| 1 | 500 | 100 | 5 | 2 | ~$450 |
| 2 | 1.000 | 200 | 10 | 3 | ~$870 |
| 3 | 2.000 | 400 | 20 | 6 | ~$1.720 |
| 6 | 5.000 | 1.000 | 50 | 15 | ~$4.205 |
| 12 | 15.000 | 3.000 | 150 | 45 | ~$12.615 |

*Añadiendo membresía, el MRR al mes 12 puede superar los $2.850/mes adicionales.*

**Margen neto: >90%** — Costos totales estimados: $0-39/mes.

---

*Última actualización: Julio 2026 — v1.0.0*
