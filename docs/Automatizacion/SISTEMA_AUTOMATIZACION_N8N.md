# Sistema de Automatización con n8n

## Descripción General

Solar Fluidity integra n8n como su motor de automatización principal, permitiendo a los usuarios crear flujos de trabajo personalizados que automatizan tareas repetitivas relacionadas con la facturación electrónica y la gestión de proyectos solares.

![Arquitectura n8n](../assets/diagrams/n8n-architecture.png)

## 1. Arquitectura de Interconexión

### 1.1 Diagrama de Arquitectura

```
┌───────────────────────────────────────────────────────────────────────────┐
│                            SOLAR FLUIDITY                                 │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐   │
│  │                 │      │                 │      │                 │   │
│  │   FRONTEND      │◀────▶│   API GATEWAY   │◀────▶│   SUPABASE      │   │
│  │                 │      │                 │      │                 │   │
│  └────────┬────────┘      └────────┬────────┘      └────────┬────────┘   │
│           │                        │                        │            │
│           │                        │                        │            │
│           ▼                        ▼                        ▼            │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐   │
│  │                 │      │                 │      │                 │   │
│  │   WEBHOOKS      │◀────▶│    N8N ENGINE   │◀────▶│   SERVICIOS     │   │
│  │                 │      │                 │      │   EXTERNOS      │   │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Componentes Principales

1. **n8n Engine**: Motor central que ejecuta los flujos de trabajo y coordina las automatizaciones.
2. **Webhook Endpoints**: Puntos de entrada para desencadenar flujos de trabajo desde eventos externos.
3. **Database Triggers**: Activadores basados en cambios en la base de datos Supabase.
4. **Custom Nodes**: Nodos personalizados para operaciones específicas de Solar Fluidity.
5. **Credentials Management**: Sistema seguro para gestionar credenciales de servicios.

## 2. Integración Técnica

La integración de n8n con Solar Fluidity se realiza a través de múltiples puntos:

### 2.1 Configuración de n8n

```typescript
// src/config/n8n.ts
import axios from 'axios';
import { env } from './environment';
import { logger } from '../utils/logger';

export class N8nService {
  private static instance: N8nService;
  private baseUrl: string;
  private apiKey: string;
  
  private constructor() {
    this.baseUrl = env.N8N_BASE_URL;
    this.apiKey = env.N8N_API_KEY;
  }
  
  public static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }
  
  private getHeaders() {
    return {
      'X-N8N-API-KEY': this.apiKey,
      'Content-Type': 'application/json',
    };
  }
  
  /**
   * Activa un flujo de trabajo con datos específicos
   */
  public async triggerWorkflow(workflowId: string, data: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/webhook/${workflowId}`,
        data,
        { headers: this.getHeaders() }
      );
      
      logger.info(`Workflow ${workflowId} triggered successfully`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to trigger workflow ${workflowId}`, error);
      throw error;
    }
  }
  
  /**
   * Obtiene información de un flujo de trabajo
   */
  public async getWorkflow(workflowId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/workflows/${workflowId}`,
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to get workflow ${workflowId}`, error);
      throw error;
    }
  }
  
  /**
   * Obtiene ejecuciones de un flujo de trabajo
   */
  public async getWorkflowExecutions(workflowId: string, limit: number = 10): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/executions?workflowId=${workflowId}&limit=${limit}`,
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to get executions for workflow ${workflowId}`, error);
      throw error;
    }
  }
}
```

### 2.2 Implementación de Webhooks

```typescript
// src/routes/webhook.routes.ts
import { Router } from 'express';
import { N8nService } from '../config/n8n';
import { logger } from '../utils/logger';

const router = Router();

