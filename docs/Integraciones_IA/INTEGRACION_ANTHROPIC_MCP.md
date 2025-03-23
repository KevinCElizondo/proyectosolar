# Documento Técnico: Integración de Anthropic MCP, n8n y Supabase para Solar Fluidity

**Versión 1.0 | Marzo 2025**

## Resumen Ejecutivo

Este documento detalla la integración de tecnologías avanzadas de IA (Anthropic MCP) con nuestra plataforma de automatización (n8n) y base de datos (Supabase) para potenciar las capacidades de Solar Fluidity. Esta integración permitirá automatizar tareas complejas relacionadas con la facturación electrónica, gestión de proyectos solares y electromecánicos, y mejorar la experiencia del usuario mediante asistentes virtuales inteligentes.

---

## 1. Introducción

### 1.1 ¿Qué es Anthropic MCP?

**Model Control Protocol (MCP)** es un estándar desarrollado por Anthropic para controlar modelos de lenguaje como **Claude**. MCP actúa como un "puerto USB-C para aplicaciones de IA", estandarizando la forma en que las herramientas se conectan con los modelos de lenguaje (LLMs).

### 1.2 Beneficios para Solar Fluidity

La integración de estas tecnologías permitirá:

- **Automatización Inteligente**: Procesamiento automático de facturas y documentos fiscales.
- **Asistencia Contextual**: Asesoramiento en tiempo real para clientes sobre gestión de proyectos solares.
- **Seguridad Mejorada**: Control estricto sobre las respuestas del modelo, evitando información errónea sobre temas fiscales o legales.
- **Escalabilidad**: Adaptarse a volúmenes crecientes de datos sin aumentar la carga operativa.

---

## 2. Arquitectura del Sistema

### 2.1 Componentes Clave

| **Componente**         | **Rol en Solar Fluidity**                                                                 |
|------------------------|-------------------------------------------------------------------------------------------|
| **Anthropic Claude**   | Modelo de lenguaje para interpretar consultas y generar respuestas sobre facturación e información de proyectos. |
| **MCP**                | Control y restricción de las capacidades de Claude según políticas predefinidas. |
| **n8n**                | Orquestación de flujos de trabajo entre sistemas (Supabase, API de Hacienda, Claude). |
| **Supabase**           | Almacenamiento de datos de clientes, facturas y proyectos con activación de eventos. |

### 2.2 Diagrama de Arquitectura

```
[Cliente Solar Fluidity]
         │
         ▼
[Interfaz Web/Móvil] ◄───► [API Gateway]
         │                      │
         │                      ▼
         │              [Servicios Core]
         │              (Facturación/Proyectos)
         │                      │
         ▼                      ▼
[MCP Servers] ◄───────► [n8n Workflows] ◄───► [Supabase]
    │                         │                   │
    ▼                         ▼                   ▼
[Claude API]             [Integraciones]     [PostgreSQL]
                         (Email, Hacienda)    (RLS activo)
```

---

## 3. Escenarios de Uso para Solar Fluidity

### 3.1 Asistente Virtual para Facturación Electrónica

**Problema**: Clientes con dudas sobre los procesos de facturación electrónica en Costa Rica.

**Solución MCP**:
1. Cliente envía consulta por chat/email.
2. n8n activa flujo que consulta datos relevantes en Supabase.
3. Claude recibe contexto del cliente + reglas MCP que le impiden dar consejos fiscales incorrectos.
4. Se genera respuesta apropiada con instrucciones precisas sobre facturación offline.

**Política MCP Ejemplo**:
```yaml
- type: content_policy
  rules:
    - restrict: [tax_advice_costa_rica]
    - only_reference: ["oficial_mh_regulations"]
    - always_mention: ["this_is_informational_only"]
```

### 3.2 Automatización de Procesamiento de Documentos XML

**Problema**: Conversión y validación de facturas XML para el sistema tributario costarricense.

**Solución**:
1. Cliente sube XML/PDF a Solar Fluidity.
2. n8n procesa el documento mediante flujo automatizado.
3. Claude (vía MCP) analiza estructura y extrae datos críticos.
4. Supabase almacena datos estructurados para reportes y dashboard.
5. En caso de errores, Claude sugiere correcciones específicas.

### 3.3 Planificación Inteligente de Proyectos Solares

**Implementación**:
1. Cliente ingresa datos básicos del proyecto solar/electromecánico.
2. n8n activa flujo de estimación y planificación.
3. Claude (restringido por MCP) genera plan de proyecto basado en históricos.
4. Se sugieren cronogramas, materiales y recursos específicos para Costa Rica.

---

## 4. Implementación Técnica

### 4.1 Servidores MCP Requeridos

| **Servidor MCP**        | **Propósito en Solar Fluidity**                                 |
|-------------------------|----------------------------------------------------------------|
| **filesystem-server**   | Acceso a plantillas de facturas y documentos del proyecto      |
| **supabase-server**     | Consulta y actualización de datos de clientes y facturas       |
| **brave-search**        | Búsqueda de normativas fiscales actualizadas                   |
| **sequential-thinking** | Análisis paso a paso de proyectos solares                      |
| **stagehand**           | Automatización web para trámites con Ministerio de Hacienda    |

