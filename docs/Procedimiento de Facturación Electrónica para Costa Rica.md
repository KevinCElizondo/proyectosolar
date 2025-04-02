# Guía de Generación de Estructura de Factura Electrónica (XML) para Costa Rica - Solar Fluidity

**Fecha de entrada en vigencia:** 1 de Abril de 2025 (Versión Actual)

## 1. Introducción

Esta guía describe el proceso de generación de la estructura de factura electrónica (archivo XML) en Costa Rica para los usuarios de Solar Fluidity, conforme a los requisitos de la Dirección General de Tributación (DGT) del Ministerio de Hacienda (versión 4.3).

**Alcance Importante:** Solar Fluidity **genera el archivo XML** con la estructura correcta. **El usuario es responsable de firmar digitalmente este archivo y enviarlo a Hacienda** a través de sus propios medios. Solar Fluidity no se conecta directamente con Hacienda para el envío ni realiza la firma digital en esta versión.

## 2. Requisitos Legales Clave

- La facturación electrónica es obligatoria para todas las empresas en Costa Rica.
- Se debe generar un archivo XML que cumpla con el esquema y validaciones definidas por Hacienda.
- El archivo XML debe ser firmado digitalmente con un certificado válido emitido a nombre del contribuyente.
- El archivo XML firmado debe ser enviado a Hacienda para su validación.
- El emisor debe gestionar los acuses de recibo (aceptación/rechazo) de Hacienda.

## 3. Configuración Inicial en Solar Fluidity

1.  **Datos Fiscales:**
    *   Acceder a "Configuración > Empresa".
    *   Ingresar los datos fiscales requeridos: nombre o razón social, cédula física/jurídica, dirección, actividad económica principal, régimen tributario, etc. Asegúrate de que estos datos coincidan exactamente con tu registro en Hacienda.
2.  **Numeración Consecutiva:**
    *   Solar Fluidity gestiona automáticamente la numeración consecutiva de los documentos generados dentro de la plataforma. Verifica la configuración inicial en "Configuración > Facturación".
3.  **(Futuro) Certificado Digital:**
    *   La funcionalidad para cargar y utilizar el certificado de firma digital directamente en Solar Fluidity está planificada para futuras versiones. Actualmente, la firma debe realizarse fuera de la plataforma.

## 4. Proceso de Generación del XML de la Factura

1.  **Crear Nueva Factura:**
    *   Ve a "Facturación > Emitir Factura".
    *   Completa la información requerida:
        *   **Cliente:** Selecciona un cliente existente o crea uno nuevo (asegúrate de incluir cédula/identificación y correo electrónico si deseas enviarle el XML/PDF).
        *   **Condición de Venta:** Contado, Crédito, etc.
        *   **Medio de Pago:** Efectivo, Transferencia, Tarjeta, etc.
        *   **Líneas de Detalle:** Añade cada producto o servicio con descripción, cantidad, unidad de medida, precio unitario, descuentos (si aplica), y el código de impuesto correspondiente (IVA 13%, 4%, 2%, 1%, 0%, Exento). Solar Fluidity calculará los subtotales y el impuesto.
        *   **Moneda:** Selecciona la moneda de la transacción.
        *   **(Opcional) Vincular Proyecto:** Asocia la factura a un proyecto gestionado en la plataforma.
        *   **(Opcional) Notas:** Añade cualquier observación relevante.
2.  **Validación Preliminar:**
    *   Solar Fluidity realiza validaciones básicas de formato y datos requeridos antes de generar el XML.
3.  **Generar Estructura XML:**
    *   Haz clic en "Generar XML".
    *   La plataforma, con ayuda de los Agentes IA, construirá el archivo XML siguiendo la estructura v4.3 de Hacienda.
4.  **Descargar XML:**
    *   Una vez generado, podrás descargar el archivo XML a tu computadora. El estado de la factura cambiará a "XML Generado".

## 5. Pasos Posteriores (Realizados por el Usuario fuera de Solar Fluidity)

1.  **Firma Digital del XML:**
    *   Utiliza tu software de firma digital preferido (ej. Firma Digital del BCCR, software de terceros) y tu certificado digital vigente para firmar el archivo XML descargado de Solar Fluidity.
2.  **Envío a Hacienda:**
    *   Envía el archivo XML **firmado** a Hacienda a través del medio que utilices (ATV, sistema de facturación conectado a Hacienda, etc.).
3.  **Gestión de Acuses de Recibo:**
    *   Monitorea la respuesta de Hacienda (aceptación o rechazo) a través del medio de envío que utilizaste.
4.  **(Opcional) Envío al Cliente:**
    *   Puedes enviar el XML firmado y su representación gráfica (PDF, que puedes generar tú mismo o con otras herramientas) a tu cliente por correo electrónico u otro medio.

## 6. Generación de Notas de Crédito y Débito

- El proceso es similar al de la factura:
    1.  Ve a "Facturación > Emitir Nota de Crédito/Débito".
    2.  Selecciona la factura original a la que hace referencia la nota.
    3.  Completa los detalles de la nota (motivo, montos a ajustar).
    4.  Genera y descarga el XML de la nota.
    5.  **Realiza los pasos de firma y envío a Hacienda fuera de Solar Fluidity.**

## 7. Resolución de Problemas Comunes

### Error al Generar XML en Solar Fluidity
- **Causa Posible:** Datos incompletos o incorrectos en la factura (ej. falta cédula del cliente, código de impuesto inválido).
- **Solución:** Revisa cuidadosamente todos los campos de la factura en Solar Fluidity y corrige la información faltante o errónea antes de intentar generar el XML nuevamente. Consulta los mensajes de error proporcionados por la plataforma.

### XML Rechazado por Hacienda (Después de Firmar y Enviar)
- **Causa Posible:** Inconsistencias entre los datos de la factura y tu registro en Hacienda, errores estructurales no detectados inicialmente, problemas con la firma digital.
- **Solución:** Revisa el mensaje de rechazo de Hacienda. Verifica tus datos fiscales en Solar Fluidity y en Hacienda. Si el problema es estructural, reporta el error a soporte@solarfluidity.com con los detalles. Si es un problema de firma, verifica tu certificado y proceso de firma. Deberás generar una nota de crédito para anular el documento rechazado y emitir uno nuevo corregido.

## 8. Automatización con Agentes IA / Python

- Los Agentes IA pueden asistir en la validación de datos antes de generar el XML.
- Se pueden configurar flujos para generar borradores de facturas basados en hitos de proyectos completados (requieren revisión humana antes de generar el XML final).
- Se pueden automatizar recordatorios internos o para clientes sobre facturas cuyo XML ha sido generado pero que podrían no haber sido enviadas/pagadas (basado en estados manuales o fechas).

## 9. Contacto y Soporte

Para consultas sobre la generación de la estructura XML de facturación electrónica, contacta a:
- **Soporte Técnico:** soporte@solarfluidity.com
- **Chat en vivo** (dentro de la plataforma)

**Última actualización:** 1 de Abril de 2025