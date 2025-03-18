# **Guía de Facturación Electrónica Offline para Costa Rica - Solar Fluidity**

**Fecha de entrada en vigencia:** 18 de marzo de 2025

## **1. Introducción**
Esta guía describe el proceso de facturación electrónica offline en Costa Rica para los usuarios de Solar Fluidity, conforme a los requisitos de la Dirección General de Tributación (DGT) del Ministerio de Hacienda. La capacidad offline permite continuar operando cuando no hay conexión a internet o los servicios de Hacienda no están disponibles, asegurando la continuidad del negocio en todo momento.

## **2. Requisitos Legales**
- La facturación electrónica es obligatoria para todas las empresas en Costa Rica.
- Se debe utilizar un proveedor autorizado para generar, firmar y enviar facturas electrónicas en formato XML.
- Las facturas deben cumplir con el esquema definido por Hacienda.
- En caso de problemas de conectividad, la Resolución DGT-R-012-2018 permite la emisión de comprobantes electrónicos en contingencia, que deberán ser enviados a Hacienda cuando se restablezca la conexión.

## **3. Configuración de Facturación Electrónica en Solar Fluidity**
1. **Registro ante Hacienda:**
   - Obtener un certificado digital para firmar las facturas.
   - Registrar la empresa en el portal de Hacienda.
2. **Integración con Solar Fluidity:**
   - Acceder a la configuración de facturación en el panel de administración.
   - Ingresar los datos fiscales requeridos: cédula jurídica, dirección, actividad económica, etc.
   - Subir el certificado digital emitido por Hacienda.
   - Configurar preferencias de modo offline y vinculación con proyectos solares/electromecánicos.
3. **Configuración de Automatizaciones con n8n:**
   - Definir flujos de trabajo para la generación automática de facturas basadas en hitos de proyectos.
   - Establecer procesos de recordatorios y seguimiento de pagos.
   - Configurar alertas para sincronización cuando se restablezca la conexión.

## **4. Emisión de Facturas Electrónicas**
### **4.1 Proceso Online (Conexión Disponible)**
1. **Generación de la factura:**
   - Ingresar los detalles de la transacción (cliente, montos, descripciones, impuestos aplicables).
   - Opción de vincular la factura a proyectos solares/electromecánicos específicos.
   - Solar Fluidity genera el archivo XML según el formato exigido.
2. **Firma Digital:**
   - El documento XML se firma con el certificado digital del emisor.
3. **Envío a Hacienda:**
   - La factura se envía automáticamente a la DGT para su validación.
4. **Recepción del Acuse de Recibo:**
   - Hacienda responde con un "acuse de recibo" que confirma la validez de la factura.
   - Se almacena en el sistema y se envía una copia al cliente.

### **4.2 Proceso Offline (Sin Conexión)**
1. **Generación y Almacenamiento Local:**
   - El sistema detecta automáticamente la falta de conexión con Hacienda.
   - Se genera la factura en formato XML con indicación de contingencia.
   - Se firma digitalmente usando el certificado almacenado localmente.
   - Se almacena en la cola de envío pendiente.
2. **Entrega al Cliente:**
   - Se genera un PDF con marca de agua "Comprobante en Contingencia".
   - Se entrega al cliente por correo electrónico o se imprime.
3. **Sincronización Automática:**
   - Cuando se restablece la conexión, el sistema envía automáticamente todas las facturas pendientes.
   - Se notifica a usuarios y clientes cuando las facturas son aceptadas por Hacienda.

## **5. Notificación y Almacenamiento**
- Cada factura validada por Hacienda se envía al cliente vía correo electrónico.
- Todas las facturas emitidas y sus acuses de recibo quedan almacenadas en SolarFluidity por un período mínimo de 5 años.

## **6. Notas de Crédito y Débito**
- **Notas de crédito:** Se emiten para corregir o anular facturas ya enviadas.
- **Notas de débito:** Se utilizan para aumentar el monto de una factura original.
- Ambas deben enviarse y validarse por Hacienda igual que las facturas electrónicas.

## **7. Resolución de Problemas Comunes**
### Errores en la Firma Digital
- Verificar que el certificado digital esté vigente.
- Confirmar que la clave privada coincide con el certificado.
- Comprobar que la instancia local tiene acceso al certificado almacenado.

### Factura Rechazada por Hacienda
- Revisar que los datos fiscales sean correctos.
- Asegurar que los montos y códigos de impuestos sean los adecuados.
- Verificar que se está utilizando la versión correcta del esquema XML.

### Problemas de Sincronización Offline-Online
- Verificar que las facturas pendientes no tengan conflictos de numeración.
- Comprobar el estado de la cola de envío en el panel de administración.
- Forzar sincronización manual si es necesario.

### Problemas con Automatizaciones
- Revisar los registros de ejecución de flujos de n8n.
- Asegurar que las credenciales de API están actualizadas.
- Verificar la configuración de triggers y eventos.

## **8. Integración con Gestión de Proyectos Solares/Electromecánicos**
- **Vinculación de Facturas a Proyectos:** Cada factura puede asociarse a un proyecto específico para seguimiento financiero.
- **Facturación por Hitos:** Configuración de facturación automática al completar etapas del proyecto.
- **Reportes Financieros por Proyecto:** Generación de informes de ingresos, impuestos y rentabilidad por proyecto.

## **9. Automatización con n8n**
- **Notificaciones Automáticas:** Envío de alertas a clientes sobre facturas próximas y pagos pendientes.
- **Integración con Bancos:** Conciliación automática de pagos recibidos con facturas emitidas.
- **Flujos de Documentación:** Generación de contratos y documentos de proyecto basados en plantillas predefinidas.

## **10. Contacto y Soporte**
Para consultas sobre facturación electrónica offline y automatizaciones, contacta a:
- **Email principal:** facturacion@solarfluidity.com
- **Soporte Técnico:** soporte@solarfluidity.com
- **Especialista en Automatizaciones:** automatizaciones@solarfluidity.com

**Última actualización:** 18 de marzo de 2025