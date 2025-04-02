# Guía de Despliegue desde GitHub

Este documento proporciona una guía paso a paso para desplegar la aplicación Solar Fluidity directamente desde su repositorio de GitHub.

## Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente:

1.  **Acceso al Repositorio de GitHub**: Debes tener acceso de lectura (y preferiblemente de escritura/administración) al repositorio del proyecto.
2.  **Cuenta de Proveedor de Cloud**: Una cuenta en un proveedor de servicios en la nube como Vercel (recomendado para el frontend), Supabase (para la base de datos y backend), y un entorno para ejecutar los agentes de IA (por ejemplo, AWS EC2, Google Cloud Run, o un servidor propio).
3.  **Node.js y npm/yarn/bun**: Instalados en tu máquina local para construir el frontend si es necesario.
4.  **Python y pip**: Instalados para configurar y ejecutar los agentes de IA.
5.  **Docker (Opcional pero Recomendado)**: Para contenerizar los agentes de IA y facilitar el despliegue.
6.  **Credenciales y Claves API**:
    *   Claves API de Supabase (URL del proyecto y clave `anon`).
    *   Credenciales para servicios externos (PayPal, Hacienda CR, etc.).
    *   Claves API para los modelos de IA (ej. OpenAI, Anthropic).

## Pasos de Despliegue

### 1. Clonar el Repositorio

Clona el repositorio de GitHub a tu máquina local o directamente a tu servidor de despliegue:

```bash
git clone https://github.com/tu-usuario/proyectosolar.git
cd proyectosolar
```

### 2. Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example` y rellena todas las variables de entorno necesarias. Esto incluye:

*   `VITE_SUPABASE_URL`: URL de tu proyecto Supabase.
*   `VITE_SUPABASE_ANON_KEY`: Clave anónima pública de Supabase.
*   `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`: Claves para los servicios de IA.
*   Variables para PayPal, Hacienda, etc.

Asegúrate de que este archivo `.env` **no se suba** al repositorio de GitHub (debe estar en `.gitignore`).

### 3. Despliegue del Frontend (Vercel Recomendado)

Vercel ofrece una integración sencilla con GitHub para desplegar aplicaciones React/Vite.

