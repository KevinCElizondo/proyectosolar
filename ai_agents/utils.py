"""
Utilidades para los agentes de IA de Solar Fluidity.
"""
import os
from typing import Dict, Any, List, Optional
import json
import logging
from dotenv import load_dotenv
import openai
import requests # Added for Ollama

logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

def get_model():
    """
    Obtiene el modelo de LLM basado en las variables de entorno.
    """
    llm_provider = os.getenv("LLM_PROVIDER", "openai").lower()
    if llm_provider == "ollama":
        # Default to a common Ollama model if none specified for Ollama
        model_name = os.getenv("MODEL_NAME", "llama3")
    else: # Default to OpenAI
        model_name = os.getenv("MODEL_NAME", "gpt-4-turbo")
    logger.debug(f"Using LLM model: {model_name} (Provider: {llm_provider})")
    return model_name

def call_llm_api(system_prompt: str, user_prompt: str) -> str:
    """
    Llama a la API del LLM configurado (OpenAI u Ollama) con un prompt de sistema y usuario.
    
    Args:
        system_prompt: Prompt de sistema para definir el comportamiento del LLM
        user_prompt: Prompt del usuario con la consulta o tarea
        
    Returns:
        Respuesta del modelo
    """
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    llm_provider = os.getenv("LLM_PROVIDER", "openai").lower()
    model_name = get_model()
    
    try:
        if llm_provider == "ollama":
            ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
            api_endpoint = f"{ollama_url}/api/generate"
            payload = {
                "model": model_name,
                "system": system_prompt,
                "prompt": user_prompt,
                "stream": False # Request a single response object
            }
            logger.info(f"Calling Ollama API at {api_endpoint} with model {model_name}")
            response = requests.post(api_endpoint, json=payload)
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
            
            response_data = response.json()
            logger.debug(f"Ollama raw response: {response_data}")
            return response_data.get("response", "").strip()
            
        else: # Default to OpenAI
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if not openai_api_key:
                raise ValueError("OPENAI_API_KEY environment variable not set.")
            client = openai.OpenAI(api_key=openai_api_key)
            logger.info(f"Calling OpenAI API with model {model_name}")
            
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
            )
            logger.debug(f"OpenAI raw response: {response}")
            return response.choices[0].message.content.strip()

    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Ollama API: {e}", exc_info=True)
        return f"Error: No se pudo conectar al servidor Ollama en {ollama_url}. ¿Está Ollama ejecutándose?"
    except openai.APIError as e:
        logger.error(f"Error calling OpenAI API: {e}", exc_info=True)
        return f"Error: Ocurrió un error con la API de OpenAI: {e}"
    except Exception as e:
        logger.error(f"Unexpected error in call_llm_api: {e}", exc_info=True)
        return f"Error: Ocurrió un error inesperado al procesar la solicitud."
    
def load_mcp_config() -> Dict[str, Any]:
    """
    Carga la configuración MCP desde el archivo de configuración.
    """
    config_path = os.path.expanduser('~/.codeium/windsurf/mcp_config.json')
    with open(config_path, 'r') as f:
        return json.load(f)

def call_mcp_server(server_name: str, tool_name: str, **kwargs):
    """
    Llama a una herramienta específica en un servidor MCP.
    
    Args:
        server_name: Nombre del servidor MCP
        tool_name: Nombre de la herramienta a llamar
        kwargs: Argumentos para la herramienta
    
    Returns:
        Resultado de la llamada a la herramienta
    """
    # Esta es una implementación simulada - en un entorno real,
    # utilizaríamos la biblioteca MCP para hacer estas llamadas
    print(f"Llamando a {tool_name} en servidor {server_name}")
    print(f"Argumentos: {kwargs}")
    
    # Implementación simulada para pruebas
    if server_name == "airtable" and tool_name == "create_record":
        return {"id": "rec123", "created": True}
    elif server_name == "github" and tool_name == "create_issue":
        return {"issue_number": 42, "url": "https://github.com/org/repo/issues/42"}
    elif server_name == "gmail" and tool_name == "send_email":
        return {"message_id": "msg123", "sent": True}
    
    return {"status": "simulado", "server": server_name, "tool": tool_name}

class MCPToolProvider:
    """
    Proveedor de herramientas MCP para los agentes.
    """
    def __init__(self, servers: List[str]):
        self.servers = servers
        self.config = load_mcp_config()
    
    def get_tool_for_server(self, server_name: str, tool_name: str):
        """
        Obtiene una herramienta para un servidor MCP específico.
        """
        if server_name not in self.servers:
            raise ValueError(f"Servidor MCP {server_name} no configurado")
        
        def tool_function(**kwargs):
            return call_mcp_server(server_name, tool_name, **kwargs)
        
        return tool_function
