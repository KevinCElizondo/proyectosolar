# Preguntas Frecuentes (FAQ) - Solar Fluidity

## Índice

1. [General](#general)
2. [Facturación Electrónica Offline](#facturación-electrónica-offline)
3. [Gestión de Proyectos Solares](#gestión-de-proyectos-solares)
4. [Automatizaciones con n8n](#automatizaciones-con-n8n)
5. [Soporte Técnico](#soporte-técnico)
6. [Planes y Facturación](#planes-y-facturación)

---

## General

### ¿Qué es Solar Fluidity?

Solar Fluidity es una plataforma SaaS (Software as a Service) especializada para empresas del sector solar y electromecánico en Costa Rica, que integra tres funcionalidades principales:
- Facturación electrónica con capacidad offline
- Gestión de proyectos solares y electromecánicos
- Automatización de procesos con n8n

### ¿Cómo funciona Solar Fluidity en modo offline?

Solar Fluidity implementa tecnología PWA (Progressive Web App) que permite:
1. Descargar y almacenar localmente los datos esenciales para su operación
2. Generar documentos fiscales válidos sin conexión a internet
3. Gestionar proyectos solares en campo
4. Sincronizar automáticamente toda la información al recuperar conectividad

### ¿En qué dispositivos puedo utilizar Solar Fluidity?

Solar Fluidity funciona en:
- Computadoras (Windows, macOS, Linux)
- Tablets (iOS, Android)
- Smartphones (iOS, Android)

Solo necesita un navegador moderno como Chrome, Firefox, Safari o Edge.

### ¿Necesito instalación especial para usar Solar Fluidity?

No. Al ser una PWA, puede acceder directamente desde el navegador en app.solarfluidity.com. Para un mejor rendimiento offline, su navegador le ofrecerá la opción de "Instalar" la aplicación, lo que creará un acceso directo en su dispositivo.

---

## Facturación Electrónica Offline

### ¿Cómo puedo emitir facturas electrónicas sin conexión a internet?

Solar Fluidity utiliza el mecanismo de contingencia autorizado por el Ministerio de Hacienda:
1. La aplicación detecta automáticamente la falta de conectividad
2. Activa el modo de contingencia según la resolución DGT-R-033-2019
3. Permite generar documentos con numeración especial
4. Almacena localmente los documentos firmados
5. Sincroniza con Hacienda al recuperar conexión

### ¿Los documentos generados offline son válidos ante Hacienda?

Sí. Los documentos generados en modo contingencia cumplen con todos los requisitos establecidos por la normativa fiscal costarricense, incluyendo:
- Estructura XML válida según esquemas oficiales
- Firma digital mediante certificado autorizado
- Numeración según protocolo de contingencia
- Indicación específica de emisión contingente

### ¿Cómo configuro mi certificado digital para uso offline?

1. Vaya a "Configuración > Facturación Electrónica > Certificados"
2. Cargue su certificado .p12
3. Ingrese la contraseña del certificado
4. Active la opción "Permitir uso offline"
5. Establezca un PIN adicional para mayor seguridad (opcional)

### ¿Qué sucede si emito una factura offline y luego no tengo conexión por varios días?

Solar Fluidity almacena de forma segura todos los documentos emitidos offline y los mantiene en cola de sincronización. La normativa costarricense establece un plazo de 2 días hábiles para enviar los documentos emitidos en contingencia, pero el sistema intentará sincronizar tan pronto como detecte conectividad.

### ¿Puedo anular facturas emitidas en modo offline?

Sí. Puede generar notas de crédito electrónicas (NC) referenciando las facturas emitidas offline. Estas NC también se mantendrán en cola de sincronización si continúa sin conexión.

### ¿Cómo manejo las facturas recibidas de proveedores estando offline?

Puede registrar manualmente las facturas recibidas en "Documentos > Recibidos > Nuevo" y posteriormente, al recuperar conexión, confirmar electrónicamente su aceptación mediante mensaje receptor.

### ¿Qué sucede si hay un conflicto de numeración al sincronizar?

El sistema tiene un mecanismo inteligente de resolución de conflictos que:
1. Detecta duplicidades o inconsistencias
2. Aplica reglas de negocio para resolver automáticamente cuando es posible
3. Solicita intervención manual cuando es necesario, presentando opciones de resolución

---

## Gestión de Proyectos Solares

### ¿Puedo diseñar sistemas solares sin conexión a internet?

Sí. Solar Fluidity incluye herramientas de diseño que funcionan offline:
- Calculadora de dimensionamiento con datos precargados de radiación solar para Costa Rica
- Catálogo de equipos disponible offline (paneles, inversores, baterías)
- Templates de diseño para configuraciones comunes
- Herramientas básicas de dibujo y diagramación

### ¿Cómo gestiono proyectos en campo cuando no hay conectividad?

La aplicación permite:
1. Acceder a datos completos del proyecto previamente sincronizados
2. Actualizar estados de tareas y cronogramas
3. Capturar fotos y documentarlas directamente en el proyecto
4. Registrar horas de trabajo y materiales utilizados
5. Obtener firmas digitales de clientes para aprobaciones
6. Sincronizar todo el progreso cuando recupere conectividad

### ¿Puedo hacer cálculos de rendimiento solar sin conexión?

Sí. El sistema incluye:
- Datos históricos de radiación solar para diferentes zonas de Costa Rica
- Algoritmos simplificados de cálculo que funcionan localmente
- Factores de corrección preestablecidos para diferentes tipos de instalaciones
- Estimaciones de producción mensual y anual

### ¿Cómo manejo el inventario de equipos solares?

Solar Fluidity permite:
1. Administrar su inventario completo de equipos
2. Realizar reservas de equipos para proyectos específicos
3. Generar órdenes de compra a proveedores
4. Registrar movimientos de entrada/salida
5. Escanear códigos de serie para seguimiento
6. Notificar sobre niveles bajos de stock

### ¿Puedo generar propuestas comerciales para clientes sin internet?

Sí. Puede crear propuestas completas que incluyen:
- Diseño preliminar del sistema
- Listado de equipos recomendados
- Estimación de producción energética
- Análisis financiero (ROI, tiempo de recuperación)
- Presupuesto detallado
- Cronograma estimado de implementación

Estas propuestas se pueden exportar a PDF para compartir con el cliente inmediatamente.

---

## Automatizaciones con n8n

### ¿Qué tipo de procesos puedo automatizar con Solar Fluidity?

Las automatizaciones más comunes incluyen:
- Envío automático de facturas recurrentes
- Notificaciones de pagos pendientes
- Alertas de vencimiento de certificados
- Generación y distribución de reportes
- Recordatorios de mantenimiento de instalaciones solares
- Actualizaciones automáticas de estado de proyectos
- Sincronización con otros sistemas (contabilidad, CRM)

### ¿Cómo funcionan las automatizaciones cuando no hay internet?

Las automatizaciones en n8n están diseñadas para:
1. Detectar la falta de conectividad
2. Encolar las tareas pendientes
3. Ejecutar localmente las que no requieren conexión
4. Completar el resto cuando se recupera la conectividad
5. Notificar sobre cualquier acción pendiente o completada

### ¿Necesito conocimientos técnicos para configurar automatizaciones?

No. Solar Fluidity incluye:
- Plantillas predefinidas para casos de uso comunes
- Editor visual intuitivo de flujos de trabajo
- Asistentes paso a paso para configuraciones
- Documentación detallada con ejemplos

Para casos más complejos, nuestro equipo de soporte puede ayudarle a implementar flujos personalizados.

### ¿Puedo integrar Solar Fluidity con otros sistemas mediante n8n?

Sí. n8n permite integraciones con:
- Software contable (QuickBooks, Xero, etc.)
- CRM (Salesforce, HubSpot, etc.)
- Herramientas de comunicación (Email, WhatsApp, SMS)
- Almacenamiento en la nube (Google Drive, Dropbox)
- Hojas de cálculo (Google Sheets, Excel)
- Aplicaciones mediante webhooks y APIs

### ¿Las automatizaciones consumen recursos adicionales de mi plan?

Las automatizaciones básicas están incluidas en todos los planes. Sin embargo, algunas integraciones avanzadas o con alto volumen de ejecución pueden requerir complementos. Consulte la sección de "Planes y Facturación" para más detalles.

---

## Soporte Técnico

### ¿Qué opciones de soporte ofrece Solar Fluidity?

Ofrecemos múltiples canales de soporte:
- Chat en vivo (horario 8am-5pm días hábiles)
- Correo electrónico (soporte@solarfluidity.com)
- Base de conocimientos (docs.solarfluidity.com)
- Videotutoriales (youtube.com/solarfluidity)
- Soporte telefónico para planes Premium y Enterprise

### ¿Cómo reporto un problema técnico?

1. En la aplicación, vaya a "Ayuda > Reportar Problema"
2. Complete el formulario detallando el problema
3. Adjunte capturas de pantalla si es relevante
4. Opcionalmente active la opción "Incluir Logs" para diagnóstico avanzado
5. Envíe el reporte

También puede contactarnos directamente por correo o chat.

### ¿Ofrecen capacitación para nuevos usuarios?

Sí. Ofrecemos:
- Sesiones de inducción gratuitas para nuevos clientes
- Webinars periódicos sobre funcionalidades
- Capacitación personalizada para equipos (con costo adicional)
- Recursos de autoformación (videos, tutoriales, guías)

### ¿Cómo recibo actualizaciones y novedades sobre la plataforma?

Las actualizaciones se notifican a través de:
- Notificaciones en la aplicación
- Correo electrónico (si está suscrito)
- Blog oficial (blog.solarfluidity.com)
- Redes sociales (@SolarFluidity)

### ¿Qué hago si olvido mi contraseña estando offline?

Para prevenir esta situación:
1. Configure métodos alternativos de acceso (biométrico si su dispositivo lo permite)
2. Establezca un PIN de recuperación en "Configuración > Seguridad"
3. Mantenga sesiones activas por períodos más largos en dispositivos confiables

Si olvida su contraseña sin conexión, deberá esperar a recuperar conectividad para restablecerla.

---

## Planes y Facturación

### ¿Qué planes ofrece Solar Fluidity?

Ofrecemos planes diseñados para diferentes tamaños de negocio:

**Basic**
- Hasta 100 facturas/mes
- Hasta 5 proyectos activos
- Automatizaciones básicas
- 5GB almacenamiento

**Professional**
- Hasta 500 facturas/mes
- Hasta 15 proyectos activos
- Automatizaciones avanzadas
- 20GB almacenamiento
- Soporte prioritario

**Enterprise**
- Facturas ilimitadas
- Proyectos ilimitados
- Automatizaciones personalizadas
- 50GB+ almacenamiento
- Soporte dedicado
- API personalizada

### ¿Puedo cambiar de plan en cualquier momento?

Sí. Puede actualizar su plan en cualquier momento desde "Configuración > Facturación > Cambiar Plan". Los cambios se aplican inmediatamente y se prorratea el costo según el tiempo restante del ciclo de facturación.

Para downgrade a planes inferiores, el cambio se aplicará al final del ciclo de facturación actual.

### ¿Hay costos adicionales que deba considerar?

Los siguientes servicios pueden tener costos adicionales:
- Almacenamiento adicional más allá del incluido en su plan
- Integraciones especializadas con sistemas externos
- Desarrollos a medida de flujos complejos en n8n
- Capacitación presencial o dedicada
- Servicios de migración de datos

### ¿Ofrecen descuentos para ONG o instituciones educativas?

Sí. Ofrecemos planes especiales con descuentos para:
- Organizaciones sin fines de lucro
- Instituciones educativas
- Startups del sector energético
- Asociaciones profesionales

Contacte a ventas@solarfluidity.com para más información.

### ¿Qué métodos de pago aceptan?

Aceptamos:
- Tarjetas de crédito/débito (procesadas por PayPal o Stripe)
- Transferencia bancaria (SINPE para cuentas costarricenses)
- Pago por SINPE Móvil
- Depósito bancario

Para clientes Enterprise también ofrecemos facturación con crédito a 30 días.

### ¿La facturación también funciona offline?

La gestión de su suscripción requiere conexión a internet. Sin embargo, una vez activada, puede utilizar todas las funcionalidades offline durante el periodo contratado sin problemas.
