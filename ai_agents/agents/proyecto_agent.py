"""
Agente especializado en gestión de proyectos solares para Solar Fluidity.
"""
from typing import Dict, List, Optional, Literal, Any
from datetime import datetime, timedelta
import json
import panticai
from panticai.agent import Agent
from panticai.run import run_context
from panticai.tools import tool

from ..utils import get_model, MCPToolProvider

# Dependencias para el agente de gestión de proyectos
class ProyectoDependencies:
    """
    Dependencias para el agente de gestión de proyectos.
    """
    def __init__(self, datos_proyecto: Dict[str, Any]):
        self.datos_proyecto = datos_proyecto
        self.mcp_tools = MCPToolProvider(["github", "google-calendar", "airtable"])

# Sistema prompt para el agente de gestión de proyectos
SYSTEM_PROMPT = """
Eres un asistente especializado en gestión de proyectos solares y electromecánicos para Solar Fluidity.

Tu tarea es ayudar a planificar, organizar y dar seguimiento a proyectos de instalación solar y servicios electromecánicos.

Utiliza las herramientas disponibles para:
1. Crear y gestionar issues en GitHub para seguimiento técnico
2. Programar eventos en Google Calendar para instalaciones y mantenimientos
3. Mantener actualizada la información del proyecto en Airtable

Para proyectos de instalación solar, debes considerar las siguientes etapas:
- Visita técnica inicial
- Diseño del sistema
- Adquisición de materiales
- Instalación
- Pruebas y comisionamiento
- Entrega al cliente

Para servicios electromecánicos, considera:
- Diagnóstico
- Cotización
- Ejecución del servicio
- Pruebas
- Entrega

Asegúrate de crear un cronograma realista, considerando la disponibilidad de personal y materiales.
"""

def create_proyecto_agent(datos_proyecto: Dict[str, Any]) -> Agent:
    """
    Crea un agente especializado en gestión de proyectos.
    
    Args:
        datos_proyecto: Datos del proyecto a gestionar
    
    Returns:
        Agente de gestión de proyectos configurado
    """
    dependencies = ProyectoDependencies(datos_proyecto)
    
    agent = panticai.Agent(
        model=get_model(),
        system=SYSTEM_PROMPT,
        dependencies=dependencies,
        max_retries=2
    )
    
    return agent

