# Design: Local Development Support Dashboard

## 1. Objetivo

Crear una página web local simple, accesible durante el desarrollo (preferiblemente servida a través de Docker Compose), que actúe como un panel de control para desarrolladores del proyecto Solar Fluidity. Esta página facilitará la visualización del estado de los servicios, el acceso a logs, la revisión de la configuración y la comprensión general de la estructura del proyecto.

## 2. Acceso

-   **URL:** `http://localhost:9999` (o un puerto similar no conflictivo)
-   **Servicio:** Un contenedor Docker dedicado (ej. `support-dashboard`) definido en `docker-compose.yml`, posiblemente usando una imagen base simple de Node.js/Express o Python/Flask para servir HTML estático o dinámico básico.

## 3. Estructura y Contenido

La página tendrá una interfaz limpia y organizada, posiblemente con una barra lateral de navegación y un área de contenido principal.

### 3.1. Barra Lateral / Navegación

-   **Dashboard:** Enlace a la vista principal.
-   **Service Status:** Estado de los contenedores Docker.
-   **Log Viewer:** Acceso a los logs de los servicios.
-   **Environment:** Visualización de variables de entorno (no secretas).
-   **Project Structure:** Resumen de la estructura de directorios.
-   **Quick Links:** Enlaces útiles.
-   **(Opcional) MCP Inspector:** Interfaz básica para MCPs.

### 3.2. Contenido Principal

#### a) Dashboard (Vista Principal)

-   **Título:** "Solar Fluidity - Development Dashboard"
-   **Resumen Rápido:**
    -   Número de servicios definidos en `docker-compose.yml`.
    -   Número de servicios actualmente en ejecución (`running`).
    -   Número de servicios detenidos (`stopped`/`exited`).
-   **Accesos Directos:** Botones o enlaces grandes para las secciones más comunes (Service Status, Log Viewer).

#### b) Service Status

-   **Título:** "Estado de los Servicios (Docker)"
-   **Tabla:** Lista de todos los servicios definidos en `docker-compose.yml`.
    -   **Columnas:**
        -   `Service Name`: Nombre del servicio (ej. `frontend`, `backend-api`, `ai-agents`).
        -   `Container ID`: ID del contenedor (si está corriendo).
        -   `Status`: Estado actual (ej. `running`, `exited(0)`, `exited(1)`, `starting`). Indicador visual (verde para running, rojo para error, amarillo para otros).
        -   `Ports`: Puertos mapeados (ej. `5173->5173`, `4000->4000`).
        -   `Actions`: Botones para "View Logs", "Restart" (si es posible implementarlo).
-   **Fuente de Datos:** Se obtendría ejecutando comandos `docker ps -a --format "{{json .}}"` en el host o a través de la API de Docker si el dashboard tiene acceso.

#### c) Log Viewer

-   **Título:** "Visor de Logs"
-   **Selector:** Dropdown para seleccionar el servicio (contenedor) del cual ver los logs.
-   **Área de Logs:** Muestra las últimas N líneas de log del contenedor seleccionado.
    -   Opción para "Seguir" (tail) los logs en tiempo real.
    -   Opción para cargar más líneas anteriores.
    -   Filtro simple por texto.
-   **Fuente de Datos:** Ejecutando `docker logs [container_id]` o `docker logs -f [container_id]` para seguir.

#### d) Environment Variables

-   **Título:** "Variables de Entorno Cargadas"
-   **Selector:** Dropdown para seleccionar el servicio.
-   **Tabla:** Lista de variables de entorno **NO SECRETAS** cargadas por el servicio seleccionado.
    -   **Columnas:** `Variable Name`, `Value`.
    -   **Advertencia:** Mostrar un aviso claro de que las variables secretas (API Keys, Tokens, Passwords) **NO** se muestran aquí por seguridad.
-   **Fuente de Datos:** Podría obtenerse si los contenedores exponen un endpoint simple para esto (con cuidado de no exponer secretos) o leyendo los archivos `.env` asociados (menos dinámico).

#### e) Project Structure

-   **Título:** "Estructura del Proyecto"
-   **Visualización:** Una representación simple (texto preformateado o lista anidada) de los directorios y archivos clave del proyecto, similar a un comando `tree` limitado.
    -   `backend-api/`
    -   `readme_notifier/`
    -   `ai_agents/`
    -   `src/` (Frontend)
    -   `docs/`
    -   `scripts/`
    -   `docker-compose.yml`
    -   `.env` (Principal)
-   **Fuente de Datos:** Podría ser estático o generado al construir la imagen del dashboard leyendo la estructura del proyecto en ese momento.

#### f) Quick Links

-   **Título:** "Enlaces Rápidos"
-   **Lista de Enlaces:**
    -   Frontend Local (`http://localhost:5173`)
    -   Backend API Local (`http://localhost:4000`)
    -   Supabase Dashboard (`https://app.supabase.io/...`)
    -   Render Dashboard (`https://dashboard.render.com/`)
    -   Documentación Principal (`./docs/`)
    -   Repositorio Git

#### g) (Opcional) MCP Inspector

-   **Título:** "Inspector MCP"
-   **Funcionalidad:**
    -   Listar MCP Servers detectados/configurados.
    -   Para cada servidor, listar sus `tools` y `resources` disponibles (requeriría que el dashboard pueda comunicarse con los MCPs o leer su configuración).
-   **Nota:** Esto añade complejidad significativa.

## 4. Consideraciones Técnicas

-   **Framework/Librería:** Podría ser una app simple de Express/Flask sirviendo HTML con algo de JavaScript para llamadas API (a sí misma o a la API de Docker si se expone de forma segura), o un framework frontend ligero como Svelte o Vue si se desea más interactividad.
-   **Acceso a Docker:** La forma más segura es que el contenedor del dashboard tenga acceso al socket de Docker del host (`/var/run/docker.sock`) montado como volumen (con las implicaciones de seguridad que esto conlleva) o usar una API intermediaria segura. Ejecutar comandos `docker` directamente desde el contenedor es otra opción si la imagen incluye el cliente Docker.
-   **Seguridad:** Dado que es una herramienta de desarrollo local, la seguridad puede ser menos estricta, pero evitar exponer secretos es crucial. El acceso debería limitarse a `localhost`.

Este diseño proporciona una base para construir una herramienta útil que mejore la experiencia de desarrollo del equipo en el proyecto Solar Fluidity.