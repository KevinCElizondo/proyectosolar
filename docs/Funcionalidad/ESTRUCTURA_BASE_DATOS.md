# Estructura de Base de Datos de Solar Fluidity

## Introducción

La base de datos es un componente crítico de Solar Fluidity, diseñada para soportar todas las funcionalidades relacionadas con facturación electrónica, gestión de proyectos y automatizaciones. Este documento detalla la estructura de la base de datos, las relaciones entre entidades, y las consideraciones de diseño para garantizar integridad, rendimiento y escalabilidad.

Solar Fluidity utiliza PostgreSQL a través de Supabase como sistema de gestión de base de datos principal, aprovechando sus capacidades avanzadas de relaciones, seguridad a nivel de fila (RLS) y rendimiento.

## Diagrama Entidad-Relación

A continuación se presenta un diagrama simplificado de las principales entidades y sus relaciones:

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│              │       │              │       │              │
│   profiles   │◄─────►│   projects   │◄─────►│  activities  │
│              │       │              │       │              │
└──────┬───────┘       └──────┬───────┘       └──────────────┘
       │                      │                       ▲
       │                      │                       │
       │                      │                       │
       │                      ▼                       │
┌──────▼───────┐       ┌──────────────┐       ┌──────────────┐
│              │       │              │       │              │
│ subscriptions│       │   invoices   │───────►invoice_items │
│              │       │              │       │              │
└──────────────┘       └──────┬───────┘       └──────────────┘
                              │
                              │
                              ▼
                       ┌──────────────┐       ┌──────────────┐
                       │              │       │              │
                       │   payments   │◄─────►│  tax_rates   │
                       │              │       │              │
                       └──────────────┘       └──────────────┘
```

## Descripción de Tablas Principales

### 1. Gestión de Usuarios y Perfiles

#### 1.1 `auth.users` (Gestionada por Supabase Auth)

Esta tabla es manejada internamente por Supabase Auth y almacena la información básica de autenticación:

```sql
-- Esta tabla es gestionada por Supabase y no requiere creación manual
-- Aquí se muestra con fines informativos
-- auth.users
-- id UUID PRIMARY KEY
-- email TEXT UNIQUE
-- phone TEXT UNIQUE
-- confirmed_at TIMESTAMP WITH TIME ZONE
-- email_confirmed_at TIMESTAMP WITH TIME ZONE
-- phone_confirmed_at TIMESTAMP WITH TIME ZONE
-- last_sign_in_at TIMESTAMP WITH TIME ZONE
-- raw_app_meta_data JSONB
-- raw_user_meta_data JSONB
-- created_at TIMESTAMP WITH TIME ZONE
-- updated_at TIMESTAMP WITH TIME ZONE
```

#### 1.2 `profiles`

Contiene información ampliada sobre los usuarios registrados, especialmente datos relacionados con su actividad comercial:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  company_name TEXT,
  tax_id TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  business_type TEXT,
  industry TEXT,
  country TEXT DEFAULT 'Costa Rica',
  province TEXT,
  canton TEXT,
  district TEXT,
  postal_code TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 2. Gestión de Proyectos

#### 2.1 `projects`

Almacena información sobre los proyectos creados en el sistema:

```sql
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_tax_id TEXT,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending',
  budget DECIMAL(12,2),
  actual_cost DECIMAL(12,2) DEFAULT 0,
  profit_margin DECIMAL(5,2),
  project_type TEXT,
  priority TEXT DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

#### 2.2 `activities`

Contiene las actividades o tareas asociadas a cada proyecto:

```sql
CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES activities(id),
  name TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES profiles(id),
  start_date DATE,
  end_date DATE,
  duration INTEGER, -- En días
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  estimated_hours DECIMAL(8,2),
  actual_hours DECIMAL(8,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_activities_project_id ON activities(project_id);
CREATE INDEX idx_activities_parent_id ON activities(parent_id);
CREATE INDEX idx_activities_assignee_id ON activities(assignee_id);
CREATE INDEX idx_activities_status ON activities(status);

-- RLS Policies
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage activities for their projects"
  ON activities
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = activities.project_id
    AND projects.user_id = auth.uid()
  ));
```

#### 2.3 `project_resources`

Gestiona los recursos asignados a proyectos (materiales, equipos, etc.):

