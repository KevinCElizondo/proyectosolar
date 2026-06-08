# 🔥 SOLAR FLUIDITY – VERSIÓN DEFINITIVA REFINADA

## SaaS de Modelado CAD Web + Tienda de Hardware (Dogfooding) + Portal de Anuncios con Aprobación Manual

> **Documento final para implementación – Basado en análisis de viabilidad y estrategia de early adopters**  
> *Stack: Next.js + Supabase + OpenCascade.js (Wasm) + Three.js + n8n*

---

## 📌 1. Resumen Ejecutivo (Refinado)

**SolarFluidity** es un ecosistema compuesto por:

1. **SaaS (solarfluidity.com):** Herramienta CAD web que permite crear, visualizar y exportar modelos 3D paramétricos. Ofrece **dos planes**:
   - **Plan Normal (gratuito):** 1 modelo simple, sin exportación `.step`, ideal para pruebas.
   - **Plan Pro ($99/mes o $990/año):** Modelos ilimitados, generación desde imagen, subida/exportación STEP, y **portal de anuncios** (directorio con aprobación manual del administrador).

2. **Tienda de hardware (solarfluiditystudio.store):** Vende parrillas híbridas y camas de cultivo. **Usa el propio SaaS** como configurador (Dogfooding), generando flujo de caja que financia el desarrollo del SaaS.

3. **Portal de anuncios:** Directorio público donde los clientes Pro aprobados por el administrador muestran su negocio, incentivando la suscripción.

**Corrección estratégica clave (post-análisis):**
- El **valle de la muerte** (primeros 3 meses sin ingresos) se cubre con la tienda de hardware, no con el SaaS. La prioridad de desarrollo es el **Core Engine** (renderizado y manipulación de modelos 3D), no el portal de anuncios.
- Los **20 cupones** no son para el propietario (que ya tiene acceso de administrador), sino para **20 early adopters** seleccionados estratégicamente, quienes recibirán un **descuento del 70% durante 3 meses** a cambio de feedback y testimonio. Estos early adopters tendrán un "Badge de Miembro Fundador" en el directorio.

**Proyección anual:** SaaS ≈ $20,000 – $25,000 + hardware ≈ $48,000 → **Total ≈ $70,000 – $80,000** (realista).

---

## 🧭 2. Filosofía y Propuesta de Valor (Refinada)

### 2.1. Nicho vertical: Fabricantes de productos físicos (muebles, parrillas, piezas personalizadas)

- **Dolor:** Necesitan mostrar y vender productos personalizables, pero no tienen presupuesto para SolidWorks o configuradores a medida.
- **Solución:** SaaS CAD web con generación rápida desde imagen, edición paramétrica y exportación para impresión 3D/CNC.

### 2.2. Diferenciadores clave

| Característica | Plan Normal (gratis) | Plan Pro ($99/mes) |
|----------------|----------------------|--------------------|
| Número de modelos activos | 1 | Ilimitados |
| Generar 3D desde imagen | No | Sí (texturizado sobre cubo) |
| Subir archivos STEP/STL | No | Sí (hasta 50 MB) |
| Edición paramétrica (dimensiones) | No | Sí (básica) |
| Exportar a `.step` para impresión 3D | No | Sí |
| Incrustación web (embed.js) | Vista previa con marca | Sin marca + scripts personalizables |
| Portal de anuncios (directorio) | No | Sí (aprobación manual requerida) |
| Soporte | Comunidad | Email prioritario |

### 2.3. El rol del Súper Usuario (Administrador)

- **Tú** tienes acceso al panel de administración (Supabase Studio + Retool opcional) para:
  - Aprobar o rechazar solicitudes de clientes Pro para el directorio (verificando que tengan al menos un modelo activo y el configurador incrustado en su sitio).
  - Gestionar los 20 cupones de early adopters (asignarlos, monitorizar su uso).
  - Ver métricas de uso (almacenamiento, modelos creados, etc.).
  - Resolver incidencias técnicas.

**No necesitas cupones para ti mismo:** como administrador, puedes crear tiendas de demostración directamente asignándote el plan Pro sin costo.

---

## 🎫 3. Estrategia de Early Adopters (20 cupones estratégicos)

En lugar de regalar cupones sin control, los **20 espacios** se asignan a segmentos específicos que aporten valor de validación y marketing.

### 3.1. Distribución de los 20 cupones

