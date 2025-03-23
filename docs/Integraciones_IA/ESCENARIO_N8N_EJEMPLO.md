# Escenario de Ejemplo n8n: Asistente de Facturación con Anthropic MCP

**Versión 1.0 | Marzo 2025**

Este documento proporciona un ejemplo paso a paso de cómo implementar un asistente de facturación electrónica para Solar Fluidity utilizando n8n y Anthropic MCP.

## Descripción del Escenario

El escenario "Asistente de Facturación" automatiza la respuesta a consultas de clientes sobre la facturación electrónica, utilizando:

- **Claude** (a través de MCP) para generar respuestas precisas y éticas
- **Brave Search MCP** para obtener información actualizada sobre normativas fiscales
- **Supabase MCP** para acceder a datos del cliente y plantillas de respuesta
- **n8n** para orquestar todo el flujo de trabajo

## Beneficios

- Respuestas inmediatas a clientes 24/7
- Información actualizada y precisa sobre regulaciones fiscales
- Reducción de carga en equipo de soporte
- Experiencia consistente para todos los usuarios

## Prerrequisitos

- n8n instalado y configurado
- Servidores MCP funcionando (brave-search, supabase, filesystem)
- API Key de Anthropic configurada
- Base de datos Supabase con tablas de soporte configuradas

## Implementación Paso a Paso

### 1. Crear un Nuevo Flujo de Trabajo en n8n

1. Abre la interfaz de n8n (http://localhost:5678)
2. Haz clic en "Create new workflow"
3. Nombra el flujo: "Asistente de Facturación Electrónica"

### 2. Configurar el Trigger de Webhook

1. Añade un nodo "Webhook"
2. Configura:
   - Authentication: None
   - HTTP Method: POST
   - Path: `/webhook/facturacion-consulta`
   - Response Code: 200
   - Response Data: noData

### 3. Obtener Información del Cliente

1. Añade un nodo "Supabase"
2. Configura:
   - Operation: Select
   - Table: clients
   - Filters: `id = {{$json.client_id}}`
   - Limit: 1

### 4. Buscar Información Actualizada con Brave Search MCP

1. Añade un nodo "HTTP Request" (o nodo MCP si disponible)
2. Configura:
   - URL: `http://localhost:8193/execute`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "tool": "search",
       "parameters": {
         "query": "{{$json.question}} facturación electrónica Costa Rica normativa actualizada"
       }
     }
     ```

### 5. Buscar Documentos Internos con Filesystem MCP

1. Añade otro nodo "HTTP Request"
2. Configura:
   - URL: `http://localhost:8191/execute`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "tool": "search_files",
       "parameters": {
         "directory": "/documentos/facturacion",
         "query": "{{$json.keywords}}",
         "max_results": 3
       }
     }
     ```

### 6. Generar Respuesta con Claude (a través de MCP)

1. Añade un nodo "Anthropic"
2. Configura:
   - API Key: `{{$env.ANTHROPIC_API_KEY}}`
   - Model: claude-3-opus-20240229
   - System Prompt:
     ```
     Eres un asistente especializado en facturación electrónica de Costa Rica para Solar Fluidity.
     
     RESTRICCIONES IMPORTANTES:
     - No proporciones asesoramiento fiscal específico
     - No indiques plazos exactos de presentación
     - No interpretes la legislación fiscal
     - Incluye siempre un disclaimer sobre consultar a un profesional
     
     CONTEXTO DEL CLIENTE:
     {{$node["Supabase"].json.client_info}}
     
     INFORMACIÓN DE BÚSQUEDA WEB:
     {{$node["Brave Search MCP"].json.results}}
     
     DOCUMENTACIÓN INTERNA:
     {{$node["Filesystem MCP"].json.file_contents}}
     ```
   - Human Prompt: `{{$json.question}}`
   - Max Tokens: 1000

### 7. Guardar la Respuesta en Supabase

1. Añade un nodo "Supabase"
2. Configura:
   - Operation: Insert
   - Table: support_responses
   - Fields:
     - client_id: `{{$json.client_id}}`
     - question: `{{$json.question}}`
     - response: `{{$node["Anthropic"].json.content[0].text}}`
     - created_at: `{{$now.iso}}`

### 8. Enviar Email al Cliente

1. Añade un nodo "Send Email"
2. Configura:
   - To: `{{$node["Supabase"].json.email}}`
   - Subject: "Respuesta a su consulta sobre Facturación Electrónica"
   - Body:
     ```html
     <p>Estimado/a {{$node["Supabase"].json.name}},</p>
     
     <p>Gracias por contactar al soporte de Solar Fluidity. A continuación, encontrará la respuesta a su consulta:</p>
     
     <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
       {{$node["Anthropic"].json.content[0].text}}
     </div>
     
     <p><strong>Nota:</strong> Esta respuesta ha sido generada automáticamente. Si necesita asistencia adicional, responda a este correo o contáctenos directamente.</p>
     
     <p>Saludos cordiales,<br>
     Equipo de Soporte<br>
     Solar Fluidity</p>
     ```

### 9. Configurar Manejo de Errores

1. Añade nodos "IF" después de cada solicitud HTTP/API para verificar respuestas exitosas
2. Para cada rama de error, añade notificaciones al equipo de soporte

## Diagrama del Flujo

```
[Webhook] → [Supabase: Cliente] → [Brave Search MCP] → [Filesystem MCP] → [Anthropic] → [Supabase: Guardar] → [Send Email]
                   ↓                       ↓                    ↓                ↓
                [Error]                 [Error]              [Error]          [Error]
                   ↓                       ↓                    ↓                ↓
            [Notificación]          [Notificación]       [Notificación]   [Notificación]
