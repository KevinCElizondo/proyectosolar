# Integraciones Externas

## Descripción General

Este documento detalla las integraciones externas que Solar Fluidity utiliza para proporcionar funcionalidades completas a los usuarios. Todas las integraciones están diseñadas siguiendo patrones de alta cohesión y bajo acoplamiento para facilitar su mantenimiento y actualización.

## 1. Proveedores de Pago

### 1.1 PayPal

La integración con PayPal se realiza a través de su API REST oficial para proporcionar opciones de pago seguras y familiares para los usuarios.

```typescript
// src/services/payment/paypal.ts
import { PayPalClient } from '@paypal/checkout-server-sdk';
import { env } from '../../config/environment';

export class PayPalService {
  private static instance: PayPalService;
  private client: PayPalClient;

  private constructor() {
    const environment = env.NODE_ENV === 'production'
      ? new PayPalClient.LiveEnvironment(env.PAYPAL_CLIENT_ID, env.PAYPAL_CLIENT_SECRET)
      : new PayPalClient.SandboxEnvironment(env.PAYPAL_CLIENT_ID, env.PAYPAL_CLIENT_SECRET);
    
    this.client = new PayPalClient(environment);
  }

  public static getInstance(): PayPalService {
    if (!PayPalService.instance) {
      PayPalService.instance = new PayPalService();
    }
    return PayPalService.instance;
  }

  public async createOrder(amount: number, currency: string = 'USD'): Promise<string> {
    const request = new PayPalClient.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
      }],
    });

    const response = await this.client.execute(request);
    return response.result.id;
  }

  public async captureOrder(orderId: string): Promise<any> {
    const request = new PayPalClient.orders.OrdersCaptureRequest(orderId);
    request.prefer('return=representation');
    const response = await this.client.execute(request);
    return response.result;
  }
}
```

**Configuración del Componente de Pago en Frontend:**

```tsx
// src/components/PaymentProcessor.tsx
import { FC, useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useToast } from '../../hooks/useToast';
import { supabaseClient } from '../../lib/supabase';

interface PaymentProcessorProps {
  amount: number;
  planId: string;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: Error) => void;
}

const PaymentProcessor: FC<PaymentProcessorProps> = ({
  amount,
  planId,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateOrder = async () => {
    try {
      const { data, error } = await supabaseClient
        .functions
        .invoke('create-paypal-order', {
          body: { amount, planId }
        });
      
      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error('Error creating order:', err);
      onError(err instanceof Error ? err : new Error('Unknown error creating order'));
      throw err;
    }
  };

  const handleCaptureOrder = async (data: any) => {
    setLoading(true);
    try {
      const { data: captureData, error } = await supabaseClient
        .functions
        .invoke('capture-paypal-order', {
          body: { orderId: data.orderID, planId }
        });
      
      if (error) throw error;
      
      toast({
        title: 'Pago completado',
        description: 'Tu suscripción ha sido activada correctamente',
        variant: 'success',
      });
      
      onSuccess(captureData.subscriptionId);
    } catch (err) {
      console.error('Error capturing order:', err);
      toast({
        title: 'Error en el pago',
        description: 'No se pudo procesar tu pago. Por favor, intenta nuevamente',
        variant: 'destructive',
      });
      onError(err instanceof Error ? err : new Error('Unknown error capturing order'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
        }}
        disabled={loading}
        forceReRender={[amount]}
        createOrder={handleCreateOrder}
        onApprove={(data) => handleCaptureOrder(data)}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError(err instanceof Error ? err : new Error('Unknown PayPal error'));
        }}
      />
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessor;
```

### 1.2 Stripe (Implementación Futura)

Aunque actualmente no está implementado, se ha planificado la integración con Stripe para mercados donde PayPal no es preferido.

## 2. API REST para Terceros

Solar Fluidity proporciona una API REST para que sistemas de terceros puedan interactuar con la plataforma. La API está documentada con Swagger y sigue principios RESTful.

### 2.1 Estructura de la API

```
/api/v1
├── /auth
│   ├── POST /login          - Autenticación de usuarios
│   ├── POST /refresh-token  - Refrescar token de autenticación
│   └── POST /logout         - Cerrar sesión
│
├── /invoices
│   ├── GET /                - Listar facturas
│   ├── GET /:id             - Obtener factura específica
│   ├── POST /               - Crear factura
│   ├── PUT /:id             - Actualizar factura
│   └── DELETE /:id          - Eliminar factura
│
├── /projects
│   ├── GET /                - Listar proyectos
│   ├── GET /:id             - Obtener proyecto específico
│   ├── POST /               - Crear proyecto
│   ├── PUT /:id             - Actualizar proyecto
│   └── DELETE /:id          - Eliminar proyecto
│
└── /webhooks
    ├── POST /Agentes IA / Python            - Webhook para automatizaciones
    └── POST /payment        - Webhook para notificaciones de pago
```

