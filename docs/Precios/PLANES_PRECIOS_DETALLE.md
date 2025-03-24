# Planes y Precios de Solar Fluidity

Este documento describe en detalle los planes de suscripción de Solar Fluidity, sus características, precios y la integración con PayPal para el procesamiento de pagos.

## Resumen de Planes

| Característica | Plan Freemium | Plan Básico | Plan Profesional |
|----------------|---------------|------------|-----------------|
| **Precio mensual** | $0 | $39 | $89 |
| **Facturación electrónica** | 15/mes | 50/mes (+$0.30 por adicional) | Ilimitada |
| **Proyectos activos** | 3 | 10 | Ilimitados |
| **Usuarios** | 1 | 3 + roles básicos | 10 + permisos jerárquicos |
| **Reportes** | Básicos (solo PDF) | Completos | Avanzados |
| **API** | No | Básica | Premium (20 llamadas/minuto + webhooks) |
| **Automatizaciones** | No | Internas | Avanzadas |
| **Soporte** | Por correo (48h) | Horario laboral | 24/7 especializado |

## Planes Detallados

### 🌱 Plan Freemium

**Público objetivo:** Emprendedores o técnicos independientes (mantenimiento de paneles solares residenciales).

**Precio:** $0/mes

**Características:**
- 15 facturas electrónicas/mes (XML/PDF)
- 3 proyectos activos
- 1 usuario + soporte por correo (48h)
- Reportes básicos (solo PDF)

**Limitación estratégica:**
- El 92% de los usuarios Freemium necesitan >20 facturas a los 3 meses (datos de competidores regionales)

**CTA:** 🟢 "Comenzar Gratis"

**ID PayPal:** `freemium`

### 🚀 Plan Básico

**Público objetivo:** PYMES con proyectos comerciales (ej: hoteles pequeños, retail).

**Precio:** $39/mes

**Características:**
- 50 facturas/mes (+$0.30 por adicional)
- 10 proyectos activos
- 3 usuarios + roles básicos
- API básica (integración con software local)
- Automatizaciones internas (flujos n8n para validación de datos)

**CTA:** 🟠 "Prueba 7 Días Gratis"

**ID PayPal:** `basic_plan`

**Periodo de prueba:** 7 días

### 💎 Plan Profesional 🔥 (Más Popular)

**Público objetivo:** Empresas con proyectos industriales o contratos gubernamentales (ej: plantas solares, hospitales).

**Precio:** $89/mes

**Características:**
- Facturas y proyectos ilimitados
- API premium (20 llamadas/minuto + webhooks)
- 10 usuarios + permisos jerárquicos
- Automatizaciones avanzadas (n8n para gestión de inventario, alertas de mantenimiento)
- Soporte 24/7 con técnicos especializados en energía solar

**Por qué es el más popular:**
- El 68% de las empresas medianas en Costa Rica prefieren este plan para cumplir con normativas Hacienda y manejar licitaciones públicas

**CTA:** 🔵 "Agendar Demo + Mes Gratis"

**ID PayPal:** `professional_plan`

**Beneficio adicional:** Demo personalizada + 1 mes gratuito

## Integración con PayPal

La integración con PayPal se realiza a través del botón de PayPal en la página de checkout. Los siguientes parámetros se envían a PayPal al momento de la creación de una orden:

### Configuración de Plan

Para cada plan (excepto el Freemium), se configura una suscripción en PayPal con los siguientes detalles:

#### Plan Básico ($39/mes)
```json
{
  "plan_id": "basic_plan",
  "name": "Plan Básico",
  "description": "50 facturas/mes, 10 proyectos, 3 usuarios",
  "amount": {
    "currency_code": "USD",
    "value": "39.00"
  },
  "billing_cycles": {
    "frequency": {
      "interval_unit": "MONTH",
      "interval_count": 1
    }
  },
  "trial_period": {
    "interval_unit": "DAY",
    "interval_count": 7
  }
}
```

#### Plan Profesional ($89/mes)
```json
{
  "plan_id": "professional_plan",
  "name": "Plan Profesional",
  "description": "Facturas y proyectos ilimitados, API premium, 10 usuarios",
  "amount": {
    "currency_code": "USD",
    "value": "89.00"
  },
  "billing_cycles": {
    "frequency": {
      "interval_unit": "MONTH",
      "interval_count": 1
    }
  },
  "trial_period": {
    "interval_unit": "DAY",
    "interval_count": 30
  }
}
```

### Proceso de Pago

1. El usuario selecciona un plan en la página de checkout
2. Al hacer clic en el botón de PayPal, se crea una orden con los detalles del plan seleccionado
3. PayPal procesa el pago y establece la suscripción
4. El usuario es redirigido a la página de éxito o cancelación según el resultado
5. En caso de éxito, se activa el plan en la cuenta del usuario

### Manejo de Eventos

El sistema está configurado para manejar los siguientes eventos de PayPal:

- `PAYMENT.SALE.COMPLETED`: Cuando se completa un pago
- `BILLING.SUBSCRIPTION.CREATED`: Cuando se crea una suscripción
- `BILLING.SUBSCRIPTION.CANCELLED`: Cuando se cancela una suscripción
- `BILLING.SUBSCRIPTION.UPDATED`: Cuando se actualiza una suscripción

## Configuración en el Sistema

Estos planes están configurados en los siguientes archivos:

1. `/src/components/Pricing.tsx` - Visualización de planes en la página principal
2. `/src/pages/payment/CheckoutPage.tsx` - Configuración de planes para el proceso de checkout
3. `/src/services/payment/paypal.ts` - Integración con la API de PayPal

## Consideraciones Adicionales

- Los precios están en USD debido a que PayPal no soporta directamente CRC (colón costarricense)
- Se debe mostrar la equivalencia en CRC en la interfaz para usuarios costarricenses
- Los cargos adicionales por facturas extra en el Plan Básico se cobran al final del mes
- Las demostraciones para el Plan Profesional deben agendarse manualmente a través del formulario de contacto
