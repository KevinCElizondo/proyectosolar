"""
Agente especializado en facturación electrónica para Solar Fluidity.
"""
from typing import Dict, List, Optional, Literal, Any
from pydantic import BaseModel
import json

from ..utils import call_openai_api, MCPToolProvider

# Dependencias para el agente de facturación
class FacturacionDependencies:
    """
    Dependencias para el agente de facturación.
    """
    def __init__(self, datos_cliente: Dict[str, Any]):
        self.datos_cliente = datos_cliente
        self.mcp_tools = MCPToolProvider(["airtable", "zapier"])

# Sistema prompt para el agente de facturación
SYSTEM_PROMPT = """
Eres un asistente especializado en facturación electrónica para Costa Rica, trabajando para Solar Fluidity.

Tu tarea es crear facturas electrónicas válidas para los clientes, siguiendo la normativa de Costa Rica.

Utiliza las herramientas disponibles para:
1. Crear registros de facturas en Airtable
2. Generar XML/PDF de facturas utilizando las plantillas apropiadas
3. Enviar facturas por correo electrónico a los clientes

Asegúrate de incluir todos los detalles fiscales necesarios (número de cédula, detalles del receptor, 
impuestos, etc.) y seguir el formato oficial para facturas electrónicas en Costa Rica.

Cuando necesites crear una factura, primero busca si el cliente ya existe en el sistema y luego 
procede a crear la factura con los elementos y montos proporcionados.
"""

def create_facturacion_agent(datos_cliente: Dict[str, Any]) -> Agent:
    """
    Crea un agente especializado en facturación.
    
    Args:
        datos_cliente: Datos del cliente y detalles para la factura
    
    Returns:
        Agente de facturación configurado
    """
    dependencies = FacturacionDependencies(datos_cliente)
    
    agent = panticai.Agent(
        model=get_model(),
        system=SYSTEM_PROMPT,
        dependencies=dependencies,
        max_retries=2
    )
    
    return agent

@tool("buscar_cliente_airtable")
def buscar_cliente_airtable(
    cedula: str = "Cédula o identificación fiscal del cliente",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Busca un cliente en Airtable por su cédula.
    
    Args:
        cedula: Cédula o identificación fiscal del cliente
    
    Returns:
        Datos del cliente si existe, o diccionario vacío si no existe
    """
    mcp_tools = run_context.dependencies.mcp_tools
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "list_records")
    
    result = airtable_tool(
        base_id="clientes",
        table_name="Clientes",
        filter_by_formula=f"{{Cedula}}='{cedula}'"
    )
    
    if result.get("records", []):
        return result["records"][0]
    return {"exists": False}

@tool("crear_cliente_airtable")
def crear_cliente_airtable(
    nombre: str = "Nombre completo del cliente",
    cedula: str = "Cédula o identificación fiscal del cliente",
    correo: Optional[str] = "Correo electrónico del cliente",
    telefono: Optional[str] = "Número de teléfono del cliente",
    direccion: Optional[str] = "Dirección del cliente",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Crea un nuevo cliente en Airtable.
    
    Args:
        nombre: Nombre completo del cliente
        cedula: Cédula o identificación fiscal
        correo: Correo electrónico (opcional)
        telefono: Número de teléfono (opcional)
        direccion: Dirección del cliente (opcional)
    
    Returns:
        Datos del cliente creado
    """
    mcp_tools = run_context.dependencies.mcp_tools
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "create_record")
    
    fields = {
        "Nombre": nombre,
        "Cedula": cedula
    }
    
    if correo:
        fields["Correo"] = correo
    if telefono:
        fields["Telefono"] = telefono
    if direccion:
        fields["Direccion"] = direccion
    
    result = airtable_tool(
        base_id="clientes",
        table_name="Clientes",
        fields=fields
    )
    
    return result

