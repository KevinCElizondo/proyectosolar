# 🌞 SolarFluidity Ecosystem – Plan Maestro de Dominación SaaS

> **Propietario:** Kevin Josue Cordero Elizondo (Solar Fluidity Venture Studio)
> 
> **Ubicación:** Zona Sur, Costa Rica
> 
> **Actividad:** 6201 (Desarrollo de software y consultoría informática)

---

## 🎯 1. El Veredicto Definitivo: Ecosistema "Propiedad Total"

El análisis de viabilidad técnica y comercial ha concluido una realidad ineludible: **Fluidity CAD, desarrollado nativamente con React Three Fiber (R3F) y con una capa de hardware complementaria (mini impresoras 3D), es la estrategia ganadora**.

¿Por qué este cambio es crucial? Al eliminar intermediarios (como Zakeke), pasas de ser un "revendedor de servicios" a ser una **Empresa de Tecnología con Activos Tangibles e Intangibles**.

**Las capas de ventaja que construyes:**
- **Margen Infinito en el software:** Una vez programado el código, te cuesta lo mismo ($0) ejecutarlo para 1 cliente que para 1.000. Cada nuevo cliente SaaS es ingreso puro sin costo marginal.
- **Control Visual Total:** R3F te permite una fidelidad gráfica (sombras dinámicas, texturas de madera realistas, iluminación HDRI) superior a los configuradores genéricos, vital para vender muebles de alta gama.
- **Activo Vendible (Propiedad Intelectual):** Este código se puede licenciar o vender en el futuro. Estás construyendo valor patrimonial.
- **Hardware como Barrera de Entrada:** Las mini impresoras 3D (que vendes instaladas, calibradas y con garantía) crean un ecosistema cerrado. Un cliente que compra tu hardware difícilmente se cambiará a otro proveedor de software.

---

## 🧩 2. La Estrategia de Fusión: El Modelo "Tesla + HP"

Tu negocio de muebles y tu hardware no son cosas distintas de tu SaaS. Funcionan bajo un ecosistema integrado de tres capas:

| Capa | Producto | Función en el Ecosistema | Ingreso Asociado |
|:---|:---|:---|:---|
| **Capa 1 – Hardware** | Mini impresoras 3D preconfiguradas | Genera leads B2B masivos. Instaladores que compran la impresora necesitan el software para digitalizar sus diseños. | Venta única de hardware (₡300,000 - ₡800,000) |
| **Capa 2 – SaaS de Configuración** | Fluidity CAD (Plan Taller / Pro) | Es el motor de ingresos recurrentes. Sin el software, la impresora es una caja. | Suscripción mensual ($29 - $79) |
| **Capa 3 – Marketplace Digital** | Directorio de Muebles + Marketplace de Planos | Escala el negocio: vendedores de planos 3D y carpinteros externalizan su inventario a tu plataforma. | Comisión por venta + Suscripción de vendedor |

> ⚠️ **ADVERTENCIA ESTRATÉGICA – ORDEN DE OPERACIONES CRÍTICO:**
> 
> El modelo "Tesla + HP" es poderoso, pero construir tres negocios a la vez es una receta segura para la parálisis. NO intentes lanzar las 3 capas simultáneamente.
>
> **El orden correcto es:**
> 1. **Fase 1 (Ahora):** Lanza el SaaS de configuración (Fluidity CAD) con tu propia tienda de muebles como caso de estudio. Sin hardware, sin marketplace.
> 2. **Fase 2 (Mes 6):** Introduce las mini impresoras 3D como upsell para clientes del SaaS que quieran fabricar sus diseños.
> 3. **Fase 3 (Mes 12):** Abre el marketplace para que terceros vendan planos o muebles digitalizados.
> 
> Si saltas directo al ecosistema completo, terminarás con 3 MVPs inconclusos en lugar de 1 negocio funcionando.

---

## 🏗️ 3. Arquitectura Técnica "Antigravedad" + R3F

Esta arquitectura garantiza **mantenimiento bajo y escalabilidad masiva** sin costos fijos altos.

### 3.1. El Stack de Desarrollo

