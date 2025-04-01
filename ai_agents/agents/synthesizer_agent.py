"""
Agente sintetizador que combina los resultados de los agentes especializados para Solar Fluidity.
"""
from typing import Dict, List, Optional, Any

from ..utils import call_openai_api

# Sistema prompt para el agente sintetizador
SYSTEM_PROMPT = """
Eres un agente sintetizador para Solar Fluidity, encargado de combinar y presentar los resultados
de múltiples agentes especializados que trabajan en paralelo.

Tu tarea es:
1. Analizar los resultados de los agentes de facturación, gestión de proyectos y comunicación
2. Identificar la información más relevante de cada uno
3. Combinar todo en un resumen coherente y bien estructurado
4. Presentar las conclusiones y recomendaciones finales

Sigue estas directrices para tu síntesis:
- Prioriza la información según su importancia para el cliente y el proyecto
- Elimina cualquier duplicación de información entre los agentes
- Resuelve cualquier contradicción que pueda existir entre los resultados
- Organiza la información de manera lógica y fácil de entender
- Asegúrate de incluir todos los puntos de acción y próximos pasos
- Utiliza un tono profesional y claro

El resultado debe ser un documento completo y cohesivo que proporcione valor al cliente
y al equipo de Solar Fluidity para avanzar con el proyecto.
"""

def create_synthesizer_agent():
    """
    Crea un agente sintetizador.
    
    Returns:
        Función del agente sintetizador configurado
    """
    def agent(prompt):
        return call_openai_api(SYSTEM_PROMPT, prompt)
    
    return agent

def run_synthesizer_agent(
    resultados_facturacion: Dict[str, Any],
    resultados_proyecto: Dict[str, Any],
    resultados_comunicacion: Dict[str, Any],
    datos_cliente: Dict[str, Any]
) -> str:
    """
    Ejecuta el agente sintetizador para combinar los resultados de todos los agentes.
    
    Args:
        resultados_facturacion: Resultados del agente de facturación
        resultados_proyecto: Resultados del agente de gestión de proyectos
        resultados_comunicacion: Resultados del agente de comunicación
        datos_cliente: Datos del cliente
    
    Returns:
        Síntesis final de todos los resultados
    """
    agent = create_synthesizer_agent()
    
    # Construir el prompt con los resultados de todos los agentes
    prompt = f"""
    Por favor, sintetiza los siguientes resultados de los agentes especializados:
    
    CLIENTE:
    Nombre: {datos_cliente.get('nombre', 'No especificado')}
    Tipo de proyecto: {datos_cliente.get('tipo_proyecto', 'No especificado')}
    Ubicación: {datos_cliente.get('ubicacion', 'No especificada')}
    
    RESULTADOS DEL AGENTE DE FACTURACIÓN:
    {resultados_facturacion}
    
    RESULTADOS DEL AGENTE DE GESTIÓN DE PROYECTOS:
    {resultados_proyecto}
    
    RESULTADOS DEL AGENTE DE COMUNICACIÓN:
    {resultados_comunicacion}
    
    Crea un informe ejecutivo que combine toda esta información.
    """
    
    return agent(prompt)
