# Escenarios de Prueba: Integración de n8n con MCP para Solar Fluidity

**Versión 1.0 | Marzo 2025**

## Índice

1. [Introducción](#1-introducción)
2. [Configuración del Entorno](#2-configuración-del-entorno)
3. [Escenarios de Prueba](#3-escenarios-de-prueba)
   - [Escenario 1: Facturación Electrónica Automatizada](#escenario-1-facturación-electrónica-automatizada)
   - [Escenario 2: Asistente Virtual para Consultas de Clientes](#escenario-2-asistente-virtual-para-consultas-de-clientes)
   - [Escenario 3: Planificación de Proyectos Solares](#escenario-3-planificación-de-proyectos-solares)
   - [Escenario 4: Monitoreo y Mantenimiento Predictivo](#escenario-4-monitoreo-y-mantenimiento-predictivo)
   - [Escenario 5: Generación de Reportes de Sostenibilidad](#escenario-5-generación-de-reportes-de-sostenibilidad)
4. [Metodología de Pruebas](#4-metodología-de-pruebas)
5. [Métricas y KPIs](#5-métricas-y-kpis)
6. [Resolución de Problemas](#6-resolución-de-problemas)
7. [Referencias](#7-referencias)

---

## 1. Introducción

Este documento detalla la metodología de pruebas para integrar el Model Context Protocol (MCP) con n8n en el proyecto Solar Fluidity. La integración permitirá automatizar procesos críticos del negocio utilizando inteligencia artificial contextual, específicamente enfocada en la gestión de facturación electrónica en Costa Rica y la administración de proyectos solares.

### 1.1 Propósito

El propósito de este documento es establecer un marco de trabajo para implementar, probar y optimizar escenarios de automatización que combinen n8n (para la orquestación de flujos de trabajo) con MCP (para la ejecución de acciones contextuales basadas en IA).

### 1.2 Alcance

Este documento cubre:
- Configuración del entorno de desarrollo y pruebas
- Definición detallada de escenarios de prueba
- Criterios de aceptación para cada escenario
- Metodología de pruebas progresivas
- Indicadores de rendimiento y éxito

### 1.3 Relación con otros componentes

Esta integración se relaciona directamente con:
- La API de OpenAI (configurada en `config.py`)
- El sistema de automatización n8n
- La infraestructura Convex como servidor MCP
- La base de datos Supabase de Solar Fluidity
- Los sistemas externos de facturación electrónica

---

## 2. Configuración del Entorno

### 2.1 Requisitos Previos

Antes de comenzar con las pruebas, asegúrate de tener configurado:

1. **Entorno MacOS**:
   - macOS Monterey o superior
   - Mínimo 8GB de RAM
   - Al menos 20GB de espacio libre en disco

2. **Software necesario**:
   - Node.js v18.x o superior
   - npm/pnpm como gestor de paquetes
   - Git para control de versiones
   - Docker Desktop para contenedores
   - WindSurf IDE (opcional pero recomendado)

3. **Cuentas y credenciales**:
   - Cuenta en Convex (para servidor MCP)
   - Cuenta de OpenAI con clave API configurada
   - Credenciales de Supabase
   - Acceso al repositorio GitHub del proyecto

### 2.2 Instalación de n8n

```bash
# Usando Docker (recomendado para entorno de pruebas)
docker pull n8nio/n8n
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Alternativamente, usando npm
npm install n8n -g
n8n start
```

### 2.3 Configuración de MCP con Convex

Sigue estos pasos para configurar Convex como servidor MCP:

1. **Crea un proyecto en Convex**:
   ```bash
   npx create-convex-app@latest mcp-solarfluidity --template typescript
   cd mcp-solarfluidity
   npx convex dev
   ```

2. **Define el schema para los modelos de datos**:
   ```typescript
   // convex/schema.ts
   import { defineSchema, defineTable } from "convex/server";
   import { v } from "convex/values";

   export default defineSchema({
     invoices: defineTable({
       number: v.string(),
       customerName: v.string(),
       amount: v.number(),
       status: v.string(),
       xml: v.optional(v.string()),
       createdAt: v.number(),
     }),
     projects: defineTable({
       name: v.string(),
       description: v.string(),
       client: v.string(),
       status: v.string(),
       startDate: v.number(),
       endDate: v.optional(v.number()),
       tasks: v.array(v.object({
         name: v.string(),
         status: v.string(),
         assignee: v.optional(v.string()),
       })),
     }),
     customerQueries: defineTable({
       question: v.string(),
       answer: v.optional(v.string()),
       status: v.string(),
       createdAt: v.number(),
     }),
   });
   ```

3. **Configura el archivo `.env.local` con la URL de Convex**:
   ```
   CONVEX_URL=tu-url-de-convex
   OPENAI_API_KEY=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
   ```

### 2.4 Conexión de n8n con OpenAI y Convex

1. **Configuración de credenciales en n8n**:
   - Abre la interfaz de n8n en `http://localhost:5678`
   - Ve a "Settings" → "Credentials"
   - Añade credenciales para OpenAI:
     - Nombre: `openai-solarfluidity`
     - API Key: La clave configurada en `config.py`
   - Añade credenciales para HTTP Request (Convex):
     - Nombre: `convex-mcp`
     - URL Base: La URL de tu despliegue Convex

2. **Prueba de conectividad**:
   - Crea un nuevo workflow en n8n
   - Añade un nodo "HTTP Request" y configúralo para hacer una petición GET a tu API de Convex
   - Ejecuta el workflow para verificar la conectividad

---

## 3. Escenarios de Prueba

A continuación se detallan los escenarios de prueba específicos que implementaremos para validar la integración entre n8n y MCP. Cada escenario incluye:
- Objetivo funcional
- Configuración específica en n8n
- Reglas MCP a implementar
- Criterios de éxito
- Instrucciones paso a paso para la configuración

### Escenario 1: Facturación Electrónica Automatizada

**Objetivo**: Automatizar la generación, validación y envío de facturas electrónicas conforme a las regulaciones costarricenses.

#### Configuración del Flujo en n8n

1. **Trigger**: Nuevo registro en tabla `invoices` de Supabase
2. **Nodos de procesamiento**:
   - Nodo de extracción de datos del cliente
   - Nodo de generación de XML según formato del Ministerio de Hacienda
   - Nodo MCP para validación inteligente del documento
   - Nodo para firma digital y envío (si está en modo online)
   - Nodo para almacenamiento local (si está en modo offline)

#### Reglas MCP para este escenario

```yaml
# rules.yaml para Facturación Electrónica
- type: content_validation
  name: "validacion_factura_cr"
  rules:
    - validate:
        schema: "xml_factura_electronica_cr"
        required_fields: ["emisor", "receptor", "detalle", "impuestos"]
    - check_constraints:
        - field: "monto_total"
          condition: "sum_equals_line_items"
        - field: "impuesto"
          condition: "valid_tax_calculation"
    - format_requirements:
        - xml_well_formed: true
        - encoding: "UTF-8"
    - regulatory_compliance:
        - country: "costa_rica"
        - document_type: "factura_electronica"
        - version: "4.3"
```

#### Instrucciones de Implementación

1. **Crear el workflow en n8n**:
   - Nombre: "Facturación Electrónica Automatizada"
   - Descripción: "Procesa facturas electrónicas con validación MCP y regulaciones CR"

2. **Configurar el trigger**:
   - Tipo: Webhook o Supabase
   - Evento: Nuevo registro en tabla de facturas
   - Filtro: Status = "pendiente"

3. **Configurar el nodo MCP**:
   - Seleccionar servidor MCP: Convex
   - Cargar reglas desde `rules.yaml`
   - Configurar timeouts y reintentos

4. **Probar con casos de prueba**:
   - Factura válida simple (2 líneas, sin descuentos)
   - Factura con múltiples líneas y descuentos
   - Factura con impuestos especiales
   - Factura con datos incompletos (debe fallar validación)

#### Criterios de Éxito

- 100% de facturas válidas procesadas correctamente
- 0% de facturas inválidas aceptadas
- Tiempo de procesamiento < 3 segundos por factura
- Funcionamiento correcto en modo offline
- Sincronización exitosa al restaurar conectividad

### Escenario 2: Asistente Virtual para Consultas de Clientes

**Objetivo**: Implementar un asistente virtual que responda consultas de clientes sobre facturación electrónica y proyectos solares con información contextual y precisa.

#### Configuración del Flujo en n8n

1. **Trigger**: Mensaje recibido en chat o email
2. **Nodos de procesamiento**:
   - Extracción de la consulta
   - Búsqueda de contexto relevante en base de datos
   - Consulta a MCP para generar respuesta
   - Envío de respuesta al cliente
   - Registro de la interacción para aprendizaje

#### Reglas MCP para este escenario

```yaml
# rules.yaml para Asistente Virtual
- type: content_policy
  name: "asistente_solar_fluidity"
  rules:
    - restrict: 
        - "tax_advice_specific"
        - "legal_guarantees"
        - "specific_financial_forecasts"
    - only_reference: 
        - "official_mh_regulations"
        - "company_documentation"
    - always_mention: 
        - "this_is_informational_only"
        - "consult_professional_for_specific_advice"
    - tone_requirements:
        - helpful: true
        - professional: true
        - concise: true
```

#### Instrucciones de Implementación

1. **Crear el workflow en n8n**:
   - Nombre: "Asistente Virtual Solar Fluidity"
   - Descripción: "Procesa consultas de clientes usando MCP"

2. **Configurar el trigger**:
   - Tipo: Webhook o Email
   - Evento: Nuevo mensaje recibido
   - Filtro: Categoría = "soporte"

3. **Configurar el nodo de contexto**:
   - Conexión a Supabase para extraer información del cliente
   - Búsqueda de documentación relevante
   - Formateo del prompt con contexto

4. **Configurar el nodo MCP**:
   - Seleccionar servidor MCP: Convex
   - Cargar reglas desde `rules.yaml`
   - Configurar parámetros de respuesta (max_tokens, temperature)

5. **Probar con casos de prueba**:
   - Consulta sobre proceso de facturación
   - Consulta sobre tiempo de instalación de paneles solares
   - Consulta que solicite asesoría fiscal específica (debe incluir disclaimer)
   - Consulta sobre financiamiento (debe ser informativo sin compromisos)

#### Criterios de Éxito

- Precisión de respuestas > 90% (evaluación manual)
- Tiempo de respuesta < 5 segundos
- 100% de inclusión de disclaimers cuando sea necesario
- 0% de respuestas que violen políticas regulatorias

### Escenario 3: Planificación de Proyectos Solares

**Objetivo**: Automatizar la planificación de proyectos solares utilizando IA contextual para optimizar recursos, tiempos y presupuestos según las características específicas del cliente y ubicación.

#### Configuración del Flujo en n8n

1. **Trigger**: Creación de nuevo proyecto solar en Supabase
2. **Nodos de procesamiento**:
   - Extracción de datos del proyecto y cliente
   - Consulta de bases de datos históricas para proyectos similares
   - Análisis geoespacial para determinar condiciones solares
   - Nodo MCP para generación de plan optimizado
   - Creación de tareas en sistema de gestión de proyectos
   - Notificación a equipo técnico

#### Reglas MCP para este escenario

```yaml
# rules.yaml para Planificación de Proyectos
- type: planning_optimization
  name: "planificador_solar"
  rules:
    - consider_factors:
        - location_solar_radiation
        - seasonal_variations
        - construction_restrictions
        - budget_constraints
        - local_regulations
    - optimize_for:
        - energy_production
        - roi
        - installation_time
    - risk_assessment:
        - identify_critical_path
        - suggest_contingencies
        - highlight_regulatory_requirements
    - output_format:
        - structured_timeline
        - resource_allocation
        - budget_breakdown
```

#### Instrucciones de Implementación

1. **Crear el workflow en n8n**:
   - Nombre: "Planificador Inteligente de Proyectos Solares"
   - Descripción: "Genera planes detallados para proyectos solares con optimización IA"

2. **Configurar el trigger**:
   - Tipo: Supabase
   - Evento: Nuevo registro en tabla de proyectos
   - Filtro: Status = "pre-planificación"

3. **Configurar el nodo de datos contextuales**:
   - Conexión a base de datos histórica
   - API de datos geoespaciales y meteorológicos
   - Consulta de regulaciones por ubicación

4. **Configurar el nodo MCP**:
   - Seleccionar servidor MCP: Convex
   - Cargar reglas desde `rules.yaml`
   - Configurar parámetros de optimización

5. **Probar con casos de prueba**:
   - Proyecto residencial pequeño (<10kW)
   - Proyecto comercial mediano (10-100kW)
   - Proyecto con restricciones regulatorias especiales
   - Proyecto en zona con condiciones meteorológicas variables

#### Criterios de Éxito

- Precisión en estimación de tiempo: ±15% del tiempo real
- Precisión en presupuesto: ±10% del costo final
- Optimización de recursos: 15% mejor que planificación manual
- Identificación del 95% de restricciones regulatorias relevantes
- Tiempo de generación de plan < 5 minutos

### Escenario 4: Monitoreo y Mantenimiento Predictivo

**Objetivo**: Implementar un sistema de monitoreo continuo de instalaciones solares que utilice IA para predecir fallos, programar mantenimientos preventivos y maximizar el rendimiento energético.

#### Configuración del Flujo en n8n

1. **Trigger**: Datos periódicos de sensores o fecha programada de revisión
2. **Nodos de procesamiento**:
   - Recopilación de datos de rendimiento
   - Normalización y preprocesamiento
   - Análisis de tendencias y detección de anomalías
   - Nodo MCP para diagnóstico predictivo
   - Programación automática de mantenimiento (si es necesario)
   - Generación de informe para cliente

#### Reglas MCP para este escenario

```yaml
# rules.yaml para Mantenimiento Predictivo
- type: predictive_maintenance
  name: "mantenimiento_solar_predictivo"
  rules:
    - analyze_patterns:
        - performance_degradation
        - error_codes
        - weather_impact
        - seasonal_variations
    - detect_anomalies:
        - threshold: "adaptive"
        - sensitivity: 0.85
        - false_positive_mitigation: true
    - prioritize_issues:
        - critical: ["inverter_failure", "connection_loss", "severe_underperformance"]
        - high: ["gradual_degradation", "efficiency_loss"]
        - medium: ["minor_fluctuations", "cosmetic_issues"]
    - recommend_actions:
        - include_urgency_level
        - provide_specific_components
        - estimate_impact_on_production
```

#### Instrucciones de Implementación

1. **Crear el workflow en n8n**:
   - Nombre: "Monitoreo Predictivo Solar"
   - Descripción: "Sistema de mantenimiento predictivo con IA para instalaciones solares"

2. **Configurar el trigger**:
   - Tipo: Webhook (para datos de sensores) o Schedule (para revisiones programadas)
   - Frecuencia: Diaria para análisis general, tiempo real para alertas críticas

3. **Configurar el nodo de procesamiento de datos**:
   - Normalización de lecturas de diferentes sensores
   - Cálculo de métricas derivadas (eficiencia, ratio de conversión)
   - Almacenamiento en serie temporal para análisis de tendencias

4. **Configurar el nodo MCP**:
   - Seleccionar servidor MCP: Convex
   - Cargar reglas desde `rules.yaml`
   - Configurar parámetros de sensibilidad según tipo de instalación

5. **Probar con casos de prueba**:
   - Simulación de degradación gradual de rendimiento
   - Simulación de fallo inminente de inversor
   - Datos normales con variaciones estacionales
   - Situación de alerta meteorológica

#### Criterios de Éxito

- Detección de fallos con 48h de antelación: >85%
- Falsos positivos: <5%
- Reducción del tiempo de inactividad: >30%
- Aumento de producción energética anual: >8%
- Reducción de costos de mantenimiento: >20%

### Escenario 5: Generación de Reportes de Sostenibilidad

**Objetivo**: Automatizar la creación de informes personalizados de sostenibilidad para clientes, calculando el impacto ambiental de sus instalaciones solares con datos precisos y contextualizados.

#### Configuración del Flujo en n8n

1. **Trigger**: Solicitud de cliente o programación mensual/trimestral
2. **Nodos de procesamiento**:
   - Recopilación de datos de producción energética
   - Cálculo de métricas ambientales (CO2 evitado, equivalencias)
   - Comparativa con períodos anteriores
   - Nodo MCP para generación de narrativa personalizada
   - Creación de documento (PDF/HTML) con visualizaciones
   - Envío al cliente por email o notificación

#### Reglas MCP para este escenario

```yaml
# rules.yaml para Reportes de Sostenibilidad
- type: report_generation
  name: "reporte_sostenibilidad_solar"
  rules:
    - data_processing:
        - validate_energy_production
        - calculate_emissions_avoided
        - compare_with_benchmarks
    - narrative_style:
        - tone: "professional_positive"
        - highlight_achievements
        - provide_context
        - suggest_improvements
    - visualization_requirements:
        - include_trends
        - use_company_colors
        - adapt_to_audience_technical_level
    - compliance:
        - costa_rica_environmental_standards
        - carbon_neutrality_reporting
        - sdg_alignment
```

#### Instrucciones de Implementación

1. **Crear el workflow en n8n**:
   - Nombre: "Generador de Reportes de Sostenibilidad"
   - Descripción: "Genera informes personalizados de impacto ambiental para clientes"

2. **Configurar el trigger**:
   - Tipo: Webhook (solicitud manual) o Schedule (informe periódico)
   - Parámetros: ID de cliente, período de informe, tipo de reporte

3. **Configurar el nodo de procesamiento de datos**:
   - Conexión a base de datos de producción energética
   - API de factores de emisión actualizados
   - Biblioteca de equivalencias de CO2

4. **Configurar el nodo MCP**:
   - Seleccionar servidor MCP: Convex
   - Cargar reglas desde `rules.yaml`
   - Configurar preferencias de estilo según cliente

5. **Configurar el nodo de generación de documento**:
   - Plantillas HTML/PDF con marca de la empresa
   - Integración de gráficos generados dinámicamente
   - Opciones de personalización por cliente

6. **Probar con casos de prueba**:
   - Cliente residencial con 1 año de datos
   - Cliente comercial con múltiples instalaciones
   - Reporte trimestral vs. anual
   - Cliente con objetivos específicos de sostenibilidad

#### Criterios de Éxito

- Precisión de cálculos: 100%
- Tiempo de generación < 3 minutos
- Satisfacción del cliente con claridad del informe: >90%
- Tasa de apertura de emails con informes: >65%
- Aumento en contratación de servicios adicionales tras informes: >15%

---

## 4. Metodología de Pruebas

### 4.1 Enfoque Iterativo

La implementación y prueba de los escenarios seguirá un enfoque iterativo con las siguientes fases para cada escenario:

1. **Fase de Desarrollo Inicial**:
   - Implementación básica del flujo en n8n
   - Configuración de reglas MCP fundamentales
   - Pruebas con datos sintéticos controlados

2. **Fase de Pruebas Controladas**:
   - Pruebas con subconjunto limitado de datos reales
   - Validación manual de resultados
   - Refinamiento de reglas y flujos

3. **Fase de Pruebas Extendidas**:
   - Ampliación a conjunto completo de datos históricos
   - Pruebas de carga y rendimiento
   - Optimización de parámetros

4. **Fase de Producción Supervisada**:
   - Implementación en producción con supervisión humana
   - Monitoreo constante de resultados
   - Ajustes finales basados en retroalimentación real

5. **Fase de Producción Completa**:
   - Automatización completa del flujo
   - Monitoreo automatizado
   - Mejora continua basada en datos de uso

### 4.2 Plan de Pruebas Específico

| Escenario | Fase Actual | Duración Estimada | Responsable | Criterios de Promoción |
|-----------|-------------|-------------------|-------------|------------------------|
| 1: Facturación | Desarrollo Inicial | 2 semanas | Equipo Técnico | 95% precisión en validación |
| 2: Asistente Virtual | Pruebas Controladas | 3 semanas | Equipo IA | 90% satisfacción usuario |
| 3: Planificación | Desarrollo Inicial | 4 semanas | Equipo Proyectos | 85% precisión estimaciones |
| 4: Mantenimiento | Diseño | 6 semanas | Equipo IoT | Pendiente |
| 5: Reportes | Diseño | 3 semanas | Equipo Sostenibilidad | Pendiente |

### 4.3 Entornos de Prueba

| Entorno | Propósito | Características | Datos |
|---------|-----------|-----------------|-------|
| Desarrollo | Implementación inicial | Recursos limitados, sin persistencia | Datos sintéticos |
| Pruebas | Validación funcional | Similar a producción, aislado | Datos anonimizados reales |
| Staging | Pruebas de rendimiento | Réplica exacta de producción | Copia reciente de producción |
| Producción | Operación real | Recursos completos, alta disponibilidad | Datos reales |

### 4.4 Gestión de Errores y Feedback

1. **Captura de errores**:
   - Todos los errores se registran en sistema centralizado
   - Clasificación automática por tipo y severidad
   - Notificaciones según nivel de criticidad

2. **Ciclo de feedback**:
   - Revisión diaria de errores críticos
   - Sesión semanal de análisis de patrones
   - Incorporación de mejoras cada sprint

3. **Validación humana**:
   - Fase inicial: 100% de resultados validados por humano
   - Fase controlada: Muestreo del 30% de resultados
   - Fase extendida: Revisión por excepción (casos marcados como dudosos)
   - Producción: Auditorías aleatorias (5% de transacciones)

---

## 5. Métricas y KPIs

### 5.1 Métricas Técnicas

| Métrica | Descripción | Objetivo | Método de Medición |
|---------|-------------|----------|--------------------|
| Tiempo de respuesta | Tiempo desde solicitud hasta respuesta | <3s (P95) | Registro automático en cada flujo |
| Tasa de errores | % de ejecuciones con error | <1% | Monitoreo de logs |
| Uso de recursos | CPU/RAM consumidos | <30% capacidad | Métricas de sistema |
| Disponibilidad | % tiempo en que el sistema está operativo | >99.9% | Heartbeat y monitoreo |
| Precisión | % de resultados correctos | >95% | Validación manual/automatizada |

### 5.2 Métricas de Negocio

| Métrica | Descripción | Objetivo | Método de Medición |
|---------|-------------|----------|--------------------|
| Ahorro de tiempo | Horas ahorradas vs. proceso manual | >70% | Comparativa con línea base |
| Satisfacción | Puntuación de satisfacción de usuarios | >4.5/5 | Encuestas post-uso |
| Adopción | % de usuarios que utilizan funcionalidades IA | >60% | Análisis de uso |
| Retención | % reducción en cancelaciones | -20% | Análisis churn |
| ROI | Retorno sobre inversión en automatización | >300% anual | Análisis financiero |

### 5.3 Dashboard de Monitoreo

Se implementará un dashboard en tiempo real con las siguientes visualizaciones:

1. **Panel general**:
   - Estado actual de cada escenario (operativo/degradado/caído)
   - Volumen de transacciones últimas 24h
   - Principales alertas activas

2. **Panel técnico**:
   - Tiempo de respuesta (promedio, P95, P99)
   - Tasa de errores por flujo
   - Consumo de recursos
   - Logs de errores recientes

3. **Panel de negocio**:
   - Ahorro de tiempo acumulado
   - Satisfacción usuarios (último mes)
   - Tendencias de uso por escenario
   - Impacto financiero estimado

---

## 6. Resolución de Problemas

### 6.1 Problemas Comunes y Soluciones

| Problema | Posibles Causas | Soluciones Recomendadas |
|----------|-----------------|-------------------------|
| Tiempos de respuesta elevados | Sobrecarga API OpenAI, Complejidad excesiva MCP | Implementar caché, Optimizar reglas MCP, Escalar recursos |
| Errores en validación XML | Cambios en formato Hacienda, Casos borde no contemplados | Actualizar esquemas, Ampliar suite de pruebas |
| Falsos positivos en mantenimiento | Sensibilidad excesiva, Datos anómalos no filtrados | Ajustar umbrales, Mejorar preprocesamiento |
| Desconexiones n8n-Convex | Problemas de red, Límites de API excedidos | Implementar reintentos, Monitorear cuotas |
| Degradación gradual de precisión | Drift de datos, Cambios en patrones de uso | Reentrenamiento periódico, Validación continua |

### 6.2 Procedimiento de Escalamiento

1. **Nivel 1**: Problemas operativos básicos
   - Responsable: Equipo de soporte
   - Tiempo resolución: <2 horas
   - Herramientas: Dashboard de monitoreo, Reinicio de servicios

2. **Nivel 2**: Problemas técnicos complejos
   - Responsable: Equipo de desarrollo
   - Tiempo resolución: <8 horas
   - Herramientas: Logs detallados, Depuración en staging

3. **Nivel 3**: Problemas estructurales o de diseño
   - Responsable: Arquitectos e ingenieros IA
   - Tiempo resolución: <3 días
   - Herramientas: Análisis profundo, Rediseño de componentes

### 6.3 Plan de Contingencia

En caso de fallo crítico en la integración n8n-MCP, se activará el siguiente plan:

1. **Detección**: Alerta automática ante 3 errores consecutivos o latencia >10s

2. **Contención**:
   - Activación automática de modo degradado (sin IA)
   - Notificación a equipos responsables
   - Mensaje a usuarios afectados

3. **Diagnóstico rápido**:
   - Revisión de logs y métricas
   - Verificación de conectividad con OpenAI y Convex
   - Comprobación de cambios recientes

4. **Recuperación**:
   - Rollback a última versión estable si necesario
   - Solución temporal mientras se resuelve causa raíz
   - Restauración gradual de funcionalidades

5. **Post-incidente**:
   - Análisis de causa raíz
   - Documentación en base de conocimiento
   - Implementación de medidas preventivas

---

## 7. Referencias

### 7.1 Documentación Técnica

- [Documentación oficial de n8n](https://docs.n8n.io/)
- [Model Context Protocol (MCP) Documentation](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Convex Documentation](https://docs.convex.dev)
- [Supabase Documentation](https://supabase.io/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

### 7.2 Documentos Internos Relacionados

- [INTEGRACION_ANTHROPIC_MCP.md](/Users/kevincorderoelizondo/Documents/GitHub/proyectosolar/docs/Integraciones_IA/INTEGRACION_ANTHROPIC_MCP.md)
- [SISTEMA_AUTOMATIZACION_N8N.md](/Users/kevincorderoelizondo/Documents/GitHub/proyectosolar/docs/Automatizacion/SISTEMA_AUTOMATIZACION_N8N.md)
- [INTEGRACIONES_EXTERNAS.md](/Users/kevincorderoelizondo/Documents/GitHub/proyectosolar/docs/Integraciones/INTEGRACIONES_EXTERNAS.md)
- [DOCUMENTO_MAESTRO_ARQUITECTURA.md](/Users/kevincorderoelizondo/Documents/GitHub/proyectosolar/docs/DOCUMENTO_MAESTRO_ARQUITECTURA.md)

### 7.3 Recursos Adicionales

- [Ministerio de Hacienda CR - Documentación de Facturación Electrónica](https://www.hacienda.go.cr/contenido/14355-factura-electronica)
- [Guía de Mejores Prácticas para Automatización con n8n](https://community.n8n.io/c/knowledge-exchange/best-practices/)
- [YAML Schema Validation Best Practices](https://yaml.org/spec/1.2.2/)
- [Automatización inteligente con LLMs: Estudio de casos](https://arxiv.org/abs/2302.06670)
