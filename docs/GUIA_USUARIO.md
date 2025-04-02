# Guía de Usuario de Solar Fluidity

Esta guía proporciona instrucciones detalladas sobre cómo utilizar las principales funcionalidades de Solar Fluidity, la plataforma SaaS especializada en generación de estructura de facturación electrónica (XML para Hacienda CR) para empresas costarricenses, gestión de proyectos solares/electromecánicos y automatizaciones con Agentes IA / Python.

## Índice

1. [Introducción](#introducción)
2. [Generación de Estructura de Factura Electrónica (XML)](#facturación-electrónica-offline)
   - [Creación de Facturas](#creación-de-facturas)
   - [Firma Digital](#firma-digital)
   - [Seguimiento de Estados](#seguimiento-de-estados)
   - [Reportes Fiscales](#reportes-fiscales)
3. [Gestión de Proyectos](#gestión-de-proyectos)
   - [Creación de Proyectos](#creación-de-proyectos)
   - [Seguimiento de Avances](#seguimiento-de-avances)
   - [Calendario de Actividades](#calendario-de-actividades)
   - [Gestión de Recursos](#gestión-de-recursos)
4. [Automatizaciones con Agentes IA / Python](#automatizaciones-con-Agentes IA / Python)
   - [Flujos Predefinidos](#flujos-predefinidos)
   - [Creación de Nuevos Flujos](#creación-de-nuevos-flujos)
   - [Integración con Servicios Externos](#integración-con-servicios-externos)
5. [Uso de Agentes IA](#uso-de-agentes-ia)
   - [Consultas a Agentes](#consultas-a-agentes)
   - [Personalización de Prompts](#personalización-de-prompts)
6. [Administración de Cuenta](#administración-de-cuenta)
   - [Perfiles y Usuarios](#perfiles-y-usuarios)
   - [Suscripciones y Pagos](#suscripciones-y-pagos)
   - [Configuración General](#configuración-general)
7. [Soporte y Ayuda](#soporte-y-ayuda)

## Introducción

Solar Fluidity es una plataforma todo-en-uno diseñada específicamente para las necesidades de empresas costarricenses en el sector solar y electromecánico. A diferencia de otras soluciones, nuestra plataforma ofrece:

- **Generación de Estructura de Factura Electrónica (XML)**: Generación de documentos XML/PDF válidos según la normativa fiscal de Costa Rica sin conexión directa con Hacienda.
- **Gestión Especializada de Proyectos**: Herramientas adaptadas a las particularidades de proyectos solares y electromecánicos.
- **Automatización**: Flujos de trabajo con Agentes IA / Python para optimizar procesos y reducir tareas manuales.

## Generación de Estructura de Factura Electrónica (XML)

### Creación de Facturas

Para crear una nueva factura electrónica:

1. En el menú principal, haz clic en "Facturación" > "Nueva Factura".
2. Completa la información del cliente:
   - Nombre o razón social
   - Número de identificación (cédula física, jurídica o DIMEX)
   - Correo electrónico (para envío de la factura)
   - Dirección (opcional)

3. Añade los productos o servicios haciendo clic en "Agregar Línea":
   - Descripción del producto o servicio
   - Cantidad
   - Precio unitario
   - Tipo de impuesto (IVA 13%, exento, reducido, etc.)

4. El sistema calculará automáticamente:
   - Subtotal
   - Impuestos
   - Total

5. Selecciona la condición de venta (contado, crédito, etc.) y el medio de pago.

6. Haz clic en "Vista Previa" para revisar la factura antes de generarla.

7. Finalmente, haz clic en "Generar Factura" para crear los archivos XML y PDF.

> **Nota**: Las facturas generadas quedarán en estado "Pendiente de Firma" hasta que sean firmadas digitalmente.

### Firma Digital

Para firmar digitalmente una factura:

1. Ve a "Facturación" > "Facturas Pendientes de Firma".
2. Selecciona la factura que deseas firmar.
3. Haz clic en "Firmar Documento".
4. Se te solicitará insertar tu dispositivo de firma digital (token del BCCR).
5. Sigue las instrucciones en pantalla para completar el proceso de firma.

> **Importante**: Es necesario tener instalado el software del BCCR para firma digital.

### Seguimiento de Estados

Puedes dar seguimiento al estado de tus facturas electrónicas:

1. Ve a "Facturación" > "Gestión de Facturas".
2. Utiliza los filtros disponibles para buscar por:
   - Estado (Pendiente de firma, Emitida, Aceptada, Rechazada)
   - Cliente
   - Fecha
   - Monto

3. Para cada factura puedes:
   - Ver detalles
   - Descargar XML/PDF
   - Enviar por correo
   - Registrar pago
   - Consultar estado en Hacienda (cuando esté online)

### Reportes Fiscales

Para generar reportes fiscales:

1. Ve a "Facturación" > "Reportes".
2. Selecciona el tipo de reporte:
   - Ventas del período
   - IVA por período
   - Facturas por cliente
   - Facturas pendientes de cobro
   - Personalizado

3. Define el período (mes, trimestre, año o personalizado).
4. Haz clic en "Generar Reporte".
5. Puedes exportar el reporte en formato Excel, PDF o CSV.

## Gestión de Proyectos

### Creación de Proyectos

Para crear un nuevo proyecto:

1. Ve a "Proyectos" > "Nuevo Proyecto".
2. Completa la información básica:
   - Nombre del proyecto
   - Cliente
   - Tipo (Solar, Electromecánico, Híbrido)
   - Ubicación
   - Fecha de inicio

3. Define las especificaciones técnicas según el tipo de proyecto:
   - Para proyectos solares:
     - Capacidad (kW)
     - Tipo de instalación (tejado, suelo, etc.)
     - Cantidad y modelo de paneles
     - Tipo de inversor
   - Para proyectos electromecánicos:
     - Alcance del trabajo
     - Requisitos específicos
     - Equipamiento necesario

4. Establece el presupuesto y define las etapas del proyecto.
5. Asigna recursos (personal, equipamiento) a cada etapa.
6. Haz clic en "Crear Proyecto".

### Seguimiento de Avances

Para dar seguimiento a tus proyectos:

1. Ve a "Proyectos" > "Gestión de Proyectos".
2. Selecciona el proyecto al que deseas dar seguimiento.
3. En el dashboard del proyecto podrás ver:
   - Progreso general
   - Etapas completadas y pendientes
   - Próximos hitos
   - Alertas y notificaciones

4. Para actualizar el avance:
   - Selecciona la etapa correspondiente
   - Actualiza el porcentaje de avance
   - Añade comentarios o notas
   - Adjunta fotos o documentos (opcional)

### Calendario de Actividades

El calendario integrado te permite gestionar todas las actividades relacionadas con tus proyectos:

1. Ve a "Proyectos" > "Calendario".
2. Visualiza actividades por día, semana o mes.
3. Filtra por tipo de actividad, proyecto o personal asignado.
4. Para añadir una nueva actividad:
   - Haz clic en el día correspondiente
   - Selecciona el tipo de actividad (visita, instalación, mantenimiento)
   - Asigna personal
   - Define horario
   - Vincula con el proyecto correspondiente

5. Configura recordatorios automáticos para las actividades importantes.

### Gestión de Recursos

Para gestionar los recursos asignados a proyectos:

1. Ve a "Proyectos" > "Recursos".
2. Visualiza la disponibilidad de:
   - Personal técnico
   - Vehículos
   - Equipamiento
   - Materiales

3. Para asignar recursos:
   - Selecciona el proyecto
   - Elige el recurso a asignar
   - Define el período de asignación
   - Establece porcentaje de dedicación (para personal)

4. El sistema alertará sobre conflictos de asignación y sobreasignación de recursos.

## Automatizaciones con Agentes IA / Python

### Flujos Predefinidos

Solar Fluidity incluye varios flujos de automatización predefinidos:

1. **Recordatorio de Facturas Pendientes**:
   - Envía recordatorios automáticos a clientes con facturas próximas a vencer
   - Configurable por días de anticipación y mensaje personalizado

2. **Notificaciones de Hitos de Proyecto**:
   - Alerta automáticamente cuando se alcanza un hito o se aproxima una fecha clave
   - Notifica a los responsables y al cliente

3. **Reporte Semanal de Actividades**:
   - Genera y distribuye automáticamente un resumen semanal de avances
   - Personalizable por proyecto y destinatarios

4. **Sincronización de Calendario**:
   - Mantiene actualizado Google Calendar con las actividades programadas
   - Envía invitaciones automáticas a los participantes

Para activar un flujo predefinido:

1. Ve a "Automatizaciones" > "Flujos Predefinidos".
2. Selecciona el flujo que deseas activar.
3. Configura los parámetros específicos.
4. Haz clic en "Activar Flujo".

### Creación de Nuevos Flujos

Para crear un flujo personalizado:

1. Ve a "Automatizaciones" > "Editor de Flujos".
2. Haz clic en "Nuevo Flujo".
3. Define el disparador (trigger) del flujo:
   - Temporal (programado)
   - Evento (cambio de estado, nueva factura, etc.)
   - Manual (activado por usuario)
   - Webhook (llamada API externa)

4. Arrastra y suelta los nodos de acción necesarios desde el panel lateral.
5. Configura cada nodo con sus parámetros específicos.
6. Conecta los nodos para definir el flujo de la automatización.
7. Haz clic en "Probar" para validar el funcionamiento.
8. Una vez validado, haz clic en "Activar" para poner el flujo en producción.

### Integración con Servicios Externos

Para integrar tus flujos con servicios externos:

1. Ve a "Automatizaciones" > "Integraciones".
2. Selecciona el servicio con el que deseas integrarte:
   - Google Workspace (Gmail, Calendar, Drive)
   - Airtable
   - Slack
   - WhatsApp Business
   - CRM externo
   - ERP externo

3. Sigue las instrucciones para autenticar y autorizar la conexión.
4. Una vez configurada la integración, estará disponible para usarse en tus flujos.

## Uso de Agentes IA

### Consultas a Agentes

Los agentes de IA pueden ayudarte con diversas tareas de forma conversacional:

1. Ve a "Asistentes" > "Chat con Agentes".
2. Selecciona el tipo de agente con el que deseas interactuar:
   - Facturación
   - Proyectos
   - Comunicaciones
   - Automatizaciones

3. Formula tu consulta o solicitud en lenguaje natural.
4. El agente procesará tu solicitud y:
   - Responderá a tus preguntas con información precisa
   - Ejecutará acciones si se le solicita y tiene permisos
   - Proporcionará recomendaciones basadas en datos

Ejemplos de consultas efectivas:
- "Genera una factura para el cliente ABC por la instalación de 10 paneles solares"
- "Muestra el estado actual del proyecto XYZ y los próximos hitos"
- "Crea un flujo de automatización para enviar recordatorios 3 días antes de cada mantenimiento programado"

### Personalización de Prompts

Puedes personalizar los prompts que utilizan los agentes:

1. Ve a "Asistentes" > "Configuración de Agentes".
2. Selecciona el agente que deseas personalizar.
3. Edita los prompts según tus necesidades específicas:
   - Instrucciones generales
   - Ejemplos de uso
   - Restricciones
   - Formato de respuestas

4. Guarda los cambios y prueba el comportamiento actualizado.

## Administración de Cuenta

### Perfiles y Usuarios

Para gestionar los usuarios de tu cuenta:

1. Ve a "Administración" > "Usuarios".
2. Aquí puedes:
   - Ver usuarios existentes
   - Crear nuevos usuarios
   - Asignar roles y permisos
   - Desactivar cuentas

3. Para crear un nuevo usuario, haz clic en "Nuevo Usuario" y proporciona:
   - Nombre
   - Correo electrónico
   - Rol (Administrador, Gestor de Proyectos, Técnico, Facturador, etc.)
   - Permisos específicos (opcional)

### Suscripciones y Pagos

Para gestionar tu suscripción:

1. Ve a "Administración" > "Suscripción".
2. Aquí puedes:
   - Ver tu plan actual
   - Cambiar de plan
   - Ver historial de facturación
   - Actualizar método de pago

3. Los planes se basan en:
   - Número de facturas mensuales
   - Número de proyectos activos
   - Funcionalidades adicionales (automatizaciones, agentes IA, etc.)

### Configuración General

Para personalizar la configuración general de tu cuenta:

1. Ve a "Administración" > "Configuración".
2. Aquí puedes personalizar:
   - Datos de empresa (logo, información fiscal, etc.)
   - Plantillas de correo
   - Plantillas de facturas y documentos
   - Configuración de notificaciones
   - Preferencias de sistema

## Soporte y Ayuda

Si necesitas ayuda adicional:

1. Ve a "Soporte" > "Centro de Ayuda".
2. Puedes acceder a:
   - Base de conocimientos
   - Videotutoriales
   - Preguntas frecuentes
   - Soporte por chat en vivo

Para contactar directamente al soporte:
- Correo: soporte@solarfluidity.com
- Teléfono: +506 2222-3333
- Horario: Lunes a Viernes de 8:00 AM a 5:00 PM (hora de Costa Rica)

---

Esta guía cubre las funcionalidades principales de Solar Fluidity. Para información más detallada sobre características específicas, consulta la documentación completa disponible en el Centro de Ayuda o contacta a nuestro equipo de soporte.
