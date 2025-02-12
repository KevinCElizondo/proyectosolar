
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'es',
  lng: 'es',
  resources: {
    en: {
      translations: {
        // Features section
        "features.title": "Main Features of SolarFluidity",
        "features.inventory.title": "Inventory Management",
        "features.inventory.description": "Keep total control of your solar panels and equipment in real time. Automate stock tracking and organize your products intelligently to avoid shortages or excess.",
        "features.quotes.title": "Professional Quotes",
        "features.quotes.description": "Create personalized and attractive proposals in minutes. Integrate cost calculations and discounts to generate accurate quotes and track each stage of your projects.",
        "features.financial.title": "Financial Management",
        "features.financial.description": "Control all your transactions and payments from one place. Integrated with payment gateways and billing systems to keep your finances in order.",
        "features.support.title": "Premium Support",
        "features.support.description": "Get specialized and dedicated assistance. Our team accompanies you every step of the way, ensuring your business operates smoothly.",
        
        // Pricing section
        "pricing.title": "Plans and Pricing",
        "pricing.basic.title": "Basic",
        "pricing.basic.features.1": "Basic inventory management",
        "pricing.basic.features.2": "Unlimited quotes",
        "pricing.basic.features.3": "Email support",
        "pricing.basic.features.4": "1 user",
        "pricing.pro.title": "Professional",
        "pricing.pro.features.1": "Advanced inventory",
        "pricing.pro.features.2": "Custom quotes",
        "pricing.pro.features.3": "Priority support",
        "pricing.pro.features.4": "5 users",
        "pricing.enterprise.title": "Enterprise",
        "pricing.enterprise.features.1": "Custom features",
        "pricing.enterprise.features.2": "ERP integration",
        "pricing.enterprise.features.3": "24/7 support",
        "pricing.enterprise.features.4": "Unlimited users",
        "pricing.month": "/month",
        "pricing.custom": "Custom",
        "pricing.select": "Select Plan",
      }
    },
    es: {
      translations: {
        // Features section
        "features.title": "Características Principales de SolarFluidity",
        "features.inventory.title": "Gestión de Inventario",
        "features.inventory.description": "Mantén un control total y en tiempo real de tus paneles y equipos solares. Automatiza el seguimiento de existencias y organiza tus productos de forma inteligente para evitar faltantes o excesos.",
        "features.quotes.title": "Cotizaciones Profesionales",
        "features.quotes.description": "Elabora propuestas personalizadas y atractivas en minutos. Integra cálculos de costos y descuentos para generar cotizaciones precisas y seguir cada etapa de tus proyectos.",
        "features.financial.title": "Gestión Financiera",
        "features.financial.description": "Controla todas tus transacciones y pagos desde un solo lugar. Integrado con pasarelas de pago y sistemas de facturación para mantener tus finanzas en orden.",
        "features.support.title": "Soporte Premium",
        "features.support.description": "Obtén asistencia especializada y dedicada. Nuestro equipo te acompaña en cada paso, asegurando que tu negocio opere sin contratiempos.",
        
        // Pricing section
        "pricing.title": "Planes y Precios",
        "pricing.basic.title": "Básico",
        "pricing.basic.features.1": "Gestión de inventario básico",
        "pricing.basic.features.2": "Cotizaciones ilimitadas",
        "pricing.basic.features.3": "Soporte por email",
        "pricing.basic.features.4": "1 usuario",
        "pricing.pro.title": "Profesional",
        "pricing.pro.features.1": "Inventario avanzado",
        "pricing.pro.features.2": "Cotizaciones personalizadas",
        "pricing.pro.features.3": "Soporte prioritario",
        "pricing.pro.features.4": "5 usuarios",
        "pricing.enterprise.title": "Empresarial",
        "pricing.enterprise.features.1": "Características personalizadas",
        "pricing.enterprise.features.2": "Integración con su ERP",
        "pricing.enterprise.features.3": "Soporte 24/7",
        "pricing.enterprise.features.4": "Usuarios ilimitados",
        "pricing.month": "/mes",
        "pricing.custom": "Personalizado",
        "pricing.select": "Seleccionar Plan",
      }
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

export default i18n;
