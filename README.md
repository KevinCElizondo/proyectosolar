# ☀️ Solar Fluidity Pro - v5.1.1

Bienvenido al repositorio definitivo de **Solar Fluidity 3D**. Este proyecto ha sido estructurado en Next.js 14 (App Router), con un modelo Serverless y renderizado 3D integrado de fábrica para operar con un costo de infraestructura de **$0/mes**.

## 🚀 Cómo Iniciar el Desarrollo Local

Sigue estos pasos para arrancar el entorno en tu máquina:

1. **Abre tu terminal en la carpeta del proyecto** (`proyectosolar`).
2. **Instala las dependencias** (solo si no lo has hecho):
   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la interfaz 3D Premium.

---

## 📝 Próximos Pasos de Implementación (Para continuar mañana)

Aquí tienes la hoja de ruta exacta de lo que debes hacer/configurar a continuación (referencia al archivo `docs/CHECKLIST_IMPLEMENTACION.md`):

### 1. Configurar Supabase (Base de Datos)
1. Entra a tu cuenta en [Supabase](https://supabase.com).
2. Ve a la sección **SQL Editor**.
3. Copia el contenido completo del archivo `docs/IMPLEMENTACION_DEFINTIVA_v5.1.1.md` (la sección 4 de SQL) y ejecútalo para crear las tablas `profiles`, `models` y `paypal_events` con sus políticas de seguridad (RLS).
4. Copia tus llaves de Supabase (`URL`, `anon_key` y `service_role_key`) y pégalas en el archivo `.env.local` en la raíz de este proyecto.

### 2. Configurar PayPal Subscriptions
1. Inicia sesión en [PayPal Developer](https://developer.paypal.com/).
2. Crea los planes de suscripción (ej. uno Estándar y uno Early Bird).
3. Obtén el `Client ID` y colócalo en el archivo `.env.local`.

### 3. Preparar los Modelos 3D Reales
1. Exporta tus modelos de FreeCAD a formato `.glb`.
2. Ubícalos dentro de la carpeta `public/models/` (ej. `public/models/grill/grill-separated.glb`).
3. Modificaremos el `src/app/page.tsx` para cargar este archivo real en lugar del cubo de demostración paramétrico.

---

## 📂 Documentos Importantes

- `docs/IMPLEMENTACION_DEFINTIVA_v5.1.1.md`: Toda la lógica de negocio, arquitectura y tablas.
- `docs/CHECKLIST_IMPLEMENTACION.md`: Mapa de tareas técnico semana a semana.
- `docs/REVISIONES.md`: Historial de versiones y cambios aplicados (Changelog).

> **Nota:** El proyecto actual utiliza Tailwind CSS, framer-motion (para micro-animaciones en el UI) y `@react-three/fiber` para el 3D en el cliente. Todo está compilando y configurado sin errores.
