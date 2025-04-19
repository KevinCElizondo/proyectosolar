import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { GOOGLE_AUTH_CONFIG } from '../config/integrations';

interface GoogleAuthButtonProps {
  onAuthSuccess?: (credentials: any) => void;
  onAuthFailure?: (error: Error) => void;
  buttonText?: string;
  customStyle?: React.CSSProperties;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onAuthSuccess,
  onAuthFailure,
  buttonText = 'Conectar con Google',
  customStyle
}) => {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initializeGoogleAuth = useCallback(() => {
    if (window.google) {
      setInitialized(true);
    } else {
      console.error("No se pudo cargar la API de Google");
      onAuthFailure && onAuthFailure(new Error("No se pudo cargar la API de Google"));
    }
  }, [onAuthFailure]);

  useEffect(() => {
    // Cargar el script de Google API
    const loadGoogleScript = () => {
      if (!document.getElementById('google-jssdk')) {
        const script = document.createElement('script');
        script.id = 'google-jssdk';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleAuth;
        document.body.appendChild(script);
      } else {
        initializeGoogleAuth();
      }
    };

    loadGoogleScript();
    
    return () => {
      // Limpiar el cliente de Google si existe
      const googleScript = document.getElementById('google-jssdk');
      if (googleScript) {
        googleScript.remove();
      }
    };
  }, [initializeGoogleAuth]);

  const handleGoogleLogin = () => {
    if (!initialized) {
      console.error("Google API no inicializada");
      return;
    }

    setLoading(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_AUTH_CONFIG.clientId,
        scope: GOOGLE_AUTH_CONFIG.scopes.join(' '),
        callback: (tokenResponse: any) => {
          setLoading(false);
          if (tokenResponse.error) {
            console.error("Error en autenticación de Google:", tokenResponse.error);
            onAuthFailure && onAuthFailure(new Error(tokenResponse.error));
          } else {
            // Guardar el token en localStorage para uso futuro
            localStorage.setItem('googleToken', JSON.stringify(tokenResponse));
            console.log("Autenticación con Google exitosa");
            onAuthSuccess && onAuthSuccess(tokenResponse);
          }
        },
        prompt: GOOGLE_AUTH_CONFIG.prompt
      });

      client.requestAccessToken();
    } catch (error) {
      setLoading(false);
      console.error("Error al iniciar autenticación con Google:", error);
      onAuthFailure && onAuthFailure(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
      onClick={handleGoogleLogin}
      disabled={loading || !initialized}
      style={{ 
        backgroundColor: '#4285F4', 
        color: 'white',
        textTransform: 'none',
        fontWeight: 500,
        ...customStyle 
      }}
    >
      {loading ? 'Conectando...' : buttonText}
    </Button>
  );
};

// Añadir definición de tipo para window
declare global {
  interface Window {
    google?: any;
  }
}

export default GoogleAuthButton;
