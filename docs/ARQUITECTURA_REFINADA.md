# Arquitectura Refinada y Estrategia de Implementación

Este documento detalla el "camino correcto" para el desarrollo y lanzamiento de **SolarFluidity**, integrando la estrategia técnica del SaaS CAD y el plan de negocio inicial para superar el "valle de la muerte".

## 1. El Esquema de Funcionamiento del Ecosistema

El ecosistema SolarFluidity no es solo un SaaS, sino un conjunto de tres piezas que se retroalimentan:

1. **SaaS CAD (Core):** El motor que genera los modelos 3D y permite la incrustación.
2. **Tienda de Hardware (Dogfooding):** La tienda de parrillas y camas de cultivo operada por ti mismo, que actúa como el primer y principal cliente (Plan Pro) del SaaS.
3. **Portal de Anuncios:** Un directorio curado donde los clientes Pro muestran su uso del configurador, sirviendo de marketing orgánico.

### El Flujo Financiero y Técnico
* **Financiación Inicial:** La Tienda de Hardware utiliza el SaaS para vender productos físicos. Estas ventas (proyectadas en ~$4,000 netos/mes) financian los servidores (Supabase, Stripe, n8n) y tu tiempo de desarrollo durante los primeros meses.
* **Validación (Dogfooding):** Cualquier bug en el SaaS se detectará primero en tu Tienda de Hardware. Si el configurador funciona para vender parrillas, funcionará para los clientes.
* **Adquisición SaaS:** Una vez estable, se abre la puerta a los **20 Early Adopters** seleccionados, ofreciéndoles un descuento del 70% para obtener feedback rápido y testimonios.

## 2. Camino Correcto de Implementación Técnica

Para no sobre-ingenierizar en fases tempranas, la implementación debe ser estrictamente secuencial:

### FASE 1: Core Engine (El Motor 3D) - Semanas 1 y 2
* **Objetivo:** Lograr que un cubo paramétrico se renderice sin congelar el navegador.
* **Acciones:**
  * Implementar el **Web Worker con OpenCascade.js** (Ver `OPENCASCADE_WORKER.md`).
  * Conectar los sliders de React al Worker.
  * Renderizar la malla devuelta con Three.js.
* **Métrica de Éxito:** Un usuario puede mover los sliders y el cubo cambia en tiempo real a 60fps.

### FASE 2: Autenticación y Dogfooding - Semanas 3 y 4
* **Objetivo:** Que la tienda de hardware pueda usar el motor.
* **Acciones:**
  * Configurar Supabase Auth (Magic Links).
  * Desarrollar el script `embed.js` para incrustar el visor.
  * Lanzar `solarfluiditystudio.store` usando el visor incrustado.
* **Métrica de Éxito:** Primera venta de una parrilla o cama de cultivo configurada en 3D.

### FASE 3: Generación por Imagen y Almacenamiento - Semanas 5 y 6
* **Objetivo:** Permitir a usuarios crear modelos fácilmente.
* **Acciones:**
  * Implementar la **Edge Function** `upload-to-3d` (Ver `EDGE_FUNCTION_UPLOAD_3D.md`).
  * Desarrollar el panel de usuario en Next.js para gestionar modelos subidos y sus parámetros.
* **Métrica de Éxito:** Un usuario sube una textura de madera y obtiene un cubo 3D con esa textura guardado en su cuenta.

### FASE 4: Early Adopters y Pagos - Semanas 7 a 10
* **Objetivo:** Adquirir los primeros usuarios B2B pagos.
* **Acciones:**
  * Integración con **Stripe**.
  * Crear la tabla de `coupons` en Supabase y generar los 20 códigos con 70% de descuento.
  * Contactar a FabLabs y Carpinteros.
* **Métrica de Éxito:** Los primeros 5 cupones canjeados y suscripciones Stripe activas.

### FASE 5: Portal de Anuncios - Semanas 11 y 12
* **Objetivo:** Generar comunidad y valor añadido al Plan Pro.
* **Acciones:**
  * Crear tabla `directory_requests`.
  * Desarrollar el panel de administración (solo para ti) para aprobar solicitudes.
  * Lanzar la página `/directory`.
* **Métrica de Éxito:** Los early adopters completan su perfil y aparecen públicamente con el badge de "Miembro Fundador".

## 3. Detalles Críticos a No Olvidar

* **El administrador no paga:** Como dueño, debes poder asignarte el rol de `admin` en la base de datos para no tener que pagar la suscripción ni gastar cupones en tus propias tiendas de prueba.
* **Protección del Worker:** La carga de `opencascade.wasm.js` es pesada (puede ser de 5-10MB). Debe estar cacheadamente agresivamente (por ejemplo, mediante Cloudflare o Vercel Edge Network) para que los clientes finales no sufran tiempos de carga largos.
* **Exportación STEP:** La generación de archivos `.step` ocurre del lado del Web Worker llamando a la API de escritura STEP de OpenCascade, la cual devuelve una cadena de texto que puede ser empaquetada en un Blob y descargada por el usuario.
* **Límites de Storage:** Asegúrate de implementar RLS (Row Level Security) en Supabase Storage para que un usuario solo pueda leer/borrar sus propios modelos, evitando abusos del espacio gratuito.
