// src/services/payment/paypal.ts
import * as paypal from '@paypal/paypal-server-sdk'; // Use namespace import
import axios from 'axios';
import { env } from '../../config/environment';

// Tipos personalizados para PayPal
interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

/**
 * Servicio para la integración con PayPal
 * Facilita el procesamiento de pagos para suscripciones y servicios de Solar Fluidity
 * 
 * Características:
 * - Procesa pagos para facturas electrónicas offline
 * - Maneja suscripciones para planes de servicio
 * - Genera órdenes para proyectos solares y electromecánicos
 */
export class PayPalService {
  private static instance: PayPalService;
  private client: paypal.core.PayPalHttpClient;
  private readonly API_BASE: string;

  private constructor() {
    // Usar siempre sandbox para desarrollo y pruebas
    // Solo usar producción cuando sea explícitamente configurado
    const isProduction = env.NODE_ENV === 'production';
    const clientId = isProduction ? env.PAYPAL_LIVE_CLIENT_ID : env.PAYPAL_SANDBOX_CLIENT_ID;
    const clientSecret = isProduction ? env.PAYPAL_LIVE_SECRET : env.PAYPAL_SANDBOX_SECRET;

    const environment = isProduction
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    
    this.client = new paypal.core.PayPalHttpClient(environment);
    this.API_BASE = isProduction 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    
    // Verificar que las credenciales estén configuradas
    if (!clientId || !clientSecret) {
      console.warn('PayPal no está correctamente configurado. Faltan credenciales en el archivo .env');
    }
  }

  /**
   * Obtener la instancia singleton del servicio PayPal
   */
  public static getInstance(): PayPalService {
    if (!PayPalService.instance) {
      PayPalService.instance = new PayPalService();
    }
    return PayPalService.instance;
  }

  /**
   * Crear una orden de pago para facturación o suscripción
   * @param amount Monto a cobrar
   * @param currency Moneda (por defecto USD ya que PayPal no soporta CRC directamente)
   * @param description Descripción del pago (ej. "Facturación Electrónica - Solar Fluidity")
   */
  public async createOrder(amount: number, currency: string = 'USD', description: string = 'Solar Fluidity'): Promise<string> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        description: description
      }],
      application_context: {
        brand_name: 'Solar Fluidity',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING'
      }
    });

    try {
      const response = await this.client.execute(request);
      return response.result.id;
    } catch (error) {
      console.error('Error al crear orden de PayPal:', error);
      throw new Error('No se pudo procesar el pago. Por favor, intente de nuevo o contacte a soporte.');
    }
  }

  /**
   * Capturar una orden de pago previamente creada
   * @param orderId ID de la orden de PayPal a capturar
   */
  public async captureOrder(orderId: string): Promise<any> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.prefer('return=representation');
    
    try {
      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Error al capturar orden de PayPal:', error);
      throw new Error('Error al procesar la confirmación del pago. Por favor, contacte a soporte.');
    }
  }
  
  /**
   * Verificar la conexión con PayPal usando las credenciales configuradas
   * @returns {Promise<boolean>} Verdadero si la conexión es exitosa
   */
  public async verifyConnection(): Promise<boolean> {
    try {
      // Crear una orden mínima para verificar la conexión
      const orderId = await this.createOrder(1, 'USD', 'Verificación de conexión');
      console.log('Conexión con PayPal verificada. Orden de prueba creada:', orderId);
      return true;
    } catch (error) {
      console.error('Error al verificar la conexión con PayPal:', error);
      return false;
    }
  }
  
  /**
   * Obtener la URL para aprobar un pago
   * @param orderId ID de la orden de PayPal
   * @returns URL para redirigir al usuario y completar el pago
   */
  public async getApprovalUrl(orderId: string): Promise<string | null> {
    try {
      const request = new paypal.orders.OrdersGetRequest(orderId);
      const response = await this.client.execute(request);
      
      const approveUrl = response.result.links.find(link => link.rel === 'approve')?.href;
      return approveUrl || null;
    } catch (error) {
      console.error('Error al obtener URL de aprobación:', error);
      return null;
    }
  }
  
  /**
   * Devuelve el entorno actual de PayPal (sandbox o producción)
   */
  public getEnvironment(): 'sandbox' | 'production' {
    return env.NODE_ENV === 'production' ? 'production' : 'sandbox';
  }
  
  /**
   * Obtiene los detalles de una orden de PayPal
   * @param orderId ID de la orden de PayPal
   * @returns Detalles completos de la orden
   */
  public async getOrderDetails(orderId: string): Promise<any> {
    try {
      // Usar Axios para realizar la solicitud HTTP directamente, evitando problemas con tipos
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'get',
        url: `${this.API_BASE}/v2/checkout/orders/${orderId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles de la orden:', error);
      throw new Error('No se pudieron obtener los detalles de la orden');
    }
  }
  
  /**
   * Obtiene un token de acceso para la API de PayPal
   * @private
   * @returns Token de acceso
   */
  private async getAccessToken(): Promise<string> {
    try {
      const isProduction = env.NODE_ENV === 'production';
      const clientId = isProduction ? env.PAYPAL_LIVE_CLIENT_ID : env.PAYPAL_SANDBOX_CLIENT_ID;
      const clientSecret = isProduction ? env.PAYPAL_LIVE_SECRET : env.PAYPAL_SANDBOX_SECRET;
      
      if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials not configured for the current environment.');
      }
      
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const response = await axios({
        method: 'post',
        url: `${this.API_BASE}/v1/oauth2/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`
        },
        data: 'grant_type=client_credentials'
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error al obtener token de acceso de PayPal:', error);
      throw new Error('No se pudo autenticar con PayPal');
    }
  }
  
  /**
   * Genera una factura electrónica para Solar Fluidity
   * @param orderId ID de la orden de PayPal completada
   * @param clientInfo Información del cliente para la factura
   * @returns Detalles de la factura generada
   */
  public async generateInvoice(orderId: string, clientInfo: any): Promise<any> {
    try {
      // 1. Obtener detalles de la orden
      const orderDetails = await this.getOrderDetails(orderId);
      
      // 2. Aquí integrarías con tu sistema de facturación electrónica
      // Por ejemplo, llamar a un servicio externo o interno
      
      // 3. Registrar la factura en tu base de datos
      console.log(`Generando factura para orden ${orderId}`);
      
      // Este es un ejemplo - implementa tu lógica real de facturación
      return {
        invoiceId: `INV-${Date.now()}`,
        orderId,
        clientInfo,
        amount: orderDetails.purchase_units[0].amount,
        createdAt: new Date().toISOString(),
        status: 'GENERATED'
      };
    } catch (error) {
      console.error('Error al generar factura:', error);
      throw new Error('No se pudo generar la factura electrónica');
    }
  }
}

export default PayPalService.getInstance();
