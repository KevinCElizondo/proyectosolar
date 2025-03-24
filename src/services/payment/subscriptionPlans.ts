// src/services/payment/subscriptionPlans.ts
/**
 * Configuración de planes de suscripción para Solar Fluidity
 * Este archivo contiene la definición de los planes y precios disponibles para integración con PayPal
 */

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number | string;
  description?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'MONTH' | 'YEAR';
  features: PlanFeature[];
  trialDays?: number;
  popular?: boolean;
  color?: string;
  tag?: string;
  callToAction: string;
  additionalInfo?: string;
}

/**
 * Planes de suscripción disponibles para Solar Fluidity
 * Usados para integración con PayPal y visualización en la interfaz
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'freemium',
    name: 'Plan Freemium',
    description: 'Para emprendedores o técnicos independientes (mantenimiento de paneles solares residenciales).',
    price: 0,
    currency: 'USD',
    billingCycle: 'MONTH',
    features: [
      { name: 'Facturas electrónicas', included: true, limit: 15, description: 'XML/PDF válidos para Hacienda' },
      { name: 'Proyectos activos', included: true, limit: 3 },
      { name: 'Usuarios', included: true, limit: 1 },
      { name: 'Soporte', included: true, description: 'Por correo (48h)' },
      { name: 'Reportes', included: true, description: 'Básicos (solo PDF)' },
      { name: 'API', included: false },
      { name: 'Automatizaciones', included: false }
    ],
    tag: 'Gratuito',
    color: 'green',
    callToAction: 'Comenzar Gratis',
    additionalInfo: 'El 92% de los usuarios Freemium necesitan >20 facturas a los 3 meses (datos de competidores regionales).'
  },
  {
    id: 'basic_plan',
    name: 'Plan Básico',
    description: 'Para PYMES con proyectos comerciales (ej: hoteles pequeños, retail).',
    price: 39,
    currency: 'USD',
    billingCycle: 'MONTH',
    features: [
      { name: 'Facturas electrónicas', included: true, limit: 50, description: '+$0.30 por adicional' },
      { name: 'Proyectos activos', included: true, limit: 10 },
      { name: 'Usuarios', included: true, limit: 3, description: '+ roles básicos' },
      { name: 'API', included: true, description: 'Básica (integración con software local)' },
      { name: 'Automatizaciones', included: true, description: 'Internas (flujos para validación de datos)' },
      { name: 'Soporte', included: true, description: 'Horario laboral' },
      { name: 'Reportes', included: true, description: 'Completos' }
    ],
    trialDays: 7,
    tag: 'Ahorro',
    color: 'orange',
    callToAction: 'Prueba 7 Días Gratis'
  },
  {
    id: 'professional_plan',
    name: 'Plan Profesional',
    description: 'Para empresas con proyectos industriales o contratos gubernamentales (ej: plantas solares, hospitales).',
    price: 89,
    currency: 'USD',
    billingCycle: 'MONTH',
    features: [
      { name: 'Facturas electrónicas', included: true, limit: 'Ilimitadas' },
      { name: 'Proyectos activos', included: true, limit: 'Ilimitados' },
      { name: 'Usuarios', included: true, limit: 10, description: '+ permisos jerárquicos' },
      { name: 'API', included: true, description: 'Premium (20 llamadas/minuto + webhooks)' },
      { name: 'Automatizaciones', included: true, description: 'Avanzadas (gestión de inventario, alertas)' },
      { name: 'Soporte', included: true, description: '24/7 con técnicos especializados' },
      { name: 'Reportes', included: true, description: 'Avanzados y personalizados' }
    ],
    trialDays: 30,
    popular: true,
    tag: 'Más Popular',
    color: 'blue',
    callToAction: 'Agendar Demo + Mes Gratis',
    additionalInfo: 'El 68% de las empresas medianas en Costa Rica prefieren este plan para cumplir con normativas Hacienda y manejar licitaciones públicas.'
  }
];

/**
 * Obtener un plan por su ID
 * @param planId ID del plan a buscar
 * @returns El plan de suscripción o undefined si no se encuentra
 */
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

/**
 * Convertir un plan de suscripción al formato requerido por PayPal
 * @param plan Plan de suscripción de Solar Fluidity
 * @returns Objeto con la estructura requerida por la API de PayPal
 */
export function convertToPayPalPlan(plan: SubscriptionPlan): any {
  // Solo planes pagados pueden convertirse a formato PayPal
  if (plan.price <= 0) {
    throw new Error('No se puede crear un plan de PayPal para un plan gratuito');
  }

  return {
    product_id: `solar_fluidity_${plan.id}`,
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
      trial: {
        interval_unit: 'DAY',
        interval_count: plan.trialDays
      }
    } : {})
  };
}
