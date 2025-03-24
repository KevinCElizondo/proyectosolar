import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paypalService from '../../services/payment/paypal';

/**
 * Página de éxito después de un pago con PayPal
 * Muestra información detallada de la transacción y opciones para continuar
 */
const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Obtener el ID de orden de los parámetros de URL
        const params = new URLSearchParams(location.search);
        const orderId = params.get('orderId');
        
        if (!orderId) {
          setError('No se pudo encontrar el ID de la orden');
          setLoading(false);
          return;
        }
        
        // Obtener detalles de la orden desde PayPal
        const details = await paypalService.getOrderDetails(orderId);
        setOrderDetails(details);
        
        // También podemos registrar este pago en nuestra base de datos aquí
        // await paymentService.recordSuccessfulPayment(orderId, details);
        
      } catch (err: any) {
        console.error('Error al obtener detalles de la orden:', err);
        setError(err.message || 'Error al procesar el pago');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location]);

  // Función para volver a la página principal o el dashboard
  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Procesando su pago...</h2>
          <p className="text-gray-500 mt-2">Esto podría tomar unos segundos, por favor espere.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Ha ocurrido un error</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button 
            onClick={() => navigate('/payment')} 
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <div className="text-green-500 text-5xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">¡Pago completado con éxito!</h1>
          <p className="text-gray-600 mt-2">
            Gracias por su compra en Solar Fluidity
          </p>
        </div>
        
        {orderDetails && (
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <h2 className="font-semibold text-gray-700 mb-3">Detalles de la transacción:</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID de Transacción:</span>
                <span className="font-medium">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado:</span>
                <span className="font-medium text-green-500">
                  {orderDetails.status === 'COMPLETED' ? 'Completado' : orderDetails.status}
                </span>
              </div>
              {orderDetails.purchase_units && orderDetails.purchase_units[0]?.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Monto:</span>
                  <span className="font-medium">
                    {orderDetails.purchase_units[0].amount.value} {orderDetails.purchase_units[0].amount.currency_code}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-medium">
                  {new Date().toLocaleString('es-CR')}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">
            Hemos enviado un recibo a su correo electrónico.
          </p>
          <button 
            onClick={handleContinue}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Continuar a mi cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
