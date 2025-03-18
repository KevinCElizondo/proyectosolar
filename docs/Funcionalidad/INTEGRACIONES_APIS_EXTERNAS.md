# Documentación de Integraciones y APIs Externas

## Introducción

Este documento detalla las integraciones y APIs externas implementadas en Solar Fluidity para soportar sus funcionalidades principales: facturación electrónica offline, gestión de proyectos solares/electromecánicos y automatizaciones con n8n. Se incluyen las especificaciones técnicas, métodos de autenticación, estructuras de datos y consideraciones de seguridad para cada integración.

## 1. Integraciones con Hacienda Costa Rica

### 1.1 API de Facturación Electrónica

La integración con el sistema ATV (Administración Tributaria Virtual) del Ministerio de Hacienda es fundamental para la validación y registro de documentos fiscales.

#### Especificaciones Técnicas

| Aspecto | Detalle |
|---------|---------|
| Endpoint Base | https://api.hacienda.go.cr/fe/ae |
| Versión API | v4.3 |
| Protocolos | HTTPS con TLS 1.2+ |
| Formato | XML (Documentos), JSON (Respuestas) |
| Firma | XMLDSig con certificado digital |

#### Métodos Principales

| Método | Ruta | Descripción | Modo Offline |
|--------|------|-------------|-------------|
| POST | /recepcion | Envío de documentos electrónicos | Diferido |
| GET | /confirmacion/{clave} | Confirmación de recepción | Diferido |
| GET | /consulta/{clave} | Consulta estado de documento | Diferido |
| POST | /contingencia | Registro de contingencia | Diferido |

#### Funcionamiento en Modo Offline

1. **Mecanismo de Cola Local**:
   - Los documentos generados sin conexión se almacenan en una cola local
   - Se utiliza IndexedDB para persistencia en el navegador/dispositivo
   - Cada documento incluye timestamp y metadatos de contingencia

2. **Procesamiento de Contingencia**:
   - Documentos marcados según resolución DGT-R-033-2019
   - Numeración especial con prefijo de contingencia
   - Validación local contra esquemas XSD almacenados

3. **Sincronización al Recuperar Conexión**:
   - Procesamiento basado en prioridad y antigüedad
   - Gestión de confirmaciones y estados
   - Resolución de conflictos de numeración

#### Esquemas y Validación

Solar Fluidity mantiene localmente los esquemas XSD oficiales para validación sin conexión:

```
/schemas/
  ├── facturaElectronica_v4.3.xsd
  ├── notaCreditoElectronica_v4.3.xsd
  ├── notaDebitoElectronica_v4.3.xsd
  ├── tiqueteElectronico_v4.3.xsd
  └── mensajeReceptor_v4.3.xsd
```

### 1.2 API de Consulta de Contribuyentes

Utilizada para validar información fiscal de clientes y proveedores.

| Aspecto | Detalle |
|---------|---------|
| Endpoint | https://api.hacienda.go.cr/fe/ae/contribuyentes |
| Caché Local | 30 días para operación offline |
| Sincronización | Automática para nuevos contribuyentes |

## 2. Integraciones para Proyectos Solares

### 2.1 APIs de Proveedores de Equipos

Integraciones con fabricantes y distribuidores de equipos solares para acceso a catálogos, especificaciones y disponibilidad.

#### Proveedores Principales

| Proveedor | API | Datos Disponibles | Sincronización Offline |
|-----------|-----|-------------------|------------------------|
| SunPower | REST API v3 | Paneles, especificaciones, garantías | Catálogo completo, 15 días |
| Fronius | Partner API | Inversores, datos técnicos, compatibilidad | Productos seleccionados, 30 días |
| BYD | Distributor API | Baterías, especificaciones, precios | Manual, actualización mensual |
| Enphase | Cloud API | Microinversores, monitoreo, diagnósticos | Especificaciones básicas, 30 días |

#### Implementación en n8n

```json
{
  "name": "Sincronización de Catálogos",
  "nodes": [
    {
      "type": "n8n-nodes-base.schedule",
      "parameters": {
        "interval": [
          {
            "field": "cronExpression",
            "expression": "0 0 1 * *"
          }
        ]
      }
    },
    {
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Código para sincronizar catálogos de múltiples proveedores\n// y almacenar localmente para acceso offline"
      }
    }
  ]
}
```

### 2.2 API de Cálculos Solares

Integración con servicios de cálculo de rendimiento solar, dimensionamiento y simulación energética.

| Servicio | Endpoint | Funcionalidad Offline |
|----------|----------|----------------------|
| PVWatts | https://developer.nrel.gov/api/pvwatts | Algoritmo simplificado local |
| SolarGIS | https://solargis.info/api/ | Datos históricos pre-descargados |
| PVGIS | https://re.jrc.ec.europa.eu/api/ | Modelo local para estimaciones |

#### Ejemplo de Cálculo Offline

