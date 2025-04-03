# Guía Detallada de Despliegue desde GitHub - Solar Fluidity

Este documento proporciona una guía paso a paso para desplegar la aplicación Solar Fluidity directamente desde su repositorio de GitHub, incluyendo opciones simplificadas y detalles sobre AWS y Docker.

**Arquitectura General:**

*   **Frontend:** Aplicación React/Vite (Desplegada en Vercel/Netlify/S3+CloudFront)
*   **Backend/Base de Datos:** Supabase (Cloud)
*   **Agentes IA / Python Workflows:** Aplicación Python/FastAPI (Desplegada en Contenedor Docker en AWS App Runner/ECS/EC2 u otro servicio de contenedores)

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener:

1.  **Acceso al Repositorio de GitHub**: Acceso de lectura/escritura.
2.  **Cuentas de Servicios Cloud**:
    *   **Vercel (Recomendado para Frontend):** O Netlify, o una cuenta AWS si prefieres S3+CloudFront.
    *   **Supabase (Backend/DB):** Cuenta y un proyecto creado.
    *   **AWS (Para Agentes IA):** Cuenta de AWS. Necesitarás permisos para ECR (Elastic Container Registry) y el servicio de despliegue elegido (App Runner, ECS, EC2).
    *   **(Opcional) PayPal Developer:** Para integración de pagos (Sandbox y Producción).
3.  **Herramientas Locales:**
    *   `git`
    *   `node` y `bun` (o `npm`/`yarn`)
    *   `python` y `pip`
    *   `docker` (Esencial para desplegar los agentes IA)
    *   `aws cli` (Configurada con tus credenciales de AWS)
4.  **Credenciales y Claves API (Listas para configurar en los servicios de despliegue):**
    *   Claves API de Supabase (URL del proyecto y clave `anon` para el frontend, clave `service_role` para los agentes IA).
    *   Claves API para los modelos de IA (si usas OpenAI; no se necesitan para Ollama si los agentes acceden directamente a `localhost` *dentro* de su propio entorno de ejecución, pero sí si el frontend necesita llamarlos).
    *   Credenciales para servicios externos (PayPal, Hacienda CR - certificado, etc.).
    *   Tu Amazon Affiliate Tag.

## 2. Preparación del Repositorio (Checklist Pre-Despliegue)

Asegúrate de que tu repositorio en GitHub esté listo:

*   **[X] `.env` file:** NO está en GitHub y SÍ en `.gitignore`.
*   **[X] `.env.example`:** Presente, actualizado, con TODAS las variables requeridas y placeholders claros. Incluye `LLM_PROVIDER`, `MODEL_NAME`, `OLLAMA_URL` (si aplica), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_AMAZON_AFFILIATE_TAG`, etc.
*   **[X] Código Limpio:** Sin secretos hardcodeados (API keys, tags de afiliado). Usa `import.meta.env.VITE_...` en el frontend y `os.getenv(...)` en Python.
*   **[X] Migraciones DB:** Scripts SQL o migraciones de Supabase CLI en el repo (`supabase/migrations/`).
*   **[X] Dependencias:** `package.json`/`bun.lockb` y `ai_agents/requirements.txt` actualizados.
*   **[X] Build Frontend:** `bun run build` funciona sin errores.
*   **[X] Logs:** Archivos `.log` en `.gitignore`.
*   **[X] Documentación:** README, esta guía, FAQs, etc., actualizados.
*   **[X] `panticai` Resuelto:** El código de los agentes que usaban `panticai` ha sido corregido/implementado.
*   **[X] Dockerfile Agentes IA:** Un `Dockerfile` funcional existe en el directorio `ai_agents/` para construir la imagen de los agentes. (Si no existe, hay que crearlo).

## 3. Despliegue del Frontend (Vercel - Opción Fácil)

Vercel es muy recomendado por su integración directa con GitHub y manejo automático de builds y SSL.

1.  **Conectar GitHub a Vercel**: Ve a [vercel.com](https://vercel.com), regístrate/inicia sesión, y conecta tu cuenta de GitHub.
2.  **Importar Proyecto**:
    *   Dashboard -> "Add New..." -> "Project".
    *   Selecciona tu repositorio `proyectosolar`.
    *   Vercel debería detectar automáticamente "Vite".
3.  **Configurar Proyecto**:
    *   **Framework Preset**: Vite.
    *   **Build Command**: `bun run build` (o `npm run build`).
    *   **Output Directory**: `dist` (generalmente detectado automáticamente).
    *   **Environment Variables**: **MUY IMPORTANTE**. Añade aquí **SOLO** las variables que necesita el frontend (las que empiezan con `VITE_` en tu `.env.example`), como:
        *   `VITE_SUPABASE_URL`
        *   `VITE_SUPABASE_ANON_KEY`
        *   `VITE_PAYPAL_CLIENT_ID` (si el frontend lo usa directamente)
        *   `VITE_AMAZON_AFFILIATE_TAG`
        *   `VITE_AI_AGENTS_API_URL` (La URL pública donde desplegarás tus agentes Python - ver Paso 5).
4.  **Desplegar**: Click "Deploy". Vercel clonará, construirá y desplegará.
5.  **Dominio**: Asigna tu dominio personalizado en la configuración del proyecto en Vercel.

*Alternativas:* Netlify (similar a Vercel), AWS S3 + CloudFront (más configuración manual).

## 4. Configuración de Supabase (Cloud)

Esto no cambia respecto a la guía anterior. Asegúrate de:

1.  **Tener un Proyecto Supabase Creado.**
2.  **Ejecutar Migraciones/Schema SQL:** Usa el "SQL Editor" de Supabase o Supabase CLI para aplicar el schema desde `supabase/migrations/`.
3.  **Configurar Autenticación:** Habilita proveedores (Email, Google), ajusta URLs de redirección y plantillas de email.
4.  **Definir Políticas RLS:** **CRÍTICO**. Asegura tus tablas para que los usuarios solo accedan a sus datos.
5.  **Configurar Storage:** Crea buckets (ej. `invoices`, `avatars`) y define políticas de acceso.

## 5. Despliegue de Agentes IA / Python (AWS - Opciones)

Aquí es donde Docker es esencial. Necesitamos construir una imagen Docker de tus agentes Python y desplegarla.

**Paso 5.1: Crear/Verificar Dockerfile para Agentes IA**

Asegúrate de tener un `Dockerfile` en el directorio `ai_agents/` similar a este:

```Dockerfile
# Usa una imagen base de Python
FROM python:3.10-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo de requerimientos e instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de los agentes
COPY . .

