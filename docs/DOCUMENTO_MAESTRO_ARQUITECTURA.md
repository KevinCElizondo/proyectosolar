# Solar Fluidity

Plataforma Integral SaaS para Empresas Solares y Electromecánicas

---

## 1. Descripción General

Solar Fluidity es una plataforma SaaS diseñada para empresas costarricenses de los sectores solar y electromecánico. Ofrece tres pilares principales:

### 1.1 Facturación Electrónica Offline
- Genera documentos XML/PDF válidos siguiendo la normativa fiscal de Costa Rica.
- No requiere conexión directa con Hacienda para la creación de facturas.
- El usuario puede emitir y descargar la factura en cualquier momento, garantizando mayor autonomía.

### 1.2 Gestión de Proyectos Especializada
- Herramientas para seguimiento de instalaciones, mantenimientos y cotizaciones.
- Sistema que replica funcionalidades de Airtable o Notion, centralizando datos y proyectos.

### 1.3 Automatización con Agentes IA
- Sistema interno y confidencial basado en LangGraph y Pydantic.
- Automatiza validaciones, recordatorios, reportes financieros, seguimientos y más.
- Uso interno, no expuesto públicamente.

---

## 2. Arquitectura Tecnológica

### 2.1 Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + Framer Motion
- Autenticación y base de datos: Supabase
- Hospedaje: Netlify, Vercel o S3+CloudFront

### 2.2 Backend y Microservicios
- Contenedores Docker orquestados con docker-compose
- API Principal: Node.js + Express (facturación, validaciones, pagos)
- Agentes IA: Python + FastAPI (LangGraph + Pydantic)
- Base de datos: Supabase (PostgreSQL gestionado en la nube)
- Almacenamiento: AWS S3 para XML/PDF
- Integraciones: Gmail (alias), PayPal, API Gateway opcional (Traefik)
- Despliegue: Netlify/Vercel (frontend), AWS (backend y agentes), Supabase (DB)

---

## 3. Estructura del Proyecto

```
proyectosolar/
├── docker-compose.yml
├── .env.example
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── invoices/
│   │   ├── reports/
│   │   └── settings/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── styles/
│   └── integrations/
│       └── mcp/
├── ai_agents/
│   ├── agents/
│   ├── main.py
│   ├── graph.py
│   └── requirements.txt
├── backend-api/
│   ├── server.js
│   ├── package.json
│   └── .env
├── scripts/
├── docs/
└── ...
```

---

## 4. Contenedores Docker

- **frontend:** React + Vite, contenido estático
- **backend-api:** Node.js + Express
- **ai-agents:** FastAPI con agentes IA
- **db:** PostgreSQL (opcional local)
- **adminer:** Admin DB (opcional)
- **support-dashboard:** Herramienta interna (sin Docker socket en producción)

---

## 5. Despliegue

### 5.1 Frontend
- Build con `npm run build`
- Deploy en Netlify, Vercel o S3+CloudFront
- Variables: `VITE_API_URL`, `VITE_SUPABASE_URL`, etc.

### 5.2 Backend y Agentes
- AWS ECS, Elastic Beanstalk, EC2 o Lightsail
- Docker Compose para local
- Variables en `.env`

### 5.3 Base de Datos
- Supabase gestionado
- RLS configurado
- Migraciones SQL

### 5.4 Almacenamiento
- AWS S3
- Credenciales en `.env`
- Políticas seguras

---

## 6. Funcionalidades Clave

### 6.1 Facturación Electrónica Offline
- XML/PDF según UBL 2.1
- Firma digital opcional
- Descarga inmediata
- Historial y estados
- Seguridad con cifrado

### 6.2 Gestión de Proyectos
- Planificación, seguimiento, cotizaciones
- Calendarios, hitos, paneles personalizados
- Documentación técnica centralizada
- Notificaciones por correo

### 6.3 Automatización con Agentes IA
- Interno y confidencial
- LangGraph + Pydantic
- Validaciones, recordatorios, reportes
- Orquestación paralela
- Logs detallados

---

## 7. Integraciones

- **Gmail (alias):** Correos automatizados
- **PayPal:** Pagos y suscripciones
- **MCP:** Integración con servicios externos
- **AWS S3:** Almacenamiento seguro

---

## 8. Documentación

- Guías de usuario
- Guía de despliegue
- Políticas legales y privacidad
- Plan de continuidad
- Guía de integraciones

---

## 9. Roadmap

- Firma digital BCCR
- App móvil (React Native)
- Optimización de rutas con IA
- Módulo de inventario avanzado
- IA predictiva para demanda energética

---

## 10. Seguridad

- Variables sensibles fuera del repo
- SSL en todas las comunicaciones
- RLS en Supabase
- Auditorías y actualizaciones
- Backups automáticos y cifrados

---

## 11. Instalación Rápida

```bash
git clone https://github.com/KevinCElizondo/proyectosolar.git
cp .env.example .env
# Frontend
npm install
# Agentes IA
cd ai_agents && pip install -r requirements.txt
# Volver a raíz
cd ..
docker-compose up -d --build
```

---

## 12. Contacto

- Correo: soporte@solarfluidity.com
- Canal interno: Microsoft Teams

---

Con esta arquitectura, Solar Fluidity ofrece una base sólida, escalable y segura para la gestión integral de empresas solares y electromecánicas en Costa Rica y la región.