| Componente | Tecnología | Propósito | Costo |
|:---|:---|:---|:---|
| **Entorno & Deploy** | Project IDX (Google Cloud) + Vercel | Desarrollo en la nube, despliegue global instantáneo | $0 (IDX) + $0-20 (Vercel) |
| **Motor Gráfico** | React Three Fiber (R3F) + Drei | El corazón del configurador 3D | $0 |
| **Optimización de Assets** | gltfjsx (npx gltfjsx model.glb --transform) | Reduce modelos 3D entre 70% y 90% | $0 |
| **Estado Global** | Zustand | Maneja cambios de color/tamaño sin re-renderizar todo el canvas | $0 |
| **Backend & DB** | Supabase (PostgreSQL) | Guarda configuraciones de usuarios y gestiona autenticación | $0-25 |
| **Automatización** | n8n | Orquestador de pedidos, facturación y notificaciones | $0-20 |
| **Servicio de Impresión** | Moonraken API + OctoPrint | Control remoto de las mini impresoras 3D | $0 |

> 🔥 **CONSEJO PARA UN MANTENIMIENTO CERo:** La mejor manera de no tener que mantener algo es que otros lo mantengan por ti. Siempre que sea posible, usa herramientas serverless: Supabase (base de datos administrada), n8n en la nube, Vercel (frontend administrado). Tu código se reduce a la lógica de negocio y el motor 3D.

### 3.2. Flujo de Datos Técnico (End-to-End)

```
Cliente (Carpintero/Instalador) ──► Sube foto de su madera/tela
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │ Servidor de Texturizado │
                              │ (Node.js + Sharp)       │
                              │ • Convierte imagen a    │
                              │   textura repetible     │
                              │ • Optimiza tamaño       │
                              └───────────┬─────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │ React Three Fiber       │
                              │ (Cliente Web)           │
                              │ • Aplica textura al     │
                              │   modelo 3D             │
                              │ • Renderiza en tiempo   │
                              │   real con luces/sombras│
                              └───────────┬─────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │ Zustand (Estado Global) │
                              │ • Guarda configuración  │
                              │   del usuario           │
                              │ • Sincroniza con UI     │
                              └───────────┬─────────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
              ▼                           ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐       ┌─────────────────────┐
    │ Botón "Pedir"   │         │ Botón "Exportar"│       │ Botón "Compartir"   │
    │ → n8n genera    │         │ → Descarga      │       │ → Genera video      │
    │   cotización    │         │   plano PDF     │       │   MP4 del mueble    │
    │   + factura     │         │   con medidas   │       │   para Instagram    │
    └─────────────────┘         └─────────────────┘       └─────────────────────┘
```

### 3.3. El Secreto del Rendimiento: Instancing + GLTFJSX

Dos técnicas son críticas para que la experiencia 3D no sea lenta:

**A. Instancing (Drei/Instances):** Cuando tienes múltiples objetos iguales (ej. múltiples sillas en una mesa), cada `<mesh>` genera una "draw call" al GPU. Con `<Instances>`, reduces 50 draw calls a 1 sola, pasando de 8 FPS a 60 FPS fluidos.

**B. GLTFJSX con transformación:** El comando `npx gltfjsx model.glb --transform` comprime, optimiza y convierte tu modelo en un componente React reutilizable, reduciendo el tamaño del archivo hasta en un 90%.

### 3.4. La "Plataforma Beta": Código Cero, Ingresos Ahora

Olvida el desarrollo complejo. El objetivo es vender una solución que ya es funcional.

| Componente | Función en el MVP | Costo Mensual |
|:---|:---|:---|
| **Tally.so** | Formulario de captura de clientes potenciales (leads) | $0 |
| **n8n** (Render Starter) | Orquestador de pedidos y facturación | $7 |
| **Google Sheets** | Base de datos de clientes (simple) | $0 |
| **Gemini API** | Asistente de soporte automatizado | ≈$5 |
| **Resend** | Envío de correos de confirmación | $0 (3,000 emails/mes) |
| **Vercel** | Landing page y directorio público | $0 |

**Total fijo mensual para operar el MVP:** ≈$12.

---

## 👑 4. El "Super Usuario" y la Arquitectura de Autogestión

El objetivo es que el código **no se toque** para el mantenimiento diario. Todo lo que un cliente necesita cambiar debe ser autogestionable desde un panel. Para ello, implementamos tres portales diferenciados:

### 4.1. Portal del Administrador (Tú – Super Usuario)

Tu herramienta de control central, construida con **Retool** (plan gratuito suficiente para empezar), te permite:

