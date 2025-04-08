# Guía de Despliegue de Solar Fluidity con Docker

**Versión 1.0 | Abril 2025**

Esta guía describe los pasos necesarios para configurar y ejecutar la plataforma Solar Fluidity utilizando Docker y Docker Compose en un entorno de desarrollo local.

## 1. Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

-   **Git:** Para clonar el repositorio.
-   **Docker:** La plataforma de contenedores. Descárgalo desde [Docker Desktop](https://www.docker.com/products/docker-desktop/).
-   **Docker Compose:** Generalmente viene incluido con Docker Desktop. Verifica ejecutando `docker-compose --version`.
-   **Cuentas de Servicios Externos:**
    -   Google Cloud (para OAuth de Gmail/Calendar si usas MCPs)
    -   Supabase (para base de datos principal)
    -   PayPal Developer (para credenciales de API de pagos Sandbox y Live)
    -   OpenAI (para los Agentes IA)
    -   (Opcional) AWS (para S3 si se configura)

## 2. Clonar el Repositorio

```bash
git clone https://github.com/KevinCElizondo/proyectosolar.git
cd proyectosolar
```

## 3. Configurar Variables de Entorno (`.env`)

Necesitarás crear y configurar varios archivos `.env` con tus credenciales y configuraciones específicas. **Nunca compartas estos archivos con información sensible.**

**a) Archivo Principal (`./.env`)**

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
nano .env # o usa tu editor preferido
```

Configura las variables según las instrucciones en `README.md`, prestando especial atención a:

-   `VITE_API_URL`: Debería apuntar al backend API (aún no dockerizado, por defecto `http://localhost:4000`).
-   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`: Credenciales de Supabase para el frontend.
-   `SUPABASE_URL`, `SUPABASE_KEY`: Credenciales de Supabase para el servidor MCP (rol de servicio).
-   `OPENAI_API_KEY`: Clave de API de OpenAI (usada por `ai-agents`).
-   Otras claves necesarias para MCPs, PayPal, etc.

**b) Backend API (`./backend-api/.env`)**

Crea este archivo dentro de `backend-api/` (si aún no existe):

```bash
nano backend-api/.env
```

Añade el contenido según `README.md`, asegurándote de que `PORT` sea `4000` y `FRONTEND_URL` sea la URL donde correrá el frontend (por defecto `http://localhost:5173`).


**d) Agentes IA (`./ai_agents/.env`)**

Crea este archivo dentro de `ai_agents/`:

```bash
nano ai_agents/.env
```

Añade las variables necesarias para los agentes. Como mínimo, necesitarás la `OPENAI_API_KEY` si no está definida en el `.env` principal. Puedes copiarla del `.env` principal o definirla aquí específicamente.

```dotenv
# Clave de API de OpenAI (requerida por los agentes)
OPENAI_API_KEY=your_openai_api_key # ¡SECRETO!

# Otras variables específicas para los agentes si las hubiera
# Ejemplo: SUPABASE_URL y SUPABASE_KEY si los agentes acceden directamente
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-supabase-service-role-key
```
*Nota: El `docker-compose.yml` está configurado para leer este archivo (`./ai_agents/.env`) para el servicio `ai-agents`.*

**e) Support Dashboard (`./support-dashboard/.env`)**

Si el dashboard de soporte requiere variables de entorno, crea un archivo `.env` en `./support-dashboard/` y configúralo según sea necesario. El `docker-compose.yml` actual no especifica un `env_file` para este servicio, pero podría añadirse si fuera necesario.

## 4. Configurar Base de Datos (Supabase)

Si es la primera vez que configuras el proyecto, necesitas ejecutar las migraciones o scripts SQL para crear las tablas necesarias en tu instancia de Supabase.

Consulta la sección "Configurar Base de Datos (Supabase)" en el `README.md` principal. Puedes usar el script `start_solar_fluidity.sh --setup` (si está actualizado) o ejecutar manualmente los scripts SQL (como `src/integrations/mcp/create_supabase_tables.py` o SQL directo) en el editor SQL de Supabase.

## 5. Construir y Ejecutar los Contenedores

Una vez configurados los archivos `.env`, puedes construir las imágenes y levantar los servicios definidos en `docker-compose.yml` (actualmente `support-dashboard` y `ai-agents`).

```bash
docker-compose up --build -d
```

-   `up`: Crea e inicia los contenedores.
-   `--build`: Fuerza la reconstrucción de las imágenes si los Dockerfiles o el código fuente han cambiado.
-   `-d`: Ejecuta los contenedores en segundo plano (detached mode).

Docker descargará las imágenes base, construirá las imágenes para tus servicios e iniciará los contenedores.

## 6. Ejecutar Servicios No Dockerizados (Temporal)

