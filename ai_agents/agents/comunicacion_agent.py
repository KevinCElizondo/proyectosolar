"""
Agente especializado en comunicación con clientes para Solar Fluidity.
"""
from typing import Dict, List, Optional, Literal, Any
import panticai
from panticai.agent import Agent
from panticai.run import run_context
from panticai.tools import tool
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

from ..utils import get_model, MCPToolProvider

# Dependencias para el agente de comunicación
class ComunicacionDependencies:
    """
    Dependencias para el agente de comunicación.
    """
    def __init__(self, datos_cliente: Dict[str, Any]):
        self.datos_cliente = datos_cliente
        self.mcp_tools = MCPToolProvider(["gmail", "airtable", "zapier"])

# Sistema prompt para el agente de comunicación
SYSTEM_PROMPT = """
Eres un asistente especializado en comunicación con clientes para Solar Fluidity, una empresa 
de servicios solares y electromecánicos en Costa Rica.

Tu tarea es mantener una comunicación clara, profesional y efectiva con los clientes, 
proporcionando actualizaciones sobre sus proyectos, respondiendo preguntas y gestionando 
cualquier inquietud.

Utiliza las herramientas disponibles para:
1. Enviar correos electrónicos a través de Gmail
2. Consultar información de clientes y proyectos en Airtable
3. Crear y enviar notificaciones por diversos canales

Tu comunicación debe ser siempre cortés y profesional. Utiliza un tono amigable pero formal.
Siempre firma tus comunicaciones como "Equipo de Solar Fluidity".

Cuando redactes correos electrónicos:
- Usa un saludo apropiado (Estimado/a [Nombre])
- Sé claro y conciso
- Proporciona toda la información relevante
- Incluye los próximos pasos cuando sea apropiado
- Añade información de contacto
- Usa una despedida cordial

Para comunicaciones en español, asegúrate de usar el tratamiento formal ("usted") a menos 
que el cliente haya establecido una comunicación informal previa.
"""

def create_comunicacion_agent(datos_cliente: Dict[str, Any]) -> Agent:
    """
    Crea un agente especializado en comunicación con clientes.
    
    Args:
        datos_cliente: Datos del cliente para la comunicación
    
    Returns:
        Agente de comunicación configurado
    """
    dependencies = ComunicacionDependencies(datos_cliente)
    
    logger.info(f"Creating Comunicacion Agent with client data keys: {datos_cliente.keys()}")
    agent = panticai.Agent(
        model=get_model(),
        system=SYSTEM_PROMPT,
        dependencies=dependencies,
        max_retries=2
    )
    
    return agent

@tool("enviar_correo")
def enviar_correo(
    destinatario: str = "Correo electrónico del destinatario",
    asunto: str = "Asunto del correo",
    contenido: str = "Contenido del correo en formato HTML",
    cc: Optional[List[str]] = "Lista de correos en copia (opcional)",
    adjuntos: Optional[List[str]] = "Lista de URLs de archivos adjuntos (opcional)",
    run_context: run_context = None
) -> Dict[str, Any]:
    logger.info(f"Executing tool: enviar_correo to: {destinatario} with subject: '{asunto}'")
    """
    Envía un correo electrónico a través de Gmail.
    
    Args:
        destinatario: Correo electrónico del destinatario
        asunto: Asunto del correo
        contenido: Contenido del correo en formato HTML
        cc: Lista de correos en copia (opcional)
        adjuntos: Lista de URLs de archivos adjuntos (opcional)
    
    Returns:
        Estado del envío del correo
    """
    mcp_tools = run_context.dependencies.mcp_tools
    gmail_tool = mcp_tools.get_tool_for_server("gmail", "send_email")
    
    email_data = {
        "to": destinatario,
        "subject": asunto,
        "body": contenido,
        "contentType": "text/html"
    }
    
    if cc:
        email_data["cc"] = cc
    
    if adjuntos:
        email_data["attachments"] = adjuntos
    
    logger.debug(f"Calling Gmail send_email tool with data: {email_data}")
    result = gmail_tool(**email_data)
    
    # Registrar la comunicación en Airtable
    logger.debug(f"Gmail send_email result: {result}. Logging communication to Airtable...")
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "create_record")
    cliente_nombre = run_context.dependencies.datos_cliente.get("nombre", "Cliente")
    
    airtable_tool(
        base_id="comunicaciones",
        table_name="Comunicaciones",
        fields={
            "Cliente": cliente_nombre,
            "Tipo": "Email",
            "Asunto": asunto,
            "Contenido": contenido,
            "Fecha": datetime.now().strftime('%Y-%m-%d'),
            "Estado": "Enviado"
        }
    )
    logger.debug("Airtable create_record for communication log finished.")
    
    return result
    logger.info(f"Tool enviar_correo finished. Result: {result}")
    return result

