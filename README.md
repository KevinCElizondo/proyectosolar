# SolarFluidity

SolarFluidity es un Software as a Service (SaaS) diseñado para la gestión integral de proyectos solares, permitiendo a las empresas del sector administrar cotizaciones, inventarios, facturación, reportes y automatizaciones de manera eficiente y escalable.

## Características Principales

- Gestión de cotizaciones y proyectos solares
- Sistema de inventario integrado
- Facturación electrónica (integración con Hacienda CR)
- Reportes automatizados
- Panel de administración intuitivo
- Planes personalizados para empresas

## Tecnologías Utilizadas

- Frontend: React + TypeScript + Vite
- UI/UX: shadcn-ui + Tailwind CSS
- Backend: Node.js
- Base de Datos: PostgreSQL/Supabase
- Automatizaciones: n8n/gum Loop
- Pagos: PayPal, Stripe
- Despliegue: AWS/GCP/Azure

## Configuración del Proyecto

### Requisitos Previos

- Node.js & npm - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Base de datos PostgreSQL
- Cuenta de PayPal Business (para procesamiento de pagos)

### Instalación

```sh
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Navegar al directorio del proyecto
cd proyectosolar

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

```
proyectosolar/
├── src/
│   ├── components/    # Componentes React reutilizables
│   ├── pages/        # Páginas principales de la aplicación
│   ├── services/     # Servicios y APIs
│   ├── utils/        # Utilidades y helpers
│   └── styles/       # Estilos y configuración de Tailwind
├── public/           # Archivos estáticos
└── docs/            # Documentación adicional
```

## Documentación

Para información detallada sobre la arquitectura, configuración y guías de desarrollo, consulta los siguientes documentos en la carpeta `docs/`:

- Manual de Identidad Visual
- Guía de Experiencia de Usuario y Diseño de Interfaz
- Arquitectura Técnica y Modelo de Base de Datos
- Manual de Operaciones y Administración
- Política de Privacidad y Términos de Uso

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia [Especificar tipo de licencia]. Ver el archivo `LICENSE` para más detalles.

## Contacto

Kevin Cordero Elizondo - [Información de contacto]

Project Link: [https://github.com/KevinCElizondo/proyectosolar](https://github.com/KevinCElizondo/proyectosolar)