| Funcionalidad | Descripción | Frecuencia de Uso |
|:---|:---|:---|
| **Gestión de Prompts de IA** | Editar el comportamiento del asistente Gemini de TODOS los clientes desde un solo lugar | Semanal (mejoras) |
| **Monitoreo de Uso de API** | Ver cuántas consultas procesó cada cliente este mes | Diario (5 min) |
| **Logs de Errores** | Revisar qué webhooks fallaron y por qué | Diario (10 min) |
| **Gestión de Planes** | Activar/desactivar clientes, cambiar suscripciones | Semanal |
| **Dashboard de Ingresos** | Ver MRR, clientes nuevos, churn | Diario |

**Ventaja:** Nunca tocas el código de producción para cambios de contenido o configuración. Todo se maneja desde Retool + variables de entorno.

### 4.2. Portal del Cliente (El Instalador/Carpintero)

El instalador accede a su propio panel donde gestiona autónomamente su negocio:

| Módulo | Funcionalidad | Cómo se Implementa sin Tocar Código |
|:---|:---|:---|
| **Perfil de Anuncio** | Subir logo, descripción, enlace web | Formulario → guarda en Supabase → se muestra en el directorio automáticamente |
| **Base de Datos de Clientes** | Añadir, editar o eliminar clientes | Interfaz visual en Retool embebida o Supabase Table Editor |
| **Banner Publicitario** | Subir imagen para pie de correo | Subida a Supabase Storage → n8n actualiza el prompt de Gemini |
| **Estadísticas** | Ver cuántas consultas procesó el bot este mes | Dashboard simple con datos de Supabase |

**Tecnología:** Supabase (PostgreSQL) + Retool embebido (gratis). El cliente nunca ve el código.

### 4.3. Marketplace de Planos 3D (Expansión futura)

Vendedores externos (diseñadores 3D freelance) pueden subir sus modelos y recibir comisiones automáticas.

| Funcionalidad | Automatización |
|:---|:---|
| **Subida de modelo GLB** | El vendedor sube archivo → Supabase Storage |
| **Conversión automática** | n8n ejecuta `npx gltfjsx model.glb --transform` para optimizar |
| **Precio y venta** | Stripe Connect → comisión automática para SolarFluidity |
| **Notificación al comprador** | Resend envía enlace de descarga |

---

## 💰 5. Modelo de Negocio Simplificado (2 Planes + Hardware)

Para Costa Rica, la simplicidad es clave. Eliminamos el plan intermedio. O eres un artesano individual o eres un negocio establecido.

### 5.1. Planes de Software

| Plan | Precio Mensual USD | Precio Mensual CRC (aprox) | Incluye | Objetivo |
|:---|:---|:---|:---|:---|
| **Taller Maker** | $29 | ₡15,500 | 1 producto configurable, carga de texturas propias, botón "Pedido por WhatsApp" | Artesanos individuales, emprendedores de Instagram |
| **Industrial Pro** | $79 | ₡42,000 | Hasta 10 productos, exportación de planos PDF, generación automática de videos 360°, embed sin marca | Mueblerías establecidas, talleres de soldadura, empresas de exhibición |

**Validación de ingresos:** Con solo 20 clientes en el plan `Taller Maker`, cubres todos tus costos operativos y generas ≈$580 USD/mes pasivos. Con 10 clientes en `Industrial Pro`, generas ≈$790 USD/mes adicionales.

### 5.2. Hardware: Mini Impresora 3D "Fluidity Forge"

No vendes impresoras genéricas. Vendes una **herramienta llave en mano** para que el carpintero fabrique sus diseños.

| Especificación | Detalle |
|:---|:---|
| **Base** | Impresora 3D estilo Prusa Mini (open source) |
| **Firmware** | Marlin (open source, compatible con Klipper)|
| **Software de Control** | OctoPrint + Moonraken API (para control remoto desde el SaaS) |
| **Precio de Venta al Cliente** | $350 - $500 (instalada, calibrada, con garantía de 6 meses) |
| **Margen por Unidad** | ≈$150 - $250 |

**Cómo se vende:** Como upsell dentro del plan `Industrial Pro`. "¿Ya digitalizaste tu inventario? Ahora fábrica tus piezas personalizadas con nuestra impresora preconfigurada."

### 5.3. El Caso de Éxito "Baika" (Prueba de Concepto Validada)