// Webhook para notificaciones de facturas
router.post('/invoice-notification', async (req, res) => {
  try {
    const { invoiceId, status, customerId } = req.body;
    
    if (!invoiceId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const n8nService = N8nService.getInstance();
    await n8nService.triggerWorkflow('invoice-notification-workflow', {
      invoiceId,
      status,
      customerId,
      timestamp: new Date().toISOString(),
    });
    
    logger.info(`Invoice notification webhook triggered for invoice ${invoiceId}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error in invoice notification webhook', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook para actualizaciones de proyectos
router.post('/project-update', async (req, res) => {
  try {
    const { projectId, action, data } = req.body;
    
    if (!projectId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const n8nService = N8nService.getInstance();
    await n8nService.triggerWorkflow('project-update-workflow', {
      projectId,
      action,
      data,
      timestamp: new Date().toISOString(),
    });
    
    logger.info(`Project update webhook triggered for project ${projectId}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error in project update webhook', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

## 3. Flujos de Trabajo Principales

### 3.1 Automatización de Facturas Electrónicas

#### 3.1.1 Flujo de Notificación de Facturas

Este flujo se activa cuando una factura cambia su estado a "EMITIDA" y realiza los siguientes pasos:

1. Genera el PDF de la factura
2. Envía la factura por correo electrónico al cliente
3. Notifica internamente sobre la factura emitida
4. Actualiza la estadística de facturación

```json
{
  "name": "Notificación de Facturas",
  "nodes": [
    {
      "id": "1",
      "name": "Start",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "invoice-notification",
        "responseMode": "onReceived",
        "responseData": "firstEntryJson"
      },
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "id": "2",
      "name": "Obtener Datos Factura",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "select",
        "table": "invoices",
        "schema": "public",
        "returnAll": false,
        "limit": 1,
        "filter": {
          "conditions": [
            {
              "keyName": "id",
              "keyOperator": "equal",
              "valueType": "expression",
              "value": "={{ $json.invoiceId }}"
            }
          ]
        }
      },
      "credentials": {
        "supabaseApi": "supabase_credentials"
      },
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "id": "3",
      "name": "Obtener Cliente",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "select",
        "table": "customers",
        "schema": "public",
        "returnAll": false,
        "limit": 1,
        "filter": {
          "conditions": [
            {
              "keyName": "id",
              "keyOperator": "equal",
              "valueType": "expression",
              "value": "={{ $node[\"Obtener Datos Factura\"].json.customer_id }}"
            }
          ]
        }
      },
      "credentials": {
        "supabaseApi": "supabase_credentials"
      },
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "id": "4",
      "name": "Generar PDF",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "=https://api.solarfluidity.com/api/v1/invoices/{{ $json.invoiceId }}/pdf",
        "method": "POST",
        "authentication": "bearerToken",
        "responseFormat": "json"
      },
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "id": "5",
      "name": "Enviar Email",
      "type": "n8n-nodes-base.sendEmail",
      "parameters": {
        "fromEmail": "facturacion@solarfluidity.com",
        "toEmail": "={{ $node[\"Obtener Cliente\"].json.email }}",
        "subject": "=Factura Electrónica #{{ $node[\"Obtener Datos Factura\"].json.invoice_number }}",
        "text": "=Estimado/a {{ $node[\"Obtener Cliente\"].json.name }},\n\nAdjunto encontrará su factura electrónica #{{ $node[\"Obtener Datos Factura\"].json.invoice_number }}.\n\nGracias por confiar en nosotros.\n\nSolar Fluidity",
        "attachments": [
          {
            "name": "=Factura-{{ $node[\"Obtener Datos Factura\"].json.invoice_number }}.pdf",
            "url": "={{ $node[\"Generar PDF\"].json.pdfUrl }}"
          }
        ]
      },
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "id": "6",
      "name": "Actualizar Estadísticas",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Calcular estadísticas\nconst currentMonth = new Date().getMonth() + 1;\nconst currentYear = new Date().getFullYear();\n\n// Actualizar contador mensual\nconst countKey = `invoice_count_${currentYear}_${currentMonth}`;\nconst amountKey = `invoice_amount_${currentYear}_${currentMonth}`;\n\n// Obtener valores actuales\nconst currentCount = $node[\"Obtener Estadísticas\"].json.count || 0;\nconst currentAmount = $node[\"Obtener Estadísticas\"].json.amount || 0;\n\n// Calcular nuevos valores\nconst newCount = currentCount + 1;\nconst newAmount = currentAmount + $node[\"Obtener Datos Factura\"].json.amount;\n\nreturn {\n  countKey,\n  amountKey,\n  newCount,\n  newAmount\n};"
      },
      "typeVersion": 1,
      "position": [1250, 300]
    }
  ],
  "connections": {
    "Start": {
      "main": [
        [
          {
            "node": "Obtener Datos Factura",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Obtener Datos Factura": {
      "main": [
        [
          {
            "node": "Obtener Cliente",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Obtener Cliente": {
      "main": [
        [
          {
            "node": "Generar PDF",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generar PDF": {
      "main": [
        [
          {
            "node": "Enviar Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Enviar Email": {
      "main": [
        [
          {
            "node": "Actualizar Estadísticas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

#### 3.1.2 Flujo de Recordatorio de Facturas Pendientes

Este flujo se ejecuta diariamente para identificar facturas pendientes de pago y enviar recordatorios a los clientes.

### 3.2 Automatización de Proyectos Solares

#### 3.2.1 Flujo de Seguimiento de Tareas

Este flujo monitorea el progreso de tareas en proyectos solares y notifica a los responsables cuando se acercan las fechas límite.

#### 3.2.2 Flujo de Actualización de Recursos

Gestiona automáticamente la asignación de recursos y materiales a proyectos basándose en las tareas programadas.

## 4. Plantillas de Automatización

Solar Fluidity ofrece plantillas prediseñadas para los casos de uso más comunes:

### 4.1 Plantillas de Facturación

| Nombre | Descripción | Tiempo de Ejecución |
|--------|-------------|---------------------|
| Facturación Recurrente | Genera facturas mensualmente para clientes con contratos recurrentes | Mensual |
| Recordatorios de Pago | Envía recordatorios escalonados para facturas vencidas | Diario |
| Consolidado de Facturación | Genera reportes mensuales de facturación por cliente | Mensual |

### 4.2 Plantillas de Proyectos

| Nombre | Descripción | Tiempo de Ejecución |
|--------|-------------|---------------------|
| Notificación de Hitos | Alerta cuando se completan hitos importantes del proyecto | Por evento |
| Seguimiento de Presupuesto | Monitorea gastos vs. presupuesto y alerta de desviaciones | Semanal |
| Reporte de Progreso | Genera informes de progreso para clientes | Semanal |

## 5. Nodos Personalizados

Para funcionalidades específicas de Solar Fluidity, se han desarrollado nodos personalizados para n8n:

### 5.1 Nodo de Generación de XML

Este nodo personalizado genera documentos XML de facturación electrónica compatibles con el Ministerio de Hacienda de Costa Rica.

```typescript
// src/n8n/nodes/GenerateInvoiceXml.node.ts
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { generateInvoiceXML } from '../../services/invoice/xml-generator';

export class GenerateInvoiceXml implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Generate Invoice XML',
    name: 'generateInvoiceXml',
    group: ['transform'],
    version: 1,
    description: 'Generates invoice XML according to Costa Rica\'s requirements',
    defaults: {
      name: 'Generate Invoice XML',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Invoice Data',
        name: 'invoiceData',
        type: 'json',
        default: '',
        description: 'The invoice data as JSON',
        required: true,
      },
      {
        displayName: 'Include Digital Signature',
        name: 'includeSignature',
        type: 'boolean',
        default: true,
        description: 'Whether to digitally sign the XML',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const invoiceData = this.getNodeParameter('invoiceData', itemIndex, {}) as object;
        const includeSignature = this.getNodeParameter('includeSignature', itemIndex, true) as boolean;
        
        // Generate XML
        const xml = await generateInvoiceXML(invoiceData, includeSignature);
        
        // Return data
        returnData.push({
          json: {
            xml,
            success: true,
          },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
              success: false,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
```

### 5.2 Nodo de Cálculo Solar

Este nodo realiza cálculos específicos para instalaciones solares, como estimación de producción energética.

## 6. Monitoreo y Gestión

### 6.1 Panel de Control de Automatizaciones

Solar Fluidity incluye un panel de control dedicado para monitorear y gestionar automatizaciones:

```tsx
// src/pages/AutomationDashboard.tsx
import { FC, useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import { supabaseClient } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AutomationList } from '../components/automation/AutomationList';
import { AutomationHistory } from '../components/automation/AutomationHistory';
import { CreateAutomationModal } from '../components/automation/CreateAutomationModal';

const AutomationDashboard: FC = () => {
  const [automations, setAutomations] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAutomations();
    fetchHistory();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las automatizaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('automation_executions')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching automation history:', error);
    }
  };

  const handleCreateAutomation = async (newAutomation: any) => {
    try {
      const { data, error } = await supabaseClient
        .from('automations')
        .insert(newAutomation)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Automatización creada',
        description: `La automatización "${data.name}" se ha creado exitosamente`,
        variant: 'success',
      });

      setShowCreateModal(false);
      fetchAutomations();
    } catch (error) {
      console.error('Error creating automation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la automatización',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Centro de Automatización</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Nueva Automatización
        </Button>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Automatizaciones Activas</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Automatizaciones Activas</CardTitle>
              <CardDescription>
                Todas tus automatizaciones activas y programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AutomationList 
                automations={automations.filter(a => a.status === 'active')} 
                loading={loading} 
                onRefresh={fetchAutomations} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Automatización</CardTitle>
              <CardDescription>
                Plantillas predefinidas que puedes personalizar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Contenido de plantillas */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Ejecuciones</CardTitle>
              <CardDescription>
                Registro de las últimas 20 ejecuciones de automatizaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AutomationHistory history={history} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={fetchHistory}>
                Actualizar Historial
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showCreateModal && (
        <CreateAutomationModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAutomation}
        />
      )}
    </div>
  );
};

export default AutomationDashboard;
```

### 6.2 Registro y Auditoría

Las ejecuciones de flujos de trabajo se registran en Supabase para auditoría y seguimiento:

```sql
-- Esquema de tabla para historial de automatizaciones
CREATE TABLE public.automation_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID REFERENCES public.automations(id),
  status VARCHAR(255) NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  result JSONB,
  error TEXT,
  trigger_source VARCHAR(255),
  user_id UUID REFERENCES auth.users(id)
);

-- Índices para búsqueda rápida
CREATE INDEX automation_executions_automation_id_idx ON public.automation_executions(automation_id);
CREATE INDEX automation_executions_status_idx ON public.automation_executions(status);
CREATE INDEX automation_executions_executed_at_idx ON public.automation_executions(executed_at);
```

## 7. Buenas Prácticas y Recomendaciones

### 7.1 Diseño de Flujos de Trabajo

- **Mantener simplicidad**: Cada flujo debe tener un propósito claro y específico
- **Manejar errores**: Incluir manejo de errores y notificaciones en cada paso crítico
- **Documentar**: Añadir notas explicativas a cada nodo para facilitar mantenimiento futuro
- **Probar progresivamente**: Verificar el funcionamiento de cada nodo antes de añadir nuevos
- **Limitar automatizaciones activas**: No exceder las 20-30 automatizaciones activas por cuenta

### 7.2 Seguridad

- Las credenciales para servicios externos se almacenan cifradas
- Los webhooks verifican la autenticidad mediante tokens
- Se implementan límites de tasa para prevenir abuso
- Se mantienen registros de auditoría de todas las ejecuciones

### 7.3 Rendimiento

- Los flujos de trabajo grandes se dividen en subflujos más pequeños
- Las tareas intensivas en recursos se ejecutan en horarios de baja demanda
- Se implementa caché para operaciones repetitivas
- Se establecen tiempos de espera adecuados en operaciones externas
