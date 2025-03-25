"""
Solar Fluidity MCP Server

Este servidor MCP proporciona herramientas y recursos para gestionar:
1. Facturas electrónicas (pendientes de firma digital)
2. Proyectos solares/electromecánicos
3. Integración con Supabase como backend

El servidor se puede ejecutar directamente o integrarse con la aplicación principal.
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

import httpx
from supabase import create_client, Client
from mcp.server.fastmcp import FastMCP, Context, Image

# Configuración de Supabase 
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

class SupabaseContext:
    """Contexto de la aplicación para acceder a Supabase."""
    def __init__(self, client: Client):
        self.client = client

@asynccontextmanager
async def lifespan(server: FastMCP) -> AsyncIterator[SupabaseContext]:
    """Gestiona el ciclo de vida del servidor MCP."""
    # Inicializar el cliente de Supabase
    print("Iniciando conexión con Supabase...")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Variables de entorno SUPABASE_URL y SUPABASE_KEY no encontradas")
        print("Ejecute el servidor con:")
        print("SUPABASE_URL=su_url SUPABASE_KEY=su_key python solar_fluidity_mcp_server.py")
        supabase = None
    else:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Proporcionar el contexto para que esté disponible durante las solicitudes
        yield SupabaseContext(client=supabase)
    finally:
        # Limpiar recursos (en este caso, no es necesario con Supabase)
        print("Cerrando conexión con Supabase...")

# Crear un servidor MCP con nombre y dependencias
mcp = FastMCP(
    "Solar Fluidity",
    dependencies=["supabase", "httpx", "pydantic"],
    lifespan=lifespan
)

# ========================
# RECURSOS (RESOURCES)
# ========================

@mcp.resource("invoices://list")
def get_invoices(ctx: Context) -> str:
    """Obtener lista de facturas electrónicas."""
    if not ctx.request_context.lifespan_context["client"]:
        return "Error: No hay conexión a Supabase. Verifique las credenciales."
    
    try:
        # Obtener facturas desde Supabase
        supabase = ctx.request_context.lifespan_context["client"]
        result = supabase.table("facturas").select("*").execute()
        
        # Formatear el resultado como un string legible
        invoices = result.data
        if not invoices:
            return "No se encontraron facturas electrónicas."
        
        # Crear texto formateado con las facturas
        formatted_invoices = "Facturas Electrónicas:\n\n"
        for invoice in invoices:
            formatted_invoices += f"- ID: {invoice['id']}\n"
            formatted_invoices += f"  Fecha: {invoice.get('fecha', 'N/A')}\n"
            formatted_invoices += f"  Cliente: {invoice.get('cliente_nombre', 'N/A')}\n"
            formatted_invoices += f"  Monto: ₡{invoice.get('monto_total', 0):,.2f}\n"
            formatted_invoices += f"  Estado: {invoice.get('estado', 'Pendiente')}\n\n"
        
        return formatted_invoices
    
    except Exception as e:
        return f"Error al obtener facturas: {str(e)}"

@mcp.resource("invoices://{invoice_id}")
def get_invoice_details(invoice_id: str, ctx: Context) -> str:
    """Obtener detalles de una factura específica por ID."""
    if not ctx.request_context.lifespan_context["client"]:
        return "Error: No hay conexión a Supabase. Verifique las credenciales."
    
    try:
        # Obtener factura desde Supabase
        supabase = ctx.request_context.lifespan_context["client"]
        result = supabase.table("facturas").select("*").eq("id", invoice_id).execute()
        
        invoice = result.data[0] if result.data else None
        if not invoice:
            return f"No se encontró factura con ID: {invoice_id}"
        
        # Obtener líneas de factura relacionadas
        lines_result = supabase.table("factura_lineas").select("*").eq("factura_id", invoice_id).execute()
        lines = lines_result.data
        
        # Crear texto formateado con los detalles completos
        formatted_details = f"FACTURA ELECTRÓNICA #{invoice['id']}\n"
        formatted_details += "=" * 50 + "\n\n"
        formatted_details += f"Fecha de emisión: {invoice.get('fecha', 'N/A')}\n"
        formatted_details += f"Cliente: {invoice.get('cliente_nombre', 'N/A')}\n"
        formatted_details += f"Cédula: {invoice.get('cliente_cedula', 'N/A')}\n"
        formatted_details += f"Estado: {invoice.get('estado', 'Pendiente')}\n\n"
        
        formatted_details += "DETALLE DE LÍNEAS:\n"
        formatted_details += "-" * 50 + "\n"
        
        for line in lines:
            formatted_details += f"- {line.get('descripcion', 'Producto/Servicio')}\n"
            formatted_details += f"  Cantidad: {line.get('cantidad', 1)}\n"
            formatted_details += f"  Precio unitario: ₡{line.get('precio_unitario', 0):,.2f}\n"
            formatted_details += f"  Subtotal: ₡{line.get('subtotal', 0):,.2f}\n\n"
        
        formatted_details += "-" * 50 + "\n"
        formatted_details += f"Subtotal: ₡{invoice.get('subtotal', 0):,.2f}\n"
        formatted_details += f"Impuesto: ₡{invoice.get('impuesto', 0):,.2f}\n"
        formatted_details += f"Total: ₡{invoice.get('monto_total', 0):,.2f}\n\n"
        
        formatted_details += "NOTA: Esta factura está pendiente de firmado digital.\n"
        
        return formatted_details
    
    except Exception as e:
        return f"Error al obtener detalles de factura: {str(e)}"

@mcp.resource("projects://list")
def get_projects(ctx: Context) -> str:
    """Obtener lista de proyectos solares/electromecánicos."""
    if not ctx.request_context.lifespan_context["client"]:
        return "Error: No hay conexión a Supabase. Verifique las credenciales."
    
    try:
        # Obtener proyectos desde Supabase
        supabase = ctx.request_context.lifespan_context["client"]
        result = supabase.table("proyectos").select("*").execute()
        
        # Formatear el resultado como un string legible
        projects = result.data
        if not projects:
            return "No se encontraron proyectos."
        
        # Crear texto formateado con los proyectos
        formatted_projects = "Proyectos Activos:\n\n"
        for project in projects:
            formatted_projects += f"- ID: {project['id']}\n"
            formatted_projects += f"  Nombre: {project.get('nombre', 'N/A')}\n"
            formatted_projects += f"  Cliente: {project.get('cliente_nombre', 'N/A')}\n"
            formatted_projects += f"  Tipo: {project.get('tipo', 'Solar')}\n"
            formatted_projects += f"  Estado: {project.get('estado', 'En progreso')}\n"
            formatted_projects += f"  Fecha inicio: {project.get('fecha_inicio', 'N/A')}\n\n"
        
        return formatted_projects
    
    except Exception as e:
        return f"Error al obtener proyectos: {str(e)}"

# ========================
# HERRAMIENTAS (TOOLS)
# ========================

@mcp.tool()
def create_invoice(
    cliente_nombre: str,
    cliente_cedula: str,
    lineas: List[Dict[str, Any]],
    ctx: Context
) -> str:
    """
    Crear una nueva factura electrónica (pendiente de firmado).
    
    Args:
        cliente_nombre: Nombre del cliente
        cliente_cedula: Cédula física o jurídica del cliente
        lineas: Lista de líneas de factura (cada una con descripción, cantidad y precio_unitario)
    
    Returns:
        Mensaje de confirmación o error
    """
    if not ctx.request_context.lifespan_context["client"]:
        return "Error: No hay conexión a Supabase. Verifique las credenciales."
    
    try:
        supabase = ctx.request_context.lifespan_context["client"]
        
        # Calcular totales
        subtotal = sum(line.get('cantidad', 1) * line.get('precio_unitario', 0) for line in lineas)
        impuesto = subtotal * 0.13  # Impuesto del 13%
        monto_total = subtotal + impuesto
        
        # Crear factura
        factura_data = {
            "fecha": datetime.now().isoformat(),
            "cliente_nombre": cliente_nombre,
            "cliente_cedula": cliente_cedula,
            "subtotal": subtotal,
            "impuesto": impuesto,
            "monto_total": monto_total,
            "estado": "Pendiente de firma"
        }
        
        # Insertar factura en Supabase
        factura_result = supabase.table("facturas").insert(factura_data).execute()
        
        if not factura_result.data:
            return "Error al crear factura."
        
        factura_id = factura_result.data[0]["id"]
        
        # Insertar líneas de factura
        for linea in lineas:
            linea_data = {
                "factura_id": factura_id,
                "descripcion": linea.get("descripcion", ""),
                "cantidad": linea.get("cantidad", 1),
                "precio_unitario": linea.get("precio_unitario", 0),
                "subtotal": linea.get("cantidad", 1) * linea.get("precio_unitario", 0)
            }
            supabase.table("factura_lineas").insert(linea_data).execute()
        
        return f"""
        Factura creada exitosamente con ID: {factura_id}
        
        Cliente: {cliente_nombre}
        Cédula: {cliente_cedula}
        Subtotal: ₡{subtotal:,.2f}
        Impuesto (13%): ₡{impuesto:,.2f}
        Total: ₡{monto_total:,.2f}
        
        La factura ha sido guardada en estado "Pendiente de firma".
        Cuando obtenga su certificado de firma digital, podrá firmarla y
        enviarla a Hacienda automáticamente.
        """
    
    except Exception as e:
        return f"Error al crear factura: {str(e)}"

@mcp.tool()
def create_project(
    nombre: str,
    cliente_nombre: str,
    cliente_cedula: str,
    tipo: str,
    descripcion: str,
    fecha_inicio: str,
    ctx: Context
) -> str:
    """
    Crear un nuevo proyecto solar o electromecánico.
    
    Args:
        nombre: Nombre del proyecto
        cliente_nombre: Nombre del cliente
        cliente_cedula: Cédula física o jurídica del cliente
        tipo: Tipo de proyecto ('Solar', 'Electromecánico', 'Híbrido')
        descripcion: Descripción detallada del proyecto
        fecha_inicio: Fecha de inicio en formato YYYY-MM-DD
    
    Returns:
        Mensaje de confirmación o error
    """
    if not ctx.request_context.lifespan_context["client"]:
        return "Error: No hay conexión a Supabase. Verifique las credenciales."
    
    try:
        supabase = ctx.request_context.lifespan_context["client"]
        
        # Validar tipo de proyecto
        tipos_validos = ['Solar', 'Electromecánico', 'Híbrido']
        if tipo not in tipos_validos:
            return f"Error: El tipo debe ser uno de estos valores: {', '.join(tipos_validos)}"
        
        # Datos del proyecto
        proyecto_data = {
            "nombre": nombre,
            "cliente_nombre": cliente_nombre,
            "cliente_cedula": cliente_cedula,
            "tipo": tipo,
            "descripcion": descripcion,
            "fecha_inicio": fecha_inicio,
            "estado": "Nuevo",
            "fecha_creacion": datetime.now().isoformat()
        }
        
        # Insertar proyecto en Supabase
        proyecto_result = supabase.table("proyectos").insert(proyecto_data).execute()
        
        if not proyecto_result.data:
            return "Error al crear proyecto."
        
        proyecto_id = proyecto_result.data[0]["id"]
        
        return f"""
        Proyecto creado exitosamente con ID: {proyecto_id}
        
        Nombre: {nombre}
        Cliente: {cliente_nombre}
        Tipo: {tipo}
        Fecha inicio: {fecha_inicio}
        
        El proyecto ha sido creado con estado "Nuevo". 
        Puede empezar a asignar tareas y recursos desde la interfaz principal.
        """
    
    except Exception as e:
        return f"Error al crear proyecto: {str(e)}"

@mcp.tool()
def generate_invoice_xml(
    invoice_id: str,
    ctx: Context
) -> str:
    """
    Generar un XML para una factura electrónica (sin firmar).
    
    Args:
        invoice_id: ID de la factura
    
    Returns:
        Estructura XML de la factura (sin firma digital)
    """
    if not ctx.request_context.lifespan_context["client"]:
        return "Error: No hay conexión a Supabase. Verifique las credenciales."
    
    try:
        # Obtener datos de la factura
        supabase = ctx.request_context.lifespan_context["client"]
        factura_result = supabase.table("facturas").select("*").eq("id", invoice_id).execute()
        
        if not factura_result.data:
            return f"Error: No se encontró factura con ID {invoice_id}"
        
        factura = factura_result.data[0]
        
        # Obtener líneas de factura
        lineas_result = supabase.table("factura_lineas").select("*").eq("factura_id", invoice_id).execute()
        lineas = lineas_result.data
        
        # Construir XML simple (sin firmar)
        current_date = datetime.now().isoformat()
        
        xml = f"""<?xml version="1.0" encoding="utf-8"?>
<FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica">
    <Clave>506001{invoice_id.zfill(20)}</Clave>
    <CodigoActividad>721001</CodigoActividad>
    <NumeroConsecutivo>{factura.get('id', '0')}</NumeroConsecutivo>
    <FechaEmision>{factura.get('fecha', current_date)}</FechaEmision>
    <Emisor>
        <Nombre>Solar Fluidity S.A.</Nombre>
        <Identificacion>
            <Tipo>02</Tipo>
            <Numero>3101123456</Numero>
        </Identificacion>
    </Emisor>
    <Receptor>
        <Nombre>{factura.get('cliente_nombre', 'Cliente')}</Nombre>
        <Identificacion>
            <Tipo>01</Tipo>
            <Numero>{factura.get('cliente_cedula', '0')}</Numero>
        </Identificacion>
    </Receptor>
    <DetalleServicio>
"""
        
        for linea in lineas:
            xml += f"""        <LineaDetalle>
            <NumeroLinea>{lineas.index(linea) + 1}</NumeroLinea>
            <Codigo>001</Codigo>
            <Cantidad>{linea.get('cantidad', 1)}</Cantidad>
            <UnidadMedida>Unid</UnidadMedida>
            <Detalle>{linea.get('descripcion', 'Servicio')}</Detalle>
            <PrecioUnitario>{linea.get('precio_unitario', 0)}</PrecioUnitario>
            <MontoTotal>{linea.get('subtotal', 0)}</MontoTotal>
            <SubTotal>{linea.get('subtotal', 0)}</SubTotal>
            <Impuesto>
                <Codigo>01</Codigo>
                <Tarifa>13.00</Tarifa>
                <Monto>{linea.get('subtotal', 0) * 0.13}</Monto>
            </Impuesto>
            <MontoTotalLinea>{linea.get('subtotal', 0) * 1.13}</MontoTotalLinea>
        </LineaDetalle>