1.  **Crea una cuenta en Vercel**: Ve a [vercel.com](https://vercel.com) y regístrate (puedes usar tu cuenta de GitHub).
2.  **Importa el Proyecto**:
    *   En tu dashboard de Vercel, haz clic en "Add New..." -> "Project".
    *   Selecciona "Continue with GitHub" y autoriza a Vercel a acceder a tus repositorios.
    *   Busca y selecciona tu repositorio `proyectosolar`.
    *   Vercel detectará automáticamente que es un proyecto Vite/React.
3.  **Configura el Proyecto**:
    *   **Framework Preset**: Debería ser detectado como "Vite".
    *   **Build and Output Settings**: Generalmente, los valores por defecto son correctos.
    *   **Environment Variables**: Añade aquí las variables de entorno que comienzan con `VITE_` (como `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`). Estas son las variables públicas necesarias para el frontend. **No añadas claves secretas aquí.**
4.  **Despliega**: Haz clic en "Deploy". Vercel construirá y desplegará tu aplicación.
5.  **Dominios (Opcional)**: Puedes asignar un dominio personalizado a tu despliegue de Vercel.

Vercel se configurará automáticamente para desplegar cada vez que hagas `push` a la rama principal (o la rama que configures).

### 4. Configuración de Supabase

Supabase actúa como tu backend y base de datos.

1.  **Crea un Proyecto en Supabase**: Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto. Elige una región cercana a tus usuarios.
2.  **Esquema de Base de Datos**:
    *   Ve al "SQL Editor" en tu proyecto Supabase.
    *   Ejecuta los scripts SQL necesarios para crear las tablas y funciones. Puedes encontrar estos scripts en la documentación o adaptarlos desde `docs/ARQUITECTURA_TECNICA.md`. Considera usar las migraciones de Supabase CLI para una gestión más robusta.
3.  **Autenticación**:
    *   Configura los proveedores de autenticación que necesites (Email/Password, Google OAuth, etc.) en la sección "Authentication" -> "Providers".
    *   Ajusta las plantillas de correo electrónico si es necesario.
4.  **Políticas de Seguridad (RLS)**: **Este es un paso crítico.** Define Row Level Security (RLS) policies en tus tablas para asegurar que los usuarios solo puedan acceder a sus propios datos. Revisa `docs/Funcionalidad/SEGURIDAD_IMPLEMENTACION.md` para guías.
5.  **Storage**: Configura los buckets de almacenamiento necesarios (ej. para avatares, documentos de facturas) en la sección "Storage". Asegúrate de configurar las políticas de acceso adecuadas.

### 5. Despliegue de los Agentes de IA / Python Workflows

Los agentes de IA necesitan un entorno de ejecución Python. Tienes varias opciones:

**Opción A: Usando Docker (Recomendado)**

1.  **Construye la Imagen Docker**: Navega al directorio `ai_agents` (o donde residan tus agentes) y construye la imagen:
    ```bash
    cd ai_agents
    docker build -t solarfluidity-agents .
    ```
2.  **Despliega el Contenedor**: Puedes desplegar esta imagen en varios servicios:
    *   **AWS EC2/ECS**: Lanza una instancia EC2 o configura un servicio ECS para ejecutar el contenedor.
    *   **Google Cloud Run**: Sube la imagen a Google Container Registry (GCR) y despliega en Cloud Run. Es una opción serverless escalable.
    *   **Servidor Propio**: Si tienes un servidor, puedes ejecutar el contenedor directamente.
    ```bash
    # Ejemplo de ejecución (asegúrate de pasar las variables de entorno)
    docker run -d --env-file ../.env -p 8000:8000 --name solar-agents solarfluidity-agents
    ```
    *   Asegúrate de configurar las variables de entorno necesarias (API keys, URL de Supabase, etc.) en el entorno de ejecución del contenedor.

**Opción B: Despliegue Directo en un Servidor**

1.  **Prepara el Servidor**: Asegúrate de que tu servidor tenga Python, pip y cualquier otra dependencia del sistema instalada.
2.  **Clona el Repositorio**: Clona el repositorio en el servidor.
3.  **Crea un Entorno Virtual**:
    ```bash
    cd proyectosolar/ai_agents
    python -m venv venv
    source venv/bin/activate # En Linux/macOS
    # venv\Scripts\activate # En Windows
    ```
4.  **Instala Dependencias**:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Configura Variables de Entorno**: Exporta las variables de entorno necesarias o usa un archivo `.env` con una librería como `python-dotenv`.
6.  **Ejecuta los Agentes**: Inicia el servidor FastAPI (o la aplicación principal de tus agentes):
    ```bash
    # Ejemplo con uvicorn si usas FastAPI
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```
    Considera usar un gestor de procesos como `systemd` o `supervisor` para mantener la aplicación corriendo en segundo plano y reiniciarla si falla.

**Importante**: Asegúrate de que la URL donde se ejecutan tus agentes sea accesible desde el frontend (si es necesario) y configura las variables de entorno correspondientes en Vercel si el frontend necesita llamar directamente a los agentes.

### 6. Configuración de Webhooks y Servicios Externos

1.  **PayPal**: Configura las credenciales de API en tu cuenta de PayPal Developer y añade las variables correspondientes al entorno de tus agentes/backend. Configura los webhooks de PayPal para apuntar a la URL de tu servicio de agentes/backend que maneja las notificaciones de pago.
2.  **Hacienda CR**: Configura el certificado digital y las credenciales necesarias. Asegúrate de que el entorno donde se ejecutan los agentes tenga acceso seguro al certificado.
3.  **Otros Servicios**: Configura cualquier otra integración (ej. email, calendario) con sus respectivas API keys y webhooks si aplica.

### 7. Pruebas Finales

1.  Accede a la URL de tu frontend desplegado en Vercel.
2.  Realiza pruebas de registro, inicio de sesión y funcionalidades clave (creación de facturas, gestión de proyectos).
3.  Verifica que las automatizaciones (ej. notificaciones por email, actualizaciones de estado) funcionen correctamente.
4.  Revisa los logs en Vercel, Supabase y el entorno de tus agentes para detectar errores.

## Mantenimiento y Actualizaciones

*   **Actualizaciones de Código**: Simplemente haz `push` de tus cambios a la rama principal de GitHub. Vercel desplegará automáticamente el frontend. Para los agentes de IA, necesitarás reconstruir la imagen Docker y redesplegarla, o hacer `git pull` en el servidor y reiniciar el proceso.
*   **Actualizaciones de Dependencias**: Ejecuta `npm update` / `yarn upgrade` / `bun update` en el frontend y `pip install --upgrade -r requirements.txt` en los agentes periódicamente.
*   **Monitorización**: Configura herramientas de monitorización (ej. Sentry, Datadog, logs de Supabase/Vercel) para supervisar el rendimiento y los errores.
*   **Backups**: Supabase gestiona los backups de la base de datos, pero considera backups adicionales si es necesario.

Esta guía proporciona los pasos generales. Puede que necesites ajustarlos según la configuración específica de tu proveedor de nube y las particularidades de tu implementación.