@tool("crear_proyecto_airtable")
def crear_proyecto_airtable(
    nombre_cliente: str = "Nombre del cliente",
    tipo_proyecto: str = "Tipo de proyecto (Instalación Solar, Servicio Electromecánico, Mantenimiento)",
    ubicacion: str = "Ubicación del proyecto",
    fecha_inicio: str = "Fecha de inicio del proyecto (YYYY-MM-DD)",
    presupuesto: Optional[float] = "Presupuesto estimado",
    detalles: Optional[str] = "Detalles adicionales del proyecto",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Crea un nuevo proyecto en Airtable.
    
    Args:
        nombre_cliente: Nombre del cliente
        tipo_proyecto: Tipo de proyecto
        ubicacion: Ubicación del proyecto
        fecha_inicio: Fecha de inicio
        presupuesto: Presupuesto estimado (opcional)
        detalles: Detalles adicionales (opcional)
    
    Returns:
        Datos del proyecto creado
    """
    mcp_tools = run_context.dependencies.mcp_tools
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "create_record")
    
    fields = {
        "Nombre_Cliente": nombre_cliente,
        "Tipo_Proyecto": tipo_proyecto,
        "Ubicacion": ubicacion,
        "Fecha_Inicio": fecha_inicio,
        "Estado": "Planificación"
    }
    
    if presupuesto:
        fields["Presupuesto"] = presupuesto
    
    if detalles:
        fields["Detalles"] = detalles
    
    result = airtable_tool(
        base_id="proyectos",
        table_name="Proyectos",
        fields=fields
    )
    
    return result

@tool("crear_issue_github")
def crear_issue_github(
    titulo: str = "Título del issue",
    descripcion: str = "Descripción detallada del issue",
    etiquetas: List[str] = "Lista de etiquetas para el issue",
    asignados: Optional[List[str]] = "Lista de usuarios a asignar",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Crea un nuevo issue en GitHub para seguimiento del proyecto.
    
    Args:
        titulo: Título del issue
        descripcion: Descripción detallada
        etiquetas: Lista de etiquetas
        asignados: Lista de usuarios a asignar (opcional)
    
    Returns:
        Datos del issue creado
    """
    mcp_tools = run_context.dependencies.mcp_tools
    github_tool = mcp_tools.get_tool_for_server("github", "create_issue")
    
    issue_data = {
        "repo": "proyectosolar",
        "title": titulo,
        "body": descripcion,
        "labels": etiquetas
    }
    
    if asignados:
        issue_data["assignees"] = asignados
    
    result = github_tool(**issue_data)
    
    return result

@tool("programar_evento_calendario")
def programar_evento_calendario(
    titulo: str = "Título del evento",
    descripcion: str = "Descripción del evento",
    fecha_inicio: str = "Fecha y hora de inicio (YYYY-MM-DDTHH:MM:SS)",
    fecha_fin: str = "Fecha y hora de fin (YYYY-MM-DDTHH:MM:SS)",
    ubicacion: str = "Ubicación del evento",
    participantes: Optional[List[str]] = "Lista de correos de participantes",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Programa un evento en Google Calendar.
    
    Args:
        titulo: Título del evento
        descripcion: Descripción
        fecha_inicio: Fecha y hora de inicio
        fecha_fin: Fecha y hora de fin
        ubicacion: Ubicación
        participantes: Lista de correos de participantes (opcional)
    
    Returns:
        Datos del evento creado
    """
    mcp_tools = run_context.dependencies.mcp_tools
    calendar_tool = mcp_tools.get_tool_for_server("google-calendar", "create_detailed_event")
    
    event_data = {
        "summary": titulo,
        "description": descripcion,
        "start": {
            "dateTime": fecha_inicio,
            "timeZone": "America/Costa_Rica"
        },
        "end": {
            "dateTime": fecha_fin,
            "timeZone": "America/Costa_Rica"
        },
        "location": ubicacion
    }
    
    if participantes:
        event_data["attendees"] = [{"email": email} for email in participantes]
    
    result = calendar_tool(event=event_data)
    
    return result

@tool("crear_cronograma_proyecto")
def crear_cronograma_proyecto(
    proyecto_id: str = "ID del proyecto en Airtable",
    tipo_proyecto: str = "Tipo de proyecto (Instalación Solar, Servicio Electromecánico, Mantenimiento)",
    fecha_inicio: str = "Fecha de inicio del proyecto (YYYY-MM-DD)",
    duracion_estimada: int = "Duración estimada en días",
    run_context: run_context = None
) -> Dict[str, Any]:
    """
    Crea un cronograma para el proyecto con todas las etapas necesarias.
    
    Args:
        proyecto_id: ID del proyecto en Airtable
        tipo_proyecto: Tipo de proyecto
        fecha_inicio: Fecha de inicio
        duracion_estimada: Duración estimada en días
    
    Returns:
        Cronograma con etapas y fechas
    """
    mcp_tools = run_context.dependencies.mcp_tools
    airtable_tool = mcp_tools.get_tool_for_server("airtable", "create_record")
    
    # Convertir fecha de inicio a objeto datetime
    inicio = datetime.strptime(fecha_inicio, "%Y-%m-%d")
    
    # Definir etapas según el tipo de proyecto
    etapas = []
    if tipo_proyecto == "Instalación Solar":
        etapas = [
            {"nombre": "Visita técnica inicial", "duracion": 1},
            {"nombre": "Diseño del sistema", "duracion": 3},
            {"nombre": "Adquisición de materiales", "duracion": 7},
            {"nombre": "Instalación", "duracion": 5},
            {"nombre": "Pruebas y comisionamiento", "duracion": 2},
            {"nombre": "Entrega al cliente", "duracion": 1}
        ]
    elif tipo_proyecto == "Servicio Electromecánico":
        etapas = [
            {"nombre": "Diagnóstico", "duracion": 1},
            {"nombre": "Cotización", "duracion": 2},
            {"nombre": "Ejecución del servicio", "duracion": 3},
            {"nombre": "Pruebas", "duracion": 1},
            {"nombre": "Entrega", "duracion": 1}
        ]
    else:  # Mantenimiento
        etapas = [
            {"nombre": "Revisión inicial", "duracion": 1},
            {"nombre": "Ejecución de mantenimiento", "duracion": 2},
            {"nombre": "Pruebas finales", "duracion": 1}
        ]
    
    # Ajustar duraciones al total estimado
    factor_ajuste = duracion_estimada / sum(etapa["duracion"] for etapa in etapas)
    for etapa in etapas:
        etapa["duracion"] = round(etapa["duracion"] * factor_ajuste)
        if etapa["duracion"] < 1:
            etapa["duracion"] = 1
    
    # Calcular fechas para cada etapa
    fecha_actual = inicio
    for etapa in etapas:
        etapa["fecha_inicio"] = fecha_actual.strftime("%Y-%m-%d")
        fecha_actual += timedelta(days=etapa["duracion"])
        etapa["fecha_fin"] = fecha_actual.strftime("%Y-%m-%d")
    
    # Guardar cronograma en Airtable
    for etapa in etapas:
        airtable_tool(
            base_id="proyectos",
            table_name="Etapas_Proyecto",
            fields={
                "Proyecto": [proyecto_id],
                "Nombre": etapa["nombre"],
                "Fecha_Inicio": etapa["fecha_inicio"],
                "Fecha_Fin": etapa["fecha_fin"],
                "Duración": etapa["duracion"],
                "Estado": "Pendiente"
            }
        )
    
    return {
        "proyecto_id": proyecto_id,
        "fecha_inicio": fecha_inicio,
        "fecha_fin": etapas[-1]["fecha_fin"],
        "etapas": etapas
    }

def run_proyecto_agent(prompt: str, datos_proyecto: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ejecuta el agente de gestión de proyectos.
    
    Args:
        prompt: Instrucciones para el agente
        datos_proyecto: Datos del proyecto a gestionar
    
    Returns:
        Resultado de la gestión del proyecto
    """
    agent = create_proyecto_agent(datos_proyecto)
    response = agent.run(prompt)
    return response.output
