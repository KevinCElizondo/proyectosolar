# Estado y Estructura del Proyecto: Solar Fluidity 3D (Versión 5.0)

Este documento centraliza el estado actual, la estructura del código y el mapa de ruta de las integraciones para **Solar Fluidity 3D (Modelo Freemium + Pro)**, enfocado en ser la plataforma definitiva de configuración 3D multi-tienda para fabricantes de muebles.

> **Última Actualización:** Finalización del MVP de la Semana 1.

---

## 🏗️ 1. Arquitectura y Stack Actual

El proyecto ha pivotado hacia un modelo SaaS puro (sin hardware físico de impresión 3D a cargo de nosotros) que aprovecha renderizado 3D en el cliente y backend serverless.

### Tecnologías Core
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui.
- **Motor 3D:** `@react-three/fiber` (R3F), `@react-three/drei`, `three.js`.
- **Estado Global:** `zustand`.
- **Backend y Autenticación:** Supabase (PostgreSQL, Magic Links, Storage).
- **Integraciones Críticas (En progreso / Planeadas):**
  - **Suscripciones B2B:** PayPal Server SDK (Facturación mensual recurrente).
  - **Facturación Electrónica:** Sistema estructurado para generar archivos XML compatibles con el Ministerio de Hacienda de Costa Rica.
  - **Orquestación:** n8n (o scripts internos MCP) para webhooks, automatización de recibos y notificaciones.
- **Optimización de Assets (Próximamente):** Cloudflare R2 + Draco (`gltf-transform`).

---

## 📂 2. Estructura Maestra de Archivos

A continuación, la estructura lógica de los módulos más importantes del sistema actual:

```text
proyectosolar/
├── .env                        # Variables de entorno (VITE_SUPABASE_URL, PAYPAL_LIVE, etc.)
├── schema.sql                  # Script SQL maestro para la creación de tablas y políticas RLS
├── public/
│   ├── embed.js                # [NUEVO] Script vital que los clientes incrustan en sus webs
│   └── favicon.ico, images...  # Assets estáticos públicos
├── docs/
│   ├── ESTRUCTURA_PROYECTO.md  # Este documento de referencia
│   ├── GUIA_DESPLIEGUE_VERCEL.md 
│   └── ...                     # Subcarpetas con documentación técnica e integraciones
├── scripts/                    # Scripts de integración y validación (PayPal, MCP)
│   ├── verify-paypal.js
│   ├── start_mcp_server.sh
│   └── ...
└── src/                        # Código Fuente Frontend
    ├── components/             # UI Reutilizable (shadcn) e integraciones visuales
    │   ├── ui/
    │   ├── PaymentButton/      # Botones de suscripción de PayPal
    │   └── ...
    ├── config/                 # Configuración de constantes y entornos
    ├── context/
    │   └── AuthContext.tsx     # [ACTUALIZADO] Gestiona sesión mediante Supabase Auth (Magic Links)
    ├── lib/
    │   └── supabase.ts         # [NUEVO] Inicialización del cliente Supabase
    ├── pages/
    │   ├── auth/
    │   │   └── MagicLinkAuth.tsx # [NUEVO] Interfaz de inicio de sesión sin contraseña
    │   ├── Dashboard.tsx       # [ACTUALIZADO] Panel Multi-Tienda (crear y gestionar subdominios)
    │   ├── embed/
    │   │   └── EmbedViewer.tsx # [NUEVO] Visor 3D incrustable (iframe target)
    │   ├── invoices/           # Módulo base para facturación y generación de XML (Hacienda CR)
    │   ├── projects/           # Módulo para gestión de proyectos
    │   └── payment/            # Vistas de checkout y redirecciones de pago
    ├── services/               # Lógica de negocio (Convex, PayPal API, etc.)
    └── App.tsx                 # Enrutador principal de la aplicación
```

---

## 🔗 3. Integraciones Estratégicas y Estado

El proyecto se diseñó para automatizar el 100% de la facturación y la entrega del servicio.

