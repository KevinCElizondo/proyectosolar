# Preguntas Frecuentes (FAQ) - Solar Fluidity

## Índice

1. [General](#general)
2. [Generación de Factura Electrónica (XML)](#generación-de-factura-electrónica-xml)
3. [Gestión de Proyectos Solares](#gestión-de-proyectos-solares)
4. [Automatizaciones con Agentes IA / Python](#automatizaciones-con-agentes-ia--python)
5. [Soporte Técnico](#soporte-técnico)
6. [Planes y Facturación](#planes-y-facturación)

---

## General

### ¿Qué es Solar Fluidity?

Solar Fluidity es una plataforma SaaS (Software as a Service) especializada para empresas del sector solar y electromecánico en Costa Rica, que integra tres funcionalidades principales:
- Generación de estructura de facturación electrónica (XML para Hacienda CR)
- Gestión de proyectos solares y electromecánicos
- Automatización de procesos con Agentes IA / Python

### ¿Solar Fluidity funciona sin conexión a internet?

Actualmente, Solar Fluidity requiere una conexión a internet para la mayoría de sus funciones, incluyendo la generación de la estructura XML de la factura y la interacción con los agentes de IA. La funcionalidad offline no está soportada en la versión inicial.

### ¿En qué dispositivos puedo utilizar Solar Fluidity?

Solar Fluidity funciona en:
- Computadoras (Windows, macOS, Linux)
- Tablets (iOS, Android)
- Smartphones (iOS, Android)

Solo necesita un navegador moderno como Chrome, Firefox, Safari o Edge.

### ¿Necesito instalación especial para usar Solar Fluidity?

No. Al ser una aplicación web, puede acceder directamente desde el navegador en la URL proporcionada (ej. app.solarfluidity.com). No requiere instalación local más allá del navegador.

---

## Generación de Factura Electrónica (XML)

### ¿Cómo genera Solar Fluidity la factura electrónica?

Solar Fluidity te permite ingresar los datos de tu factura (cliente, items, montos, impuestos, etc.) y genera el archivo XML correspondiente, siguiendo la estructura y validaciones requeridas por el Ministerio de Hacienda de Costa Rica (versión 4.3).

### ¿Solar Fluidity envía las facturas directamente a Hacienda?

No. Solar Fluidity **genera el archivo XML** con la estructura correcta requerida por el Ministerio de Hacienda de Costa Rica. **El usuario es responsable de firmar digitalmente este archivo XML** (utilizando su propio certificado y software de firma) **y enviarlo a Hacienda** a través de los medios que disponga (ej. ATV, software de terceros). Solar Fluidity no se conecta directamente con Hacienda para el envío.

### ¿Necesito mi propia firma digital para usar Solar Fluidity?

Sí. Para que la factura electrónica sea válida ante Hacienda, **necesitas tu certificado de firma digital vigente** para firmar el archivo XML generado por Solar Fluidity *antes* de enviarlo a Hacienda. Solar Fluidity **no realiza la firma digital** en su versión inicial; esta funcionalidad está planificada para futuras actualizaciones, donde se podría integrar el uso del certificado del usuario dentro de la plataforma.

### ¿Puedo generar la estructura XML sin conexión a internet?

No. La generación de la estructura XML requiere una conexión a internet para interactuar con la plataforma, validar los datos y utilizar los agentes IA. La funcionalidad offline no está soportada actualmente.

### ¿Puedo generar notas de crédito o débito?

Sí. Solar Fluidity permite generar la estructura XML para notas de crédito y notas de débito electrónicas, referenciando la factura original. Al igual que con las facturas, el usuario es responsable de firmar y enviar estos documentos a Hacienda.

### ¿Cómo manejo las facturas recibidas de proveedores?

Puedes registrar manualmente las facturas recibidas en la sección correspondiente para tu control interno. La confirmación electrónica (mensaje receptor) ante Hacienda deberá realizarse a través de los medios que dispongas, ya que Solar Fluidity no se conecta directamente con Hacienda para esta función.

### ¿Solar Fluidity gestiona la numeración consecutiva de las facturas?

Sí. Solar Fluidity gestiona automáticamente la numeración consecutiva de los documentos electrónicos (facturas, notas de crédito, notas de débito) que generas dentro de la plataforma, asegurando el cumplimiento de este requisito fiscal para los documentos emitidos desde el SaaS.

---

## Gestión de Proyectos Solares

### ¿Puedo diseñar sistemas solares sin conexión a internet?

Actualmente, las herramientas de diseño requieren conexión a internet para acceder a catálogos actualizados de equipos, datos de radiación precisos y funcionalidades completas de cálculo y diagramación.

### ¿Cómo gestiono proyectos en campo cuando no hay conectividad?

La gestión de proyectos (actualizar tareas, registrar horas, subir fotos, etc.) requiere conexión a internet para asegurar que toda la información esté actualizada y sincronizada en tiempo real para todos los miembros del equipo. No se recomienda realizar actualizaciones críticas sin conexión.

### ¿Puedo hacer cálculos de rendimiento solar sin conexión?

Los cálculos de rendimiento más precisos y las simulaciones requieren acceso a datos actualizados y modelos que se ejecutan en nuestros servidores, por lo que necesitan conexión a internet.

### ¿Cómo manejo el inventario de equipos solares?

Solar Fluidity permite (requiere conexión):
1. Administrar su inventario completo de equipos
2. Realizar reservas de equipos para proyectos específicos
3. Generar órdenes de compra a proveedores
4. Registrar movimientos de entrada/salida
5. Escanear códigos de serie para seguimiento
6. Notificar sobre niveles bajos de stock

### ¿Puedo generar propuestas comerciales para clientes sin internet?

La generación de propuestas requiere conexión a internet para acceder a la información más reciente de precios, inventario, plantillas y realizar cálculos financieros actualizados. Puede exportar propuestas generadas previamente a PDF para verlas sin conexión.

---

## Automatizaciones con Agentes IA / Python

### ¿Qué tipo de procesos puedo automatizar con Solar Fluidity?

Las automatizaciones gestionadas por los Agentes IA / Python pueden incluir:
- Envío programado de recordatorios de pago (basado en facturas generadas en el sistema)
- Notificaciones internas sobre hitos de proyectos próximos o vencidos
- Alertas de vencimiento de certificados (si se registran en el sistema)
- Generación y distribución interna de reportes de proyectos
- Actualizaciones automáticas de estado de proyectos basadas en reglas internas
- Sincronización básica con otros sistemas mediante APIs (si se configuran)

### ¿Cómo funcionan las automatizaciones cuando no hay internet?

Las automatizaciones gestionadas por los Agentes IA / Python requieren conexión a internet para ejecutarse, ya que dependen de la interacción con la plataforma, la base de datos (Supabase), los modelos de IA (Ollama/OpenAI) y potencialmente APIs externas.

### ¿Necesito conocimientos técnicos para configurar automatizaciones?

Solar Fluidity incluirá plantillas predefinidas para casos de uso comunes. La configuración de estas plantillas será guiada. Para flujos de trabajo muy personalizados o integraciones complejas, podría requerirse asistencia técnica o conocimientos básicos de lógica de flujos.

### ¿Puedo integrar Solar Fluidity con otros sistemas mediante Agentes IA / Python?

Sí, las automatizaciones pueden diseñarse para interactuar con APIs de otros sistemas (contabilidad, CRM, comunicación, etc.), siempre que estos sistemas ofrezcan APIs accesibles y se configuren las credenciales y lógica necesarias dentro de los flujos Python.

### ¿Las automatizaciones consumen recursos adicionales de mi plan?

Las automatizaciones básicas estarán incluidas en los planes. Flujos muy complejos, de alta frecuencia o que consuman muchos recursos de IA (ej. llamadas frecuentes a modelos de lenguaje) podrían tener límites o requerir complementos según el plan. Consulte la sección de "Planes y Facturación" para más detalles.

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

### ¿Qué hago si olvido mi contraseña?

Si olvida su contraseña, necesitará conexión a internet para utilizar el proceso de restablecimiento de contraseña a través de su correo electrónico desde la pantalla de inicio de sesión.

---

## Planes y Facturación

### ¿Qué planes ofrece Solar Fluidity?

Ofrecemos planes diseñados para diferentes tamaños de negocio:

**Basic**
- Generación de hasta 100 XML de facturas/mes
- Hasta 5 proyectos activos
- Automatizaciones básicas
- 5GB almacenamiento

**Professional**
- Generación de hasta 500 XML de facturas/mes
- Hasta 15 proyectos activos
- Automatizaciones avanzadas
- 20GB almacenamiento
- Soporte prioritario

**Enterprise**
- Generación de XML de facturas ilimitadas
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
- Desarrollos a medida de flujos complejos en Agentes IA / Python
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

### ¿La gestión de mi suscripción funciona sin conexión?

No. La gestión de su suscripción (cambiar plan, actualizar pago, etc.) y el acceso general a la plataforma requieren conexión a internet.
