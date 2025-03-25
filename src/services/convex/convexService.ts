/**
 * Servicio para integración con Convex
 * Este servicio proporciona funciones para interactuar con la API de Convex
 */

import { ConvexClient } from 'convex/browser';
import { CONVEX_CONFIG } from '../../config/integrations';

// Inicializar el cliente de Convex
let convexClient: ConvexClient | null = null;

/**
 * Inicializa el cliente de Convex si aún no existe
 * @returns El cliente de Convex inicializado
 */
export const getConvexClient = () => {
  if (!convexClient) {
    convexClient = new ConvexClient(CONVEX_CONFIG.deploymentUrl);
  }
  return convexClient;
};

/**
 * Configura el cliente de Convex con un token de autenticación
 * @param token Token de autenticación (por ejemplo, de Google OAuth)
 */
export const setupConvexAuth = (token: string) => {
  const client = getConvexClient();
  client.setAuth(token);
  return client;
};

/**
 * Ejecuta una función de Convex
 * @param functionName Nombre de la función a ejecutar
 * @param args Argumentos para pasar a la función
 * @returns Resultado de la función
 */
export const executeConvexFunction = async (functionName: string, args: any = {}) => {
  const client = getConvexClient();
  try {
    // @ts-ignore - Convex tiene un tipado dinámico
    return await client.query(functionName, args);
  } catch (error) {
    console.error(`Error ejecutando función Convex ${functionName}:`, error);
    throw error;
  }
};

/**
 * Envía una mutación a Convex
 * @param mutationName Nombre de la mutación a ejecutar
 * @param args Argumentos para pasar a la mutación
 * @returns Resultado de la mutación
 */
export const executeConvexMutation = async (mutationName: string, args: any = {}) => {
  const client = getConvexClient();
  try {
    // @ts-ignore - Convex tiene un tipado dinámico
    return await client.mutation(mutationName, args);
  } catch (error) {
    console.error(`Error ejecutando mutación Convex ${mutationName}:`, error);
    throw error;
  }
};

/**
 * Suscribe a cambios en una tabla de Convex
 * @param queryName Nombre de la consulta a suscribir
 * @param args Argumentos para pasar a la consulta
 * @param callback Función a llamar cuando hay cambios
 * @returns Función para cancelar la suscripción
 */
export const subscribeToConvexQuery = (queryName: string, args: any = {}, callback: (data: any) => void) => {
  const client = getConvexClient();
  try {
    // @ts-ignore - Convex tiene un tipado dinámico
    return client.onUpdate(queryName, args, callback);
  } catch (error) {
    console.error(`Error suscribiéndose a consulta Convex ${queryName}:`, error);
    throw error;
  }
};