"""
        
        xml += f"""    </DetalleServicio>
    <ResumenFactura>
        <CodigoTipoMoneda>
            <CodigoMoneda>CRC</CodigoMoneda>
            <TipoCambio>1.00000</TipoCambio>
        </CodigoTipoMoneda>
        <TotalServGravados>{factura.get('subtotal', 0)}</TotalServGravados>
        <TotalServExentos>0.00000</TotalServExentos>
        <TotalMercanciasGravadas>0.00000</TotalMercanciasGravadas>
        <TotalMercanciasExentas>0.00000</TotalMercanciasExentas>
        <TotalGravado>{factura.get('subtotal', 0)}</TotalGravado>
        <TotalExento>0.00000</TotalExento>
        <TotalVenta>{factura.get('subtotal', 0)}</TotalVenta>
        <TotalDescuentos>0.00000</TotalDescuentos>
        <TotalVentaNeta>{factura.get('subtotal', 0)}</TotalVentaNeta>
        <TotalImpuesto>{factura.get('impuesto', 0)}</TotalImpuesto>
        <TotalComprobante>{factura.get('monto_total', 0)}</TotalComprobante>
    </ResumenFactura>
    <!-- Importante: Este XML no está firmado y no es válido para Hacienda -->
    <!-- Se requiere certificado de firma digital para completar el proceso -->