```javascript
// Modelo simplificado para estimación offline de generación
function estimateSolarProduction(systemCapacity, location, tilt, azimuth) {
  // Utilizando datos precargados de irradiancia para Costa Rica
  const irradianceData = getLocalIrradianceData(location);
  
  // Factores de corrección almacenados localmente
  const losses = getDefaultSystemLosses();
  const temperatureFactor = getTemperatureEfficiencyFactor(location);
  
  // Cálculo básico
  return systemCapacity * irradianceData * (1 - losses) * temperatureFactor;
}
```

### 2.3 API de Servicios Meteorológicos

Integraciones con proveedores de datos meteorológicos para planificación de instalaciones y mantenimientos.

| Proveedor | Endpoint | Datos Offline |
|-----------|----------|--------------|
| IMN (CR) | https://www.imn.ac.cr/api/ | Históricos por región |
| Weather API | https://www.weatherapi.com | Promedios mensuales |
| OpenWeatherMap | https://api.openweathermap.org | Datos estacionales |

## 3. Integraciones de Pagos y Financiamiento

### 3.1 Pasarelas de Pago

| Proveedor | Tipo | Funcionalidad Offline |
|-----------|------|----------------------|
| PayPal | REST API | Generación de enlaces pendientes |
| BNCR | SOAP API | Formularios pre-generados |
| BCR | XML Gateway | No soportado offline |
| BAC | REST API | No soportado offline |

### 3.2 Financiamiento Solar

Integración con entidades financieras que ofrecen productos específicos para proyectos solares.

| Entidad | Método | Documentación Offline |
|---------|--------|----------------------|
| Banco Popular (ECO Créditos) | API REST | Formularios y requisitos |
| BNCR (BN Soluciones Verdes) | Portal Integrado | Simulador básico offline |
| Fundecooperación | Formularios API | Plantillas descargables |

#### Flujo de Solicitud en n8n

```json
{
  "name": "Solicitud Financiamiento Solar",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "financiamiento/solicitud"
      }
    },
    {
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "conditions": [
          {
            "value1": "={{$node[\"Webhook\"].json[\"entidad\"]}}",
            "value2": "banco_popular"
          },
          {
            "value1": "={{$node[\"Webhook\"].json[\"entidad\"]}}",
            "value2": "bncr"
          }
        ]
      }
    }
  ]
}
```

## 4. Integraciones para Automatizaciones con n8n

### 4.1 Conectores Personalizados

Solar Fluidity incluye nodos personalizados para n8n que facilitan la automatización de procesos específicos.

| Conector | Funcionalidad | Soporte Offline |
|----------|---------------|----------------|
| Hacienda Connector | Interacción con APIs fiscales | Cola de tareas |
| Solar Calculator | Cálculos de dimensionamiento | Completo |
| Document Generator | Creación de propuestas y contratos | Completo |
| Installation Tracker | Seguimiento de proyectos | Parcial |
| Maintenance Scheduler | Programación de mantenimientos | Parcial |

### 4.2 Integración entre n8n y Aplicación Principal

| Aspecto | Implementación | Resiliencia |
|---------|---------------|-------------|
| Comunicación | REST API + WebSockets | Cola de mensajes local |
| Autenticación | JWT con tokens específicos | Tokens offline con tiempo limitado |
| Sincronización | Bidireccional con reconciliación | Registro de transacciones pendientes |

```javascript
// Ejemplo de código para encolar tareas n8n cuando no hay conexión
async function queueWorkflow(workflowId, payload) {
  if (navigator.onLine) {
    return await executeWorkflowDirectly(workflowId, payload);
  } else {
    const queuedTask = {
      id: generateUUID(),
      workflowId,
      payload,
      timestamp: new Date().toISOString(),
      attempts: 0
    };
    
    await db.pendingWorkflows.add(queuedTask);
    registerSyncTask('pending-workflows');
    
    return {
      status: 'queued',
      taskId: queuedTask.id,
      message: 'Tarea programada para ejecución cuando se recupere la conexión'
    };
  }
}
```

## 5. Estrategias de Sincronización

### 5.1 Arquitectura de Sincronización

Solar Fluidity implementa un sistema de sincronización inteligente para manejar la operación offline.

```
┌──────────────────┐       ┌────────────────────┐
│                  │       │                    │
│  Cliente (PWA)   │◀─────▶│ Servicio de        │
│  - IndexedDB     │       │ Sincronización     │
│  - Service Worker│       │                    │
└──────────────────┘       └────────────────────┘
         ▲                           ▲
         │                           │
         ▼                           ▼
┌──────────────────┐       ┌────────────────────┐
│                  │       │                    │
│  APIs Externas   │◀─────▶│ Base de Datos      │
│  (Hacienda, etc) │       │ (Supabase)         │
│                  │       │                    │
└──────────────────┘       └────────────────────┘
```

### 5.2 Políticas de Sincronización

| Tipo de Dato | Prioridad | Estrategia de Conflictos | Validación Post-Sincronización |
|--------------|-----------|--------------------------|-------------------------------|
| Documentos Fiscales | Alta | Servidor prevalece | Verificación completa |
| Proyectos Solares | Media | Último cambio gana | Notificación al usuario |
| Catálogos/Referencia | Baja | Servidor prevalece | Solo cambios significativos |

