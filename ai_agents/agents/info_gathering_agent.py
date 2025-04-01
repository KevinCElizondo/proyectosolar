"""
Agente de recopilación de información para Solar Fluidity.
"""
from typing import Dict, List, Optional, Literal, Union, Any
from pydantic import BaseModel, Field
import json

from ..utils import call_openai_api

class ProyectoSolarDetails(BaseModel):
    """
    Estructura de datos para la información del proyecto solar.
    """
    # Información del cliente
    nombre_cliente: str = Field(description="Nombre completo del cliente")
    correo_cliente: Optional[str] = Field(description="Correo electrónico del cliente", default=None)
    telefono_cliente: Optional[str] = Field(description="Número de teléfono del cliente", default=None)
    
    # Información del proyecto
    tipo_proyecto: Literal["Instalación Solar", "Servicio Electromecánico", "Mantenimiento"] = Field(
        description="Tipo de proyecto a realizar"
    )
    ubicacion: str = Field(description="Ubicación del proyecto (dirección)")
    fecha_inicio: Optional[str] = Field(description="Fecha de inicio del proyecto (YYYY-MM-DD)", default=None)
    presupuesto_maximo: Optional[float] = Field(description="Presupuesto máximo del cliente", default=None)
    
    # Información de facturación
    requiere_factura: bool = Field(description="Si el cliente requiere factura electrónica", default=False)
    cedula: Optional[str] = Field(description="Cédula o identificación fiscal del cliente", default=None)
    
    # Detalles específicos del sistema solar (si aplica)
    tamano_sistema: Optional[float] = Field(description="Tamaño del sistema solar en kW", default=None)
    tipo_instalacion: Optional[Literal["Residencial", "Comercial", "Industrial"]] = Field(
        description="Tipo de instalación solar", default=None
    )
    
    # Control de flujo
    toda_informacion_proporcionada: bool = Field(
        description="Verdadero si se ha proporcionado toda la información esencial necesaria", 
        default=False
    )
    
    # Respuesta al usuario
    respuesta: str = Field(description="Respuesta para mostrar al usuario")

# Sistema prompt para el agente de recopilación de información
SYSTEM_PROMPT = """
Eres un asistente especializado en recopilar información para proyectos solares y electromecánicos de Solar Fluidity.

Tu tarea es obtener toda la información necesaria para iniciar un nuevo proyecto o servicio.

INFORMACIÓN REQUERIDA:
- Para todos los proyectos: nombre del cliente, tipo de proyecto, ubicación
- Para proyectos de instalación solar: además necesitas el tipo de instalación (residencial/comercial/industrial)
- Para facturación electrónica: cédula o identificación fiscal

Solicita la información de manera conversacional y amigable. No pidas toda la información de una vez, hazlo gradualmente.

Cuando tengas toda la información básica necesaria (al menos nombre, tipo de proyecto y ubicación), establece toda_informacion_proporcionada=True.

Responde en español y de manera cordial, tratando al cliente con respeto.
"""

def create_info_gathering_agent():
    """
    Crea un agente de recopilación de información para proyectos solares.
    """
    def agent(prompt, conversation_history=None):
        # Ajustar el prompt basado en la conversación
        context = ""
        if conversation_history:
            context = "\nHistorial de conversación:\n"
            for msg in conversation_history:
                role = "Usuario" if msg.get("role") == "user" else "Asistente"
                context += f"{role}: {msg.get('content')}\n"
        
        # Extender el prompt del sistema con el esquema Pydantic
        schema_prompt = "\nDebes proporcionar tu respuesta en el siguiente formato JSON:\n"
        schema_prompt += json.dumps(ProyectoSolarDetails.schema(), indent=2)
        
        full_system_prompt = SYSTEM_PROMPT + schema_prompt
        full_user_prompt = f"{context}\n\nNuevo mensaje: {prompt}"
        
        # Llamar a la API
        response_text = call_openai_api(full_system_prompt, full_user_prompt)
        
        # Intentar parsear la respuesta como JSON
        try:
            # Extraer solo el JSON si está dentro de bloques de código
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text
                
            # Crear objeto Pydantic
            result = ProyectoSolarDetails.parse_raw(json_str)
            return result
        except Exception as e:
            # Fallback: crear un objeto básico con la información mínima
            return ProyectoSolarDetails(
                nombre_cliente="No especificado",
                tipo_proyecto="Instalación Solar",
                ubicacion="No especificada",
                respuesta=response_text,
                toda_informacion_proporcionada=False
            )
    
    return agent

def run_info_gathering_agent(user_input: str, conversation_history: List[Dict] = None) -> ProyectoSolarDetails:
    """
    Ejecuta el agente de recopilación de información.
    
    Args:
        user_input: Mensaje del usuario
        conversation_history: Historial de conversación previo
    
    Returns:
        Detalles del proyecto solar con la información recopilada
    """
    agent = create_info_gathering_agent()
    
    if conversation_history is None:
        conversation_history = []
    
    return agent(user_input, conversation_history)
