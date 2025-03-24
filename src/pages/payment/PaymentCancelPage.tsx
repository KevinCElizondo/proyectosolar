import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Página mostrada cuando un usuario cancela un pago con PayPal
 * Ofrece opciones para volver a intentar o elegir otro método de pago
 */
const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Volver a la página de checkout
    navigate('/checkout');
  };

  const handleGoToInvoices = () => {
    // Ir a la sección de facturación
    navigate('/facturacion');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <div className="text-yellow-500 text-5xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Pago cancelado</h1>
          <p className="text-gray-600 mt-2">
            Ha cancelado el proceso de pago. Su orden no ha sido procesada.
          </p>
        </div>
        
        <div className="border-t border-gray-200 py-4 my-4">
          <h2 className="font-semibold text-gray-700 mb-3">¿Qué desea hacer ahora?</h2>
          <p className="text-gray-600 text-sm mb-4">
            Puede intentar nuevamente el pago o elegir otro método.
          </p>
        </div>
        
        <div className="space-y-3 mt-6">
          <button 
            onClick={handleRetry}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Intentar nuevamente
          </button>
          
          <button 
            onClick={handleGoToInvoices}
            className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Ir a Facturación
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-white text-gray-500 hover:text-gray-700 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