### 5.3 Tecnologías Implementadas

- **Background Sync API**: Sincronización cuando el navegador recupera conexión
- **Workbox**: Gestión avanzada de caché y sincronización
- **CouchDB/PouchDB**: Replicación bidireccional para datos complejos
- **Conflict Resolution Engine**: Sistema personalizado para resolver conflictos basado en reglas de negocio

## 6. Monitoreo y Logging de Integraciones

### 6.1 Herramientas de Monitoreo

| Herramienta | Propósito | Métricas Clave |
|-------------|-----------|---------------|
| Grafana | Visualización de métricas | Latencia, disponibilidad, errores |
| Prometheus | Recolección de métricas | Tasas de éxito, tiempos de respuesta |
| Sentry | Registro de errores | Excepciones, fallos de integración |

### 6.2 Alertas y Notificaciones

| Evento | Umbral | Notificación | Acción Automática |
|--------|--------|--------------|-------------------|
| API Hacienda no disponible | 3 intentos fallidos | Administrador, Usuarios | Activación modo contingencia |
| Error en sincronización | 5 intentos | Soporte técnico | Retroceso exponencial |
| Actualización API externa | Detección cambio | Equipo desarrollo | Despliegue fallback |

## 7. Documentación para Desarrolladores

### 7.1 Integración con Hacienda

```typescript
// Ejemplo de código para integrar con API de Hacienda

import { HaciendaClient } from '@solar-fluidity/fiscal-utils';

// Inicializar cliente
const client = new HaciendaClient({
  certificatePath: './certs/company.p12',
  certificatePassword: process.env.CERT_PASSWORD,
  environment: 'production', // o 'staging' para pruebas
  offlineSupport: true
});

// Enviar documento
async function sendInvoice(invoiceXml: string, isContingency: boolean = false) {
  try {
    const result = await client.sendDocument(invoiceXml, {
      isContingency,
      offlineQueue: true,
      retryStrategy: 'exponential'
    });
    
    return result;
  } catch (error) {
    if (error.isConnectivityError) {
      // Manejar caso offline
      return client.queueForLater(invoiceXml);
    }
    throw error;
  }
}
```

### 7.2 Integración con Cálculos Solares

```typescript
// Ejemplo de integración con calculadora solar

import { SolarCalculator } from '@solar-fluidity/solar-utils';

// Inicializar con datos offline
const calculator = new SolarCalculator({
  useOfflineData: true,
  dataPath: './data/solar_irradiance_cr.json',
  updateFrequency: '30d' // Actualizar datos cada 30 días
});

// Calcular rendimiento
async function calculateYield(
  location: GeoCoordinates,
  systemSize: number,
  panelType: string,
  roofParameters: RoofParams
): Promise<YieldEstimation> {
  return calculator.estimateAnnualProduction({
    location,
    systemSize,
    panelType,
    roofParameters,
    usePrecisionModel: navigator.onLine // Usar modelo simplificado offline
  });
}
```

## 8. Roadmap de Integraciones

### 8.1 Próximas Integraciones

| Integración | Prioridad | Calendario | Funcionalidad Clave |
|-------------|-----------|------------|---------------------|
| API Mapas Solares | Alta | Q2 2024 | Mapeo solar avanzado con lidar |
| ARESEP | Media | Q3 2024 | Trámites de interconexión a red |
| ICE Integración | Media | Q3 2024 | Validación de instalaciones |
| Compañías Seguros | Baja | Q4 2024 | Seguros específicos para instalaciones |

### 8.2 Mejoras Planificadas

| Componente | Mejora | Beneficio |
|------------|--------|-----------|
| Sincronización | Motor basado en CRDT | Mejor resolución de conflictos |
| Offline Mode | Persistencia extendida | Operación sin conexión por semanas |
| APIs Fiscales | Migración a v4.4 | Soporte para documentos electrónicos internacionales |
| Calculadora Solar | Modelo IA local | Mayor precisión sin conexión |

## 9. Apéndices

### 9.1 Glosario de Términos

| Término | Definición |
|---------|------------|
| ATV | Administración Tributaria Virtual (sistema de Hacienda) |
| FE | Factura Electrónica |
| NC | Nota de Crédito Electrónica |
| ND | Nota de Débito Electrónica |
| n8n | Plataforma de automatización de flujos de trabajo |
| PWA | Progressive Web Application |

### 9.2 Referencias y Documentación Externa

| Recurso | URL | Descripción |
|---------|-----|------------|
| API Hacienda | https://www.hacienda.go.cr/ATV/ComprobanteElectronico/frmGInformacionComprobantes.aspx | Documentación oficial APIs |
| PVWatts | https://developer.nrel.gov/docs/solar/pvwatts/v6/ | API de cálculo solar |
| n8n Docs | https://docs.n8n.io/ | Documentación oficial n8n |
