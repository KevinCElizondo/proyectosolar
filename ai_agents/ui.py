"""
Interfaz de usuario de Streamlit para los agentes paralelos de Solar Fluidity.
"""
import streamlit as st
import asyncio
import json
import requests
from typing import Dict, List, Any, Optional
import uuid
import websockets
import os

# URL de la API (ajustar según configuración)
API_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000/agent/stream"

st.set_page_config(
    page_title="Solar Fluidity - Agentes Paralelos",
    page_icon="☀️",
    layout="wide"
)

# Título y descripción
st.title("☀️ Solar Fluidity - Agentes Paralelos")
st.markdown("""
Esta interfaz te permite interactuar con el sistema de agentes paralelos que automatizan procesos
clave para Solar Fluidity, utilizando los servidores MCP configurados en tu hub.
""")

# Sidebar para configuración
st.sidebar.header("Configuración")

# Seleccionar modo
mode = st.sidebar.radio(
    "Modo de interacción",
    ["Conversación", "Prueba Rápida"]
)

# Configuración de API
with st.sidebar.expander("Configuración de API", expanded=False):
    api_url = st.text_input("URL de la API", value=API_URL)
    ws_url = st.text_input("URL de WebSocket", value=WS_URL)

# Preferencias de visualización
with st.sidebar.expander("Preferencias", expanded=True):
    streaming = st.checkbox("Streaming de respuestas", value=True)
    show_internal = st.checkbox("Mostrar procesamiento interno", value=False)

st.sidebar.markdown("---")
st.sidebar.markdown("### Servidores MCP Conectados")
st.sidebar.markdown("""
- ✅ Airtable MCP
- ✅ GitHub MCP
- ✅ Gmail MCP 
- ✅ Google Calendar MCP
- ✅ Stagehand MCP
- ✅ Zapier MCP
- ✅ Convex MCP
""")

# Función para llamar a la API
def call_api(message, thread_id=None, conversation_history=None):
    """Llama a la API REST para chatear con el agente."""
    data = {
        "message": message,
        "thread_id": thread_id,
        "conversation_history": conversation_history
    }
    response = requests.post(f"{api_url}/agent/chat", json=data)
    return response.json()

# Función para streaming vía WebSocket
async def stream_response(message, thread_id=None, conversation_history=None):
    """Obtiene la respuesta en streaming a través de WebSocket."""
    data = {
        "message": message,
        "thread_id": thread_id,
        "conversation_history": conversation_history
    }
    
    async with websockets.connect(ws_url) as websocket:
        await websocket.send(json.dumps(data))
        
        full_response = []
        while True:
            response = await websocket.recv()
            if response == "[DONE]":
                break
            
            full_response.append(response)
            yield response
    
    return "".join(full_response)

# Inicializar estado de la sesión
if "messages" not in st.session_state:
    st.session_state.messages = []

if "thread_id" not in st.session_state:
    st.session_state.thread_id = str(uuid.uuid4())

# Contenedor principal para la UI
if mode == "Conversación":
    # Mostrar mensajes anteriores
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Campo de entrada
    prompt = st.chat_input("Escribe tu mensaje...")
    
    if prompt:
        # Mostrar mensaje del usuario
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Añadir mensaje del usuario a la historia
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Respuesta del asistente
        with st.chat_message("assistant"):
            if streaming:
                # Usar WebSocket para respuesta en streaming
                response_placeholder = st.empty()
                full_response = []
                
                # Crear función para ejecutar el stream
                async def run_streaming():
                    async for response_chunk in stream_response(
                        prompt,
                        thread_id=st.session_state.thread_id,
                        conversation_history=st.session_state.messages[:-1]
                    ):
                        full_response.append(response_chunk)
                        response_placeholder.markdown("".join(full_response))
                
                # Ejecutar el streaming
                asyncio.run(run_streaming())
                
                # Agregar respuesta completa a la historia
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": "".join(full_response)
                })
            else:
                # Usar API REST para respuesta completa
                with st.spinner("El asistente está pensando..."):
                    response = call_api(
                        prompt,
                        thread_id=st.session_state.thread_id,
                        conversation_history=st.session_state.messages[:-1]
                    )
                
                st.markdown(response["response"])
                
                # Actualizar historia y thread_id
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": response["response"]
                })
                st.session_state.thread_id = response["thread_id"]

else:  # Modo de Prueba Rápida
    st.header("Pruebas Rápidas")
    
    # Ejemplos predefinidos para pruebas
    examples = {
        "Proyecto Solar Residencial": """
        Necesito instalar paneles solares en mi casa en Heredia. 
        Mi nombre es Juan Pérez y mi cédula es 108760543.
        Mi correo es juan.perez@ejemplo.com.
        """,
        
        "Servicio Electromecánico": """
        Soy María López de Cartago y necesito un servicio de instalación eléctrica
        para mi negocio. Mi teléfono es 8822-5566.
        """,
        
        "Facturación Electrónica": """
        Necesito generar una factura electrónica para el cliente Pedro Ramírez,
        cédula 401230456, por la instalación de un sistema solar de 5kW.
        El monto es de $8,500 más 13% de IVA.
        """,
        
        "Programación de Proyecto": """
        Crea un cronograma para el proyecto de instalación solar del cliente
        Carlos Jiménez que debe comenzar el 15 de abril. La instalación es
        para un sistema de 8kW en una bodega en Alajuela.
        """
    }
    
    col1, col2 = st.columns(2)
    
    with col1:
        example_key = st.selectbox("Seleccionar ejemplo", list(examples.keys()))
        st.text_area("Mensaje de prueba", examples[example_key], height=200, key="test_prompt")
        
        if st.button("Ejecutar Prueba"):
            with col2:
                st.subheader("Respuesta")
                
                if streaming:
                    # Usar WebSocket para streaming
                    response_area = st.empty()
                    
                    # Crear función para ejecutar el stream
                    async def run_test_streaming():
                        full_response = []
                        async for chunk in stream_response(st.session_state.test_prompt):
                            full_response.append(chunk)
                            response_area.markdown("".join(full_response))
                    
                    # Ejecutar el streaming
                    asyncio.run(run_test_streaming())
                    
                else:
                    # Usar API REST para respuesta completa
                    with st.spinner("Procesando..."):
                        response = call_api(st.session_state.test_prompt)
                    
                    st.markdown(response["response"])

# Instrucciones en el footer
st.markdown("---")
st.caption("""
© 2025 Solar Fluidity | Powered by Agentes Paralelos con Pydantic AI y LangGraph
""")

# Punto de entrada principal
if __name__ == "__main__":
    # El código se ejecuta directamente cuando se llama a streamlit run ui.py
    pass
