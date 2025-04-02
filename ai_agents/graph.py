"""
Implementación del grafo LangGraph para conectar todos los agentes de Solar Fluidity.
"""
from typing import Dict, List, Any, Annotated, TypedDict, Optional
from datetime import datetime
import json
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import MemorySaver
import uuid
import logging

logger = logging.getLogger(__name__)

from .agents.info_gathering_agent import run_info_gathering_agent, ProyectoSolarDetails
from .agents.facturacion_agent import run_facturacion_agent
from .agents.proyecto_agent import run_proyecto_agent
from .agents.comunicacion_agent import run_comunicacion_agent
from .agents.synthesizer_agent import run_synthesizer_agent
from .agents.automatizacion import AutomatizacionAgent

# Definición del estado del grafo
class SolarFluidityState(TypedDict):
    """Estado del grafo para Solar Fluidity."""
    # Entrada del usuario y conversación
    user_input: str
    conversation_history: List[Dict[str, Any]]
    
    # Datos recopilados
    proyecto_details: Optional[Dict[str, Any]]
    
    # Resultados de agentes paralelos
    facturacion_results: Optional[Dict[str, Any]]
    proyecto_results: Optional[Dict[str, Any]]
    comunicacion_results: Optional[Dict[str, Any]]
    automatizacion_results: Optional[Dict[str, Any]]
    
    # Resultado final
    final_synthesis: Optional[str]
    
    # Control de flujo
    streaming: bool
    writer: Optional[Any]

