// src/config/environment.ts
// Configuración centralizada de variables de entorno

export const env = {
  // Entorno
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // API y servicios
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // PayPal
  // Use VITE_ prefix for frontend access, but read potentially different vars for backend/serverless context
  PAYPAL_SANDBOX_CLIENT_ID: import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_ID || import.meta.env.PAYPAL_SANDBOX_CLIENT_ID,
  PAYPAL_SANDBOX_SECRET: import.meta.env.VITE_PAYPAL_SANDBOX_SECRET || import.meta.env.PAYPAL_SANDBOX_SECRET,
  PAYPAL_LIVE_CLIENT_ID: import.meta.env.VITE_PAYPAL_LIVE_CLIENT_ID || import.meta.env.PAYPAL_LIVE_CLIENT_ID,
  PAYPAL_LIVE_SECRET: import.meta.env.VITE_PAYPAL_LIVE_SECRET || import.meta.env.PAYPAL_LIVE_SECRET,
  
  // Características
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  
  // N8N
  N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL,
};