| Segmento | Cupones | Perfil | Objetivo |
|----------|---------|--------|-----------|
| **Talleres de fabricación digital / FabLabs** | 8 | Usuarios que necesitan exportar `.step` para CNC/impresoras 3D. Serán beta testers exigentes. | Detectar errores en la cadena de exportación y optimizar rendimiento. |
| **Diseñadores de interiores / Carpinteros** | 7 | Profesionales que requieren configuradores para clientes finales. | Validar la facilidad de incrustación web y la utilidad del configurador paramétrico. |
| **Instituciones educativas / Estudiantes** | 5 | Generan ruido en redes y pueden viralizar la herramienta. | Crear marca y contenido educativo (tutoriales). |

### 3.2. Condiciones del cupón (descuento, no gratis total)

- **Descuento del 70%** durante los primeros 3 meses (pagan ~$30/mes en lugar de $99).
- **Compromiso:** Una entrevista de feedback de 30 minutos antes del tercer mes y un testimonio en video (o escrito) que SolarFluidity puede usar en su web.
- **Beneficio adicional:** Obtienen un **"Badge de Miembro Fundador"** en su ficha del directorio, con prioridad visual sobre futuros clientes Pro.

### 3.3. Implementación técnica de los cupones

```sql
-- Tabla de cupones (descuento porcentual, meses de validez)
CREATE TABLE coupons (
  code TEXT PRIMARY KEY,
  discount_percent INT DEFAULT 70,
  duration_months INT DEFAULT 3,
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  segment TEXT CHECK (segment IN ('fablab', 'designer', 'education', 'other')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar 20 cupones (ejemplo)
INSERT INTO coupons (code, discount_percent, duration_months, max_uses, segment)
SELECT 
  'EARLY-' || generate_series(1,8),
  70, 3, 1, 'fablab'
FROM generate_series(1,8);
-- Repetir para los otros segmentos...
```

**Flujo de canje:**
1. El usuario se registra en el SaaS (plan Normal).
2. En la pantalla de upgrade a Pro, ingresa el código.
3. La Edge Function valida el cupón y crea una suscripción en Stripe con un precio reducido (usando `coupon` de Stripe o aplicando un descuento manual).
4. Se registra el canje en `coupon_redemptions`.

---

## ⚙️ 4. Arquitectura Técnica (Core Engine prioritario)

### 4.1. Stack definitivo (sin cambios)

| Capa | Tecnología | Costo mensual |
|------|------------|----------------|
| Frontend | Next.js 14 + React + Three.js (o Babylon.js) | $0 |
| CAD kernel | **OpenCascade.js** (Wasm) + CascadeStudio como referencia | $0 |
| Backend | Supabase (PostgreSQL + Storage) | $0-25 |
| Orquestación | n8n (Render Starter) – solo para flujos de email y notificaciones de hardware | $7 |
| Conversión imagen→3D | Edge Function + `@gltf-transform/core` | ≈$5 |
| Email | Resend | $0 |
| Pagos | Stripe | 2.9% + $0.30 |
| **Total fijo** | | **≈$15-20/mes** |

### 4.2. El Core Engine (prioridad #1)

**Riesgo principal:** La manipulación de geometría CAD en el navegador puede congelar la interfaz si no se usa **Web Workers** y se optimiza la teselación.

**Implementación recomendada:**
- Usar OpenCascade.js dentro de un **Web Worker** para que los cálculos pesados no bloqueen el hilo principal.
- Para la renderización (Three.js), solo transferir la malla generada (buffer de vértices) al hilo principal.
- Seguir la arquitectura de **CascadeStudio** (código abierto) como referencia.

**Flujo mínimo funcional (semana 1-2):**
1. El usuario ve un cubo paramétrico con sliders (largo, ancho, alto).
2. Al mover un slider, se actualiza el modelo en tiempo real (Web Worker recalcula la geometría, Three.js la renderiza).
3. Botón "Exportar STEP" (solo visible para plan Pro) – descarga el archivo `.step` generado por OpenCascade.

**No priorizar en el MVP:**
- Portal de anuncios (se añade después, cuando el core engine esté estable).
- Generación avanzada desde imagen (se puede lanzar como feature v1.1).

### 4.3. Modelo de datos simplificado (para el core)

```sql
-- Usuarios
CREATE TABLE users ( id UUID PRIMARY KEY, email TEXT UNIQUE, role TEXT DEFAULT 'client' );

-- Suscripciones (plan normal o pro)
CREATE TABLE subscriptions ( user_id UUID REFERENCES users(id), plan TEXT, stripe_subscription_id TEXT, current_period_end TIMESTAMPTZ );

-- Modelos 3D
CREATE TABLE models ( id UUID, user_id UUID, name TEXT, parameters JSONB, model_url TEXT, created_at TIMESTAMPTZ );
```

### 4.4. Incrustación web (embed.js) – igual que antes

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

---

## 💰 5. Modelo de Negocio y Proyección Financiera (Refinada)