```sql
CREATE TABLE project_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- material, equipment, human
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT, -- kg, pcs, hours, etc.
  unit_cost DECIMAL(12,2),
  total_cost DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_project_resources_project_id ON project_resources(project_id);
CREATE INDEX idx_project_resources_activity_id ON project_resources(activity_id);

-- RLS Policies
ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage resources for their projects"
  ON project_resources
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_resources.project_id
    AND projects.user_id = auth.uid()
  ));
```

### 3. Facturación Electrónica

#### 3.1 `invoices`

Almacena los encabezados de las facturas electrónicas:

```sql
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  project_id UUID REFERENCES projects(id),
  client_name TEXT NOT NULL,
  client_tax_id TEXT,
  client_email TEXT,
  client_address TEXT,
  invoice_number TEXT NOT NULL,
  consecutive_number TEXT NOT NULL,
  numeric_key TEXT, -- Clave numérica de Hacienda
  issue_date DATE NOT NULL,
  due_date DATE,
  currency TEXT DEFAULT 'CRC',
  exchange_rate DECIMAL(12,2) DEFAULT 1.0,
  subtotal DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, generated, sent, accepted, rejected, paid
  payment_method TEXT,
  notes TEXT,
  terms TEXT,
  xml_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Información de respuesta de Hacienda
  hacienda_status TEXT,
  hacienda_response_date TIMESTAMP,
  hacienda_message TEXT
);

-- Índices
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX idx_invoices_numeric_key ON invoices(numeric_key);

-- RLS Policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own draft invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id AND status = 'draft');
```

#### 3.2 `invoice_items`

Contiene los detalles de cada línea de una factura:

```sql
CREATE TABLE invoice_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  line_number INTEGER NOT NULL,
  code TEXT, -- Código de producto/servicio
  description TEXT NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit TEXT, -- Unidad de medida
  unit_price DECIMAL(12,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL,
  tax_code TEXT, -- Código de impuesto según Hacienda
  tax_amount DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- RLS Policies
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage items for their invoices"
  ON invoice_items
  USING (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));
```

#### 3.3 `tax_rates`

Almacena las tasas de impuestos disponibles según la normativa fiscal:

```sql
CREATE TABLE tax_rates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  tax_code TEXT NOT NULL, -- Código según Hacienda
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales
INSERT INTO tax_rates (name, rate, tax_code, description)
VALUES 
  ('IVA 13%', 13.00, '01', 'Impuesto al Valor Agregado 13%'),
  ('IVA 4%', 4.00, '02', 'Impuesto al Valor Agregado 4%'),
  ('IVA 2%', 2.00, '03', 'Impuesto al Valor Agregado 2%'),
  ('IVA 1%', 1.00, '04', 'Impuesto al Valor Agregado 1%'),
  ('IVA 0%', 0.00, '05', 'Impuesto al Valor Agregado 0%');
```

#### 3.4 `payments`

Registra los pagos recibidos por las facturas:

```sql
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'CRC',
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  notes TEXT,
  status TEXT DEFAULT 'completed',
  payment_provider TEXT, -- paypal, stripe, etc.
  payment_provider_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage payments for their invoices"
  ON payments
  USING (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = payments.invoice_id
    AND invoices.user_id = auth.uid()
  ));
```

### 4. Gestión de Suscripciones

#### 4.1 `plans`

Define los planes de suscripción disponibles:

```sql
CREATE TABLE plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'CRC',
  billing_period TEXT NOT NULL, -- monthly, yearly
  features JSONB NOT NULL,
  max_projects INTEGER,
  max_invoices INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales
INSERT INTO plans (name, description, price, billing_period, features, max_projects, max_invoices)
VALUES 
  ('Básico', 'Plan para pequeñas empresas', 15000, 'monthly', '{"offline_invoicing": true, "project_management": true, "automations": 5}', 5, 50),
  ('Profesional', 'Plan para empresas medianas', 25000, 'monthly', '{"offline_invoicing": true, "project_management": true, "automations": 15, "advanced_reports": true}', 15, 150),
  ('Empresarial', 'Plan para grandes empresas', 45000, 'monthly', '{"offline_invoicing": true, "project_management": true, "automations": -1, "advanced_reports": true, "priority_support": true}', -1, -1);
```

#### 4.2 `subscriptions`

Gestiona las suscripciones de los usuarios:

```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan_id UUID REFERENCES plans(id) NOT NULL,
  status TEXT NOT NULL, -- active, cancelled, past_due
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_provider TEXT NOT NULL, -- paypal, stripe, etc.
  payment_provider_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

## 6. Relaciones Principales
