# Ejemplos de Flujos de Trabajo n8n para Solar Fluidity

Este documento proporciona ejemplos prácticos de flujos de trabajo en n8n para aprovechar la funcionalidad de Solar Fluidity.

## 1. Workflow: Listar Facturas Electrónicas

Este workflow permite consultar todas las facturas electrónicas generadas en el sistema.

### Nodos necesarios:
1. **Webhook** (Trigger)
   - Método: GET
   - Ruta: `/facturas`
   - Modo: Respuesta por nodo

2. **MCP Client**
   - Conexión: Command Line (STDIO)
   - Command: `python`
   - Arguments: `src/integrations/mcp/solar_fluidity_mcp_server.py`
   - Environments:
     ```
     SUPABASE_URL=https://rlqvkqaownzqelvxnhzd.supabase.co
     SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0
     ```

3. **MCP Read Resource**
   - Resource: `invoices://list`

4. **Respond to Webhook**
   - Respuesta: JSON
   - Cuerpo: `{{$node["MCP Read Resource"].json.result}}`

### Conexiones:
Webhook → MCP Client → MCP Read Resource → Respond to Webhook

## 2. Workflow: Crear Nueva Factura

Este workflow permite crear una nueva factura electrónica en el sistema.

### Nodos necesarios:
1. **Webhook** (Trigger)
   - Método: POST
   - Ruta: `/facturas/nueva`
   - Modo: Respuesta por nodo

2. **MCP Client**
   - Configuración igual que en el workflow anterior

3. **MCP Call Tool**
   - Tool: `create_invoice`
   - Args: 
     ```json
     {
       "cliente_nombre": "{{$json.body.cliente_nombre}}",
       "cliente_cedula": "{{$json.body.cliente_cedula}}",
       "lineas": "{{$json.body.lineas}}"
     }
     ```

4. **Respond to Webhook**
   - Respuesta: JSON
   - Cuerpo: `{{$node["MCP Call Tool"].json.result}}`

### Conexiones:
Webhook → MCP Client → MCP Call Tool → Respond to Webhook

## 3. Workflow: Automatización de Facturas con Gmail

Este workflow envía automáticamente facturas por correo electrónico cuando se crean.

### Nodos necesarios:
1. **Schedule Trigger**
   - Cada 15 minutos 

2. **MCP Client**
   - Configuración igual que en los workflows anteriores

3. **MCP Read Resource**
   - Resource: `invoices://list`

4. **Function**
   - Código:
     ```javascript
     // Filtrar facturas pendientes de envío
     return items.map(item => {
       const facturas = item.json.result || "";
       // Si contiene "Pendiente" y una dirección de correo, la procesamos
       if (facturas.includes("Pendiente") && facturas.includes("@")) {
         return { facturas, pendientes: true };
       }
       return { facturas, pendientes: false };
     });
     ```

5. **IF**
   - Condición: `{{$json.pendientes}}`

6. **Google Gmail**
   - Operación: Enviar Email
   - A: (Extraído de la información de la factura)
   - Asunto: "Su factura electrónica de Solar Fluidity"
   - Cuerpo: Plantilla HTML con detalles de factura

7. **MCP Call Tool** (Para marcar como enviada)
   - Tool: `update_invoice_status`
   - Args:
     ```json
     {
       "invoice_id": "...",
       "new_status": "Enviada"
     }
     ```

### Conexiones:
Schedule → MCP Client → MCP Read Resource → Function → IF → Google Gmail → MCP Call Tool

## 4. Workflow: Notificar Actualizaciones de Proyectos

Este workflow notifica a los clientes cuando hay actualizaciones en sus proyectos.

### Nodos necesarios:
1. **Webhook** (Trigger)
   - Método: POST
   - Ruta: `/proyectos/actualizar`
   - Modo: Respuesta por nodo

2. **MCP Client**
   - Configuración igual que en los workflows anteriores

3. **MCP Call Tool**
   - Tool: `update_project_status`
   - Args:
     ```json
     {
       "project_id": "{{$json.body.project_id}}",
       "new_status": "{{$json.body.new_status}}"
     }
     ```

4. **Google Calendar**
   - Operación: Crear Evento
   - Calendario: Principal
   - Título: `Actualización del proyecto {{$json.body.project_name}}`
   - Descripción: `El proyecto ha cambiado a estado {{$json.body.new_status}}`
   - Fecha de inicio: `{{$today.plus(1, "days")}}`
   - Duración: 60 minutos

5. **Google Gmail**
   - Operación: Enviar Email
   - A: Cliente del proyecto
   - Asunto: `Actualización de su proyecto solar`
   - Cuerpo: Plantilla HTML con detalles de la actualización

6. **Respond to Webhook**
   - Respuesta: JSON
   - Cuerpo: `{"success": true, "message": "Proyecto actualizado y notificaciones enviadas"}`

### Conexiones:
Webhook → MCP Client → MCP Call Tool → Google Calendar → Google Gmail → Respond to Webhook

## Importación de workflows en n8n

Para importar estos workflows:

1. Abre tu instancia de n8n
2. Ve a "Workflows" en el menú principal
3. Haz clic en el botón "Import from File"
4. Sube el archivo JSON del workflow o pega su contenido
5. Configura las credenciales necesarias (Google, Supabase)
6. Activa el workflow con el botón "Active"

## Consideraciones importantes

- Asegúrate de que tu servidor de n8n tenga acceso a la ruta donde se encuentra el script `solar_fluidity_mcp_server.py`
- Para los workflows que utilizan servicios de Google, debes configurar las credenciales de OAuth en n8n
- Los webhooks serán accesibles en `https://tu-dominio-n8n.com/webhook/[ruta]`