La empresa costarricense **Baika** ha validado que el mercado de muebles personalizados en Costa Rica es real y rentable. Sus piezas (como el sillón Baika de 3 plazas revestido en madera de castaño oscuro) demuestran que:

- Los clientes costarricenses **están dispuestos a pagar precios premium** por muebles únicos y personalizados.
- Ofrecen explícitamente la opción de personalización: *"Podemos personalizar el tamaño, color, altura, medidas y materiales"*.
- Utilizan **plataformas digitales (1stdibs, Lagu.shop)** para vender internacionalmente, demostrando que el canal online funciona para este nicho.

**Lección para SolarFluidity:** Si Baika puede vender muebles personalizados de alta gama sin un configurador 3D, imagina lo que podrás lograr *con* uno. Tu tecnología es el multiplicador de su modelo de negocio.

---

## 📈 6. Validación de Mercado y Tamaño de Oportunidad

### 6.1. TAM (Mercado Total Abordable)

El mercado de muebles en Costa Rica proyecta un crecimiento anual superior al 9% hasta 2026. Solo en la provincia de San José, existen **195 fabricantes de muebles** registrados. Si consideramos que al menos el 20% de estos fabricantes podrían beneficiarse de un configurador 3D:

- **Clientes potenciales SaaS:** ≈40 empresas solo en San José.
- **Clientes adicionales en otras provincias:** ≈30 empresas adicionales.
- **TAM inicial:** ≈70 empresas de muebles en Costa Rica.

### 6.2. SAM (Mercado Potencial Atendible)

No todos los fabricantes tienen el perfil para pagar un SaaS. Segmentamos por:

| Categoría | Cantidad Estimada | Perfil | Potencial de Conversión |
|:---|:---|:---|:---|
| **Mueblerías de alta gama** (Escazú, Santa Ana, Zona Sur) | 15-20 | Presencia digital activa, venden en línea, precios premium | Alta (30-40%) |
| **Talleres con redes sociales activas** | 20-30 | Venden por Instagram, necesitan destacar visualmente | Media (15-25%) |
| **Mueblerías tradicionales** (sin presencia digital) | 20-30 | Venden por referencia y catálogo físico | Baja (5-10%) |

**SAM realista:** ≈30-40 empresas con alto potencial de conversión.

### 6.3. Proyección de Ingresos Realista (Año 1)

| Métrica | Mes 1 | Mes 3 | Mes 6 | Mes 12 |
|:---|:---|:---|:---|:---|
| Clientes `Taller Maker` ($29) | 3 | 8 | 15 | 25 |
| Clientes `Industrial Pro` ($79) | 0 | 2 | 5 | 10 |
| Unidades de hardware vendidas | 0 | 0 | 2 | 5 |
| **MRR (SaaS)** | $87 | $390 | $830 | $1,515 |
| **Ingreso por hardware (único)** | $0 | $0 | $500 | $1,250 |
| **Total Acumulado Año 1** | $87 | $1,224 | $4,980 | ≈$19,500 |

**Objetivo para Año 2:** 60 clientes SaaS + 20 unidades de hardware → MRR ≈$2,500 + ingreso hardware ≈$5,000 → Total ≈$35,000 anuales.

---

## 🚀 7. Plan de Ejecución por Fases (6 Meses)

### Fase 1 – "Patient Zero" (Semanas 1-2)

Tu primer cliente eres tú mismo. Digitaliza UNO de tus muebles como prueba de concepto.

| Día | Actividad | Herramientas | Tiempo |
|:---|:---|:---|:---|
| 1 | Modelar UN mueble en Blender (optimizado, bajo poligonaje) | Blender | 4h |
| 2-3 | Configurar proyecto en Project IDX, instalar React Three Fiber | IDX, npm | 2h |
| 3-4 | Crear escena R3F (luces, sombras, OrbitControls) | R3F, Drei | 4h |
| 4-5 | Implementar cambio de textura con clic (Zustand para estado) | Zustand | 2h |
| 6 | Ejecutar `npx gltfjsx model.glb --transform` para optimizar | gltfjsx | 1h |
| 7 | Integrar en landing page de Next.js y desplegar en Vercel | Vercel | 2h |

### Fase 2 – Abstracción SaaS (Semanas 3-4)

Convertir tu código personalizado en una plataforma multiusuario.

