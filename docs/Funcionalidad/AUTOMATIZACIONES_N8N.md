# Automatizaciones con n8n en Solar Fluidity

## Introducción a n8n en el Contexto de Facturación Electrónica Offline y Proyectos Solares

n8n es una herramienta de automatización de flujos de trabajo potente y flexible que permite conectar diferentes aplicaciones y servicios sin necesidad de programación. En Solar Fluidity, n8n juega un papel crucial como motor de automatización para tres pilares fundamentales:

1. **Facturación Electrónica Offline**: Gestionando la generación, firma, almacenamiento y sincronización posterior de documentos fiscales cuando se restablece la conectividad.

2. **Gestión de Proyectos Solares/Electromecánicos**: Automatizando la asignación de recursos, seguimiento de avances, notificaciones de hitos y generación de reportes técnicos.

3. **Integraciones con Servicios Externos**: Facilitando la comunicación con proveedores, clientes y entidades regulatorias como el Ministerio de Hacienda.

## Integración de n8n en Solar Fluidity

### Arquitectura de la Integración

La integración de n8n con Solar Fluidity sigue el siguiente modelo:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  Frontend       │------>│  Supabase DB    │<----->│     n8n         │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
                                                             ↓
                                                   ┌─────────────────────┐
                                                   │  Servicios Externos │
                                                   │  • AWS S3           │
                                                   │  • Email SMTP       │
                                                   │  • Hacienda CR      │
                                                   │  • PayPal           │
                                                   └─────────────────────┘
