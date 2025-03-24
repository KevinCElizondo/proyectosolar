import React, { useState } from 'react';
import PayPalButton from '../../components/PaymentButton/PayPalButton';
import { useNavigate } from 'react-router-dom';

// Planes disponibles para el componente de facturación de Solar Fluidity
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: 25,
    features: [
      'Facturación electrónica offline (50 facturas/mes)',
      'Gestión de proyectos solares (2 proyectos)',
      'Automatizaciones básicas con n8n'
    ],
    recommended: false
  },
  {
    id: 'professional',
    name: 'Plan Profesional',
    price: 50,
    features: [
      'Facturación electrónica offline (150 facturas/mes)',
      'Gestión de proyectos solares (10 proyectos)',
      'Automatizaciones avanzadas con n8n',
      'Soporte prioritario'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Plan Empresarial',
    price: 100,
    features: [
      'Facturación electrónica offline (ilimitada)',
      'Gestión de proyectos solares (ilimitados)',
      'Automatizaciones con n8n personalizadas',
      'Soporte 24/7',
      'API access'
    ],
    recommended: false
  }
];

const CheckoutPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1]); // Plan profesional por defecto
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlanSelect = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    setSelectedPlan(plan);
    setErrorMessage(null);
  };

  const handlePaymentSuccess = (orderId: string) => {
    console.log('Pago completado con éxito:', orderId);
    // Normalmente aquí podrías registrar la suscripción en tu base de datos
    // Luego rediriges al usuario a la página de éxito con el ID de la orden
    navigate(`/payment/success?orderId=${orderId}`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Error en el pago:', error);
    setLoading(false);
    setErrorMessage('Ha ocurrido un error al procesar el pago. Por favor, intente de nuevo.');
  };

  const handlePaymentCancel = () => {
    console.log('Pago cancelado por el usuario');
    setLoading(false);
    navigate('/payment/cancel');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Suscripción a Solar Fluidity
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Elija el plan que mejor se adapte a las necesidades de su empresa
          </p>
        </div>

        {/* Selección de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`
                rounded-lg shadow-md overflow-hidden
                ${selectedPlan.id === plan.id 
                  ? 'ring-2 ring-blue-500 bg-white transform scale-105 z-10' 
                  : 'bg-white hover:shadow-lg transition-transform cursor-pointer'}
              `}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.recommended && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                  Recomendado
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">/mes</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de compra */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Resumen de su compra</h3>
          </div>
          <div className="px-6 py-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Plan seleccionado:</span>
              <span className="font-medium">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Precio mensual:</span>
              <span className="font-medium">${selectedPlan.price} USD</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Impuestos:</span>
              <span className="font-medium">$0.00 USD</span>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold">${selectedPlan.price} USD</span>
            </div>
          </div>
        </div>

        {/* Sección de pago */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Método de pago</h3>
          </div>
          <div className="px-6 py-6">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            
            <div className="mb-6">
              <p className="mb-4 text-gray-600">
                Seleccione un método de pago para continuar con su suscripción a Solar Fluidity.
              </p>
              
              <div className="max-w-sm mx-auto">
                <PayPalButton 
                  amount={selectedPlan.price}
                  description={`Solar Fluidity - ${selectedPlan.name} (Suscripción mensual)`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={handlePaymentCancel}
                  className="mt-4"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mt-6">
              <p>
                Al completar la compra, acepta nuestros 
                <a href="/terms" className="text-blue-500 hover:underline ml-1">
                  Términos de Servicio
                </a> 
                <span className="mx-1">y</span>
                <a href="/privacy" className="text-blue-500 hover:underline">
                  Política de Privacidad
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