# Expone el puerto en el que corre FastAPI/Flask (ej. 8000)
EXPOSE 8000

# Comando para ejecutar la aplicación (ajusta según tu main.py)
# Usa gunicorn para producción
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "4", "-b", "0.0.0.0:8000", "main:app"]
```
*(Asegúrate de que `gunicorn` y `uvicorn` estén en `ai_agents/requirements.txt`)*

**Paso 5.2: Construir y Subir Imagen a AWS ECR (Elastic Container Registry)**

1.  **Crear Repositorio ECR:**
    *   Ve a la consola de AWS -> ECR -> Create repository.
    *   Dale un nombre (e.g., `solarfluidity-agents`).
2.  **Autenticar Docker con ECR:**
    *   Selecciona tu repositorio ECR y haz clic en "View push commands". Sigue el primer comando para autenticar tu CLI de Docker.
3.  **Construir Imagen Docker:**
    *   Navega a `ai_agents/` en tu terminal.
    *   Ejecuta `docker build -t solarfluidity-agents .` (usa el nombre de tu repo ECR si es diferente).
4.  **Etiquetar Imagen:**
    *   Sigue el comando "tag" de las "push commands" de ECR. Ejemplo:
        `docker tag solarfluidity-agents:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/solarfluidity-agents:latest`
5.  **Subir Imagen:**
    *   Sigue el comando "push" de las "push commands" de ECR. Ejemplo:
        `docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/solarfluidity-agents:latest`

**Paso 5.3: Desplegar Contenedor en AWS (Elige UNA opción)**

**Opción A: AWS App Runner (Más Fácil, Recomendado para empezar)**

*   **Concepto:** Servicio totalmente gestionado. Le das tu imagen de ECR, configuras CPU/Memoria, variables de entorno, y él se encarga del balanceo de carga, escalado y SSL.
*   **Pasos:**
    1.  Ve a la consola de AWS -> App Runner -> Create service.
    2.  **Source:** Selecciona "Container registry" y "Amazon ECR". Elige tu imagen `solarfluidity-agents:latest`.
    3.  **Deployment settings:** Elige "Automatic".
    4.  **Configure service:**
        *   Dale un nombre al servicio.
        *   Define CPU y Memoria (empieza con 1 vCPU, 2 GB).
        *   Define el Puerto (e.g., `8000`, el que expusiste en el Dockerfile).
        *   **Environment variables:** **MUY IMPORTANTE**. Añade aquí TODAS las variables de entorno que necesitan tus agentes Python (las que NO empiezan con `VITE_`), incluyendo:
            *   `SUPABASE_URL`
            *   `SUPABASE_SERVICE_ROLE_KEY`
            *   `LLM_PROVIDER=ollama` (o `openai`)
            *   `MODEL_NAME=<tu_modelo_ollama_o_openai>`
            *   `OLLAMA_URL=http://localhost:11434` (Si Ollama corre localmente *para los agentes*, aunque para despliegue usualmente apuntarías a un servicio Ollama desplegado o usarías OpenAI/Anthropic) - **¡OJO! Si los agentes corren en AWS, no pueden acceder a tu `localhost`. Necesitarías desplegar Ollama también o usar una API cloud.** Considera empezar con OpenAI para el despliegue si no quieres desplegar Ollama.
            *   `OPENAI_API_KEY` (si usas OpenAI)
            *   Credenciales de PayPal, AWS S3 (si los agentes las usan), etc.
        *   Configura Health check (usualmente sobre `/` o un endpoint `/health`).
    5.  Revisa y crea el servicio. App Runner te dará una URL pública HTTPS. **Esta es la URL que debes poner en `VITE_AI_AGENTS_API_URL` en la configuración de Vercel (Paso 3).**