### 2.2 Autenticación de API

La API utiliza autenticación basada en JWT (JSON Web Tokens) con tokens de corta duración y refresh tokens.

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { supabaseAdmin } from '../lib/supabase-admin';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded;
      
      // Verificar si el usuario existe en Supabase
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, role, active')
        .eq('id', decoded.sub)
        .single();
        
      if (error || !data || !data.active) {
        return res.status(401).json({ error: 'Unauthorized: Invalid user' });
      }
      
      // Añadir rol a la solicitud para control de acceso
      req.user.role = data.role;
      
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized: No user role' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};
```

### 2.3 Documentación de la API

La documentación completa de la API se genera automáticamente utilizando Swagger UI:

```typescript
// src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Solar Fluidity API',
      version: '1.0.0',
      description: 'API para integración con la plataforma Solar Fluidity',
      contact: {
        name: 'Soporte de Solar Fluidity',
        email: 'api@solarfluidity.com',
      },
    },
    servers: [
      {
        url: env.NODE_ENV === 'production' 
          ? 'https://api.solarfluidity.com/v1' 
          : 'http://localhost:3000/api/v1',
        description: env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
```

## 3. Integración con Sistema de Facturación Electrónica

La plataforma se integra con el sistema oficial de facturación electrónica de Costa Rica para la validación y registro de facturas generadas offline.

### 3.1 Arquitectura de la Integración

```
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────────┐
│                 │     │                   │     │                        │
│  XML GENERADO   │────▶│  SERVICIO DE      │────▶│  MINISTERIO DE         │
│  LOCALMENTE     │     │  SINCRONIZACIÓN   │     │  HACIENDA              │
│                 │     │                   │     │                        │
└─────────────────┘     └───────────────────┘     └────────────┬───────────┘
                                                               │
                                                               ▼
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────────┐
│                 │     │                   │     │                        │
│  ACTUALIZACIÓN  │◀────│  PROCESAMIENTO    │◀────│  RESPUESTA DEL         │
│  DE ESTADO      │     │  DE RESPUESTA     │     │  MINISTERIO            │
│                 │     │                   │     │                        │
└─────────────────┘     └───────────────────┘     └────────────────────────┘
```

### 3.2 Implementación del Cliente SOAP

```typescript
// src/services/invoice/hacienda-client.ts
import { createClientAsync } from 'soap';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { readFileSync } from 'fs';
import { env } from '../../config/environment';
import { Invoice } from '../../types/invoice';
import { logger } from '../../utils/logger';

export class HaciendaClient {
  private static instance: HaciendaClient;
  private soapClient: any;
  private xmlParser: XMLParser;
  private xmlBuilder: XMLBuilder;
  private wsdlUrl: string;
  
  private constructor() {
    this.xmlParser = new XMLParser({ ignoreAttributes: false });
    this.xmlBuilder = new XMLBuilder({ ignoreAttributes: false });
    this.wsdlUrl = env.NODE_ENV === 'production'
      ? 'https://api.hacienda.go.cr/fe/ae?wsdl'
      : 'https://api-sandbox.hacienda.go.cr/fe/ae?wsdl';
  }
  
  public static async getInstance(): Promise<HaciendaClient> {
    if (!HaciendaClient.instance) {
      HaciendaClient.instance = new HaciendaClient();
      await HaciendaClient.instance.initialize();
    }
    return HaciendaClient.instance;
  }
  
  private async initialize(): Promise<void> {
    try {
      this.soapClient = await createClientAsync(this.wsdlUrl, {
        disableCache: true,
        wsdl_options: {
          pfx: readFileSync(env.HACIENDA_CERT_PATH),
          passphrase: env.HACIENDA_CERT_PASS,
        },
      });
      logger.info('Hacienda SOAP client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Hacienda SOAP client', error);
      throw error;
    }
  }
  
  public async sendInvoice(invoice: Invoice): Promise<any> {
    try {
      const response = await this.soapClient.EnviarFacturaElectronicaAsync({
        clave: invoice.key,
        fecha: invoice.date,
        emisor: {
          identificacion: {
            tipo: invoice.issuer.idType,
            numero: invoice.issuer.idNumber,
          },
          nombre: invoice.issuer.name,
        },
        receptor: {
          identificacion: {
            tipo: invoice.recipient.idType,
            numero: invoice.recipient.idNumber,
          },
          nombre: invoice.recipient.name,
        },
        comprobanteXml: invoice.xmlContent,
      });
      
      logger.info(`Invoice ${invoice.id} sent to Hacienda successfully`);
      return response;
    } catch (error) {
      logger.error(`Failed to send invoice ${invoice.id} to Hacienda`, error);
      throw error;
    }
  }
  
  public async checkInvoiceStatus(key: string): Promise<any> {
    try {
      const response = await this.soapClient.ConsultarComprobantesAsync({
        clave: key,
      });
      
      logger.info(`Status check for invoice with key ${key} completed`);
      return response;
    } catch (error) {
      logger.error(`Failed to check status for invoice with key ${key}`, error);
      throw error;
    }
  }
}
```

## 4. Integración con Servicio de Correo Electrónico

Para garantizar comunicación fiable con los usuarios, se ha integrado con el servicio de correo electrónico SendGrid.

```typescript
// src/services/email/sendgrid-service.ts
import sendgrid from '@sendgrid/mail';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';

export class EmailService {
  private static instance: EmailService;
  
  private constructor() {
    sendgrid.setApiKey(env.SENDGRID_API_KEY);
  }
  
  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }
  
  public async sendInvoiceNotification(
    to: string, 
    invoiceNumber: string, 
    pdfUrl: string
  ): Promise<void> {
    try {
      await sendgrid.send({
        to,
        from: env.EMAIL_FROM,
        subject: `Factura electrónica #${invoiceNumber}`,
        templateId: env.INVOICE_TEMPLATE_ID,
        dynamicTemplateData: {
          invoiceNumber,
          pdfUrl,
          date: new Date().toLocaleDateString('es-CR'),
        },
      });
      
      logger.info(`Invoice notification for #${invoiceNumber} sent to ${to}`);
    } catch (error) {
      logger.error(`Failed to send invoice notification for #${invoiceNumber} to ${to}`, error);
      throw error;
    }
  }
  
  public async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      await sendgrid.send({
        to,
        from: env.EMAIL_FROM,
        subject: 'Restablecimiento de contraseña - Solar Fluidity',
        templateId: env.PASSWORD_RESET_TEMPLATE_ID,
        dynamicTemplateData: {
          resetUrl,
          expiry: '60 minutos',
        },
      });
      
      logger.info(`Password reset email sent to ${to}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${to}`, error);
      throw error;
    }
  }
}
```

## 5. Integración con Amazon Associates

Solar Fluidity integra con el Programa de Asociados de Amazon para recomendar productos relacionados con energía solar y recibir comisiones. Esta funcionalidad se implementa a través del componente `AmazonAffiliateSection`.

```tsx
// Implementación detallada en src/components/AmazonAffiliateSection.tsx
// La documentación completa está disponible en docs/Afiliados/SECCION_AFILIADOS_AMAZON.md
```

## 6. Integración con Servicio de Almacenamiento en la Nube

Los archivos generados (facturas PDF, documentos de proyectos, etc.) se almacenan en Amazon S3 a través de la integración con Supabase Storage.

```typescript
// src/services/storage/file-storage.ts
import { supabaseClient } from '../../lib/supabase';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';