```

### Método de Comunicación

1. **Webhooks**: Endpoints HTTP que reciben solicitudes desde el frontend o la base de datos
2. **Base de Datos**: Monitoreo de cambios en tablas específicas con soporte para sincronización diferida
3. **Programación**: Ejecución de flujos de trabajo en intervalos definidos
4. **Cola de Sincronización**: Sistema específico para manejar operaciones pendientes en modo offline
5. **Mensajería Interna**: Comunicación entre componentes durante periodos sin conectividad

## Flujos de Trabajo Principales

### 1. Generación de Documentos Electrónicos Offline

Este flujo de trabajo es responsable de generar los documentos XML y PDF para la facturación electrónica, con capacidad para operar sin conexión a internet o cuando los sistemas de Hacienda no están disponibles.

#### Triggers:
- Webhook desde el frontend al crear una nueva factura
- Evento de base de datos al cambiar el estado de una factura a "pendiente de generación"
- Detección automática de modo offline

#### Pasos en Modo Online:
1. **Recepción de Datos**: Obtener información de la factura y datos del proyecto solar relacionado
2. **Validación**: Verificar que todos los campos obligatorios estén presentes y cumplan la normativa fiscal
3. **Formateo de Datos**: Preparar los datos según el formato requerido por Hacienda
4. **Generación XML**:
   - Cargar la plantilla XML actualizada con la última versión del esquema fiscal
   - Aplicar los datos de la factura incluyendo referencias a proyectos solares
   - Generar el código QR y otros elementos requeridos
   - Firmar digitalmente el documento con el certificado del contribuyente
5. **Envío a Hacienda**: Transmitir el XML firmado a los servidores de la DGT
6. **Recepción de Confirmación**: Procesar la respuesta de Hacienda (aceptación/rechazo)
7. **Generación PDF**:
   - Generar representación gráfica oficial de la factura
   - Incluir logotipos e información personalizada de la empresa
   - Incorporar el código QR enlazando al documento en Hacienda
8. **Almacenamiento**:
   - Subir XML, confirmación y PDF a AWS S3
   - Guardar URLs en la base de datos con estado validado
9. **Notificación**: Informar al usuario y al cliente que los documentos están listos
10. **Vinculación con Proyecto**: Asociar la factura al proyecto solar correspondiente en el sistema

#### Pasos en Modo Offline:
1. **Detección de Modo Offline**: Identificar automáticamente la falta de conexión
2. **Validación Local**: Verificar datos sin consultar servicios externos
3. **Generación XML con Marca de Contingencia**: 
   - Incluir indicadores de contingencia según normativa fiscal
   - Firmar digitalmente con certificado almacenado localmente
4. **Generación PDF con Marca de Contingencia**:
   - Incluir marca de agua "Comprobante Pendiente de Validación"
   - Mantener todos los requisitos fiscales para validez legal
5. **Almacenamiento Local**:
   - Guardar documentos localmente para sincronización posterior
   - Registrar en cola de documentos pendientes
6. **Notificación de Modo Contingencia**: Informar al usuario del estado pendiente
7. **Programación de Sincronización**: Configurar intento automático cuando se detecte conectividad

#### Configuración:

```json
{
  "name": "Generación de Documentos Electrónicos",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "position": [100, 300],
      "parameters": {
        "path": "factura/generar",
        "responseMode": "responseNode"
      }
    },
    {
      "type": "n8n-nodes-base.function",
      "position": [300, 300],
      "parameters": {
        "functionCode": "// Código de validación de datos"
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "position": [500, 300],
      "parameters": {
        "url": "https://servicio-xml.ejemplo/generar",
        "method": "POST",
        "bodyContent": "={{ $node[\"Function\"].json }}"
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "position": [700, 300],
      "parameters": {
        "url": "https://servicio-pdf.ejemplo/generar",
        "method": "POST",
        "bodyContent": "={{ $node[\"HTTP Request\"].json }}"
      }
    },
    {
      "type": "n8n-nodes-base.s3",
      "position": [900, 300],
      "parameters": {
        "operation": "upload",
        "bucket": "{{ $env.AWS_BUCKET_NAME }}",
        "fileName": "={{ $node[\"HTTP Request1\"].json.facturaId }}_factura.xml"
      }
    },
    {
      "type": "n8n-nodes-base.supabaseDb",
      "position": [1100, 300],
      "parameters": {
        "operation": "update",
        "table": "invoices",
        "id": "={{ $node[\"HTTP Request1\"].json.facturaId }}",
        "updateFields": {
          "xml_url": "={{ $node[\"S3\"].json.url }}",
          "pdf_url": "={{ $node[\"S31\"].json.url }}",
          "status": "generada"
        }
      }
    }
  ]
}
```

### 2. Sistema de Recordatorios de Pago

Este flujo automatiza el envío de recordatorios a clientes con facturas pendientes de pago.

#### Triggers:
- Programación temporal (diaria)
- Evento manual desde el panel de administración

#### Pasos:
1. **Consulta de Facturas**: Obtener listado de facturas pendientes de pago
2. **Filtrado**: Identificar facturas que requieren recordatorio según su fecha de vencimiento
3. **Segmentación**: Clasificar facturas por nivel de urgencia (próximas a vencer, vencidas, muy atrasadas)
4. **Generación de Correos**:
   - Seleccionar plantilla adecuada según el segmento
   - Personalizar contenido con datos del cliente y la factura
5. **Envío de Correos**: Enviar notificaciones a los clientes
6. **Registro**: Actualizar base de datos con información sobre los recordatorios enviados
7. **Reporte**: Generar informe para el usuario sobre los recordatorios enviados

#### Configuración:

```json
{
  "name": "Recordatorios de Pago",
  "nodes": [
    {
      "type": "n8n-nodes-base.schedule",
      "position": [100, 300],
      "parameters": {
        "cronExpression": "0 9 * * 1-5"
      }
    },
    {
      "type": "n8n-nodes-base.supabaseDb",
      "position": [300, 300],
      "parameters": {
        "operation": "select",
        "table": "invoices",
        "options": {
          "where": {
            "conditions": [
              {
                "column": "status",
                "operator": "eq",
                "value": "pendiente"
              },
              {
                "column": "due_date",
                "operator": "lt",
                "value": "={{ $now.format(\"YYYY-MM-DD\") }}"
              }
            ]
          }
        }
      }
    },
    {
      "type": "n8n-nodes-base.function",
      "position": [500, 300],
      "parameters": {
        "functionCode": "// Código para segmentar facturas"
      }
    },
    {
      "type": "n8n-nodes-base.splitInBatches",
      "position": [700, 300]
    },
    {
      "type": "n8n-nodes-base.email",
      "position": [900, 300],
      "parameters": {
        "fromEmail": "{{ $env.SMTP_USER }}",
        "toEmail": "={{ $json.client_email }}",
        "subject": "Recordatorio de pago - Factura #{{ $json.invoice_number }}",
        "text": "={{ $json.emailBody }}"
      }
    },
    {
      "type": "n8n-nodes-base.supabaseDb",
      "position": [1100, 300],
      "parameters": {
        "operation": "update",
        "table": "invoice_notifications",
        "updateFields": {
          "last_reminder_sent": "={{ $now.format() }}",
          "reminder_count": "={{ $json.reminder_count + 1 }}"
        }
      }
    }
  ]
}
```

### 3. Generación Automática de Reportes

Este flujo genera y distribuye informes financieros y de gestión de proyectos de forma automática.

#### Triggers:
- Programación temporal (semanal, mensual)
- Solicitud manual desde el frontend

#### Pasos:
1. **Recopilación de Datos**: Obtener información relevante de la base de datos
2. **Procesamiento**: Realizar cálculos y agregaciones necesarios
3. **Formateo**: Estructurar los datos para el informe
4. **Generación de Documento**:
   - Crear documento PDF con gráficos y tablas
   - Aplicar formato corporativo
5. **Almacenamiento**: Guardar informe en AWS S3
6. **Distribución**: Enviar por correo a destinatarios configurados
7. **Registro**: Actualizar registro de informes generados

#### Configuración:

```json
{
  "name": "Generación de Reportes Mensuales",
  "nodes": [
    {
      "type": "n8n-nodes-base.schedule",
      "position": [100, 300],
      "parameters": {
        "cronExpression": "0 7 1 * *"
      }
    },
    {
      "type": "n8n-nodes-base.supabaseDb",
      "position": [300, 300],
      "parameters": {
        "operation": "selectRaw",
        "query": "SELECT * FROM monthly_report_data WHERE month = date_trunc('month', current_date - interval '1 month')"
      }
    },
    {
      "type": "n8n-nodes-base.function",
      "position": [500, 300],
      "parameters": {
        "functionCode": "// Código para procesamiento de datos de reporte"
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "position": [700, 300],
      "parameters": {
        "url": "https://servicio-pdf.ejemplo/generar-reporte",
        "method": "POST",
        "bodyContent": "={{ $node[\"Function\"].json }}"
      }
    },
    {
      "type": "n8n-nodes-base.s3",
      "position": [900, 300],
      "parameters": {
        "operation": "upload",
        "bucket": "{{ $env.AWS_BUCKET_NAME }}",
        "fileName": "reporte_mensual_{{ $today.format(\"YYYY-MM\") }}.pdf"
      }
    },
    {
      "type": "n8n-nodes-base.supabaseDb",
      "position": [1100, 300],
      "parameters": {
        "operation": "select",
        "table": "report_subscriptions",
        "options": {
          "where": {
            "conditions": [
              {
                "column": "report_type",
                "operator": "eq",
                "value": "monthly"
              },
              {
                "column": "is_active",
                "operator": "eq",
                "value": true
              }
            ]
          }
        }
      }
    },
    {
      "type": "n8n-nodes-base.splitInBatches",
      "position": [1300, 300]
    },
    {
      "type": "n8n-nodes-base.email",
      "position": [1500, 300],
      "parameters": {
        "fromEmail": "{{ $env.SMTP_USER }}",
        "toEmail": "={{ $json.email }}",
        "subject": "Reporte Mensual - {{ $today.format(\"MMMM YYYY\") }}",
        "text": "Se adjunta el reporte mensual.",
        "attachments": "={{ $node[\"S3\"].json.url }}"
      }
    }
  ]
}
```

### 4. Validación y Procesamiento de Pagos

Este flujo maneja la validación y el procesamiento de pagos recibidos a través de PayPal.

#### Triggers:
- Webhook desde PayPal (notificación de pago)
- Verificación programada de suscripciones

#### Pasos:
1. **Recepción de Notificación**: Recibir datos de pago desde PayPal
2. **Verificación**: Validar autenticidad de la notificación
3. **Identificación**: Asociar el pago con la factura o suscripción correspondiente
4. **Actualización de Estado**: Marcar la factura como pagada o la suscripción como activa
5. **Generación de Comprobante**: Crear recibo de pago si es necesario
6. **Notificación**: Informar al usuario sobre el pago recibido
7. **Registro de Transacción**: Guardar detalles de la transacción para auditoría

#### Configuración:

```json
{
  "name": "Procesamiento de Pagos PayPal",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "position": [100, 300],
      "parameters": {
        "path": "webhook/paypal",
        "responseMode": "responseNode"
      }
    },
    {
      "type": "n8n-nodes-base.function",
      "position": [300, 300],
      "parameters": {
        "functionCode": "// Código para verificar autenticidad del webhook"
      }
    },
    {
      "type": "n8n-nodes-base.if",
      "position": [500, 300],
      "parameters": {
        "condition": "={{ $node[\"Function\"].json.verified === true }}"
      }
    },
    {
      "type": "n8n-nodes-base.supabaseDb",
      "position": [700, 200],
      "parameters": {
        "operation": "select",
        "table": "invoices",
        "options": {
          "where": {
            "conditions": [
              {
                "column": "payment_reference",
                "operator": "eq",
                "value": "={{ $node[\"Webhook\"].json.resource.id }}"
              }
            ]
          }
        }
      }
    },
    {
      "type": "n8n-nodes-base.supabaseDb",
      "position": [900, 200],
      "parameters": {
        "operation": "update",
        "table": "invoices",
        "id": "={{ $node[\"Supabase DB\"].json.id }}",
        "updateFields": {
          "status": "pagada",
          "payment_date": "={{ $now.format() }}",
          "payment_details": "={{ $node[\"Webhook\"].json }}"
        }
      }
    },
    {
      "type": "n8n-nodes-base.email",
      "position": [1100, 200],
      "parameters": {
        "fromEmail": "{{ $env.SMTP_USER }}",
        "toEmail": "={{ $node[\"Supabase DB1\"].json.user_email }}",
        "subject": "Pago recibido - Factura #{{ $node[\"Supabase DB1\"].json.invoice_number }}",
        "text": "Hemos recibido su pago correctamente. Gracias por su confianza."
      }
    }
  ]
}
```

## Gestión y Mantenimiento de Workflows

### Instalación y Configuración

Para configurar n8n en el entorno de Solar Fluidity:

1. **Instalación**:
   ```bash
   # Opción 1: Instalación global con npm
   npm install n8n -g
   
   # Opción 2: Usando Docker
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

