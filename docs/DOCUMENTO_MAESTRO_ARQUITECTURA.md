# Documento Maestro de Arquitectura Solar Fluidity

**Versión 1.0 | Marzo 2025**

Este documento constituye la base fundamental para la comprensión, mantenimiento y evolución de la plataforma Solar Fluidity. Incluye la arquitectura completa del sistema, estructura de directorios, patrones de diseño, integración con tecnologías de automatización y estrategias de optimización.

## Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Infraestructura y Despliegue](#4-infraestructura-y-despliegue)
5. [Componentes Principales](#5-componentes-principales)
6. [Flujo de Datos](#6-flujo-de-datos)
7. [Integraciones Externas](#7-integraciones-externas)
8. [Sistema de Automatización con Agentes IA / Python](#8-sistema-de-automatización-con-Agentes IA / Python)
9. [Integración de Inteligencia Artificial](#9-integración-de-inteligencia-artificial)
10. [Estrategias de Optimización Implementadas](#10-estrategias-de-optimización-implementadas)
11. [Seguridad y Privacidad](#11-seguridad-y-privacidad)
12. [Testing y Calidad](#12-testing-y-calidad)
13. [Observabilidad y Monitoreo](#13-observabilidad-y-monitoreo)
14. [Guía de Mantenimiento](#14-guía-de-mantenimiento)
15. [Plan de Escalabilidad](#15-plan-de-escalabilidad)
16. [Diagramas](#16-diagramas)

## 1. Visión General

### 1.1 Propósito de la Aplicación

Solar Fluidity es una plataforma SaaS enfocada en tres pilares fundamentales:

1. **Facturación Electrónica Offline**: Permite a empresas costarricenses generar documentos XML/PDF válidos sin requerir conexión constante a internet.
2. **Gestión de Proyectos**: Especializada en servicios solares y electromecánicos.
3. **Automatización de Procesos**: A través de Agentes IA / Python, permitiendo integrar diversas plataformas y servicios.

### 1.2 Tecnologías Clave

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express.js, RESTful APIs
- **Base de Datos**: PostgreSQL (Supabase), Redis (caché)
- **Automatización**: Agentes IA / Python, Anthropic MCP
- **Despliegue**: AWS (ECS, S3, CloudFront)
- **Observabilidad**: Sentry, PostHog

### 1.3 Principios de Diseño

- **Offline-First**: La aplicación está diseñada para funcionar sin conexión, sincronizando cuando hay disponibilidad de internet.
- **Modularidad**: Componentes reutilizables y desacoplados.
- **Rendimiento Optimizado**: Carga diferida, PWA, optimización de assets.
- **Seguridad por Diseño**: Row Level Security, encriptación de datos sensibles, HTTPS.
- **Experiencia de Usuario**: Interfaces intuitivas, retroalimentación clara, tiempos de respuesta optimizados.

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        CLIENTE (BROWSER/PWA)                    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        CLOUDFRONT (CDN)                         │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     FRONTEND (REACT + VITE)                     │
│                         (S3 + ECS)                              │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    API GATEWAY / LOAD BALANCER                  │
│                                                                 │
└─────────┬─────────────────────┬──────────────────────┬──────────┘
          │                     │                      │
          ▼                     ▼                      ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────┐
│                 │   │                 │   │                     │
│  API PRINCIPAL  │   │   API FACTURAS  │   │   API PROYECTOS     │
│   (NODE.JS)     │   │   (NODE.JS)     │   │    (NODE.JS)        │
│                 │   │                 │   │                     │
└────────┬────────┘   └────────┬────────┘   └──────────┬──────────┘
         │                     │                       │
         └─────────────────────┼───────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      SUPABASE (POSTGRESQL)                      │
│                                                                 │
└─────────┬─────────────────────┬──────────────────────┬──────────┘
          │                     │                      │
          ▼                     ▼                      ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────┐
│                 │   │                 │   │                     │
│  REDIS (CACHÉ)  │   │      Agentes IA / Python        │   │  ANTHROPIC MCP      │
│                 │   │ (AUTOMATIZACIÓN)│   │    (IA)             │
│                 │   │                 │   │                     │
└─────────────────┘   └─────────────────┘   └─────────────────────┘
```

### 2.2 Flujo de Autenticación

- OAuth 2.0 y JWT para gestión de sesiones
- Supabase Auth para gestión de usuarios
- Refresh Tokens para sesiones prolongadas
- Políticas RLS en Supabase para control de acceso a nivel de datos

### 2.3 Manejo de Estado

- Zustand para estado global (actualización desde React Context)
- React Query para estado del servidor
- Almacenamiento local para operaciones offline

## 3. Estructura de Directorios

### 3.1 Estructura Frontend

```
src/
├── assets/           # Recursos estáticos (imágenes, fuentes)
├── components/       # Componentes reutilizables
│   ├── ui/           # Componentes UI base (shadcn)
│   ├── forms/        # Componentes de formularios
│   ├── layout/       # Componentes estructurales
│   └── features/     # Componentes específicos por funcionalidad
├── config/           # Configuraciones de la aplicación
├── context/          # Contextos de React
├── hooks/            # Hooks personalizados
├── i18n/             # Internacionalización
├── layouts/          # Layouts principales
├── lib/              # Utilidades y adaptadores
├── pages/            # Páginas/Rutas de la aplicación
│   ├── auth/         # Autenticación
│   ├── invoices/     # Facturas
│   ├── projects/     # Proyectos
│   └── settings/     # Configuraciones
├── services/         # Servicios de API
├── stores/           # Zustand stores
├── styles/           # Estilos globales
├── types/            # Tipos TypeScript
├── utils/            # Utilidades generales
├── App.tsx           # Componente principal
└── main.tsx          # Punto de entrada
```

### 3.2 Estructura de Documentación

```
docs/
├── Afiliados/                 # Documentación de programa de afiliados
├── Artículos/                 # Artículos y recursos educativos
├── Funcionalidad/             # Documentación detallada de funcionalidades
├── Integraciones_IA/          # Documentación de integraciones de IA
├── ARQUITECTURA_TECNICA.md    # Descripción técnica del sistema
├── DOCUMENTO_MAESTRO_ARQUITECTURA.md  # Este documento
├── GUIA_CAPACITACION.md       # Guía de capacitación
├── GUIA_UX_UI.md              # Guía de UX/UI
├── MANUAL_IDENTIDAD_VISUAL.md # Manual de identidad visual
├── MANUAL_USUARIO.md          # Manual de usuario
└── PREGUNTAS_FRECUENTES.md    # FAQ
```

## 4. Infraestructura y Despliegue

### 4.1 Entornos

- **Desarrollo**: Entorno local con servicios emulados
- **Pruebas (Staging)**: Infraestructura AWS completa para pruebas
- **Producción**: AWS optimizada para alta disponibilidad

### 4.2 CI/CD

Implementado con GitHub Actions:

```yaml
# Flujo simplificado del pipeline
name: Solar Fluidity CI/CD

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: dist
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy to S3
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            aws s3 sync dist/ s3://solarfluidity-production/ --delete
            aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID_PROD }} --paths "/*"
          else
            aws s3 sync dist/ s3://solarfluidity-staging/ --delete
            aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID_STAGING }} --paths "/*"
          fi
```

### 4.3 Configuración PWA

La aplicación implementa una estrategia Progressive Web App (PWA) para asegurar funcionalidad offline, sincronización eficiente y mejor rendimiento. El archivo `vite.config.ts` incluye la siguiente configuración:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.solarfluidity\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 12, // 12 horas
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Solar Fluidity',
        short_name: 'SolarFluid',
        description: 'Plataforma de generación de estructura de facturación electrónica (XML para Hacienda CR) y gestión de proyectos solares',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
  ],
  // Otras configuraciones de Vite
});
```

## 5. Componentes Principales

### 5.1 Componentes Core

#### 5.1.1 OptimizedBackground

Componente optimizado que reemplaza animaciones complejas por gradientes estáticos para mejorar rendimiento:

```tsx
// src/components/OptimizedBackground.tsx
import { FC } from 'react';

interface OptimizedBackgroundProps {
  backgroundColor?: string;
  className?: string;
}

const OptimizedBackground: FC<OptimizedBackgroundProps> = ({
  backgroundColor = 'bg-dark',
  className = '',
}) => {
  return (
    <div className={`${backgroundColor} absolute inset-0 w-full h-full overflow-hidden z-0 ${className}`}>
      {/* Gradiente principal */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-purple-950" style={{ opacity: 0.7 }} />
      
      {/* Elementos decorativos estáticos */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl" />
    </div>
  );
};

export default OptimizedBackground;
```

#### 5.1.2 LazySection

Componente de alto orden (HOC) para implementar carga diferida de secciones:

```tsx
// src/components/lazy-section.tsx
import { ComponentType, FC, JSX, lazy, Suspense } from 'react';

function withLazyLoading<P extends JSX.IntrinsicAttributes>(
  importComponent: () => Promise<{ default: ComponentType<P> }>,
  fallback: React.ReactNode = null
) {
  const LazyComponent = lazy(importComponent);
  
  const WithLazyLoading: FC<P> = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  return WithLazyLoading;
}

export default withLazyLoading;
```

#### 5.1.3 ErrorBoundary

Captura errores en componentes para prevenir fallos en cascada:

```tsx
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error en componente:', error, errorInfo);
    Sentry.captureException(error, { extra: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <h2 className="text-lg font-semibold">Algo salió mal</h2>
          <p className="text-sm">Por favor, recarga la página o contacta a soporte si el problema persiste.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 5.2 Módulos Funcionales

#### 5.2.1 Sistema de Facturación

Componentes principales para la generación de facturas electrónicas offline:

- **InvoiceForm**: Formulario para crear facturas electrónicas
- **InvoiceGenerator**: Genera XML y PDF según normativa
- **InvoiceList**: Muestra facturas y su estado de sincronización
- **QueueManager**: Gestiona cola de sincronización cuando se recupera la conexión

#### 5.2.2 Gestión de Proyectos

Componentes para gestionar proyectos solares y electromecánicos:

- **ProjectDashboard**: Vista principal de proyectos
- **TaskBoard**: Kanban para gestión de tareas
- **GanttChart**: Visualización temporal de proyectos
- **ResourceAllocation**: Gestión de recursos y personal

#### 5.2.3 Automatizaciones

Interfaz para la gestión y monitoreo de automatizaciones con Agentes IA / Python:

- **AutomationDashboard**: Panel principal de automatizaciones
- **WorkflowList**: Lista de flujos de trabajo disponibles
- **WorkflowDesigner**: Interfaz visual para configurar flujos simples
- **IntegrationMonitor**: Monitorización de integraciones activas

## 6. Flujo de Datos

### 6.1 Diagrama de Flujo de Datos para Facturación Electrónica

```
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────────┐
│                 │     │                   │     │                        │
│  FORMULARIO DE  │────▶│  VALIDACIÓN DE    │────▶│  GENERACIÓN DE XML     │
│   FACTURA       │     │    DATOS          │     │   (OFFLINE)            │
│                 │     │                   │     │                        │
└─────────────────┘     └───────────────────┘     └────────────┬───────────┘
                                                               │
                                                               ▼
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────────┐
│                 │     │                   │     │                        │
│   COLA DE       │◀────│  ALMACENAMIENTO   │◀────│  GENERACIÓN DE PDF     │
│ SINCRONIZACIÓN  │     │     LOCAL         │     │   (OFFLINE)            │
│                 │     │                   │     │                        │
└────────┬────────┘     └───────────────────┘     └────────────────────────┘
         │
         │  [Cuando hay conexión]
         ▼
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────────┐
│                 │     │                   │     │                        │
│  SINCRONIZACIÓN │────▶│   SUPABASE        │────▶│   WEBHOOKS             │
│     A BD        │     │  (POSTGRESQL)     │     │   (NOTIFICACIONES)     │
│                 │     │                   │     │                        │
└─────────────────┘     └─────────┬─────────┘     └────────────────────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │                   │
                        │    Agentes IA / Python TRIGGERS   │
                        │ (AUTOMATIZACIONES)│
                        │                   │
                        └───────────────────┘
```

### 6.2 Flujo de Autenticación y Autorización

```
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────────┐
│                 │     │                   │     │                        │
│  FORMULARIO DE  │────▶│  SUPABASE AUTH    │────▶│  GENERACIÓN DE JWT     │
│   LOGIN         │     │                   │     │                        │
│                 │     │                   │     │                        │
└─────────────────┘     └───────────────────┘     └────────────┬───────────┘
                                                               │
                                                               ▼
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────────┐
│                 │     │                   │     │                        │
│  ALMACENAMIENTO │◀────│   VERIFICACIÓN    │◀────│  ALMACENAMIENTO DE     │
│  DE PERMISOS    │     │   DE ROL          │     │  TOKEN EN LOCAL        │
│                 │     │                   │     │  STORAGE               │
└────────┬────────┘     └───────────────────┘     └────────────────────────┘
         │
         │
         ▼
┌─────────────────┐     ┌───────────────────┐
│                 │     │                   │
│  VERIFICACIÓN   │────▶│   ACCESO A        │
│  EN CADA RUTA   │     │   RECURSOS        │
│                 │     │                   │
└─────────────────┘     └───────────────────┘
```

### 6.3 Arquitectura de Estado con Zustand

Implementación de la arquitectura de estado usando Zustand para mejor rendimiento y manejo offline:

```typescript
// src/stores/invoiceStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice, InvoiceStatus } from '../types/invoice';
import { generateXML, generatePDF } from '../utils/invoiceGenerator';
import { supabaseClient } from '../lib/supabase';

interface InvoiceState {
  invoices: Record<string, Invoice>;
  pendingSync: string[];
  syncStatus: 'idle' | 'syncing' | 'error';
  syncError: string | null;
  
  // Acciones
  createInvoice: (data: Omit<Invoice, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  syncInvoices: () => Promise<void>;
  clearSyncError: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: {},
      pendingSync: [],
      syncStatus: 'idle',
      syncError: null,
      
      createInvoice: async (data) => {
        // Generar ID único local
        const id = `invoice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Generar XML y PDF
        const xmlContent = await generateXML(data);
        const pdfUrl = await generatePDF({ ...data, id });
        
        const newInvoice: Invoice = {
          id,
          ...data,
          xmlContent,
          pdfUrl,
          status: InvoiceStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          invoices: { ...state.invoices, [id]: newInvoice },
          pendingSync: [...state.pendingSync, id]
        }));
        
        return id;
      },
      
      updateInvoice: (id, data) => {
        set((state) => {
          if (!state.invoices[id]) return state;
          
          const updatedInvoice = {
            ...state.invoices[id],
            ...data,
            updatedAt: new Date().toISOString()
          };
          
          // Marcar para sincronización si ya está sincronizada
          let pendingSync = state.pendingSync;
          if (state.invoices[id].status !== InvoiceStatus.PENDING && 
              !state.pendingSync.includes(id)) {
            pendingSync = [...pendingSync, id];
          }
          
          return {
            invoices: { ...state.invoices, [id]: updatedInvoice },
            pendingSync
          };
        });
      },
      
      deleteInvoice: (id) => {
        set((state) => {
          const { [id]: deletedInvoice, ...remainingInvoices } = state.invoices;
          return {
            invoices: remainingInvoices,
            pendingSync: state.pendingSync.filter(pendingId => pendingId !== id)
          };
        });
      },
      
      syncInvoices: async () => {
        const state = get();
        if (state.syncStatus === 'syncing' || state.pendingSync.length === 0) {
          return;
        }
        
        set({ syncStatus: 'syncing', syncError: null });
        
        try {
          const invoicesToSync = state.pendingSync.map(id => state.invoices[id]);
          
          // Procesamiento por lotes para mayor eficiencia
          const batchSize = 5;
          for (let i = 0; i < invoicesToSync.length; i += batchSize) {
            const batch = invoicesToSync.slice(i, i + batchSize);
            await Promise.all(batch.map(async (invoice) => {
              // Sincronizar con Supabase
              const { data, error } = await supabaseClient
                .from('invoices')
                .upsert({
                  id: invoice.id,
                  customer_id: invoice.customerId,
                  amount: invoice.amount,
                  xml_content: invoice.xmlContent,
                  pdf_url: invoice.pdfUrl,
                  status: InvoiceStatus.SYNCED,
                  created_at: invoice.createdAt,
                  updated_at: new Date().toISOString()
                });
                
              if (error) throw error;
              
              // Actualizar estado a sincronizado
              set((state) => ({
                invoices: {
                  ...state.invoices,
                  [invoice.id]: {
                    ...state.invoices[invoice.id],
                    status: InvoiceStatus.SYNCED
                  }
                }
              }));
            }));
          }
          
          // Limpiar lista de pendientes
          set({ 
            pendingSync: [], 
            syncStatus: 'idle' 
          });
        } catch (error) {
          console.error('Error al sincronizar facturas:', error);
          set({ 
            syncStatus: 'error', 
            syncError: error instanceof Error ? error.message : 'Error desconocido' 
          });
        }
      },
      
      clearSyncError: () => set({ syncError: null })
    }),
    {
      name: 'invoice-storage',
      partialize: (state) => ({
        invoices: state.invoices,
        pendingSync: state.pendingSync
      }),
    }
  )
);
```