export class FileStorageService {
  private static instance: FileStorageService;
  private bucketName: string;
  
  private constructor() {
    this.bucketName = 'user-files';
  }
  
  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }
  
  public async uploadFile(
    file: File | Blob,
    path: string,
    contentType?: string
  ): Promise<string> {
    try {
      const { data, error } = await supabaseClient
        .storage
        .from(this.bucketName)
        .upload(path, file, {
          contentType,
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) throw error;
      
      // Generar URL pública
      const { data: urlData } = supabaseClient
        .storage
        .from(this.bucketName)
        .getPublicUrl(data.path);
      
      logger.info(`File uploaded successfully to ${path}`);
      return urlData.publicUrl;
    } catch (error) {
      logger.error(`Failed to upload file to ${path}`, error);
      throw error;
    }
  }
  
  public async getSignedUrl(
    path: string, 
    expiresIn: number = 60 * 60 // 1 hora por defecto
  ): Promise<string> {
    try {
      const { data, error } = await supabaseClient
        .storage
        .from(this.bucketName)
        .createSignedUrl(path, expiresIn);
      
      if (error) throw error;
      
      logger.info(`Signed URL created for ${path}`);
      return data.signedUrl;
    } catch (error) {
      logger.error(`Failed to create signed URL for ${path}`, error);
      throw error;
    }
  }
  
  public async deleteFile(path: string): Promise<void> {
    try {
      const { error } = await supabaseClient
        .storage
        .from(this.bucketName)
        .remove([path]);
      
      if (error) throw error;
      
      logger.info(`File deleted successfully from ${path}`);
    } catch (error) {
      logger.error(`Failed to delete file from ${path}`, error);
      throw error;
    }
  }
}
```