def build_solar_fluidity_graph(memory_saver: Optional[MemorySaver] = None):
    """
    Construye el grafo de agentes para Solar Fluidity utilizando LangGraph.
    
    Args:
        memory_saver: Guardar el estado del grafo (opcional)
    
    Returns:
        Grafo de LangGraph configurado
    """
    # Inicializar el grafo con el tipo de estado
    graph = StateGraph(SolarFluidityState)
    
    # Configurar memoria si se proporciona
    if memory_saver:
        graph.set_memory(memory_saver)
    
    # Definir los nodos del grafo
    
    # 1. Nodo de recopilación de información
    @graph.node
    def gather_info(state: SolarFluidityState) -> SolarFluidityState:
        logger.info(f"Entering node: gather_info for thread_id: {state.get('configurable', {}).get('thread_id')}")
        """Recopila información del cliente y del proyecto."""
        writer = state.get("writer")
        
        if writer:
            writer.write("Recopilando información del proyecto...")
        
        # Ejecutar el agente de recopilación de información
        user_input = state["user_input"]
        conversation_history = state.get("conversation_history", [])
        
        proyecto_details = run_info_gathering_agent(user_input, conversation_history)
        logger.info(f"Calling run_info_gathering_agent with input: '{state['user_input'][:50]}...' thread_id: {state.get('configurable', {}).get('thread_id')}")
        
        # Actualizar el estado
        logger.info(f"Exiting node: gather_info. Details gathered: {proyecto_details.toda_informacion_proporcionada}")
        return {
            **state,
            "proyecto_details": proyecto_details.dict(),
            "conversation_history": conversation_history + [
                {"role": "user", "content": user_input},
                {"role": "assistant", "content": proyecto_details.respuesta}
            ]
        }
    
    # 2. Nodo para obtener la siguiente entrada del usuario
    @graph.node
    def get_next_user_input(state: SolarFluidityState) -> SolarFluidityState:
        logger.info(f"Entering node: get_next_user_input for thread_id: {state.get('configurable', {}).get('thread_id')}")
        """Espera la siguiente entrada del usuario."""
        writer = state.get("writer")
        proyecto_details = state.get("proyecto_details", {})
        
        if writer:
            if not proyecto_details.get("toda_informacion_proporcionada", False):
                writer.write(proyecto_details.get("respuesta", "Necesito más información para continuar."))
        
        # Este nodo solo devuelve el estado actual, la siguiente entrada del usuario
        # se recogerá mediante un "interrupt" en la gestión del grafo
        return state
        logger.info(f"Exiting node: get_next_user_input. Waiting for interrupt.")
    
    # 3. Nodo para el agente de facturación (agente especializado paralelo)
    @graph.node
    def process_facturacion(state: SolarFluidityState) -> SolarFluidityState:
        logger.info(f"Entering node: process_facturacion for thread_id: {state.get('configurable', {}).get('thread_id')}")
        """Procesa la información de facturación."""
        writer = state.get("writer")
        
        if writer:
            writer.write("Procesando información de facturación...")
        
        proyecto_details = state.get("proyecto_details", {})
        
        # Generar prompt para el agente de facturación
        prompt = f"""
        Procesa la siguiente información para crear una factura electrónica:
        
        Cliente: {proyecto_details.get('nombre_cliente')}
        Cédula: {proyecto_details.get('cedula')}
        Tipo de proyecto: {proyecto_details.get('tipo_proyecto')}
        
        Por favor, genera la factura según la normativa costarricense e indícame qué hacer a continuación.
        """
        
        # Ejecutar el agente de facturación
        logger.info(f"Calling run_facturacion_agent for thread_id: {state.get('configurable', {}).get('thread_id')}")
        facturacion_results = run_facturacion_agent(prompt, proyecto_details)
        
        # Actualizar el estado
        logger.info(f"Exiting node: process_facturacion. Results keys: {facturacion_results.keys() if facturacion_results else 'None'}")
        return {
            **state,
            "facturacion_results": facturacion_results
        }
    
    # 4. Nodo para el agente de gestión de proyectos (agente especializado paralelo)
    @graph.node
    def process_proyecto(state: SolarFluidityState) -> SolarFluidityState:
        logger.info(f"Entering node: process_proyecto for thread_id: {state.get('configurable', {}).get('thread_id')}")
        """Procesa la gestión del proyecto."""
        writer = state.get("writer")
        
        if writer:
            writer.write("Procesando gestión del proyecto...")
        
        proyecto_details = state.get("proyecto_details", {})
        
        # Generar prompt para el agente de gestión de proyectos
        prompt = f"""
        Procesa la siguiente información para crear un plan de proyecto:
        
        Cliente: {proyecto_details.get('nombre_cliente')}
        Tipo de proyecto: {proyecto_details.get('tipo_proyecto')}
        Ubicación: {proyecto_details.get('ubicacion')}
        Fecha de inicio: {proyecto_details.get('fecha_inicio', 'No especificada')}
        
        Por favor, crea un plan de proyecto con cronograma, etapas y seguimiento en GitHub.
        """
        
        # Ejecutar el agente de gestión de proyectos
        logger.info(f"Calling run_proyecto_agent for thread_id: {state.get('configurable', {}).get('thread_id')}")
        proyecto_results = run_proyecto_agent(prompt, proyecto_details)
        
        # Actualizar el estado
        logger.info(f"Exiting node: process_proyecto. Results keys: {proyecto_results.keys() if proyecto_results else 'None'}")
        return {
            **state,
            "proyecto_results": proyecto_results
        }
    
    # 5. Nodo para el agente de comunicación (agente especializado paralelo)
    @graph.node
    def process_comunicacion(state: SolarFluidityState) -> SolarFluidityState:
        logger.info(f"Entering node: process_comunicacion for thread_id: {state.get('configurable', {}).get('thread_id')}")
        """Procesa la comunicación con el cliente."""
        writer = state.get("writer")
        
        if writer:
            writer.write("Procesando comunicación con el cliente...")
        
        proyecto_details = state.get("proyecto_details", {})
        
        # Generar prompt para el agente de comunicación
        prompt = f"""
        Genera comunicaciones para el siguiente cliente sobre su proyecto:
        
        Cliente: {proyecto_details.get('nombre_cliente')}
        Correo: {proyecto_details.get('correo_cliente', 'No especificado')}
        Tipo de proyecto: {proyecto_details.get('tipo_proyecto')}
        
        Por favor, genera un correo de bienvenida y un plan de comunicación para el seguimiento del proyecto.
        """
        
        # Ejecutar el agente de comunicación
        logger.info(f"Calling run_comunicacion_agent for thread_id: {state.get('configurable', {}).get('thread_id')}")
        comunicacion_results = run_comunicacion_agent(prompt, proyecto_details)
        
        # Actualizar el estado
        logger.info(f"Exiting node: process_comunicacion. Results keys: {comunicacion_results.keys() if comunicacion_results else 'None'}")
        return {
            **state,
            "comunicacion_results": comunicacion_results
        }
    
    # 6. Nodo sintetizador (combina resultados de agentes paralelos)
    @graph.node
    def synthesize_results(state: SolarFluidityState) -> SolarFluidityState:
        logger.info(f"Entering node: synthesize_results for thread_id: {state.get('configurable', {}).get('thread_id')}")
        """Sintetiza los resultados de todos los agentes."""
        writer = state.get("writer")
        
        if writer:
            writer.write("Sintetizando resultados...")
        
        proyecto_details = state.get("proyecto_details", {})
        facturacion_results = state.get("facturacion_results", {})
        proyecto_results = state.get("proyecto_results", {})
        comunicacion_results = state.get("comunicacion_results", {})
        
        # Ejecutar el agente sintetizador
        logger.info(f"Calling run_synthesizer_agent for thread_id: {state.get('configurable', {}).get('thread_id')}")
        synthesis = run_synthesizer_agent(
            facturacion_results,
            proyecto_results,
            comunicacion_results,
            proyecto_details
        )
        
        # Mostrar síntesis al usuario
        if writer:
            writer.write(synthesis)
        
        # Actualizar el estado
        logger.info(f"Exiting node: synthesize_results. Synthesis length: {len(synthesis)}")
        return {
            **state,
            "final_synthesis": synthesis
        }
    
    # Función para determinar el siguiente paso (recopilar más información o procesar)
    def router(state: SolarFluidityState) -> List[str]:
        """
        Determina el flujo del grafo basado en si toda la información necesaria ha sido recopilada.
        """
        proyecto_details = state.get("proyecto_details", {})
        toda_info = proyecto_details.get("toda_informacion_proporcionada", False)
        
        logger.info(f"Router decision for thread_id: {state.get('configurable', {}).get('thread_id')}: toda_info={toda_info}")
        if toda_info:
            # Ejecutar todos los agentes paralelos
            return ["process_facturacion", "process_proyecto", "process_comunicacion"]
            logger.info(f"Routing to parallel agents for thread_id: {state.get('configurable', {}).get('thread_id')}")
        else:
            # Recopilar más información
            return ["get_next_user_input"]
            logger.info(f"Routing to get_next_user_input for thread_id: {state.get('configurable', {}).get('thread_id')}")
    
    # Configurar las conexiones del grafo
    graph.add_node("gather_info", gather_info)
    graph.add_node("get_next_user_input", get_next_user_input)
    graph.add_node("process_facturacion", process_facturacion)
    graph.add_node("process_proyecto", process_proyecto)
    graph.add_node("process_comunicacion", process_comunicacion)
    graph.add_node("synthesize_results", synthesize_results)
    
    # Definir el flujo del grafo
    graph.add_edge("gather_info", router)
    graph.add_edge("get_next_user_input", "gather_info")
    graph.add_edge("process_facturacion", "synthesize_results")
    graph.add_edge("process_proyecto", "synthesize_results")
    graph.add_edge("process_comunicacion", "synthesize_results")
    graph.add_edge("synthesize_results", END)
    
    # Configurar el nodo inicial
    graph.set_entry_point("gather_info")
    
    return graph

