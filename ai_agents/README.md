# Agentes IA para Solar Fluidity

Este módulo implementa una arquitectura de agentes paralelos especializados utilizando Pydantic AI y LangGraph para automatizar procesos clave en Solar Fluidity.

## Arquitectura

El sistema utiliza una arquitectura de agentes paralelos que incluye:

1. **Agente de Recopilación de Información**: Recopila todos los datos necesarios del usuario.
2. **Agentes Especializados** (ejecutados en paralelo):
   - **Agente de Facturación**: Gestiona la creación de facturas electrónicas.
   - **Agente de Gestión de Proyectos**: Gestiona calendarios, tareas y seguimiento de proyectos.
   - **Agente de Comunicación con Clientes**: Maneja correos electrónicos y notificaciones.
3. **Agente Sintetizador**: Combina los resultados de todos los agentes especializados.

## Configuración

1. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

2. Configura las variables de entorno (o usa .env):
   ```bash
   export OPENAI_API_KEY=tu-clave-api
   ```

3. Ejecuta el servidor de agentes:
   ```bash
   python main.py
   ```

## Integración con MCP Hub

Este sistema se integra con los siguientes servidores MCP:
- Airtable MCP - Para gestión de datos
- GitHub MCP - Para seguimiento de proyectos
- Gmail MCP - Para comunicaciones
- Google Calendar MCP - Para programación
- Browserbase Stagehand - Para automatización web
- Zapier MCP - Para integraciones externas
- Convex MCP - Para base de datos en tiempo real

## Uso

El sistema puede ser utilizado a través de:
1. API REST (endpoints documentados en api.md)
2. Interfaz web (accesible en http://localhost:8000)
3. Integración directa con Windsurf IDE a través de MCP