```

## Prueba del Escenario

1. Activa el flujo de trabajo en n8n
2. Usa la siguiente solicitud POST para probar (reemplaza los valores):

```bash
curl -X POST http://localhost:5678/webhook/facturacion-consulta \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "12345",
    "question": "¿Cómo debo emitir una factura electrónica cuando no hay internet?",
    "keywords": "factura offline sin conexión"
  }'
```

3. Verifica que la respuesta se envíe al correo electrónico del cliente
4. Confirma que la respuesta se almacene en Supabase

## Mejoras Futuras

- Implementar sistema de feedback para respuestas del asistente
- Añadir más fuentes de datos para respuestas más completas
- Crear un historial de consultas por cliente
- Añadir sugerencias proactivas basadas en patrones de consulta
- Integrar con sistema de tickets para escalamiento automático

---

## Código JSON del Flujo Completo

```json
{
  "nodes": [
    {
      "parameters": {
        "path": "webhook/facturacion-consulta",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "operation": "select",
        "table": "clients",
        "filter": "id={{$json.client_id}}",
        "limit": 1
      },
      "id": "2",
      "name": "Supabase: Cliente",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        450,
        300
      ]
    },
    {
      "parameters": {
        "url": "http://localhost:8193/execute",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": "{\n  \"tool\": \"search\",\n  \"parameters\": {\n    \"query\": \"{{$json.question}} facturación electrónica Costa Rica normativa actualizada\"\n  }\n}"
      },
      "id": "3",
      "name": "Brave Search MCP",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        650,
        300
      ]
    },
    {
      "parameters": {
        "url": "http://localhost:8191/execute",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": "{\n  \"tool\": \"search_files\",\n  \"parameters\": {\n    \"directory\": \"/documentos/facturacion\",\n    \"query\": \"{{$json.keywords}}\",\n    \"max_results\": 3\n  }\n}"
      },
      "id": "4",
      "name": "Filesystem MCP",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        850,
        300
      ]
    },
    {
      "parameters": {
        "authentication": "apiKey",
        "apiKey": "={{$env.ANTHROPIC_API_KEY}}",
        "model": "claude-3-opus-20240229",
        "prompt": {
          "system": "Eres un asistente especializado en facturación electrónica de Costa Rica para Solar Fluidity.\n\nRESTRICCIONES IMPORTANTES:\n- No proporciones asesoramiento fiscal específico\n- No indiques plazos exactos de presentación\n- No interpretes la legislación fiscal\n- Incluye siempre un disclaimer sobre consultar a un profesional\n\nCONTEXTO DEL CLIENTE:\n{{$node[\"Supabase: Cliente\"].json.client_info}}\n\nINFORMACIÓN DE BÚSQUEDA WEB:\n{{$node[\"Brave Search MCP\"].json.results}}\n\nDOCUMENTACIÓN INTERNA:\n{{$node[\"Filesystem MCP\"].json.file_contents}}",
          "user": "={{$json.question}}"
        },
        "options": {
          "maxTokens": 1000
        }
      },
      "id": "5",
      "name": "Anthropic",
      "type": "n8n-nodes-base.anthropic",
      "typeVersion": 1,
      "position": [
        1050,
        300
      ]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "support_responses",
        "fields": {
          "client_id": "={{$json.client_id}}",
          "question": "={{$json.question}}",
          "response": "={{$node[\"Anthropic\"].json.content[0].text}}",
          "created_at": "={{$now.iso}}"
        }
      },
      "id": "6",
      "name": "Supabase: Guardar",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        1250,
        300
      ]
    },
    {
      "parameters": {
        "fromEmail": "soporte@solarfluidity.com",
        "toEmail": "={{$node[\"Supabase: Cliente\"].json.email}}",
        "subject": "Respuesta a su consulta sobre Facturación Electrónica",
        "html": "<p>Estimado/a {{$node[\"Supabase: Cliente\"].json.name}},</p>\n\n<p>Gracias por contactar al soporte de Solar Fluidity. A continuación, encontrará la respuesta a su consulta:</p>\n\n<div style=\"background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;\">\n  {{$node[\"Anthropic\"].json.content[0].text}}\n</div>\n\n<p><strong>Nota:</strong> Esta respuesta ha sido generada automáticamente. Si necesita asistencia adicional, responda a este correo o contáctenos directamente.</p>\n\n<p>Saludos cordiales,<br>\nEquipo de Soporte<br>\nSolar Fluidity</p>"
      },
      "id": "7",
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [
        1450,
        300
      ]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Supabase: Cliente",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase: Cliente": {
      "main": [
        [
          {
            "node": "Brave Search MCP",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Brave Search MCP": {
      "main": [
        [
          {
            "node": "Filesystem MCP",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filesystem MCP": {
      "main": [
        [
          {
            "node": "Anthropic",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Anthropic": {
      "main": [
        [
          {
            "node": "Supabase: Guardar",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase: Guardar": {
      "main": [
        [
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

*Documento preparado por el equipo técnico de Solar Fluidity*
*Última actualización: Marzo 2025*