Actualmente, el `docker-compose.yml` solo gestiona `support-dashboard` y `ai-agents`. Necesitarás iniciar manualmente los otros componentes principales:

-   **Frontend (Vite Dev Server):**
    ```bash
    npm install # Si no lo has hecho antes
    npm run dev
    ```
    (Accede en `http://localhost:5173` o el puerto que indique Vite)

-   **Backend API (Node.js/Express):**
    ```bash
    cd backend-api
    npm install # Si no lo has hecho antes
    npm start
    ```
    (API disponible en `http://localhost:4000` o el puerto en `backend-api/.env`)

-   **Servidor MCP (Python/FastMCP):**
    ```bash
    # Asegúrate de tener las dependencias de Python instaladas para este servidor
    # pip install -r src/integrations/mcp/requirements.txt (si existe)
    cd src/integrations/mcp
    # Exporta las variables o inclúyelas en el comando
    SUPABASE_URL=$VITE_SUPABASE_URL SUPABASE_KEY=$SUPABASE_KEY python solar_fluidity_mcp_server.py
    cd ../../.. # Volver a la raíz
    ```

-   **Notificador Slack (Python):**
    ```bash
    # Asegúrate de tener las dependencias instaladas
    # pip install -r readme_notifier/requirements.txt
    python readme_notifier/main.py
    ```

## 7. Acceder a los Servicios Dockerizados

-   **Support Dashboard:** `http://localhost:9999`
-   **AI Agents API:** `http://localhost:8001` (Puedes probar endpoints como `http://localhost:8001/docs` para ver la documentación de Swagger/OpenAPI)

## 8. Ver Logs

Puedes ver los logs de los contenedores en ejecución:

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico (ej. ai-agents)
docker-compose logs -f ai-agents
```

Presiona `Ctrl+C` para detener el seguimiento de logs.

## 9. Detener los Contenedores

Para detener los servicios gestionados por Docker Compose:

```bash
docker-compose down
```

Esto detendrá y eliminará los contenedores, pero no los volúmenes (si se hubieran definido y usado para persistencia).

## 10. Actualizaciones

Si realizas cambios en el código fuente de un servicio dockerizado (ej., `ai_agents`), necesitarás reconstruir la imagen y reiniciar el servicio:

```bash
docker-compose up --build -d ai-agents
```

Si cambias el `Dockerfile` o `requirements.txt`, siempre usa `--build`.

## 11. Troubleshooting

-   **Errores de Permiso (Docker Socket):** Si `docker-compose up` falla con errores relacionados con `/var/run/docker.sock`, asegúrate de que tu usuario tenga los permisos correctos para acceder al socket de Docker. En Linux, esto a menudo implica añadir tu usuario al grupo `docker`.
-   **Conflictos de Puerto:** Si un puerto ya está en uso en tu máquina host (ej., 8001), `docker-compose up` fallará. Detén el proceso que usa ese puerto o cambia el mapeo de puertos en `docker-compose.yml` (ej., `"8002:8000"`).
-   **Errores de Build:** Revisa los logs durante el `docker-compose up --build`. Los errores pueden deberse a dependencias faltantes, errores de sintaxis en el `Dockerfile`, o problemas de red al descargar paquetes.
-   **Variables de Entorno Faltantes:** Si un servicio falla al iniciar, verifica que todos los archivos `.env` requeridos existan y contengan las variables correctas. Revisa los logs del contenedor (`docker-compose logs -f <service_name>`) para mensajes de error específicos.
-   **Problemas de Conexión (Supabase, OpenAI):** Asegúrate de que las credenciales en los archivos `.env` sean correctas y que no haya problemas de red o firewalls bloqueando las conexiones salientes desde los contenedores.

## 12. Próximos Pasos (Dockerización Completa)

Para una gestión más sencilla, los siguientes pasos serían dockerizar los demás componentes:

1.  **Frontend:** Crear un `Dockerfile` para construir la aplicación React y servirla (quizás con Nginx).
2.  **Backend API:** Crear un `Dockerfile` para la API Node.js.
3.  **Servidor MCP:** Crear un `Dockerfile` para el servidor Python FastMCP.
4.  **Notificador Slack:** Crear un `Dockerfile` para el script Python.
5.  **Actualizar `docker-compose.yml`:** Añadir definiciones para todos estos servicios, configurar redes internas para que se comuniquen entre sí (en lugar de usar `localhost`), y definir dependencias (`depends_on`).
6.  **Base de Datos (Opcional):** Considerar ejecutar una instancia de PostgreSQL/Supabase en Docker para un entorno local completamente aislado, aunque usar el servicio cloud de Supabase suele ser más sencillo para desarrollo.