| Actividad | Detalle | Tiempo |
|:---|:---|:---|
| Configurar Supabase (auth, base de datos) | Tablas: users, products, textures, subscriptions | 2h |
| Hacer el configurador multi-tenant | Cargar texturas desde Supabase según usuario | 3h |
| Crear panel de administración en Retool | Gestión de clientes, texturas, logs | 2h |
| Conectar n8n para automatizar bienvenidas y facturación | Webhooks + Stripe | 2h |

### Fase 3 – Hardware como Upsell (Semanas 5-8)

Introducir las mini impresoras 3D como oferta complementaria.

| Actividad | Detalle | Tiempo |
|:---|:---|:---|
| Configurar impresora de prueba | Compra una mini impresora (ej. Kingroon KLP1) | 1h |
| Instalar OctoPrint en Raspberry Pi | Control remoto de la impresora | 2h |
| Integrar API Moonraken con n8n | Para iniciar impresiones desde el SaaS | 3h |
| Crear oferta de hardware en la landing page | "Lleva tu diseño al mundo físico" | 1h |

### Fase 4 – Directorio y Marketplace de Planos (Semanas 9-12)

Escalar el negocio con contenido generado por usuarios.

| Actividad | Detalle | Tiempo |
|:---|:---|:---|
| Crear tabla `marketplace_products` en Supabase | Modelos 3D de terceros | 1h |
| Construir página pública del directorio | Lista de carpinteros destacados | 2h |
| Implementar subida de planos para vendedores externos | Panel en Retool | 2h |
| Configurar Stripe Connect para comisiones | Pagos automáticos a vendedores | 2h |

---

## 📊 8. Análisis de Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|:---|:---|:---|:---|
| **Curva de aprendizaje R3F** | Alto (proyecto se retrasa 2-3 semanas) | Media | No intentes hacer fotorrealismo nivel cine al inicio. Usa materiales PBR estándar y buena iluminación HDRI. |
| **Rendimiento en celulares** | Medio (usuarios frustrados) | Alta | Usa `drei/PerformanceMonitor` para bajar calidad gráfica automáticamente si detecta un celular lento. |
| **Creación de modelos 3D** | Alto (cuello de botella) | Alta | Ofrece el servicio de modelado como pago único extra ($50-$100 por modelo). Externaliza a freelancers. |
| **Adopción lenta del hardware** | Medio (inventario parado) | Media | Empieza con pedidos bajo demanda (preventa con depósito). No mantengas inventario grande. |
| **Competencia de Zakeke/Configurators** | Medio (alternativas más baratas) | Media | Zakeke cobra $69-149/mes por su 3D configurator, pero su calidad de render no es premium. Tu ventaja es la fidelidad visual + hardware integrado. |
| **Costo oculto de Render gratis** | Bajo (servicio se duerme) | Baja | Usa Render Starter ($7/mes) para evitar suspensiones y cold starts. No dependas de UptimeRobot (Render penaliza esta práctica). |

---

## 💎 9. Conclusión: Por Qué Este Es el Mejor Enfoque Estratégico

**Has pasado de tener una idea difusa a tener un Plan Maestro de Ejecución.** Este documento no es teoría; es un plano de construcción.

**Las 5 ventajas competitivas que construyes:**
1. **Margen infinito en software:** El SaaS escala sin costo marginal.
2. **Control total de la tecnología:** Nadie te puede cambiar las reglas de precio como Zakeke.
3. **Hardware como barrera de entrada:** Un cliente con tu impresora no se cambia a otro software.
4. **Marketplace como efecto de red:** Más vendedores atraen más compradores, más compradores atraen más vendedores.
5. **Propiedad intelectual vendible:** Este código vale dinero. Es un activo patrimonial.

**El orden de ejecución es la clave del éxito:**
1. **Ahora:** Lanza el SaaS de configuración con tu propio mueble como caso de estudio.
2. **En 3 meses:** Añade mini impresoras 3D como upsell para tus clientes SaaS.
3. **En 6 meses:** Abre el directorio y marketplace para que terceros aporten contenido.

> 📞 **Próximo Paso Inmediato:** Abre Blender. Necesitas el modelo 3D (archivo `.glb`) de TU mueble más vendido. Ese es el inicio de todo.

---

## 📁 10. Estructura del Proyecto

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
