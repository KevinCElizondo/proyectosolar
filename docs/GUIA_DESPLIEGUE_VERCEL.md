# Guía de Despliegue de Solar Fluidity en Vercel

**Versión 1.0 | Abril 2025**

Esta guía describe los pasos necesarios para desplegar la plataforma Solar Fluidity en Vercel, enfocándose en el frontend de la aplicación.

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente:

- **Cuenta en Vercel**: Regístrate gratuitamente en [Vercel](https://vercel.com/signup) si aún no tienes una cuenta.
- **Repositorio en GitHub**: Tu proyecto debe estar en un repositorio de GitHub.
- **Variables de Entorno**: Ten a mano los valores para las variables de entorno necesarias.
- **Backend API**: Debes tener desplegada la API backend a la que se conectará tu frontend.

## 2. Preparación del Proyecto

El proyecto ya incluye los archivos necesarios para el despliegue en Vercel:

- **vercel.json**: Configuración para el enrutamiento y construcción del proyecto.
- **.env.production**: Plantilla para las variables de entorno en producción.

## 3. Configuración del Repositorio en GitHub

1. Asegúrate de que los archivos principales estén actualizados en tu repositorio:
   ```bash
   git add .
   git commit -m "Preparación para despliegue en Vercel"
   git push
   ```

## 4. Despliegue en Vercel

### 4.1. Importar Proyecto desde GitHub

1. Inicia sesión en tu cuenta de Vercel.
2. Haz clic en "Add New..." → "Project".
3. Selecciona tu repositorio de GitHub.
4. Vercel detectará automáticamente que es un proyecto de Vite.

### 4.2. Configurar el Proyecto

En la página de configuración del proyecto:

1. **Framework Preset**: Vercel debería detectar automáticamente Vite.
2. **Root Directory**: Deja el valor por defecto (raíz del repositorio).
3. **Build Command**: Deja el valor por defecto (`npm run build`).
4. **Output Directory**: Deja el valor por defecto (`dist`).

### 4.3. Configurar Variables de Entorno

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

### 4.4. Desplegar

1. Haz clic en "Deploy".
2. Vercel construirá y desplegará tu aplicación, mostrando el progreso en tiempo real.
3. Una vez completado, te proporcionará una URL para acceder a tu aplicación (ej. `https://solar-fluidity.vercel.app`).

## 5. Verificación Post-Despliegue

Después de desplegar, verifica:

1. **Funcionalidad Frontend**: Navega por tu aplicación para asegurarte de que todo funcione correctamente.
2. **Conexión con el Backend**: Verifica que la aplicación se conecte correctamente a tu API backend.
3. **Integraciones**: Prueba las integraciones con PayPal, Supabase y otros servicios.

## 6. Configuración de Dominio Personalizado (Opcional)

Si deseas usar un dominio personalizado:

1. Ve a "Settings" → "Domains" en tu proyecto en Vercel.
2. Añade tu dominio y sigue las instrucciones para configurar los registros DNS.

## 7. Despliegues Continuos

Por defecto, Vercel está configurado para redesplegar automáticamente tu aplicación cada vez que se realiza un push a la rama principal de tu repositorio. Puedes personalizar este comportamiento en "Settings" → "Git".

## 8. Monitoreo y Análisis

Vercel proporciona herramientas para monitorear el rendimiento y uso de tu aplicación:

1. **Analytics**: Disponible en la sección "Analytics" de tu proyecto.
2. **Logs**: Revisa los logs de construcción y ejecución en "Deployments".
3. **Web Vitals**: Métricas de rendimiento en tiempo real.

## 9. Troubleshooting

### Problemas Comunes

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

## 10. Recursos Adicionales

- [Documentación oficial de Vercel](https://vercel.com/docs)
- [Guía de Vite + React en Vercel](https://vercel.com/guides/how-can-i-use-vite-with-vercel)
- [Optimización de aplicaciones React en Vercel](https://vercel.com/docs/concepts/frontend-frameworks/react)

## 11. Próximos Pasos

- Considera implementar análisis y monitoreo adicional con herramientas como Google Analytics o Sentry.
- Configura un sistema de CI/CD más avanzado si lo necesitas.
- Implementa pruebas automáticas para tu aplicación antes del despliegue.