**Opción B: AWS ECS con Fargate (Más Control, Serverless)**

*   **Concepto:** Orquestador de contenedores serverless. Defines una "Task Definition" (CPU, Memoria, Imagen, Variables de Entorno) y un "Service" (cuántas tareas ejecutar, balanceo de carga, red).
*   **Pasos (Simplificado):**
    1.  Crea un Cluster ECS (tipo Fargate).
    2.  Crea una Task Definition: especifica la imagen ECR, roles IAM, CPU/Memoria, puerto mapeado (8000), y **variables de entorno**.
    3.  Crea un Service: selecciona el cluster, la task definition, configura VPC/subnets, security groups (permitiendo tráfico al puerto 8000), y opcionalmente configura un Application Load Balancer (ALB) para exponer el servicio y manejar SSL.
    4.  El ALB te dará una URL pública. Configúrala en Vercel como `VITE_AI_AGENTS_API_URL`.

**Opción C: AWS EC2 (Control Total, Más Gestión)**

*   **Concepto:** Máquina virtual tradicional. Instalas Docker, corres tu contenedor. Eres responsable del SO, parches, escalado, etc.
*   **Pasos:** Lanza una instancia EC2, instala Docker, pull de la imagen desde ECR, ejecuta `docker run` con las variables de entorno, configura un web server (Nginx) como reverse proxy para manejar SSL y exponer el puerto 8000.

## 6. Configuración Final y Verificación

1.  **Actualizar Vercel:** Asegúrate de que la variable `VITE_AI_AGENTS_API_URL` en Vercel apunte a la URL pública de tu servicio de agentes desplegado en AWS (App Runner, ALB de ECS, o IP/Dominio de EC2). Redeploy en Vercel si es necesario.
2.  **Configurar Webhooks Externos:** Asegúrate de que los webhooks de PayPal (y otros servicios) apunten a la URL correcta de tu API de agentes desplegada.
3.  **Pruebas End-to-End:** Realiza pruebas completas como las descritas en el plan de verificación local, pero ahora usando las URLs desplegadas. Verifica la comunicación Frontend -> Agentes IA -> Supabase. Revisa logs en Vercel, AWS (CloudWatch Logs para App Runner/ECS/EC2) y Supabase.

## 7. Docker para Impulsar el Proyecto

Usar Docker (como ya hicimos para los agentes IA) ofrece grandes ventajas:

*   **Consistencia:** Empaqueta tu aplicación y sus dependencias. Funciona igual en desarrollo y producción.
*   **Portabilidad:** Corre en cualquier máquina/cloud que soporte Docker.
*   **Aislamiento:** Evita conflictos de dependencias entre proyectos.
*   **Escalabilidad:** Fácil de escalar horizontalmente ejecutando más contenedores (con ECS, Kubernetes, etc.).
*   **Desarrollo Local:** Puedes usar `docker-compose.yml` para levantar toda tu pila localmente (Frontend, Agentes IA, Supabase local, Redis, etc.) con un solo comando, simplificando la configuración para nuevos desarrolladores.

**¿Deberías Dockerizar más?**

*   **Frontend:** No es estrictamente necesario si usas Vercel/Netlify, ya que ellos manejan el build y despliegue. Dockerizarlo puede ser útil para entornos de prueba consistentes o si despliegas en tu propia infraestructura.
*   **Supabase:** Puedes correr Supabase localmente con Docker para desarrollo/pruebas sin depender del servicio cloud.
*   **Otros Servicios:** Si usas Redis, Elasticsearch, etc., Docker es ideal para gestionarlos localmente y en producción.

**Recomendación:** **Sí**, usar Docker para los Agentes IA es casi imprescindible para un despliegue cloud robusto. Considera crear un `docker-compose.yml` para facilitar el desarrollo local de toda la pila.

Esta guía proporciona un camino detallado. Ajusta los pasos según tus servicios específicos y configuración.