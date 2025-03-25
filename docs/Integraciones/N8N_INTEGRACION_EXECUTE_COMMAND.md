# Integración de n8n con Solar Fluidity usando Execute Command

## Introducción

Este documento describe cómo integrar n8n con Solar Fluidity utilizando el nodo Execute Command para procesar facturas electrónicas offline y gestionar proyectos solares/electromecánicos. Esta implementación es una alternativa al uso del nodo MCP Client cuando éste presenta problemas de compatibilidad.

## Configuración del Workflow

### 1. Estructura Básica del Workflow

```
Webhook → Function (procesamiento de datos) → Execute Command → Respuesta
```

### 2. Configuración del Webhook

- **Tipo**: Webhook
- **Método**: POST
- **Autenticación**: Ninguna (o Basic Auth para mayor seguridad)
- **Ruta**: Personalizada (ej: `/facturacion/crear`)

### 3. Configuración del nodo Function

```javascript
// Prepara los datos de facturación desde la solicitud webhook
let invoiceData = {};

// Si los datos vienen en el cuerpo de la solicitud
if (items[0].body) {
  try {
    // Intenta parsear el cuerpo como JSON
    invoiceData = JSON.parse(items[0].body);
  } catch (e) {
    // Si no es JSON válido, usa el cuerpo tal como está
    invoiceData = { rawData: items[0].body };
  }
} else {
  // Si no hay cuerpo, usa los parámetros de la consulta
  invoiceData = items[0].query || {};
}

// Devuelve los datos estructurados
return [{
  invoiceData: JSON.stringify(invoiceData)
}];
```

### 4. Configuración del nodo Execute Command

- **Command**: `python`
- **Arguments**: `/ruta/completa/a/src/integrations/mcp/solar_fluidity_mcp_server.py`
- **Environment Variables**:
  ```
  SUPABASE_URL=https://rlqvkqaownzqelvxnhzd.supabase.co
  SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  INVOICE_DATA={{$json.invoiceData}}
  ```

## Casos de Uso

### 1. Generación de Facturas Electrónicas Offline

Para generar una factura electrónica offline válida para Costa Rica:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "cliente": {
    "nombre": "Empresa Solar CR",
    "identificacion": "3101123456",
    "email": "contacto@empresasolar.cr",
    "telefono": "22345678"
  },
  "items": [
    {
      "descripcion": "Instalación de paneles solares",
      "cantidad": 1,
      "precioUnitario": 500000,
      "impuesto": 13
    }
  ]
}' http://localhost:5678/webhook/tu-id-de-webhook
```

### 2. Gestión de Proyectos Solares

Para crear un nuevo proyecto:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "nombre": "Instalación Residencial Los Yoses",
  "cliente": "3101123456",
  "ubicacion": "San José, Los Yoses",
  "tipo": "residencial",
  "capacidad": "5kW",
  "fechaInicio": "2025-04-01"
}' http://localhost:5678/webhook/tu-id-de-webhook-proyectos
```

## Modificaciones al Servidor MCP

Para asegurar que el servidor MCP pueda recibir los datos del entorno correctamente, asegúrate de que `solar_fluidity_mcp_server.py` incluya:

```python
import os
import json

# Obtener datos de factura de variable de entorno
invoice_data_str = os.environ.get('INVOICE_DATA', '{}')
invoice_data = json.loads(invoice_data_str)

# Conectar con Supabase
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
```

## Solución de Problemas

Si encuentras errores al ejecutar el workflow:

1. **Error 404 en Webhook**: Asegúrate de que el workflow esté activado.
2. **Error en Execute Command**: Verifica que la ruta al script sea correcta.
3. **Error en datos de Supabase**: Confirma que las variables de entorno son válidas.

## Mantenimiento

Para actualizar esta integración:

1. Actualiza `solar_fluidity_mcp_server.py` cuando sea necesario
2. Modifica las variables de entorno en el nodo Execute Command
3. Activa nuevamente el workflow después de cada modificación
