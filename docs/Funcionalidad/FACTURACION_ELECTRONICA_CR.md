# Facturación Electrónica en Costa Rica para Solar Fluidity

## Introducción al Sistema de Facturación Electrónica de Costa Rica

La facturación electrónica en Costa Rica es un sistema implementado por el Ministerio de Hacienda para digitalizar y controlar los comprobantes fiscales. A diferencia de los sistemas tradicionales de facturación en papel, la facturación electrónica garantiza la integridad, autenticidad y no repudio de los documentos fiscales mediante el uso de certificados digitales y estándares técnicos específicos.

El sistema fue implementado gradualmente a partir de 2017 y es obligatorio para todos los contribuyentes desde 2020, salvo excepciones específicas. La normativa principal está definida en la resolución DGT-R-48-2016 y sus posteriores modificaciones.

### Normativa Vigente

- **Resolución DGT-R-48-2016**: Define las especificaciones técnicas y normativas del sistema
- **Resolución DGT-R-13-2021**: Versión 4.3 del formato XML para documentos electrónicos
- **Ley 9635**: Fortalecimiento de las Finanzas Públicas, con impacto en IVA y facturación
- **Reglamento a la Ley del Impuesto sobre el Valor Agregado**: Decreto 41779

## Documentos Electrónicos Soportados

El sistema de facturación electrónica de Costa Rica contempla los siguientes tipos de documentos:

1. **Factura Electrónica (FE)**: Documento principal para ventas de bienes y servicios
2. **Nota de Crédito Electrónica (NC)**: Para anulaciones parciales o totales de facturas
3. **Nota de Débito Electrónica (ND)**: Para aumentar el valor de facturas emitidas
4. **Tiquete Electrónico (TE)**: Para ventas al consumidor final sin identificación
5. **Factura Electrónica de Compra (FEC)**: Cuando el comprador emite la factura
6. **Factura Electrónica de Exportación (FEE)**: Para ventas al exterior
7. **Mensaje de Confirmación**: Respuesta del receptor del documento
8. **Mensaje de Aceptación**: Aceptación del documento por parte del receptor
9. **Mensaje de Rechazo**: Rechazo del documento por parte del receptor

## Arquitectura del Sistema de Facturación Electrónica Offline

Solar Fluidity implementa un enfoque de facturación electrónica offline que permite a los usuarios generar documentos electrónicos válidos sin necesidad de una conexión constante con el Ministerio de Hacienda. Este enfoque provee mayor autonomía al usuario mientras mantiene el cumplimiento normativo.

```
┌─────────────────┐     ┌────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                │     │                 │     │                 │
│ Frontend        │────>│ Generador XML  │────>│ Firmador        │────>│ Generador PDF   │
│ (React)         │     │                │     │ Digital         │     │                 │
│                 │     │                │     │                 │     │                 │
└─────────────────┘     └────────────────┘     └─────────────────┘     └───────┬─────────┘
                                                                               │
                                                                               ↓
┌─────────────────┐     ┌────────────────┐                           ┌─────────────────┐
│                 │     │                │                           │                 │
│ Ministerio de   │<────│ Envío Manual   │<─────────────────────────│ Almacenamiento  │
│ Hacienda        │     │ (Usuario)      │                           │ S3              │
│                 │     │                │                           │                 │
└─────────────────┘     └────────────────┘                           └─────────────────┘
```

### Componentes del Sistema

1. **Generador XML**: Crea documentos XML según las especificaciones del Ministerio de Hacienda
2. **Firmador Digital**: Aplica la firma digital usando el certificado del contribuyente
3. **Generador PDF**: Crea la representación gráfica del documento para visualización
4. **Almacenamiento S3**: Guarda los documentos XML y PDF de forma segura
5. **Interfaz de Envío Manual**: Permite al usuario enviar los documentos cuando lo desee

## Proceso Detallado de Facturación Electrónica Offline

