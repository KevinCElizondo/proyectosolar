"""
Punto de entrada principal para los agentes paralelos de Solar Fluidity.
"""
import os
import asyncio
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

from .graph import run_solar_fluidity_graph

# Inicializar FastAPI
app = FastAPI(
    title="Solar Fluidity - Agentes Paralelos",
    description="API para la arquitectura de agentes paralelos de Solar Fluidity",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class UserMessage(BaseModel):
    """Mensaje del usuario."""
    message: str
    thread_id: Optional[str] = None
    conversation_history: Optional[List[Dict[str, Any]]] = None

class AgentResponse(BaseModel):
    """Respuesta del agente."""
    response: str
    thread_id: str
    conversation_history: List[Dict[str, Any]]

# Clase para manejar el streaming en WebSockets
class StreamingOutput:
    """Gestiona el streaming de salida a WebSockets."""
    def __init__(self, websocket):
        self.websocket = websocket
    
    async def write(self, text):
        """Envía texto a través del WebSocket."""
        await self.websocket.send_text(text)

# Endpoints de la API
@app.post("/agent/chat", response_model=AgentResponse)
async def chat_with_agent(user_message: UserMessage):
    """
    Endpoint para chatear con el agente.
    
    Args:
        user_message: Mensaje del usuario y contexto
    
    Returns:
        Respuesta del agente
    """
    # Capturar la salida del grafo
    all_output = []
    thread_id = user_message.thread_id
    
    # Clase para capturar texto
    class OutputCollector:
        def write(self, text):
            all_output.append(text)
    
    collector = OutputCollector()
    
    # Ejecutar el grafo y recopilar la salida
    async for _ in run_solar_fluidity_graph(
        user_message.message,
        thread_id=thread_id,
        conversation_history=user_message.conversation_history,
        writer=collector
    ):
        pass
    
    # Construir la respuesta
    full_response = "\n".join(all_output)
    
    # Actualizar el historial de conversación
    conversation_history = user_message.conversation_history or []
    conversation_history.append({"role": "user", "content": user_message.message})
    conversation_history.append({"role": "assistant", "content": full_response})
    
    return AgentResponse(
        response=full_response,
        thread_id=thread_id,
        conversation_history=conversation_history
    )

@app.websocket("/agent/stream")
async def stream_chat(websocket: WebSocket):
    """
    Endpoint WebSocket para chatear con streaming.
    
    Args:
        websocket: Conexión WebSocket
    """
    await websocket.accept()
    
    try:
        while True:
            # Recibir mensaje del cliente
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Crear el manejador de streaming
            writer = StreamingOutput(websocket)
            
            # Ejecutar el grafo con streaming
            async for _ in run_solar_fluidity_graph(
                message_data["message"],
                thread_id=message_data.get("thread_id"),
                conversation_history=message_data.get("conversation_history"),
                writer=writer
            ):
                pass
            
            # Enviar señal de fin
            await websocket.send_text("[DONE]")
    
    except WebSocketDisconnect:
        print("Cliente desconectado")
    except Exception as e:
        print(f"Error en WebSocket: {str(e)}")
        if websocket.client_state.CONNECTED:
            await websocket.send_text(f"Error: {str(e)}")
            await websocket.close()

# Función para ejecutar la API
def start_api(host="0.0.0.0", port=8000):
    """Inicia la API de FastAPI."""
    uvicorn.run("ai_agents.main:app", host=host, port=port, reload=True)

# Punto de entrada principal
if __name__ == "__main__":
    start_api()