@tool("obtener_plantilla_correo")
def obtener_plantilla_correo(
    tipo_plantilla: str = "Tipo de plantilla (bienvenida, actualización, finalización, etc.)",
    run_context: run_context = None
) -> Dict[str, Any]:
    logger.info(f"Executing tool: obtener_plantilla_correo for type: {tipo_plantilla}")
    """
    Obtiene una plantilla de correo desde Airtable.
    
    Args:
        tipo_plantilla: Tipo de plantilla a obtener
    
    Returns:
        Plantilla de correo con campos para personalizar
    """
    mcp_tools = run_context.dependencies.mcp_tools
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "list_records")
    
    logger.debug("Calling Airtable list_records tool for plantilla...")
    result = airtable_tool(
        base_id="comunicaciones",
        table_name="Plantillas",
        filter_by_formula=f"{{Tipo}}='{tipo_plantilla}'"
    )
    
    logger.debug(f"Airtable list_records result for plantilla: {result}")
    if result.get("records", []):
        return {
            "plantilla": result["records"][0]["fields"]["Contenido"],
            "asunto": result["records"][0]["fields"]["Asunto"],
            "tipo": tipo_plantilla
        }
    
    return {
        "error": "Plantilla no encontrada",
        "tipos_disponibles": ["bienvenida", "actualización", "finalización", "recordatorio", "cotización"]
    }
    final_result = {
        "plantilla": result["records"][0]["fields"]["Contenido"],
        "asunto": result["records"][0]["fields"]["Asunto"],
        "tipo": tipo_plantilla
    } if result.get("records", []) else {
        "error": "Plantilla no encontrada",
        "tipos_disponibles": ["bienvenida", "actualización", "finalización", "recordatorio", "cotización"]
    }
    logger.info(f"Tool obtener_plantilla_correo finished. Found: {'error' not in final_result}")
    return final_result

@tool("enviar_notificacion_whatsapp")
def enviar_notificacion_whatsapp(
    numero_telefono: str = "Número de teléfono con código de país (506XXXXXXXX)",
    mensaje: str = "Mensaje a enviar por WhatsApp",
    run_context: run_context = None
) -> Dict[str, Any]:
    logger.info(f"Executing tool: enviar_notificacion_whatsapp to: {numero_telefono}")
    """
    Envía una notificación por WhatsApp utilizando Zapier.
    
    Args:
        numero_telefono: Número de teléfono con código de país
        mensaje: Mensaje a enviar
    
    Returns:
        Estado del envío
    """
    mcp_tools = run_context.dependencies.mcp_tools
    zapier_tool = mcp_tools.get_tool_for_server("zapier", "run_zap")
    
    logger.debug(f"Calling Zapier run_zap tool 'enviar-whatsapp'...")
    result = zapier_tool(
        zap_id="enviar-whatsapp",
        input_data={
            "telefono": numero_telefono,
            "mensaje": mensaje
        }
    )
    
    logger.debug(f"Zapier 'enviar-whatsapp' result: {result}. Logging communication to Airtable...")
    # Registrar la comunicación en Airtable
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "create_record")
    cliente_nombre = run_context.dependencies.datos_cliente.get("nombre", "Cliente")
    
    airtable_tool(
        base_id="comunicaciones",
        table_name="Comunicaciones",
        fields={
            "Cliente": cliente_nombre,
            "Tipo": "WhatsApp",
            "Contenido": mensaje,
            "Fecha": datetime.now().strftime('%Y-%m-%d'),
            "Estado": "Enviado"
        }
    )
    logger.debug("Airtable create_record for communication log finished.")
    
    return result
    logger.info(f"Tool enviar_notificacion_whatsapp finished. Result: {result}")
    return result

@tool("obtener_historial_comunicaciones")
def obtener_historial_comunicaciones(
    cliente_id: str = "ID del cliente en Airtable",
    run_context: run_context = None
) -> Dict[str, Any]:
    logger.info(f"Executing tool: obtener_historial_comunicaciones for client_id: {cliente_id}")
    """
    Obtiene el historial de comunicaciones con un cliente.
    
    Args:
        cliente_id: ID del cliente en Airtable
    
    Returns:
        Historial de comunicaciones
    """
    mcp_tools = run_context.dependencies.mcp_tools
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "list_records")
    
    logger.debug("Calling Airtable list_records tool for communication history...")
    result = airtable_tool(
        base_id="comunicaciones",
        table_name="Comunicaciones",
        filter_by_formula=f"{{Cliente}}='{cliente_id}'",
        sort=[{"field": "Fecha", "direction": "desc"}]
    )
    
    logger.debug(f"Airtable list_records result for history: {result}")
    return {
        "cliente_id": cliente_id,
        "comunicaciones": result.get("records", [])
    }
    final_result = {
        "cliente_id": cliente_id,
        "comunicaciones": result.get("records", [])
    }
    logger.info(f"Tool obtener_historial_comunicaciones finished. Found {len(final_result['comunicaciones'])} records.")
    return final_result

def run_comunicacion_agent(prompt: str, datos_cliente: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ejecuta el agente de comunicación con clientes.
    
    Args:
        prompt: Instrucciones para el agente
        datos_cliente: Datos del cliente para la comunicación
    
    Returns:
        Resultado de la comunicación
    """
    logger.info(f"Executing Comunicacion Agent with prompt: '{prompt[:50]}...' Client data keys: {datos_cliente.keys()}")
    agent = create_comunicacion_agent(datos_cliente)
    response = agent.run(prompt)
    logger.debug("Calling internal agent run (panticai?)...")
    return response.output
    logger.info(f"Comunicacion Agent finished. Result output type: {type(response.output)}")
    return response.output