### 5.1. Planes (solo dos)

| Plan | Precio mensual | Precio anual (2 meses gratis) | Características clave |
|------|----------------|-------------------------------|----------------------|
| **Normal** | $0 | – | 1 modelo, sin exportación STEP, vista previa con marca |
| **Pro** | $99 | $990 | Modelos ilimitados, exportación STEP, generación desde imagen, portal de anuncios (aprobación manual) |

### 5.2. Proyección de ingresos del SaaS (realista con early adopters)

| Mes | Clientes Pro (pago completo) | Early adopters (70% descuento) | MRR (aprox) |
|-----|------------------------------|--------------------------------|-------------|
| 1 | 0 | 0 (aún no activan) | $0 |
| 3 | 2 | 5 (pagando ~$30) | $198 + $150 = $348 |
| 6 | 6 | 12 (algunos se convierten a tarifa completa) | $594 + $360 = $954 |
| 9 | 12 | 15 (suponiendo que 5 renuevan con descuento o se convierten) | $1,188 + $450 = $1,638 |
| 12 | 20 | 18 | $1,980 + $540 = $2,520 |

**Ingresos anuales SaaS:** ≈ $22,000 (considerando renovaciones y conversiones).

### 5.3. Tienda de hardware (cubre el valle de la muerte)

Misma proyección que antes: utilidad neta ≈ $4,000/mes al final del año → ≈ $48,000 anuales.

**Total ecosistema año 1:** ≈ $70,000 – $80,000, suficiente para sostener el desarrollo y generar ganancias.

---

## 🗓️ 6. Plan de Implementación (12 semanas) – Priorizando el Core Engine

### Semana 1-2 – Core Engine CAD (Worker + OpenCascade.js)
- [ ] Configurar proyecto Next.js + Supabase (tablas básicas: users, subscriptions, models).
- [ ] Integrar OpenCascade.js en un Web Worker (tomar ejemplo de CascadeStudio).
- [ ] Crear componente React que controle sliders (largo, ancho, alto) y envíe parámetros al Worker.
- [ ] Renderizar el modelo actualizado con Three.js (transferir malla).
- [ ] Implementar botón de exportación STEP (solo para plan Pro).

### Semana 3-4 – Autenticación, planes y pagos
- [ ] Autenticación Magic Links (Supabase Auth).
- [ ] Integración con Stripe (producto Pro a $99/mes y $990/año). Webhook para actualizar subscriptions.
- [ ] Middleware que proteja la exportación STEP (solo usuarios con plan Pro activo).

### Semana 5-6 – Generación desde imagen (básica) y almacenamiento
- [ ] Edge Function `upload-to-3d` que toma una imagen, crea un cubo texturizado GLB, lo guarda en Storage y asocia a un modelo.
- [ ] Panel de usuario donde pueda ver sus modelos, subir nuevos, editar parámetros.

### Semana 7-8 – Incrustación web y documentación inicial
- [ ] Endpoint `/embed/[storeId]` que carga el configurador del usuario (según su plan).
- [ ] Script `embed.js`.
- [ ] PDF sencillo "Cómo incrustar tu configurador en WordPress/Shopify".

### Semana 9-10 – Lanzamiento de early adopters y tienda de hardware
- [ ] Generar 20 cupones con descuento del 70% y asignarlos a los segmentos definidos.
- [ ] Construir `solarfluiditystudio.store` (usando el propio SaaS con un storeId propio, plan Pro pagado por el dueño).
- [ ] Configurar n8n para flujo de cotización de parrillas/camas.

### Semana 11-12 – Portal de anuncios (aprobación manual) y pulido
- [ ] Tabla `directory_requests` y panel de administración para aprobar/rechazar.
- [ ] Página pública `/directory` con listings aprobados (incluyendo badge "Miembro Fundador" para early adopters).
- [ ] Finalizar documentación y lanzar marketing dirigido a early adopters.

---

## ✅ 7. Conclusión y Siguiente Paso

**El proyecto es técnicamente viable y el modelo de negocio es sólido.** Los ajustes realizados (priorizar el core engine, definir early adopters con descuento y compromiso, y usar la tienda de hardware como financiador inicial) eliminan las principales inconsistencias y aumentan las probabilidades de éxito.

**Tu siguiente acción concreta (hoy):**
1. Clona el repositorio de CascadeStudio y ejecuta su demo localmente. Comprende la integración de OpenCascade.js con Web Workers.
2. Crea un proyecto Supabase gratuito y ejecuta el SQL mínimo (usuarios y modelos).
3. Construye el esqueleto de Next.js con un componente simple que llame a un Worker y renderice un cubo con Three.js.
