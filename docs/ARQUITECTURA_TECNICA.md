# Arquitectura Técnica y Modelo de Base de Datos

## Arquitectura del Sistema

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn-ui + Tailwind CSS
- **Estado Global**: React Context + Hooks
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: RESTful
- **Autenticación**: JWT + OAuth2

### Base de Datos
- **Principal**: PostgreSQL/Supabase
- **Cache**: Redis
- **Búsqueda**: Elasticsearch

## Modelo de Base de Datos

### Tablas Principales

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### projects
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### quotations
```sql
CREATE TABLE quotations (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### inventory
```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### invoices
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    due_date DATE,
    xml_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Integraciones Externas

### PayPal
- API Version: v2
- Endpoints:
  - /create-order
  - /capture-payment
  - /refund-payment

### Hacienda CR
- API para Facturación Electrónica
- Certificado Digital
- Endpoints para envío y recepción de comprobantes

### n8n/gum Loop
- Automatizaciones de flujos de trabajo
- Webhooks para eventos
- Integración con correo electrónico

## Seguridad

### Autenticación
- JWT con refresh tokens
- OAuth2 para proveedores externos
- Rate limiting

### Encriptación
- Passwords: bcrypt
- Datos sensibles: AES-256
- SSL/TLS en todas las conexiones

### Backups
- Base de datos: diario
- Archivos: incremental
- Retención: 30 días

## Monitoreo

### Métricas
- Tiempo de respuesta
- Uso de recursos
- Errores y excepciones

### Logging
- Nivel: INFO, WARN, ERROR
- Rotación: diaria
- Retención: 90 días

## Escalabilidad

### Horizontal
- Load balancer
- Múltiples instancias
- Sharding de base de datos

### Vertical
- Recursos bajo demanda
- Cache en memoria
- Optimización de queries
