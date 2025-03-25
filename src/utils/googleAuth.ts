/**
 * Utilidades para la autenticación con Google en Solar Fluidity
 * Este archivo proporciona funciones para gestionar tokens y autenticación de Google
 */

import { GOOGLE_AUTH_CONFIG } from '../config/integrations';

/**
 * Interface para el token de acceso de Google
 */
export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

/**
 * Recupera el token de Google almacenado en localStorage
 * @returns El token de Google o null si no existe o ha expirado
 */
export const getGoogleToken = (): GoogleTokenResponse | null => {
  try {
    const tokenData = localStorage.getItem('googleToken');
    if (!tokenData) return null;
    
    const token = JSON.parse(tokenData) as GoogleTokenResponse;
    
    // Verificar si el token ha expirado
    if (token.expiry_date && Date.now() > token.expiry_date) {
      // Token expirado, eliminarlo
      localStorage.removeItem('googleToken');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error al recuperar token de Google:', error);
    return null;
  }
};

/**
 * Almacena el token de Google en localStorage con una fecha de expiración
 * @param tokenResponse Respuesta del token de Google
 */
export const saveGoogleToken = (tokenResponse: GoogleTokenResponse): void => {
  try {
    // Calcular la fecha de expiración
    const expiryDate = Date.now() + (tokenResponse.expires_in * 1000);
    
    // Guardar token con fecha de expiración
    const tokenToSave = {
      ...tokenResponse,
      expiry_date: expiryDate
    };
    
    localStorage.setItem('googleToken', JSON.stringify(tokenToSave));
  } catch (error) {
    console.error('Error al guardar token de Google:', error);
  }
};

/**
 * Elimina el token de Google del localStorage
 */
export const removeGoogleToken = (): void => {
  localStorage.removeItem('googleToken');
};

/**
 * Verifica si el usuario está autenticado con Google
 * @returns true si el usuario está autenticado y el token es válido
 */
export const isGoogleAuthenticated = (): boolean => {
  return getGoogleToken() !== null;
};

/**
 * Inicia el flujo de autenticación de Google
 * @param callback Función a llamar después de la autenticación
 */
export const initiateGoogleAuth = (callback?: (token: GoogleTokenResponse) => void): void => {
  if (!window.google) {
    console.error('Google API no está cargada');
    return;
  }
  
  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_AUTH_CONFIG.clientId,
      scope: GOOGLE_AUTH_CONFIG.scopes.join(' '),
      callback: (tokenResponse: GoogleTokenResponse) => {
        if (tokenResponse.error) {
          console.error('Error en autenticación de Google:', tokenResponse.error);
          return;
        }
        
        // Guardar el token
        saveGoogleToken(tokenResponse);
        
        // Llamar al callback si existe
        if (callback) {
          callback(tokenResponse);
        }
      },
      prompt: GOOGLE_AUTH_CONFIG.prompt
    });
    
    client.requestAccessToken();
  } catch (error) {
    console.error('Error al iniciar autenticación con Google:', error);
  }
};

/**
 * Realiza una solicitud a la API de Google con el token actual
 * @param endpoint Endpoint de la API de Google
 * @param method Método HTTP (GET, POST, etc.)
 * @param body Cuerpo de la solicitud (opcional)
 * @returns Respuesta de la API
 */
export const googleApiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<any> => {
  const token = getGoogleToken();
  if (!token) {
    throw new Error('No hay token de Google válido. El usuario debe autenticarse.');
  }
  
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token.access_token}`,
    'Content-Type': 'application/json'
  };
  
  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  };
  
  try {
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      // Si es error de autorización, podría ser token expirado
      if (response.status === 401) {
        removeGoogleToken();
        throw new Error('Token de Google expirado o inválido. Por favor, autentique nuevamente.');
      }
      
      throw new Error(`Error en solicitud a Google API: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en solicitud a Google API:', error);
    throw error;
  }
};
