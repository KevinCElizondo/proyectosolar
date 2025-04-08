/**
 * Configuración de integraciones para Solar Fluidity
 * Este archivo contiene las claves y URLs necesarias para las integraciones externas
 */

// Configuración de Google OAuth
export const GOOGLE_AUTH_CONFIG = {
  clientId: '882669729813-p4mjqfiv1jg9456hd1prgltep03q2pr3.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  prompt: 'consent'
};

// Configuración de Convex
export const CONVEX_CONFIG = {
  deploymentUrl: 'https://agile-bee-457.convex.cloud',
  httpActionUrl: 'https://agile-bee-457.convex.site',
  deployKey: import.meta.env.VITE_CONVEX_DEPLOY_KEY || '' // Read from environment variable
};

// Configuración de Supabase
export const SUPABASE_CONFIG = {
  url: 'https://rlqvkqaownzqelvxnhzd.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscXZrcWFvd256cWVsdnhuaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDc2OTYsImV4cCI6MjA1NDQ4MzY5Nn0.VbIVp5gROoFjCO4k1263nIqZfcAYY9WFkhTJr_VXvm0'
};

// URLs de autenticación para Google
export const AUTH_CALLBACK_URLS = {
  // URLs de callback para Convex
  convexCloud: 'https://agile-bee-457.convex.cloud/auth/callback',
  convexSite: 'https://agile-bee-457.convex.site/auth/callback',
  
  // URLs de redirect locales para desarrollo
  local: 'http://localhost:3000/auth/callback'
};