### 4.2 Flujos n8n Principales

1. **Procesamiento de Facturas Electrónicas**
   - Triggers: Nuevo documento subido a Supabase
   - Acciones: Análisis con Claude, validación, almacenamiento, notificaciones

2. **Asistente de Consultas Fiscales**
   - Triggers: Mensaje de cliente en chat/email
   - Acciones: Búsqueda contextual, consulta a Claude (con restricciones MCP), respuesta

3. **Planificador de Proyectos**
   - Triggers: Creación de nuevo proyecto
   - Acciones: Estimación de tiempo/recursos con Claude, generación de cronograma

---

## 5. Configuraciones y Ejemplo de Código

### 5.1 Configuración de n8n para MCP

```json
// Ejemplo de flujo en n8n para asistente de facturación
{
  "nodes": [
    {
      "type": "supabaseTrigger",
      "webhook": "new_customer_question",
      "parameters": {
        "table": "support_requests",
        "event": "INSERT"
      }
    },
    {
      "type": "anthropicMCP",
      "parameters": {
        "apiKey": "{{$env.ANTHROPIC_API_KEY}}",
        "prompt": "Responde esta consulta sobre facturación electrónica en Costa Rica: {{$json.question}}",
        "mcp_constraints": [
          "no_tax_specific_advice",
          "reference_official_sources_only"
        ],
        "model": "claude-3-opus-20240229"
      }
    },
    {
      "type": "supabaseUpdateItem",
      "parameters": {
        "table": "support_requests",
        "id": "{{$json.id}}",
        "data": {
          "response": "{{$json.claude_response}}",
          "status": "completed"
        }
      }
    },
    {
      "type": "sendEmail",
      "parameters": {
        "to": "{{$json.email}}",
        "subject": "Respuesta a su consulta sobre facturación electrónica",
        "body": "{{$json.claude_response}}"
      }
    }
  ]
}
```

### 5.2 Configuración de MCP para Restricciones en Facturación

```yaml
# Políticas MCP para asistente de facturación
- type: content_policy
  name: "facturacion_electronica_cr"
  rules:
    - block:
        - specific_tax_amounts
        - legal_advice
        - specific_deadlines
    - require_disclaimer: "Esta información es educativa y no constituye asesoría fiscal profesional."
    - allow_references:
        - "https://www.hacienda.go.cr/docs/facturaelectronica/"
        - "https://www.documentos-oficiales-tributarios.cr"
```

### 5.3 Integración con Supabase (Row Level Security)

```sql
-- Políticas de seguridad para tablas de facturas
CREATE POLICY "Facturas visibles solo para propietarios"
  ON public.invoices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger para activar n8n cuando llega una nueva factura
CREATE FUNCTION notify_new_invoice() RETURNS TRIGGER AS $$
BEGIN
  PERFORM http_post(
    'https://n8n.solarfluidity.com/webhook/invoice',
    json_build_object('invoice_id', NEW.id, 'user_id', NEW.user_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_invoice
  AFTER INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE PROCEDURE notify_new_invoice();
```

---

## 6. Seguridad y Consideraciones Éticas

### 6.1 Protección de Datos

- **Encriptación**: Todos los datos fiscales y personales se encriptan en reposo y tránsito.
- **Aislamiento**: Los servidores MCP operan en redes aisladas sin acceso a información sensible.
- **Anonimización**: Se eliminan datos personales antes de enviarlos a Claude.

### 6.2 Cumplimiento Regulatorio

- **GDPR/LGPD**: Cumplimiento con regulaciones de protección de datos.
- **Normativa Fiscal CR**: Adherencia a requisitos del Ministerio de Hacienda.
- **Seguridad Cloud**: Implementación de mejores prácticas para servicios cloud.

### 6.3 Transparencia con Usuarios

- Notificaciones claras cuando interactúan con respuestas generadas por IA.
- Explicación de las capacidades y limitaciones del asistente.
- Opción de solicitar intervención humana en cualquier momento.

---

## 7. Monitoreo y Mantenimiento

### 7.1 Métricas de Rendimiento

- Tasa de satisfacción en respuestas del asistente virtual.
- Tiempo promedio de procesamiento de facturas.
- Precisión en análisis de documentos fiscales.

### 7.2 Actualizaciones y Mejoras

- Actualización trimestral de políticas MCP según cambios regulatorios.
- Revisión mensual de prompts y configuraciones para mejorar calidad.
- Incorporación progresiva de nuevos casos de uso.

---

## 8. Recursos y Referencias

- [Documentación Oficial de Anthropic MCP](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [n8n + Anthropic Integration](https://docs.n8n.io/integrations/anthropic/)
- [Supabase Edge Functions](https://supabase.io/docs/guides/functions)
- [Ministerio de Hacienda CR - Documentación de Facturación Electrónica](https://www.hacienda.go.cr/contenido/14355-factura-electronica)

---

## 9. Contacto y Soporte

Para consultas relacionadas con esta integración:
- Email: soporte@solarfluidity.com
- Documentación interna: `/docs/Integraciones_IA/`
- Repositorio de código: `github.com/solarfluidity/mcp-integrations`

---

*Documento preparado por el equipo técnico de Solar Fluidity*
*Última actualización: Marzo 2025*