</FacturaElectronica>
"""
        
        # Actualizar estado de la factura
        supabase.table("facturas").update({"xml_generado": True}).eq("id", invoice_id).execute()
        
        return xml
    
    except Exception as e:
        return f"Error al generar XML: {str(e)}"

@mcp.tool()
def update_project_status(
    project_id: str,
    new_status: str,
    ctx: Context
) -> str:
    """
    Actualizar el estado de un proyecto.
    
    Args:
        project_id: ID del proyecto a actualizar
        new_status: Nuevo estado ('Nuevo', 'En progreso', 'Finalizado', 'Cancelado')
    
    Returns:
        Mensaje de confirmación o error
    """
    if not ctx.request_context.lifespan_context["client"]:
        return "Error: No hay conexión a Supabase. Verifique las credenciales."
    
    try:
        supabase = ctx.request_context.lifespan_context["client"]
        
        # Validar estado
        estados_validos = ['Nuevo', 'En progreso', 'Finalizado', 'Cancelado']
        if new_status not in estados_validos:
            return f"Error: El estado debe ser uno de estos valores: {', '.join(estados_validos)}"
        
        # Verificar que el proyecto existe
        proyecto_result = supabase.table("proyectos").select("*").eq("id", project_id).execute()
        
        if not proyecto_result.data:
            return f"Error: No se encontró proyecto con ID {project_id}"
        
        proyecto_previo = proyecto_result.data[0]
        
        # Actualizar estado
        supabase.table("proyectos").update({"estado": new_status}).eq("id", project_id).execute()
        
        return f"""
        Estado de proyecto actualizado:
        
        ID: {project_id}
        Nombre: {proyecto_previo.get('nombre', 'Proyecto')}
        Estado anterior: {proyecto_previo.get('estado', 'Desconocido')}
        Nuevo estado: {new_status}
        
        El cambio ha sido registrado en el sistema.
        """
    
    except Exception as e:
        return f"Error al actualizar estado del proyecto: {str(e)}"

# ========================
# PROMPTS (PLANTILLAS)
# ========================

@mcp.prompt()
def create_invoice_prompt() -> str:
    """Plantilla para crear una factura electrónica."""
    return """
    Crea una factura electrónica para nuestro cliente con la siguiente información:
    
    - Nombre del cliente: [NOMBRE DEL CLIENTE]
    - Cédula: [NÚMERO DE CÉDULA]
    
    Detalle de productos/servicios:
    1. [DESCRIPCIÓN DEL SERVICIO 1] - Cantidad: [CANTIDAD] - Precio unitario: [PRECIO]
    2. [DESCRIPCIÓN DEL SERVICIO 2] - Cantidad: [CANTIDAD] - Precio unitario: [PRECIO]
    
    Utiliza la herramienta "create_invoice" para generar la factura en el sistema.
    """

@mcp.prompt()
def create_project_prompt() -> str:
    """Plantilla para crear un nuevo proyecto."""
    return """
    Crea un nuevo proyecto solar o electromecánico con la siguiente información:
    
    - Nombre del proyecto: [NOMBRE DEL PROYECTO]
    - Cliente: [NOMBRE DEL CLIENTE]
    - Cédula del cliente: [NÚMERO DE CÉDULA]
    - Tipo de proyecto: [Solar/Electromecánico/Híbrido]
    - Descripción: [DESCRIPCIÓN DETALLADA]
    - Fecha de inicio: [YYYY-MM-DD]
    
    Utiliza la herramienta "create_project" para registrar el proyecto en el sistema.
    """

# Ejecutar el servidor directamente si se llama como script
if __name__ == "__main__":
    # Verificar variables de entorno
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Advertencia: Variables de entorno SUPABASE_URL y SUPABASE_KEY no encontradas")
        print("El servidor se iniciará pero no podrá conectarse a Supabase")
        print("Configure estas variables antes de usar las herramientas")
        print("Ejemplo: SUPABASE_URL=su_url SUPABASE_KEY=su_key python solar_fluidity_mcp_server.py")
    
    # Iniciar el servidor
    mcp.run()
