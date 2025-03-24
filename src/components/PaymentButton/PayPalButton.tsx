import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import paypalService from '../../services/payment/paypal';
import { env } from '../../config/environment';

interface PayPalButtonProps {
  amount: number;
  description?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Componente de botón de PayPal para Solar Fluidity
 * Utiliza el SDK de PayPal para renderizar el botón y gestionar el proceso de pago
 */
const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  description = 'Solar Fluidity',
  onSuccess,
  onError,
  onCancel,
  className = '',
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya existe el script de PayPal, no lo cargamos de nuevo
    if (window.paypal) {
      initializePayPalButton();
      return;
    }

    // Cargar el script de PayPal
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${env.PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;

    script.onload = () => {
      initializePayPalButton();
    };

    script.onerror = (err) => {
      console.error('Error al cargar el script de PayPal:', err);
      if (onError) onError(new Error('No se pudo cargar el SDK de PayPal'));
    };

    document.body.appendChild(script);

    return () => {
      // Limpiar el script al desmontar
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [amount, description]);

  const initializePayPalButton = () => {
    if (!paypalRef.current || !window.paypal) return;

    // Limpiar cualquier contenido previo
    paypalRef.current.innerHTML = '';

    // Renderizar el botón de PayPal
    window.paypal.Buttons({
      style: {
        color: 'blue',
        shape: 'rect',
        label: 'pay',
        height: 40,
      },
      createOrder: async () => {
        try {
          // Crear orden usando nuestro servicio
          const orderId = await paypalService.createOrder(amount, 'USD', description);
          return orderId;
        } catch (err) {
          console.error('Error al crear la orden de PayPal:', err);
          if (onError) onError(err);
          throw err;
        }
      },
      onApprove: async (data: any) => {
        try {
          // Capturar el pago cuando el usuario lo aprueba
          const details = await paypalService.captureOrder(data.orderID);
          console.log('Pago completado:', details);
          
          if (onSuccess) {
            onSuccess(data.orderID);
          } else {
            // Redirigir a una página de éxito por defecto
            navigate('/payment/success?orderId=' + data.orderID);
          }
          
          return details;
        } catch (err) {
          console.error('Error al capturar el pago:', err);
          if (onError) onError(err);
          throw err;
        }
      },
      onCancel: () => {
        console.log('El usuario canceló el pago');
        if (onCancel) {
          onCancel();
        } else {
          // Redirigir a una página de cancelación por defecto
          navigate('/payment/cancel');
        }
      },
      onError: (err: any) => {
        console.error('Error en el proceso de pago:', err);
        if (onError) onError(err);
      },
    }).render(paypalRef.current);
  };

  return (
    <div className={`paypal-button-container ${className}`}>
      <div ref={paypalRef} />
    </div>
  );
};

// Declaración para TypeScript
declare global {
  interface Window {
    paypal: any;
  }
}

export default PayPalButton;
