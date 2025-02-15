# **Guía de Facturación Electrónica para Costa Rica - SolarFluidity**

**Fecha de entrada en vigencia:** [Fecha de Publicación]

## **1. Introducción**
Esta guía describe el proceso de facturación electrónica en Costa Rica para los usuarios de SolarFluidity, conforme a los requisitos de la Dirección General de Tributación (DGT) del Ministerio de Hacienda.

## **2. Requisitos Legales**
- La facturación electrónica es obligatoria para todas las empresas en Costa Rica.
- Se debe utilizar un proveedor autorizado para generar, firmar y enviar facturas electrónicas en formato XML.
- Las facturas deben cumplir con el esquema definido por Hacienda.

## **3. Configuración de Facturación Electrónica en SolarFluidity**
1. **Registro ante Hacienda:**
   - Obtener un certificado digital para firmar las facturas.
   - Registrar la empresa en el portal de Hacienda.
2. **Integración con SolarFluidity:**
   - Acceder a la configuración de facturación en el panel de administración.
   - Ingresar los datos fiscales requeridos: cédula jurídica, dirección, actividad económica, etc.
   - Subir el certificado digital emitido por Hacienda.

## **4. Emisión de Facturas Electrónicas**
1. **Generación de la factura:**
   - Ingresar los detalles de la transacción (cliente, montos, descripciones, impuestos aplicables).
   - SolarFluidity genera el archivo XML según el formato exigido.
2. **Firma Digital:**
   - El documento XML se firma con el certificado digital del emisor.
3. **Envío a Hacienda:**
   - La factura se envía automáticamente a la DGT para su validación.
4. **Recepción del Acuse de Recibo:**
   - Hacienda responde con un "acuse de recibo" que confirma la validez de la factura.
   - Se almacena en el sistema y se envía una copia al cliente.

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

### Factura Rechazada por Hacienda
- Revisar que los datos fiscales sean correctos.
- Asegurar que los montos y códigos de impuestos sean los adecuados.

### Problemas de Envío
- Verificar la conectividad con los servidores de Hacienda.
- Intentar reenviar la factura manualmente desde SolarFluidity.

## **8. Contacto y Soporte**
Para consultas sobre facturación electrónica, contacta a:
- **Email principal:** facturacion@solarfluidity.com
- **Soporte:** soporte@solarfluidity.com

**Última actualización:** [Fecha de Última Modificación]