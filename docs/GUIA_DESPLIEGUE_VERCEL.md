# Guía de Despliegue de Solar Fluidity en Vercel

**Versión 1.1 | Abril 2025**

Esta guía describe los pasos necesarios para desplegar la plataforma Solar Fluidity completa, con el frontend en Vercel y los servicios backend necesarios para el funcionamiento óptimo del sistema.

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente:

- **Cuenta en Vercel**: Regístrate gratuitamente en [Vercel](https://vercel.com/signup) si aún no tienes una cuenta.
- **Repositorio en GitHub**: Tu proyecto debe estar en un repositorio de GitHub.
- **Variables de Entorno**: Ten a mano los valores para las variables de entorno necesarias.
- **Supabase**: Cuenta activa en [Supabase](https://supabase.com) para la base de datos.
- **API Keys**: API keys para servicios externos (PayPal, OpenAI).
- **Dominio para la tienda**: Configuración del dominio solarfluidity.shop.
- **Hosting para Backend**: Servicio para hospedar el backend API (p.ej. Render, Digital Ocean).

## 2. Preparación del Proyecto

El proyecto ya incluye los archivos necesarios para el despliegue en Vercel:

- **vercel.json**: Configuración para el enrutamiento y construcción del proyecto.
- **.env.production**: Plantilla para las variables de entorno en producción.

## 3. Arquitectura del Sistema

Solar Fluidity utiliza una arquitectura distribuida con los siguientes componentes:

### Frontend (Vercel)
- **React/TypeScript/Vite**: Interfaz de usuario principal
- **Autenticación**: Integrado con Supabase Auth
- **Rutas**: React Router para navegación SPA

### Backend API (Render/Digital Ocean)
- **Node.js/Express**: API para procesamiento de pagos y lógica de negocio
- **Conexión a Supabase**: Para acceso a datos
- **Integración PayPal**: Para procesamiento de pagos

### Base de Datos (Supabase)
- **PostgreSQL**: Almacenamiento principal de datos
- **Auth**: Servicio de autenticación
- **Storage**: Almacenamiento de archivos (facturas, documentos)

### Agentes IA (Opcional - Despliegue especializado)
- **Python/FastAPI**: Servicios de IA para automatizaciones
- **OpenAI Integration**: Para procesamiento de lenguaje natural

### Tienda de Afiliados (Dominio externo)
- **solarfluidity.shop**: Tienda de productos solares recomendados

## 4. Configuración del Repositorio en GitHub

1. Asegúrate de que los archivos principales estén actualizados en tu repositorio:
   ```bash
   git add .
   git commit -m "Preparación para despliegue en Vercel"
   git push
   ```

## 5. Despliegue del Frontend en Vercel

### 5.1. Importar Proyecto desde GitHub

1. Inicia sesión en tu cuenta de Vercel.
2. Haz clic en "Add New..." → "Project".
3. Selecciona tu repositorio de GitHub.
4. Vercel detectará automáticamente que es un proyecto de Vite.

### 5.2. Configurar el Proyecto

En la página de configuración del proyecto:

1. **Framework Preset**: Vercel debería detectar automáticamente Vite.
2. **Root Directory**: Deja el valor por defecto (raíz del repositorio).
3. **Build Command**: Deja el valor por defecto (`npm run build`).
4. **Output Directory**: Deja el valor por defecto (`dist`).

### 5.3. Configurar Variables de Entorno

Añade las siguientes variables de entorno en la sección "Environment Variables" de Vercel:

| Nombre                   | Descripción                                      |
|--------------------------|--------------------------------------------------|
| AUTH_SECRET              | Clave secreta para autenticación                 |
| PAYPAL_SANDBOX_CLIENT_ID | ID de cliente para PayPal Sandbox               |
| PAYPAL_LIVE_CLIENT_ID    | ID de cliente para PayPal en producción         |
| CONVEX_DEPLOY_KEY        | Clave de despliegue de Convex                   |
| SUPABASE_URL             | URL de tu proyecto en Supabase                   |
| SUPABASE_ANON_KEY        | Clave anónima de Supabase                       |
| N8N_WEBHOOK_URL          | URL del webhook de N8N para automatizaciones    |

> **Importante**: Asegúrate de que `VITE_API_URL` en `.env.production` apunte a la URL correcta de tu API backend en producción.

### 5.4. Desplegar

1. Haz clic en "Deploy".
2. Vercel construirá y desplegará tu aplicación, mostrando el progreso en tiempo real.
3. Una vez completado, te proporcionará una URL para acceder a tu aplicación (ej. `https://solar-fluidity.vercel.app`).

## 6. Despliegue del Backend API

Para un funcionamiento completo, es necesario desplegar el backend API que maneja los pagos y otras funcionalidades críticas:

### 6.1. Preparar el Backend API

1. Navega al directorio del backend API:
   ```bash
   cd backend-api
   ```

2. Asegúrate de que tienes un archivo `.env.production` con las variables de entorno correctas:
   ```
   NODE_ENV=production
   PORT=4000
   FRONTEND_URL=https://tu-dominio-vercel.vercel.app
   PAYPAL_CLIENT_ID=tu_paypal_client_id
   PAYPAL_SECRET=tu_paypal_secret
   SUPABASE_URL=tu_supabase_url
   SUPABASE_KEY=tu_supabase_key
   ```

3. Crea un archivo `render.yaml` para despliegue en Render (alternativa recomendada):
   ```yaml
   services:
     - type: web
       name: solar-fluidity-api
       env: node
       buildCommand: npm install
       startCommand: node server.js
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 4000
         - key: FRONTEND_URL
           fromGroup: solar-fluidity-env
         - key: PAYPAL_CLIENT_ID
           fromGroup: solar-fluidity-env
         - key: PAYPAL_SECRET
           fromGroup: solar-fluidity-env
         - key: SUPABASE_URL
           fromGroup: solar-fluidity-env
         - key: SUPABASE_KEY
           fromGroup: solar-fluidity-env
   ```

### 6.2. Desplegar en Render (Recomendado)

1. Crea una cuenta en [Render](https://render.com) si aún no tienes una.
2. Conecta tu repositorio de GitHub.
3. Haz clic en "New Web Service" y selecciona el repositorio.
4. Configura el servicio según las instrucciones en pantalla, utilizando el archivo `render.yaml`.
5. Configura el grupo de variables de entorno `solar-fluidity-env` con tus valores reales.
6. Haz clic en "Create Web Service".

### 6.3. Alternativa: Despliegue en Digital Ocean

1. Crea una App Platform en [Digital Ocean](https://www.digitalocean.com/products/app-platform/).
2. Conecta tu repositorio de GitHub.
3. Selecciona el directorio `backend-api` como fuente.
4. Configura el comando de inicio: `node server.js`.
5. Configura las variables de entorno necesarias.
6. Despliega la aplicación.

## 7. Configuración de la Base de Datos (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ejecuta los scripts SQL necesarios para crear las tablas (disponibles en el directorio `scripts/supabase`).
3. Configura las políticas de Row Level Security (RLS) para proteger tus datos.
4. Obtén las credenciales (URL y API Key) y configúralas en tus servicios frontend y backend.

## 8. Configuración del Dominio para la Tienda

Para configurar correctamente el dominio solarfluidity.shop:

1. Adquiere el dominio en un proveedor como Namecheap, GoDaddy o Google Domains.
2. Configura los registros DNS para apuntar al servicio donde alojarás la tienda:
   - Para una tienda personalizada: Configura un registro A o CNAME según las instrucciones de tu hosting.
   - Para una redirección a Amazon: Configura un registro A para redirección o utiliza el servicio de redirección de tu proveedor de dominios.

3. Verifica que la redirección esté funcionando correctamente.

## 9. Verificación Post-Despliegue

Después de desplegar, verifica:

1. **Funcionalidad Frontend**: Navega por tu aplicación para asegurarte de que todo funcione correctamente.
2. **Conexión con el Backend**: Verifica que la aplicación se conecte correctamente a tu API backend.
3. **Integraciones**: Prueba las integraciones con PayPal, Supabase y otros servicios.

## 10. Configuración de Dominio Personalizado

Si deseas usar un dominio personalizado:

1. Ve a "Settings" → "Domains" en tu proyecto en Vercel.
2. Añade tu dominio y sigue las instrucciones para configurar los registros DNS.

## 11. Despliegues Continuos

Por defecto, Vercel está configurado para redesplegar automáticamente tu aplicación cada vez que se realiza un push a la rama principal de tu repositorio. Puedes personalizar este comportamiento en "Settings" → "Git".

## 12. Monitoreo y Análisis

Vercel proporciona herramientas para monitorear el rendimiento y uso de tu aplicación:

1. **Analytics**: Disponible en la sección "Analytics" de tu proyecto.
2. **Logs**: Revisa los logs de construcción y ejecución en "Deployments".
3. **Web Vitals**: Métricas de rendimiento en tiempo real.

## 13. Troubleshooting

### 13.1 Problemas Comunes con el Frontend

1. **Error en la Construcción**:
   - Revisa los logs de construcción para identificar el problema específico.
   - Verifica que todas las dependencias estén correctamente instaladas en `package.json`.

2. **Variables de Entorno**:
   - Asegúrate de que todas las variables de entorno necesarias estén configuradas en Vercel.
   - Las variables deben tener el nombre exacto como se define en `.env.production`.

3. **Problemas de Conexión API**:
   - Verifica que `VITE_API_URL` apunte a la URL correcta de tu API en producción.
   - Asegúrate de que tu API acepte solicitudes CORS desde el dominio de Vercel.

4. **Error 404 en Rutas de Cliente**:
   - El archivo `vercel.json` ya está configurado para manejar el enrutamiento del lado del cliente (SPA).
   - Si persisten los problemas, verifica que el archivo `vercel.json` esté correctamente configurado.

### 13.2 Problemas Comunes con el Backend

1. **Error de Conexión con Supabase**:
   - Verifica que las credenciales de Supabase sean correctas.
   - Confirma que las tablas necesarias existan en la base de datos.
   - Revisa los logs del servidor para mensajes específicos de error.

2. **Problemas con PayPal**:
   - Asegúrate de que las credenciales de PayPal estén correctamente configuradas.
   - Verifica que estés usando las credenciales de Sandbox para pruebas y las de producción para el entorno real.
   - Consulta los logs de transacciones en el panel de desarrollador de PayPal.

3. **Errores en los Agentes IA**:
   - Comprueba que la API key de OpenAI sea válida y tenga saldo disponible.
   - Asegúrate de que los modelos de IA especificados estén disponibles.
   - Examina los logs de los agentes para mensajes de error específicos.

4. **Problemas de CORS**:
   - Verifica que el backend esté configurado para aceptar solicitudes del dominio del frontend.
   - Revisa la configuración de CORS en el archivo `server.js`.

## 14. Recursos Adicionales

- [Documentación oficial de Vercel](https://vercel.com/docs)
- [Guía de Vite + React en Vercel](https://vercel.com/guides/how-can-i-use-vite-with-vercel)
- [Optimización de aplicaciones React en Vercel](https://vercel.com/docs/concepts/frontend-frameworks/react)

## 15. Próximos Pasos

- Considera implementar análisis y monitoreo adicional con herramientas como Google Analytics o Sentry.
- Configura un sistema de CI/CD más avanzado si lo necesitas.
- Implementa pruebas automáticas para tu aplicación antes del despliegue.
- Integra sistemas de alertas para monitorear la salud del sistema.
- Configura copias de seguridad automáticas para la base de datos.
- Implementa un sistema de logs centralizado para facilitar el diagnóstico de problemas.
- Desarrolla una estrategia de escalado para manejar el crecimiento de usuarios.

## 16. Configuración Específica para Afiliados de Amazon

Si decides cambiar el enfoque actual que redirecciona a solarfluidity.shop y quieres implementar directamente afiliados de Amazon:

1. Regístrate en el [Programa de Afiliados de Amazon](https://affiliate-program.amazon.com/).
2. Obtén tu ID de Afiliado (formato: ejemplo-20).
3. Actualiza el componente `AmazonAffiliateSection.tsx` para usar tu ID de afiliado.
4. Modifica los enlaces para que apunten directamente a Amazon con tu ID de afiliado.
5. Asegúrate de cumplir con las políticas de divulgación de Amazon para links de afiliados.

Esto te permitirá obtener comisiones por las ventas generadas a través de tus enlaces.