### 1. Configuración Inicial

Antes de comenzar a utilizar la facturación electrónica en Solar Fluidity, el usuario debe:

1. **Obtener Certificado Digital**: Adquirir un certificado digital de firma avanzada de algún proveedor autorizado (BCCR, SINPE, etc.)
2. **Registrar Certificado**: Registrar el certificado en el sistema ATV del Ministerio de Hacienda
3. **Configurar Solar Fluidity**: Cargar el certificado en formato .p12 en la plataforma
4. **Configurar Datos Fiscales**: Ingresar información como número de cédula, nombre, dirección fiscal, etc.

### 2. Emisión de Documentos Electrónicos

El proceso de emisión de documentos electrónicos sigue estos pasos:

#### 2.1 Creación de la Factura

1. **Ingreso de Datos**: El usuario ingresa la información de la factura:
   - Datos del receptor (nombre, cédula, email)
   - Detalles de bienes y servicios (descripción, cantidad, precio)
   - Impuestos aplicables
   - Medios de pago
   - Observaciones
   
2. **Validación de Datos**: El sistema valida que todos los campos obligatorios estén presentes y que cumplan con las reglas establecidas:
   - Formato correcto de cédulas
   - Cálculos matemáticos correctos
   - Códigos de impuesto válidos
   - Unidades de medida según catálogo oficial

#### 2.2 Generación del XML