@tool("crear_factura")
def crear_factura(
    cliente_id: str = "ID del cliente en Airtable",
    items: List[Dict[str, Any]] = "Lista de items para la factura, cada uno con nombre, cantidad, precio_unitario y subtotal",
    impuesto: float = "Porcentaje de impuesto (13% para IVA)",
    total: float = "Monto total de la factura",
    metodo_pago: str = "Método de pago (efectivo, transferencia, etc.)",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Crea una nueva factura en Airtable y genera el XML/PDF.
    
    Args:
        cliente_id: ID del cliente en Airtable
        items: Lista de items para la factura
        impuesto: Porcentaje de impuesto
        total: Monto total de la factura
        metodo_pago: Método de pago
    
    Returns:
        Datos de la factura creada
    """
    mcp_tools = run_context.dependencies.mcp_tools
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "create_record")
    
    # Crear la factura en Airtable
    fields = {
        "Cliente": [cliente_id],
        "Items": json.dumps(items),
        "Impuesto": impuesto,
        "Total": total,
        "Metodo_Pago": metodo_pago,
        "Estado": "Pendiente",
        "Fecha": datetime.now().strftime('%Y-%m-%d')
    }
    
    factura = airtable_tool(
        base_id="facturacion",
        table_name="Facturas",
        fields=fields
    )
    
    # Llamar a Zapier para generar el XML/PDF
    zapier_tool = mcp_tools.get_tool_for_server("zapier", "run_zap")
    documento_result = zapier_tool(
        zap_id="generar-xml-factura",
        input_data={
            "factura_id": factura["id"],
            "cliente_id": cliente_id,
            "items": items,
            "impuesto": impuesto,
            "total": total
        }
    )
    
    # Actualizar la factura con los enlaces a los documentos
    airtable_update_tool = mcp_tools.get_tool_for_server("airtable", "update_record")
    airtable_update_tool(
        base_id="facturacion",
        table_name="Facturas",
        record_id=factura["id"],
        fields={
            "URL_XML": documento_result.get("url_xml", ""),
            "URL_PDF": documento_result.get("url_pdf", "")
        }
    )
    
    return {
        "factura_id": factura["id"],
        "url_xml": documento_result.get("url_xml", ""),
        "url_pdf": documento_result.get("url_pdf", "")
    }

@tool("enviar_factura_email")
def enviar_factura_email(
    factura_id: str = "ID de la factura en Airtable",
    cliente_email: str = "Correo electrónico del cliente",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Envía la factura por correo electrónico al cliente.
    
    Args:
        factura_id: ID de la factura en Airtable
        cliente_email: Correo electrónico del cliente
        
    Returns:
        Estado del envío
    """
    mcp_tools = run_context.dependencies.mcp_tools
    
    # Obtener los datos de la factura
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "get_record")
    factura = airtable_tool(
        base_id="facturacion",
        table_name="Facturas",
        record_id=factura_id
    )
    
    # Enviar el correo usando Zapier
    zapier_tool = mcp_tools.get_tool_for_server("zapier", "run_zap")
    email_result = zapier_tool(
        zap_id="enviar-factura-email",
        input_data={
            "cliente_email": cliente_email,
            "factura_id": factura_id,
            "url_pdf": factura["fields"].get("URL_PDF", ""),
            "url_xml": factura["fields"].get("URL_XML", ""),
            "total": factura["fields"].get("Total", 0)
        }
    )
    
    # Actualizar el estado de la factura
    airtable_update_tool = mcp_tools.get_tool_for_server("airtable", "update_record")
    airtable_update_tool(
        base_id="facturacion",
        table_name="Facturas",
        record_id=factura_id,
        fields={"Estado": "Enviada"}
    )
    
    return {
        "enviado": True,
        "correo": cliente_email,
        "factura_id": factura_id
    }

def run_facturacion_agent(prompt: str, datos_cliente: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ejecuta el agente de facturación.
    
    Args:
        prompt: Instrucciones para el agente
        datos_cliente: Datos del cliente y detalles para la factura
    
    Returns:
        Resultado de la operación de facturación como texto
    """
    agent = create_facturacion_agent(datos_cliente)
    response = agent(prompt)
    
    # Simulamos un resultado estructurado
    return {
        "resultado": "success",
        "mensaje": response,
        "detalles": {
            "cliente": datos_cliente.get("nombre_cliente", "Cliente"),
            "factura_creada": True,
            "enviada_por_email": True
        }
    }