2. **Configuración**:
   - Configurar credenciales para todos los servicios externos
   - Establecer variables de entorno necesarias
   - Configurar opciones de seguridad

### Respaldo y Versionado

Para mantener un control adecuado de los flujos de trabajo:

1. **Exportación Regular**: Exportar workflows como JSON
2. **Control de Versiones**: Mantener los workflows en un repositorio Git
3. **Documentación**: Mantener documentación actualizada de cada workflow
4. **Ambientes**: Separar workflows de desarrollo, prueba y producción

### Monitoreo y Solución de Problemas

Para garantizar el correcto funcionamiento:

1. **Logs**: Revisar registros de ejecución regularmente
2. **Alertas**: Configurar notificaciones para ejecuciones fallidas
3. **Pruebas**: Ejecutar workflows de prueba con datos de ejemplo
4. **Reintentos**: Configurar políticas de reintento para operaciones críticas

## Mejores Prácticas

### Diseño de Workflows

1. **Modularidad**: Crear workflows pequeños y específicos en lugar de uno grande y complejo
2. **Manejo de Errores**: Implementar manejo adecuado de excepciones
3. **Idempotencia**: Diseñar workflows que puedan ejecutarse múltiples veces sin efectos secundarios
4. **Documentación**: Documentar el propósito y el funcionamiento de cada workflow