1. **Estructura XML**: Se crea un documento XML siguiendo la estructura definida por el Ministerio de Hacienda:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica">
     <Clave>...</Clave>
     <NumeroConsecutivo>...</NumeroConsecutivo>
     <FechaEmision>...</FechaEmision>
     <Emisor>...</Emisor>
     <Receptor>...</Receptor>
     <DetalleServicio>...</DetalleServicio>
     <ResumenFactura>...</ResumenFactura>
   </FacturaElectronica>
   ```

2. **Generación de Clave Numérica**: Se genera la clave numérica de 50 dígitos según el algoritmo establecido:
   - País (3 dígitos)
   - Día (3 dígitos)
   - Cédula emisor (12 dígitos)
   - Consecutivo (20 dígitos)
   - Situación comprobante (1 dígito)
   - Código de seguridad (8 dígitos)
   - Terminal (2 dígitos)
   - Sucursal (5 dígitos)

3. **Cálculo de Totales**: Se calculan y verifican todos los totales:
   - Subtotal
   - Impuestos
   - Descuentos
   - Total

#### 2.3 Firma Digital

1. **Preparación del XML**: Se formatea el XML para la firma
2. **Aplicación de Firma**: Se utiliza el certificado .p12 del usuario para firmar el documento
3. **Validación de Firma**: Se verifica que la firma aplicada sea válida

El proceso de firma sigue estos pasos técnicos:
```javascript
// Ejemplo conceptual del proceso de firma
function firmarXML(xmlString, certificadoP12, clave) {
  // Cargar el certificado
  const certificado = loadP12Certificate(certificadoP12, clave);
  
  // Crear el objeto de firma XML
  const xmlSigner = new XMLSigner();
  
  // Configurar parámetros según Hacienda
  xmlSigner.setSignatureAlgorithm('RSA-SHA256');
  xmlSigner.setDigestAlgorithm('SHA-256');
  xmlSigner.setCanonicalizationMethod('http://www.w3.org/TR/2001/REC-xml-c14n-20010315');
  
  // Firmar el documento
  const xmlFirmado = xmlSigner.sign(xmlString, certificado);
  
  return xmlFirmado;
}
```

#### 2.4 Generación del PDF

1. **Diseño de Plantilla**: Se utiliza una plantilla personalizable que incluye:
   - Logo de la empresa
   - Información del emisor
   - Datos del receptor
   - Tabla de productos/servicios
   - Resumen de impuestos
   - Totales
   - Código QR con la clave numérica
   - Leyendas legales requeridas

2. **Renderizado del PDF**: Se genera el PDF usando los datos del XML
3. **Inclusión de Elementos Obligatorios**: Se añaden elementos requeridos como:
   - Leyenda "Factura Electrónica" o el tipo correspondiente
   - Número consecutivo
   - Clave numérica
   - Código QR
   - Condición de venta
   - Medio de pago

#### 2.5 Almacenamiento

1. **Subida a S3**: Tanto el XML como el PDF se suben al bucket de AWS S3
2. **Registro en Base de Datos**: Se guardan las referencias a los documentos en la base de datos:
   ```sql
   UPDATE invoices 
   SET 
     xml_url = 'https://bucket-name.s3.amazonaws.com/facturas/50626052100011002000100001010000000025640627142153',
     pdf_url = 'https://bucket-name.s3.amazonaws.com/facturas/50626052100011002000100001010000000025640627142153.pdf',
     status = 'generated'
   WHERE id = '12345';
   ```

3. **Respaldo Local**: Opcionalmente, se guardan copias en el dispositivo del usuario

### 3. Gestión de Documentos Generados

Una vez generados los documentos, el usuario tiene varias opciones:

#### 3.1 Visualización y Descarga

1. **Visualización en Plataforma**: El usuario puede ver los documentos dentro de Solar Fluidity
2. **Descarga de Documentos**: Puede descargar tanto el XML como el PDF para uso personal

#### 3.2 Envío al Receptor

1. **Envío por Email**: El sistema puede enviar automáticamente los documentos al receptor
2. **Generación de Link**: Creación de un enlace temporal para que el receptor descargue los documentos

#### 3.3 Envío al Ministerio de Hacienda

Dado que Solar Fluidity utiliza un enfoque offline, el envío al Ministerio de Hacienda se realiza de forma manual:

1. **Exportación de XML**: El usuario descarga el XML firmado
2. **Acceso a ATV**: El usuario ingresa al portal ATV (Administración Tributaria Virtual)
3. **Carga de Documentos**: Sube el XML a través de la opción correspondiente
4. **Recepción de Respuesta**: Obtiene la respuesta del Ministerio (aceptado, rechazado, etc.)
5. **Actualización de Estado**: Actualiza el estado del documento en Solar Fluidity

## Consideraciones Especiales para Facturación Offline

### Ventajas del Enfoque Offline

1. **Independencia de Conectividad**: Permite generar documentos incluso sin conexión a internet
2. **Mayor Control**: El usuario decide cuándo enviar los documentos a Hacienda
3. **Flexibilidad Operativa**: Facilita la adaptación a diferentes flujos de trabajo
4. **Reducción de Errores**: Permite verificar los documentos antes del envío oficial

### Limitaciones y Consideraciones

1. **Responsabilidad de Envío**: El usuario debe asegurarse de enviar los documentos dentro del plazo establecido (2 días hábiles)
2. **Control de Consecutivos**: Es necesario mantener un control estricto de los consecutivos utilizados
3. **Sincronización Manual**: Hay que actualizar manualmente los estados de los documentos según la respuesta de Hacienda

### Recomendaciones para Usuarios

1. **Envío Regular**: Aunque es posible acumular documentos, se recomienda enviarlos diariamente
2. **Backup de Certificado**: Mantener respaldos seguros del certificado digital
3. **Verificación Previa**: Revisar los documentos antes de enviarlos para evitar rechazos
4. **Seguimiento**: Mantener un registro de documentos pendientes de envío

## Integraciones Técnicas

### 1. Formato XML y Esquemas

Solar Fluidity implementa la versión 4.3 del esquema XML definido por el Ministerio de Hacienda. Los esquemas oficiales se encuentran en:
`https://cdn.comprobanteselectronicos.go.cr/xml-schemas/`

Las validaciones incluyen:
- Estructura del documento
- Campos obligatorios
- Formatos de datos
- Reglas de negocio específicas

