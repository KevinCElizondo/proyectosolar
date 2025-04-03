import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import paypalService from '../../services/payment/paypal';

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
  const navigate = useNavigate();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  return (
    <div className={`paypal-button-container ${className}`}>
      {isPending ? (
        <div className="text-center text-gray-500">Cargando PayPal...</div>
      ) : isRejected ? (
         <div className="text-center text-red-500">Error al cargar PayPal.</div>
      ) : (
        <PayPalButtons
          style={{
            color: 'blue',
            shape: 'rect',
            label: 'pay',
            height: 40,
          }}
          forceReRender={[amount, description]} // Re-render if amount or description changes
          createOrder={async () => {
            try {
              // Crear orden usando nuestro servicio backend
              const orderId = await paypalService.createOrder(amount, 'USD', description);
              if (!orderId) {
                throw new Error("Backend did not return an Order ID");
              }
              return orderId;
            } catch (err) {
              console.error('Error al crear la orden de PayPal via backend:', err);
              if (onError) onError(err);
              // Propagate the error to PayPal SDK to show an error message
              throw err;
            }
          }}
          onApprove={async (data) => {
            try {
              // Capturar el pago usando nuestro servicio backend
              const details = await paypalService.captureOrder(data.orderID);
              console.log('Pago completado via backend:', details);
              
              if (onSuccess) {
                onSuccess(data.orderID);
              } else {
                // Redirigir a una página de éxito por defecto
                navigate('/payment/success?orderId=' + data.orderID);
              }
              // The return type for onApprove is Promise<void>, so we don't return details
            } catch (err) {
              console.error('Error al capturar el pago via backend:', err);
              if (onError) onError(err);
              // Propagate the error to PayPal SDK
              throw err; 
            }
          }}
          onCancel={() => {
            console.log('El usuario canceló el pago');
            if (onCancel) {
              onCancel();
            } else {
              // Redirigir a una página de cancelación por defecto
              navigate('/payment/cancel');
            }
          }}
          onError={(err: any) => {
            console.error('Error en el proceso de pago PayPal SDK:', err);
            if (onError) onError(err);
          }}
        />
      )}
    </div>
  );
};

export default PayPalButton;
