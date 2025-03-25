# Integración de Servidores mCP con n8n en Solar Fluidity

Este documento proporciona instrucciones detalladas para integrar servidores **mCP** (Model Context Protocol) de **Supabase, Google Drive, Gmail y Amazon AWS** en **n8n** para extender las capacidades de automatización de Solar Fluidity.

## Descripción General

La integración de servidores mCP permite a Solar Fluidity:

- Automatizar la gestión de facturas electrónicas en bases de datos (Supabase)
- Sincronizar documentos de proyectos solares (Google Drive)
- Automatizar comunicaciones con clientes (Gmail)
- Gestionar recursos en la nube para escalabilidad (AWS)

Esta integración forma parte de nuestra estrategia para ofrecer automatizaciones avanzadas en los planes Básico y Profesional.

## ⚙️ Requisitos Iniciales

Asegúrate de tener previamente instalado:

- ✅ **n8n** (localmente)
- ✅ **Docker Desktop** (recomendado)
- ✅ Node.js (última versión LTS)
- ✅ Visual Studio Code
- ✅ Git

## 🚀 Proceso de Integración Paso a Paso

### 🟢 1. Habilitar Community Nodes en n8n

- Ejecuta n8n localmente:
```bash
n8n
```

- Abre la interfaz web en:  
```bash
http://localhost:5678
```

- En n8n ve a:  
**Settings → Community Nodes → Install**

- Escribe el paquete:
```
n8n-nodes-mcp
```

- Confirma instalación.

### 🟢 2. Preparar servidores mCP

A continuación se detallan comandos y configuraciones para cada servidor:

> **Importante:** Todos los siguientes comandos se ejecutan en terminal separada. Usa pestañas diferentes.

#### 🔵 A) Supabase mCP Server

- Instala servidor Supabase mCP:
```bash
npx @supabase/mcp
```

- Alternativamente usando Docker (recomendado):
```bash
docker run -p 3000:3000 supabase/postgres-meta
```

- El servidor mCP estará disponible en:
```
http://localhost:3000
```

#### 🟣 B) Google Drive mCP Server

- Usa Docker (recomendado):
```bash
docker run -p 4000:4000 ghcr.io/anthropics/google-drive-mcp
```

- Servidor Google Drive mCP estará en:
```
http://localhost:4000
```

