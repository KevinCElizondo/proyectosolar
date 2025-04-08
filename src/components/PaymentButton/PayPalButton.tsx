import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
// import paypalService from '../../services/payment/paypal'; // DO NOT import server-side service here
import { env } from '../../config/environment'; // Import env to get API URL

interface PayPalButtonProps {
  amount: number;
  description?: string;
  onSuccess?: (orderId: string, details?: any) => void; // Pass details back if needed
  onError?: (error: any) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Componente de botón de PayPal para Solar Fluidity
 * Utiliza el SDK de PayPal para renderizar el botón y gestiona el proceso de pago
 * interactuando con el backend para crear y capturar órdenes.
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
  const API_URL = env.API_URL; // Get API base URL from config

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
              // Llamar al backend para crear la orden
              const response = await fetch(`${API_URL}/api/paypal/create-order`, { // Adjust endpoint if needed
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Include auth token if required by your backend
                  // 'Authorization': `Bearer ${yourAuthToken}` 
                },
                body: JSON.stringify({
                  amount,
                  currency: 'USD', // Or get dynamically
                  description,
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error creating order: ${response.statusText}`);
              }

              const order = await response.json();
              if (!order.id) {
                throw new Error("Backend did not return an Order ID");
              }
              console.log("Order ID from backend:", order.id);
              return order.id; // Return only the Order ID to PayPal SDK
            } catch (err) {
              console.error('Error creating PayPal order via backend:', err);
              if (onError) onError(err);
              throw err; // Propagate error to PayPal SDK
            }
          }}
          onApprove={async (data) => {
            try {
              // Llamar al backend para capturar el pago
              const response = await fetch(`${API_URL}/api/paypal/capture-order`, { // Adjust endpoint if needed
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                   // Include auth token if required
                  // 'Authorization': `Bearer ${yourAuthToken}`
                },
                body: JSON.stringify({ orderID: data.orderID }),
              });

              if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `Error capturing order: ${response.statusText}`);
              }

              const details = await response.json(); // Backend should return capture details
              console.log('Payment captured via backend:', details);
              
              if (onSuccess) {
                onSuccess(data.orderID, details); // Pass details to callback
              } else {
                // Redirigir a una página de éxito por defecto
                navigate('/payment/success?orderId=' + data.orderID);
              }
            } catch (err) {
              console.error('Error capturing payment via backend:', err);
              if (onError) onError(err);
              // Consider navigating to an error page or showing a message
              // navigate('/payment/error'); 
              throw err; // Propagate error to PayPal SDK if needed, or handle here
            }
          }}
          onCancel={() => {
            console.log('User cancelled payment');
            if (onCancel) {
              onCancel();
            } else {
              // Redirigir a una página de cancelación por defecto
              navigate('/payment/cancel');
            }
          }}
          onError={(err: any) => {
            console.error('PayPal SDK Error:', err);
            if (onError) onError(err);
             // Consider navigating to an error page or showing a message
             // navigate('/payment/error');
          }}
        />
      )}
    </div>
  );
};

export default PayPalButton;
