"""
Aplicación de demostración simplificada para Solar Fluidity con integración MCP.
"""
import streamlit as st
import os
import json
import requests
from datetime import datetime
import openai
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configurar OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_client = openai.OpenAI(api_key=openai_api_key)

# Título y configuración
st.set_page_config(
    page_title="Solar Fluidity - Demo MCP",
    page_icon="☀️",
    layout="wide"
)

st.title("☀️ Solar Fluidity - Integración MCP")
st.markdown("""
Esta es una demostración simplificada del sistema de agentes para Solar Fluidity que integra los servidores MCP.
""")

# Sidebar con información
st.sidebar.header("Configuración")
modelo = st.sidebar.selectbox(
    "Modelo",
    ["gpt-4-turbo", "gpt-3.5-turbo"],
    index=0
)

# Información de MCP
st.sidebar.markdown("---")
st.sidebar.markdown("### Servidores MCP Conectados")
mcp_servers = [
    {"nombre": "Airtable MCP", "estado": "✅"},
    {"nombre": "GitHub MCP", "estado": "✅"},
    {"nombre": "Gmail MCP", "estado": "✅"},
    {"nombre": "Google Calendar MCP", "estado": "✅"},
    {"nombre": "Stagehand MCP", "estado": "✅"},
    {"nombre": "Zapier MCP", "estado": "✅"},
    {"nombre": "Convex MCP", "estado": "✅"}
]

for server in mcp_servers:
    st.sidebar.markdown(f"- {server['estado']} {server['nombre']}")

# Funciones de simulación para demos
def simular_consulta_facturacion(prompt, cliente):
    """Simula una consulta al agente de facturación"""
    response = openai_client.chat.completions.create(
        model=modelo,
        messages=[
            {"role": "system", "content": "Eres un asistente especializado en facturación electrónica para Costa Rica. Simula el proceso de creación de facturas para clientes solares."},
            {"role": "user", "content": f"Cliente: {cliente}\n\nConsulta: {prompt}"}
        ]
    )
    return response.choices[0].message.content

def simular_consulta_proyecto(prompt, cliente):
    """Simula una consulta al agente de gestión de proyectos"""
    response = openai_client.chat.completions.create(
        model=modelo,
        messages=[
            {"role": "system", "content": "Eres un asistente especializado en gestión de proyectos solares. Simula la creación de cronogramas y planes de proyecto."},
            {"role": "user", "content": f"Cliente: {cliente}\n\nConsulta: {prompt}"}
        ]
    )
    return response.choices[0].message.content

def simular_consulta_comunicacion(prompt, cliente):
    """Simula una consulta al agente de comunicación"""
    response = openai_client.chat.completions.create(
        model=modelo,
        messages=[
            {"role": "system", "content": "Eres un asistente especializado en comunicación con clientes. Simula la redacción de correos y mensajes para clientes."},
            {"role": "user", "content": f"Cliente: {cliente}\n\nConsulta: {prompt}"}
        ]
    )
    return response.choices[0].message.content

# Interfaz principal
tab1, tab2, tab3 = st.tabs(["Recopilación de Información", "Agentes Paralelos", "Resultados"])

with tab1:
    st.header("Recopilación de Información")
    
    # Formulario de cliente
    with st.form("cliente_form"):
        col1, col2 = st.columns(2)
        
        with col1:
            nombre = st.text_input("Nombre del Cliente", "Juan Pérez")
            cedula = st.text_input("Cédula", "1-1234-5678")
            correo = st.text_input("Correo", "juan@ejemplo.com")
            
        with col2:
            tipo_proyecto = st.selectbox(
                "Tipo de Proyecto",
                ["Instalación Solar", "Servicio Electromecánico", "Mantenimiento"]
            )
            ubicacion = st.text_input("Ubicación", "San José, Costa Rica")
            fecha_inicio = st.date_input("Fecha de Inicio")
        
        submit = st.form_submit_button("Recopilar Información")
    
    if submit:
        st.success(f"Información recopilada para {nombre}")
        
        # Guardar en session_state
        st.session_state.cliente = {
            "nombre": nombre,
            "cedula": cedula,
            "correo": correo,
            "tipo_proyecto": tipo_proyecto,
            "ubicacion": ubicacion,
            "fecha_inicio": fecha_inicio.strftime("%Y-%m-%d")
        }
        
        # Mostrar JSON
        st.json(st.session_state.cliente)

