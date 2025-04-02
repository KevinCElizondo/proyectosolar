# Guía de Instalación y Configuración de Solar Fluidity

Esta guía detalla todos los pasos necesarios para instalar, configurar y ejecutar correctamente la plataforma Solar Fluidity en un entorno de desarrollo o producción.

## Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación del Proyecto](#instalación-del-proyecto)
3. [Configuración de Servicios Externos](#configuración-de-servicios-externos)
4. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
6. [Configuración de la Facturación Electrónica](#configuración-de-la-facturación-electrónica)
7. [Ejecución del Proyecto](#ejecución-del-proyecto)
8. [Despliegue en Producción](#despliegue-en-producción)
9. [Verificación del Sistema](#verificación-del-sistema)
10. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

## Requisitos Previos

Antes de comenzar la instalación, asegúrese de tener instalados y configurados los siguientes componentes:

### Software Necesario

- **Node.js**: Versión 16.0.0 o superior
  ```bash
  # Verificar versión instalada
  node -v
  
  # Si necesita instalar Node.js, visite: https://nodejs.org/
  ```

- **npm/yarn/bun**: Gestor de paquetes para Node.js
  ```bash
  # Verificar versión de npm
  npm -v
  
  # O si prefiere usar Bun (recomendado para este proyecto)
  # Instalar Bun
  curl -fsSL https://bun.sh/install | bash
  
  # Verificar versión de Bun
  bun -v
  ```

- **Git**: Sistema de control de versiones
  ```bash
  # Verificar versión instalada
  git --version
  
  # Si necesita instalar Git, visite: https://git-scm.com/
  ```

- **Docker y Docker Compose** (opcional, pero recomendado para desarrollo):
  ```bash
  # Verificar versiones instaladas
  docker --version
  docker-compose --version
  
  # Si necesita instalar Docker, visite: https://docs.docker.com/get-docker/
  ```

### Cuentas y Servicios

Necesitará crear cuentas en los siguientes servicios:

1. **Supabase**: Para la base de datos PostgreSQL y autenticación
   - Visite [https://supabase.com/](https://supabase.com/) y cree una cuenta
   - Cree un nuevo proyecto y anote la URL y las claves API

2. **AWS**: Para almacenamiento S3 de documentos
   - Regístrese en [https://aws.amazon.com/](https://aws.amazon.com/)
   - Cree un usuario IAM con acceso programático
   - Cree un bucket S3 para almacenar documentos XML/PDF
   - Anote las credenciales de acceso y el nombre del bucket

3. **PayPal Developer**: Para procesamiento de pagos
   - Regístrese en [https://developer.paypal.com/](https://developer.paypal.com/)
   - Cree una aplicación para obtener las credenciales de API
   - Configure webhooks para notificaciones de pago


5. **Proveedor de Email** (SMTP):
   - Puede usar servicios como SendGrid, Amazon SES, o cualquier proveedor SMTP

## Instalación del Proyecto

### 1. Clonar el Repositorio

```bash
# Clonar el repositorio de GitHub
git clone https://github.com/KevinCElizondo/proyectosolar.git

# Navegar al directorio del proyecto
cd proyectosolar
```

### 2. Instalar Dependencias

```bash
# Usando npm
npm install

# O usando Bun (recomendado para este proyecto)
bun install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con sus credenciales
nano .env  # o use su editor preferido
```

Asegúrese de completar todas las variables requeridas en el archivo `.env`:

```env
# Supabase
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# PayPal
VITE_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_SECRET=tu_secret
PAYPAL_WEBHOOK_URL=tu_webhook_url

# AWS S3
VITE_AWS_BUCKET_NAME=nombre_bucket
VITE_AWS_REGION=region
AWS_ACCESS_KEY_ID=access_key
AWS_SECRET_ACCESS_KEY=secret_key

# Email
VITE_SMTP_HOST=tu_smtp_host
VITE_SMTP_PORT=tu_smtp_port
VITE_SMTP_USER=tu_smtp_user
VITE_SMTP_PASSWORD=tu_smtp_password

```

## Configuración de Servicios Externos

### 1. Supabase

#### 1.1 Crear y Configurar Proyecto

1. Inicie sesión en su cuenta de Supabase
2. Cree un nuevo proyecto
3. Defina un nombre para el proyecto y una contraseña segura para la base de datos
4. Seleccione la región más cercana a sus usuarios (preferiblemente en América para Costa Rica)
5. Espere a que se cree el proyecto (puede tomar unos minutos)

#### 1.2 Configurar Autenticación

1. En el panel de Supabase, vaya a "Authentication" > "Settings"
2. Configure los proveedores de autenticación (Email, Google, etc.)
3. Ajuste las URL de redirección según su entorno (desarrollo/producción)
4. Configure las plantillas de correo electrónico para registro, recuperación de contraseña, etc.

#### 1.3 Crear Esquema de Base de Datos

1. Vaya a la sección "SQL Editor" en Supabase
2. Ejecute los scripts SQL para crear las tablas necesarias (estos scripts se encuentran en el directorio `supabase/migrations/` del proyecto)

### 2. AWS S3

#### 2.1 Configurar Bucket S3

1. En la consola de AWS, vaya a S3
2. Cree un nuevo bucket con un nombre único
3. Configure los permisos del bucket para permitir acceso desde su aplicación
4. Habilite CORS si es necesario para acceso desde el frontend

#### 2.2 Configurar Políticas IAM

1. Cree una política IAM que permita operaciones específicas en su bucket
2. Adjunte esta política a su usuario IAM
3. Genere y guarde de forma segura las credenciales de acceso

### 3. PayPal

#### 3.1 Configurar Aplicación PayPal

1. En el Panel de Desarrollador de PayPal, cree una nueva aplicación
2. Configure el modo (sandbox para pruebas, live para producción)
3. Obtenga las credenciales de cliente y secreto
4. Configure los webhooks para recibir notificaciones de pagos

## Configuración de la Base de Datos

### 1. Ejecutar Migraciones

El proyecto utiliza la estructura de base de datos definida en Supabase. Ejecute los scripts de migración para configurar todas las tablas necesarias:

```bash
# Navegar al directorio de migraciones
cd supabase/migrations

# Ejecutar script principal de configuración
# (Puede ejecutar esto manualmente en el editor SQL de Supabase)
```

### 2. Datos Iniciales (Seeding)

Para configurar datos iniciales necesarios para el funcionamiento del sistema:

```bash
# Ejecutar script de datos iniciales
# (Puede ejecutar esto manualmente en el editor SQL de Supabase)
```

## Configuración de la Facturación Electrónica

### 1. Certificados Digitales

Para la facturación electrónica en Costa Rica, necesitará:

```bash
# Crear directorio de certificados
mkdir -p certificates

# Copiar certificado y llave a este directorio
# (Estos son los certificados emitidos por la autoridad tributaria)
```

### 2. Configurar Plantillas XML

Las plantillas para documentos fiscales se encuentran en el directorio `n8n/templates/`:

1. Revise y ajuste las plantillas según sea necesario
2. Asegúrese de que cumplen con los requisitos actuales del Ministerio de Hacienda

## Ejecución del Proyecto

### 1. Iniciar en Modo Desarrollo

```bash
# Usando npm
npm run dev

# O usando Bun
bun run dev
```

La aplicación estará disponible en http://localhost:5173 (o el puerto que se configure)

### 2. Compilar para Producción

```bash
# Usando npm
npm run build

# O usando Bun
bun run build
```

## Despliegue en Producción

### 1. Opciones de Hosting

Hay varias opciones para desplegar la aplicación en producción:

#### Opción A: Servidor VPS

1. Configure un servidor con Nginx/Apache
2. Instale Node.js y PM2
3. Configure SSL con Let's Encrypt
4. Despliegue la aplicación compilada

#### Opción B: Servicios de Hosting Estático

1. Para el frontend (archivos compilados):
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

2. Para servicios adicionales:
   - Mantener Supabase en la nube
   - Desplegar n8n en un servidor dedicado o usar n8n.cloud

### 2. Configuración de Dominio y SSL

1. Configure su dominio para apuntar a su servidor o servicio de hosting
2. Asegúrese de tener SSL habilitado (HTTPS)
3. Configure los registros DNS según sea necesario

## Verificación del Sistema

Después de la instalación y configuración, realice las siguientes verificaciones:

### 1. Verificar Frontend

1. Acceda a la aplicación en su navegador
2. Compruebe que puede registrarse e iniciar sesión
3. Verifique que todas las páginas cargan correctamente
4. Pruebe las funcionalidades básicas (crear proyecto, generar factura, etc.)

### 2. Verificar Backend y Base de Datos

1. Compruebe que la aplicación puede conectarse a Supabase
2. Verifique que los datos se guardan correctamente
3. Pruebe las operaciones CRUD en diferentes entidades

### 3. Verificar Integraciones

1. Pruebe la generación y almacenamiento de facturas
2. Verifique que los archivos se suben correctamente a S3
3. Compruebe que los flujos de Agentes IA / Python se ejecutan según lo esperado
4. Pruebe el procesamiento de pagos con PayPal en modo sandbox

## Solución de Problemas Comunes

### Problemas de Conexión con Supabase

- Verifique que las credenciales en `.env` son correctas
- Compruebe que su IP no está bloqueada en las reglas de acceso
- Verifique que las tablas existen y tienen la estructura correcta

### Errores en la Generación de Facturas

- Asegúrese de que los certificados digitales son válidos
- Verifique que las plantillas XML cumplen con el formato requerido
- Compruebe los logs de los Agentes IA / Python para errores específicos

### Problemas con PayPal

- Verifique que está usando el modo correcto (sandbox/live)
- Compruebe que los webhooks están configurados correctamente
- Revise los logs de transacciones en el panel de PayPal

### Errores en Automatizaciones

- Verifique que n8n está ejecutándose
- Compruebe las credenciales configuradas en n8n
- Revise los logs de ejecución de los workflows