# Función para ejecutar el grafo con gestión de interrupciones
async def run_solar_fluidity_graph(
    user_input: str,
    thread_id: Optional[str] = None,
    conversation_history: Optional[List[Dict[str, Any]]] = None,
    writer: Optional[Any] = None
):
    """
    Ejecuta el grafo de Solar Fluidity con soporte para streaming e interrupciones.
    
    Args:
        user_input: Entrada del usuario
        thread_id: ID único para el hilo de ejecución (opcional)
        conversation_history: Historial de conversación previo (opcional)
        writer: Objeto para escribir respuestas en streaming (opcional)
    
    Returns:
        Resultados de la ejecución del grafo
    """
    logger.info(f"--- Starting graph execution for thread_id: {thread_id} ---")
    # Crear el guardar en memoria para el grafo
    memory = MemorySaver()
    
    # Construir el grafo
    graph = build_solar_fluidity_graph(memory)
    
    # Generar un ID de hilo si no se proporciona
    thread_id = thread_id or str(uuid.uuid4())
    
    # Configurar el estado inicial
    if conversation_history is None:
        # Primera ejecución - empezamos desde cero
        initial_state = {
            "user_input": user_input,
            "conversation_history": [],
            "proyecto_details": None,
            "facturacion_results": None,
            "proyecto_results": None,
            "comunicacion_results": None,
            "final_synthesis": None,
            "streaming": writer is not None,
            "writer": writer
        }
        
        # Ejecutar el grafo con el estado inicial
        config = {"configurable": {"thread_id": thread_id}}
        for event in graph.stream(initial_state, config):
            logger.debug(f"Graph event for thread_id {thread_id}: {event}") # Log all stream events at DEBUG level
            yield event
    else:
        # Continuar una conversación existente - reanudar desde el punto de interrupción
        config = {
            "configurable": {"thread_id": thread_id},
            "interrupt": {"get_next_user_input": {"user_input": user_input}}
        }
        
        # Reanudar el grafo
        for event in graph.stream(None, config):
            logger.debug(f"Graph event for thread_id {thread_id}: {event}") # Log all stream events at DEBUG level
            yield event
    logger.info(f"--- Finished graph execution for thread_id: {thread_id} ---")