### Seguridad

1. **Credenciales**: Nunca hardcodear credenciales en los workflows
2. **Encriptación**: Utilizar encriptación para datos sensibles
3. **Autenticación**: Proteger webhooks con autenticación
4. **Auditoría**: Mantener registros de todas las ejecuciones para auditoría

### Rendimiento

1. **Optimización**: Minimizar operaciones innecesarias
2. **Caché**: Utilizar caché para datos que no cambian frecuentemente
3. **Lotes**: Procesar datos en lotes cuando sea posible
4. **Programación**: Programar workflows intensivos en horas de baja carga

## Extensiones y Personalización

### Nodos Personalizados

Para funcionalidades específicas de Solar Fluidity, se han desarrollado nodos personalizados:

1. **Nodo de Firma Digital**: Para firmar documentos XML según requerimientos fiscales
2. **Nodo de Validación Fiscal**: Para validar documentos según normativa costarricense
3. **Nodo de Generación PDF**: Para crear representaciones gráficas personalizadas

### Integración con APIs Específicas

Se han desarrollado integraciones específicas con:

1. **API del Ministerio de Hacienda**: Para validar y consultar estados de documentos
2. **API Interna de Proyectos**: Para sincronizar datos de proyectos con otras herramientas
3. **Servicios de Validación Fiscal**: Para verificar información tributaria

## Conclusión

Las automatizaciones con n8n son un componente crítico de Solar Fluidity, permitiendo:

1. **Reducción de Tareas Manuales**: Eliminando procesos repetitivos y propensos a errores
2. **Mayor Consistencia**: Garantizando que los procesos se ejecuten siempre de la misma manera
3. **Escalabilidad**: Facilitando el manejo de mayores volúmenes de datos y transacciones
4. **Integración**: Conectando diferentes componentes del sistema y servicios externos
5. **Flexibilidad**: Permitiendo adaptar los procesos según cambien los requisitos del negocio

La arquitectura basada en n8n proporciona una base sólida para expandir las capacidades de automatización según crezca la plataforma y evolucionen las necesidades de los usuarios.
