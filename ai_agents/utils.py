"""
Utilidades para los agentes de IA de Solar Fluidity.
"""
import os
from typing import Dict, Any, List, Optional
import json
from dotenv import load_dotenv
import openai

# Cargar variables de entorno
load_dotenv()

def get_model():
    """
    Obtiene el modelo de LLM basado en las variables de entorno.
    """
    model_name = os.getenv("MODEL_NAME", "gpt-4-turbo")
    return model_name

def call_openai_api(system_prompt, user_prompt):
    """
    Llama a la API de OpenAI con un prompt de sistema y usuario.
    
    Args:
        system_prompt: Prompt de sistema para definir el comportamiento del LLM
        user_prompt: Prompt del usuario con la consulta o tarea
        
    Returns:
        Respuesta del modelo
    """
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = client.chat.completions.create(
        model=get_model(),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
    )
    
    return response.choices[0].message.content

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