- Necesitas autenticación OAuth. Crea credenciales OAuth2 en [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

#### 📧 C) Gmail mCP Server

- Usa Docker (recomendado):
```bash
docker run -p 5000:5000 ghcr.io/anthropics/gmail-mcp
```

- Servidor Gmail mCP estará en:
```
http://localhost:5000
```

- También necesita autenticación OAuth (crea credenciales OAuth2 en [Google Cloud Console](https://console.cloud.google.com/apis/credentials)).

#### 🟠 D) Amazon AWS mCP Server

- Docker (recomendado):
```bash
docker run -p 6000:6000 ghcr.io/anthropics/aws-mcp
```

- Servidor AWS mCP estará en:
```
http://localhost:6000
```

- Requiere credenciales de AWS (Crea Access Key en IAM AWS Console)

### 🟢 3. Configuración en n8n

Realiza esta configuración para cada uno de los servicios.

#### 📌 a. Crear Workflow nuevo:

- **New** → **Blank Workflow**

#### 📌 b. Configurar nodos para cada servidor mCP

Para cada uno (ejemplo con Supabase):

1. **Agregar nodo:**  
   - Busca **mCP Client**
   - Selecciona operación: **List Available Tools**

2. **Crear Credenciales (ejemplo Supabase):**

| Campo       | Valor                                   |
|-------------|-----------------------------------------|
| Command     | `npx` o `docker` (según instalación)    |
| Arguments   | `@supabase/mcp`                         |
| Environment | URL, Key (si aplica)                    |

> Ejemplo Supabase Environment:
```bash
SUPABASE_URL=http://localhost:3000
SUPABASE_KEY=<tu-key-api>
```

> Ejemplo Google Drive / Gmail Environment:
```bash
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URL=http://localhost:4000/oauth2callback
```

> Ejemplo AWS Environment:
```bash
AWS_ACCESS_KEY_ID=tu-key-id
AWS_SECRET_ACCESS_KEY=tu-secret-access
AWS_REGION=us-east-1
```

3. **Probar nodo:**
   - Haz clic en **Execute Node**.  
   - Debería listar herramientas disponibles.

### 🟢 4. Ejecutar Herramientas

- Añade nuevo nodo: **mCP Client**
- Selecciona: **Execute Tool**
- Credenciales previamente creadas
- **Tool Name:** conecta con el resultado del nodo previo (selección dinámica)
- **Tool Parameters:** déjalo automático (AI Model define parámetros) o configúralo manualmente según cada herramienta.

### 🟢 5. Integración con AI Agent (opcional)

- Añadir nodo **AI Agent (OpenAI)** al Workflow.
- Configura tu API Key OpenAI en Credentials.
- **Tools:** Añade los nodos **mCP Client** anteriores.

> Ahora tienes un agente inteligente conectado a múltiples servicios usando mCP.

## 🚀 Casos de Uso en Solar Fluidity

### Automatizaciones para Plan Básico

1. **Supabase + Gmail:**
   - Detectar facturas pendientes y enviar recordatorios automáticos
   - Almacenar respuestas de clientes en base de datos

2. **Google Drive:**
   - Crear carpetas de proyecto automáticamente al iniciar un nuevo proyecto solar
   - Organizar documentación técnica por cliente

### Automatizaciones para Plan Profesional

1. **Supabase + Google Drive + Gmail:**
   - Sistema completo de seguimiento de proyectos solares
   - Actualización automática de documentos según fase del proyecto
   - Comunicación automatizada con clientes según hitos

2. **AWS + Supabase:**
   - Backup automático de datos críticos a S3
   - Escalado automático de recursos según demanda

## 🟢 Ejemplos de Workflows

### Workflow 1: Facturación Automatizada

```
Trigger [Nuevo cliente] → 
mCP [Supabase: Crear cliente] → 
mCP [Google Drive: Crear carpeta cliente] → 
mCP [Gmail: Enviar correo bienvenida]
```

### Workflow 2: Seguimiento de Proyectos Solares

```
Trigger [Actualización proyecto] → 
mCP [Supabase: Actualizar estado] → 
Conditional [Si es fase final] →
mCP [Gmail: Enviar correo finalización] →
mCP [AWS: Generar informe final en S3]
```

## 🚨 Consideraciones Importantes

1. **Seguridad**
   - Mantén las credenciales en variables de entorno seguras (.env)
   - Nunca expongas claves en código público
   - Utiliza permisos limitados para cada servicio

2. **Rendimiento**
   - Los servidores mCP consumen recursos, monitorea su uso
   - Para producción, considera desplegar en servidores dedicados

3. **Confidencialidad**
   - La información de clientes y facturas es sensible
   - Asegura que todas las comunicaciones estén cifradas

## 🎯 Comparativa de Servicios para Diferentes Casos de Uso

| Servicio     | Recomendado para                                   | Plan Solar Fluidity |
|--------------|----------------------------------------------------|--------------------|
| Supabase     | Gestión de datos de clientes y facturación         | Básico y Profesional |
| Google Drive | Almacenamiento y gestión de documentos de proyectos| Básico y Profesional |
| Gmail        | Comunicación con clientes, notificaciones          | Básico y Profesional |
| Amazon AWS   | Almacenamiento a gran escala, backups              | Profesional         |

## 📚 Referencias y Recursos Adicionales

- [Documentación oficial de n8n](https://docs.n8n.io/)
- [Modelo de Contexto de Protocolo (mCP)](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Guía de Supabase para desarrolladores](https://supabase.io/docs)
- [Documentación de AWS para integraciones](https://docs.aws.amazon.com/index.html)

## 🔄 Actualización y Mantenimiento

Este documento será actualizado regularmente con:
- Nuevos casos de uso para Solar Fluidity
- Mejoras en los procesos de integración
- Nuevos servidores mCP disponibles

Última actualización: 24 de marzo de 2025