### A. Autenticación y Base de Datos (Supabase) - **✅ COMPLETADO (Semana 1)**
- **Auth:** Migrado a Supabase Magic Links (`MagicLinkAuth.tsx`). El cliente no necesita recordar contraseñas.
- **Tablas Creadas (`schema.sql`):** 
  - `stores`: Almacena subdominios, nombres, plan activo y variables de iluminación.
  - `products`: Almacena URLs a los `.glb`, texturas base y vinculación a una tienda.
  - `banners` y `coupons`: Para el plan Pro.
- **Próximo Paso:** Ejecutar el `schema.sql` en el panel de Supabase.

### B. Módulo de Renderizado 3D (React Three Fiber) - **⏳ EN CURSO (Semana 2)**
- **Estado Actual:** El archivo `EmbedViewer.tsx` carga de forma dinámica el nombre de la tienda y expone un Canvas 3D básico (cubo de prueba) que las empresas pueden incrustar con `embed.js`.
- **Próximo Paso:** Sustituir el cubo por el motor de carga de archivos `.glb` con Draco, implementar cambio dinámico de texturas a través de Zustand y enlazar las luces dinámicas a los parámetros de la tabla `stores`.

### C. Suscripciones y Pagos (PayPal) - **📅 PLANIFICADO (Semana 3)**
- **Visión:** Integración del SDK de PayPal (ya en `package.json`) para gestionar el modelo Freemium y Pro ($49/mes).
- **Flujo:** 
  1. El usuario hace clic en "Hacer Upgrade" en el Dashboard.
  2. PayPal procesa el cobro y dispara un webhook a nuestro backend (vía n8n o Edge Function).
  3. Se actualiza el campo `plan` a `'pro'` en la tabla `stores`.
- **Archivos Base:** Ya existen en `src/services/payment/` y `scripts/test-paypal.js`. Deben auditarse para alinear con el costo de $49/mes.

### D. Facturación Electrónica (Hacienda CR) - **📅 PLANIFICADO (Semana 3-4)**
- **Visión:** Cada vez que un usuario paga su suscripción Pro ($49), se debe emitir automáticamente una factura electrónica (XML) válida para el Ministerio de Hacienda.
- **Flujo:**
  1. Pago confirmado por PayPal.
  2. El módulo de facturación (ya estructurado en `src/pages/invoices` y servicios subyacentes) compila el XML UBL 2.1 con los datos tributarios del cliente.
  3. Supabase Storage guarda el PDF y el XML de respuesta de Hacienda.
  4. Resend (o el servicio SMTP configurado) envía la factura automáticamente al correo del usuario.

### E. Módulo de Afiliados y Upsell - **📅 PLANIFICADO (Semana 4)**
- Al eliminar el hardware propio, el plan de negocio escala usando recomendaciones de impresoras 3D (ej. Bambu Lab).
- **Archivos Base:** Los componentes `AmazonAffiliateSection.tsx` y `AmazonBanner.tsx` se reciclarán para inyectarse de forma no intrusiva en el panel gratuito.

---

## 📝 4. Checklist para "Continuar Otro Día"

Para retomar el proyecto exactamente donde lo dejamos con la mayor productividad posible, sigue estos pasos:

1. [ ] **Validar Base de Datos:** Entrar a Supabase (proyecto `rlqvkqaownzqelvxnhzd`) > SQL Editor y ejecutar el archivo `schema.sql` que se encuentra en la raíz del proyecto.
2. [ ] **Probar Flujo de Login:** 
   - Ejecutar `npm run dev`.
   - Navegar a `http://localhost:5173/auth/login`.
   - Ingresar correo y abrir el Magic Link desde tu bandeja (o desde los Inbucket/Logs de Supabase).
3. [ ] **Validar Creación de Tienda:** Dentro del Dashboard, crear una tienda llamada "Mi Pruebas 3D" y verificar que el subdominio se guarde en Supabase.
4. [ ] **Testear Iframe (Embed):** Copiar el snippet de "Código de Incrustación", pegarlo en un `.html` vacío en tu escritorio y confirmar que carga el visualizador 3D básico con el nombre de tu tienda.
5. [ ] **Iniciar Desarrollo 3D (Semana 2):** Solicitar al asistente que comience a estructurar el componente de carga GLB optimizado con Draco en `EmbedViewer.tsx`.

> *"La arquitectura base es sólida, escalable y serverless. El ecosistema está listo para recibir el núcleo gráfico 3D y las pasarelas de pago."*