### 2. Certificados Digitales

El sistema soporta certificados digitales en formato P12 emitidos por:
- Banco Central de Costa Rica
- SINPE
- Otros emisores autorizados

El certificado debe estar registrado previamente en el sistema ATV del Ministerio de Hacienda.

### 3. Algoritmos de Firma

Se implementan los algoritmos de firma definidos en la normativa:
- Algoritmo de firma: RSA-SHA256
- Algoritmo de resumen: SHA-256
- Método de canonicalización: http://www.w3.org/TR/2001/REC-xml-c14n-20010315

### 4. Código QR

El código QR generado contiene:
- La clave numérica del documento
- URL para validación (cuando aplica)

## Flujos Especiales

### 1. Notas de Crédito y Débito

Las notas de crédito y débito siguen un proceso similar a las facturas, con algunas diferencias:

1. **Referencia Obligatoria**: Deben hacer referencia a una factura existente
2. **Motivo**: Requieren especificar la razón de la anulación o modificación
3. **Limitaciones**: Solo pueden aplicarse dentro de ciertos plazos y condiciones

### 2. Facturas de Exportación

Las facturas de exportación tienen consideraciones especiales:
1. **Formato Específico**: Utilizan la estructura de Factura Electrónica de Exportación
2. **Exención de IVA**: Normalmente están exentas de IVA
3. **Información Adicional**: Requieren datos como país de destino, incoterms, etc.

### 3. Contingencias

En caso de problemas técnicos severos, el sistema permite:
1. **Facturación en Contingencia**: Generación con un identificador especial
2. **Justificación**: Requiere documentar la razón de la contingencia
3. **Regularización**: Proceso posterior para normalizar los documentos

## Reportes y Análisis

Solar Fluidity proporciona diversas herramientas de reportería para los documentos electrónicos:

### 1. Reportes Fiscales

- **Resumen de Facturación**: Totales por período
- **Desglose por Impuestos**: Análisis de IVA y otros impuestos
- **Documentos Emitidos**: Listado completo de documentos por estado

### 2. Análisis Financieros

- **Ingresos por Cliente**: Segmentación de facturación
- **Proyección de Cobros**: Basada en facturas pendientes
- **Historial de Pagos**: Seguimiento de facturas pagadas

### 3. Exportación de Datos

- **Formatos Soportados**: Excel, CSV, PDF
- **Informes Personalizados**: Capacidad de crear reportes a medida
- **Integración con Contabilidad**: Exportación a formatos compatibles con sistemas contables

## Cumplimiento Normativo y Actualizaciones

El Ministerio de Hacienda realiza periódicamente actualizaciones a la normativa de facturación electrónica. Solar Fluidity se mantiene actualizado mediante:

1. **Monitoreo de Cambios**: Seguimiento constante de resoluciones y directrices
2. **Actualización de Esquemas**: Implementación de nuevas versiones XML
3. **Comunicación a Usuarios**: Notificación anticipada de cambios importantes
4. **Período de Transición**: Soporte para versiones anteriores durante períodos de adaptación

## Soporte y Asistencia

Para los usuarios de la plataforma, se proporciona:

1. **Documentación Detallada**: Guías de uso y manuales técnicos
2. **Soporte Técnico**: Asistencia para problemas con la generación de documentos
3. **Consultoría Fiscal**: Orientación sobre aspectos normativos
4. **Formación**: Capacitación para uso efectivo del sistema

## Conclusión

La implementación de facturación electrónica offline en Solar Fluidity ofrece una solución flexible y robusta para empresas costarricenses, especialmente aquellas en el sector solar y electromecánico. El enfoque offline proporciona autonomía sin sacrificar el cumplimiento normativo, permitiendo a los usuarios gestionar eficientemente sus obligaciones fiscales mientras mantienen el control sobre sus procesos de facturación.