with tab2:
    st.header("Agentes Paralelos")
    
    # Verificar si se ha recopilado información
    if "cliente" not in st.session_state:
        st.warning("Primero debe completar la información del cliente en la pestaña 'Recopilación de Información'.")
    else:
        st.write(f"Cliente: **{st.session_state.cliente['nombre']}**")
        st.write(f"Proyecto: **{st.session_state.cliente['tipo_proyecto']}**")
        
        # Columnas para los agentes
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.subheader("Agente de Facturación")
            facturacion_prompt = st.text_area(
                "Consulta para Facturación",
                "Genera una factura electrónica para este cliente con un monto de $5,000 por instalación solar.",
                height=100,
                key="facturacion_prompt"
            )
            
            if st.button("Ejecutar Agente de Facturación"):
                with st.spinner("Procesando facturación..."):
                    resultado = simular_consulta_facturacion(
                        facturacion_prompt,
                        st.session_state.cliente['nombre']
                    )
                    st.session_state.facturacion_resultado = resultado
                    st.success("¡Facturación procesada!")
                    st.markdown(resultado)
        
        with col2:
            st.subheader("Agente de Proyectos")
            proyecto_prompt = st.text_area(
                "Consulta para Gestión de Proyectos",
                f"Crea un cronograma para el proyecto de {st.session_state.cliente['tipo_proyecto']} en {st.session_state.cliente['ubicacion']}.",
                height=100,
                key="proyecto_prompt"
            )
            
            if st.button("Ejecutar Agente de Proyectos"):
                with st.spinner("Procesando gestión de proyectos..."):
                    resultado = simular_consulta_proyecto(
                        proyecto_prompt,
                        st.session_state.cliente['nombre']
                    )
                    st.session_state.proyecto_resultado = resultado
                    st.success("¡Proyecto planificado!")
                    st.markdown(resultado)
        
        with col3:
            st.subheader("Agente de Comunicación")
            comunicacion_prompt = st.text_area(
                "Consulta para Comunicación",
                f"Redacta un correo de bienvenida para {st.session_state.cliente['nombre']} explicando el proceso de instalación solar.",
                height=100,
                key="comunicacion_prompt"
            )
            
            if st.button("Ejecutar Agente de Comunicación"):
                with st.spinner("Procesando comunicación..."):
                    resultado = simular_consulta_comunicacion(
                        comunicacion_prompt,
                        st.session_state.cliente['nombre']
                    )
                    st.session_state.comunicacion_resultado = resultado
                    st.success("¡Comunicación generada!")
                    st.markdown(resultado)

with tab3:
    st.header("Resultados Sintetizados")
    
    # Verificar si se han ejecutado los agentes
    resultados_listos = all(k in st.session_state for k in ['facturacion_resultado', 'proyecto_resultado', 'comunicacion_resultado'])
    
    if not resultados_listos:
        st.warning("Primero debe ejecutar todos los agentes en la pestaña 'Agentes Paralelos'.")
    else:
        if st.button("Sintetizar Resultados"):
            with st.spinner("Sintetizando resultados de los agentes..."):
                # Preparar el prompt para la síntesis
                sintesis_prompt = f"""
                Por favor, sintetiza los siguientes resultados de los agentes especializados:
                
                CLIENTE:
                Nombre: {st.session_state.cliente['nombre']}
                Tipo de proyecto: {st.session_state.cliente['tipo_proyecto']}
                Ubicación: {st.session_state.cliente['ubicacion']}
                
                RESULTADOS DEL AGENTE DE FACTURACIÓN:
                {st.session_state.facturacion_resultado}
                
                RESULTADOS DEL AGENTE DE GESTIÓN DE PROYECTOS:
                {st.session_state.proyecto_resultado}
                
                RESULTADOS DEL AGENTE DE COMUNICACIÓN:
                {st.session_state.comunicacion_resultado}
                
                Crea un informe ejecutivo que combine toda esta información.
                """
                
                response = openai_client.chat.completions.create(
                    model=modelo,
                    messages=[
                        {"role": "system", "content": "Eres un asistente sintetizador que combina y presenta los resultados de múltiples agentes especializados de manera coherente y bien estructurada."},
                        {"role": "user", "content": sintesis_prompt}
                    ]
                )
                
                sintesis = response.choices[0].message.content
                st.session_state.sintesis = sintesis
                
                st.success("¡Síntesis completada!")
                
                # Mostrar resultados
                st.markdown("## Informe Ejecutivo")
                st.markdown(sintesis)
                
                # Exportar
                st.download_button(
                    "Descargar Informe",
                    sintesis,
                    f"informe_{st.session_state.cliente['nombre'].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.md",
                    mime="text/markdown"
                )

# Footer
st.markdown("---")
st.caption("""
© 2025 Solar Fluidity | MCP Hub integrado con múltiples servidores
""")

# Main
if __name__ == "__main__":
    # Este código se ejecuta cuando el script se ejecuta directamente
    pass
