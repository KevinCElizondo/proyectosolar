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

import logging

# --- Logging Configuration ---
log_file = 'ai_agents.log'
logging.basicConfig(
    level=logging.INFO,  # Log INFO level and above (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),  # Log to a file
        logging.StreamHandler()         # Log to the console
    ]
)
logger = logging.getLogger(__name__)
logger.info("AI Agents API starting up...")
# --- End Logging Configuration ---
from .graph import run_solar_fluidity_graph
from .routes import webhooks as webhook_router # Import the new webhook router

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

# Incluir routers
app.include_router(webhook_router.router) # Include the webhook router

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
    logger.info(f"Received chat request for thread_id: {user_message.thread_id}")
    all_output = []
    thread_id = user_message.thread_id

    # Clase para capturar texto
    class OutputCollector:
        def write(self, text):
            all_output.append(text)

    collector = OutputCollector()

    # Ejecutar el grafo y recopilar la salida
    logger.info(f"Running solar fluidity graph for message: '{user_message.message[:50]}...' thread_id: {thread_id}")
    full_response = "" # Initialize full_response
    async for chunk in run_solar_fluidity_graph(
        user_message.message,
        thread_id=thread_id,
        conversation_history=user_message.conversation_history,
        writer=collector
    ):
        # Assuming run_solar_fluidity_graph yields the final state or similar
        # We need to extract the actual response content if it's structured differently
        # For now, we rely on the collector
        pass

    full_response = "\n".join(all_output) # Construct response from collected output
    logger.info(f"Graph execution finished for thread_id: {thread_id}. Response length: {len(full_response)}")

    # Actualizar el historial de conversación
    conversation_history = user_message.conversation_history or []
    conversation_history.append({"role": "user", "content": user_message.message})
    conversation_history.append({"role": "assistant", "content": full_response})

    return AgentResponse(
        response=full_response,
        thread_id=thread_id if thread_id else "new_thread_" + str(datetime.now().timestamp()), # Ensure thread_id exists
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
    logger.info(f"WebSocket connection accepted from {websocket.client.host}:{websocket.client.port}")

    try:
        while True:
            # Receive message data from WebSocket client
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # Crear el manejador de streaming
            logger.info(f"Received WebSocket message for thread_id: {message_data.get('thread_id')}")
            writer = StreamingOutput(websocket)

            # Ejecutar el grafo con streaming
            logger.info(f"Running solar fluidity graph (stream) for message: '{message_data['message'][:50]}...' thread_id: {message_data.get('thread_id')}")
            async for _ in run_solar_fluidity_graph(
                message_data["message"],
                thread_id=message_data.get("thread_id"),
                conversation_history=message_data.get("conversation_history"),
                writer=writer
            ):
                pass

            # Enviar señal de fin
            await websocket.send_text("[DONE]")
            logger.info(f"Graph execution finished (stream) for thread_id: {message_data.get('thread_id')}")

    except WebSocketDisconnect:
        print("Cliente desconectado")
        logger.info(f"WebSocket client disconnected: {websocket.client.host}:{websocket.client.port}")
    except Exception as e:
        print(f"Error en WebSocket: {str(e)}")
        logger.error(f"WebSocket error: {str(e)}", exc_info=True)
        if websocket.client_state.CONNECTED:
            try:
                await websocket.send_text(json.dumps({"error": f"Server error: {str(e)}"}))
            except Exception as send_err:
                 logger.error(f"Error sending WebSocket error message: {send_err}")
            finally:
                 await websocket.close()


# Función para ejecutar la API
def start_api(host="0.0.0.0", port=8000):
    """Inicia la API de FastAPI."""
    logger.info(f"Starting Uvicorn server on {host}:{port}")
    uvicorn.run("ai_agents.main:app", host=host, port=port, reload=True)


# Punto de entrada principal
if __name__ == "__main__":
    start_api()
