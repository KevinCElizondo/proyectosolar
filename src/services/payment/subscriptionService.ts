// src/services/payment/subscriptionService.ts
import PayPalService from './paypal';
import { SUBSCRIPTION_PLANS, SubscriptionPlan, getPlanById, convertToPayPalPlan } from './subscriptionPlans';
import axios from 'axios';
import { env } from '../../config/environment';

/**
 * Servicio para gestionar suscripciones de Solar Fluidity
 * Maneja la integración con PayPal para los diferentes planes
 */
class SubscriptionService {
  private static instance: SubscriptionService;
  private paypalService: typeof PayPalService;
  private readonly API_BASE: string;

  private constructor() {
    this.paypalService = PayPalService;
    this.API_BASE = env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  /**
   * Obtener la instancia singleton del servicio de suscripciones
   */
  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  /**
   * Obtener token de acceso para API de PayPal
   */
  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    try {
      const response = await axios({
        method: 'post',
        url: `${this.API_BASE}/v1/oauth2/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        data: 'grant_type=client_credentials'
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error obteniendo token de PayPal:', error);
      throw new Error('No se pudo autenticar con PayPal');
    }
  }

  /**
   * Crear una suscripción para un plan específico
   * @param planId ID del plan de suscripción
   * @param successUrl URL de redirección en caso de éxito
   * @param cancelUrl URL de redirección en caso de cancelación
   * @param customerId ID opcional del cliente en el sistema
   */
  public async createSubscription(planId: string, successUrl: string, cancelUrl: string, customerId?: string): Promise<string> {
    const plan = getPlanById(planId);
    
    if (!plan || plan.price <= 0) {
      throw new Error('Plan no válido para suscripción');
    }

    try {
      const token = await this.getAccessToken();
      
      // Comprobar si ya existe el producto en PayPal, si no, crearlo
      const productId = `solar_fluidity_${plan.id}`;
      await this.ensureProductExists(token, productId, plan);
      
      // Comprobar si ya existe el plan en PayPal, si no, crearlo
      const paypalPlanId = await this.ensurePlanExists(token, plan, productId);
      
      // Crear la suscripción
      const response = await axios({
        method: 'post',
        url: `${this.API_BASE}/v1/billing/subscriptions`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'PayPal-Request-Id': `sf-sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        },
        data: {
          plan_id: paypalPlanId,
          application_context: {
            brand_name: 'Solar Fluidity',
            locale: 'es-CR',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            payment_method: {
              payer_selected: 'PAYPAL',
              payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
            },
            return_url: successUrl,
            cancel_url: cancelUrl
          },
          subscriber: customerId ? {
            name: {
              given_name: 'Cliente',
              surname: 'Solar Fluidity'
            },
            email_address: customerId
          } : undefined
        }
      });
      
      // Obtener el ID de suscripción y la URL de aprobación
      const subscriptionId = response.data.id;
      const approveUrl = response.data.links.find((link: any) => link.rel === 'approve')?.href;
      
      if (!approveUrl) {
        throw new Error('No se pudo obtener la URL para aprobar la suscripción');
      }
      
      return approveUrl;
    } catch (error) {
      console.error('Error al crear suscripción:', error);
      throw new Error('No se pudo crear la suscripción. Por favor, intente de nuevo.');
    }
  }
  
  /**
   * Asegurar que existe el producto en PayPal
   */
  private async ensureProductExists(token: string, productId: string, plan: SubscriptionPlan): Promise<void> {
    try {
      // Verificar si el producto ya existe
      await axios({
        method: 'get',
        url: `${this.API_BASE}/v1/catalogs/products/${productId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Si no da error, el producto ya existe
      console.log(`Producto ${productId} ya existe en PayPal`);
    } catch (error: any) {
      // Si da error 404, el producto no existe y hay que crearlo
      if (error.response && error.response.status === 404) {
        try {
          await axios({
            method: 'post',
            url: `${this.API_BASE}/v1/catalogs/products`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            data: {
              id: productId,
              name: plan.name,
              description: plan.description,
              type: 'SERVICE',
              category: 'SOFTWARE',
              home_url: 'https://solarfluidity.com'
            }
          });
          
          console.log(`Producto ${productId} creado en PayPal`);
        } catch (createError) {
          console.error('Error al crear producto en PayPal:', createError);
          throw new Error('No se pudo crear el producto en PayPal');
        }
      } else {
        console.error('Error al verificar producto en PayPal:', error);
        throw new Error('Error al verificar producto en PayPal');
      }
    }
  }
  
  /**
   * Asegurar que existe el plan en PayPal
   */
  private async ensurePlanExists(token: string, plan: SubscriptionPlan, productId: string): Promise<string> {
    // Buscar si ya existe un plan con ese nombre
    try {
      const response = await axios({
        method: 'get',
        url: `${this.API_BASE}/v1/billing/plans`,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          product_id: productId
        }
      });
      
      const plans = response.data.plans;
      if (plans && plans.length > 0) {
        // Devolver el ID del primer plan activo
        const activePlan = plans.find((p: any) => p.status === 'ACTIVE');
        if (activePlan) {
          console.log(`Plan para ${productId} ya existe en PayPal: ${activePlan.id}`);
          return activePlan.id;
        }
      }
      
      // Si no hay planes activos, crear uno nuevo
      return await this.createPayPalPlan(token, plan, productId);
    } catch (error) {
      console.error('Error al buscar planes en PayPal:', error);
      
      // Intentar crear el plan
      return await this.createPayPalPlan(token, plan, productId);
    }
  }
  
  /**
   * Crear un nuevo plan en PayPal
   */
  private async createPayPalPlan(token: string, plan: SubscriptionPlan, productId: string): Promise<string> {
    try {
      const response = await axios({
        method: 'post',
        url: `${this.API_BASE}/v1/billing/plans`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'PayPal-Request-Id': `sf-plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        },
        data: {
          product_id: productId,
          name: plan.name,
          description: plan.description,
          status: 'ACTIVE',
          billing_cycles: [
            {
              frequency: {
                interval_unit: plan.billingCycle,
                interval_count: 1
              },
              tenure_type: 'REGULAR',
              sequence: 1,
              total_cycles: 0, // Indefinido
              pricing_scheme: {
                fixed_price: {
                  value: plan.price.toFixed(2),
                  currency_code: plan.currency
                }
              }
            }
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
              value: '0',
              currency_code: plan.currency
            },
            setup_fee_failure_action: 'CONTINUE',
            payment_failure_threshold: 3
          },
          ...(plan.trialDays ? {
            payment_preferences: {
              auto_bill_outstanding: true,
              setup_fee: {
                value: '0',
                currency_code: plan.currency
              },
              setup_fee_failure_action: 'CONTINUE',
              payment_failure_threshold: 3,
              service_type: 'SUBSCRIPTION',
              trial_billing_cycle: {
                frequency: {
                  interval_unit: 'DAY',
                  interval_count: plan.trialDays
                },
                tenure_type: 'TRIAL',
                sequence: 1,
                total_cycles: 1,
                pricing_scheme: {
                  fixed_price: {
                    value: '0',
                    currency_code: plan.currency
                  }
                }
              }
            }
          } : {})
        }
      });
      
      console.log(`Plan creado en PayPal: ${response.data.id}`);
      return response.data.id;
    } catch (error) {
      console.error('Error al crear plan en PayPal:', error);
      throw new Error('No se pudo crear el plan en PayPal');
    }
  }
  
  /**
   * Obtener detalles de una suscripción
   * @param subscriptionId ID de la suscripción en PayPal
   */
  public async getSubscriptionDetails(subscriptionId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'get',
        url: `${this.API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles de suscripción:', error);
      throw new Error('No se pudo obtener información de la suscripción');
    }
  }
  
  /**
   * Cancelar una suscripción
   * @param subscriptionId ID de la suscripción en PayPal
   * @param reason Motivo de la cancelación
   */
  public async cancelSubscription(subscriptionId: string, reason: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      
      await axios({
        method: 'post',
        url: `${this.API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          reason: reason
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      throw new Error('No se pudo cancelar la suscripción');
    }
  }
  
  /**
   * Obtener todos los planes de suscripción disponibles
   */
  public getAvailablePlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }
}

export default SubscriptionService.getInstance();
