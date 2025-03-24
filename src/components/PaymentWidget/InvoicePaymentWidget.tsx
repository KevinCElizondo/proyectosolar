import React from 'react';
import { Link } from 'react-router-dom';
import PayPalButton from '../PaymentButton/PayPalButton';

interface InvoicePaymentWidgetProps {
  invoiceId: string;
  amount: number;
  clientName: string;
  dueDate: string;
  onPaymentComplete?: (paymentId: string) => void;
}

/**
 * Widget para pagar facturas en Solar Fluidity
 * Se puede integrar en la página de detalles de factura o en el dashboard de cliente
 */
const InvoicePaymentWidget: React.FC<InvoicePaymentWidgetProps> = ({
  invoiceId,
  amount,
  clientName,
  dueDate,
  onPaymentComplete
}) => {
  const handlePaymentSuccess = (orderId: string) => {
    console.log(`Pago completado para la factura ${invoiceId}. OrderID: ${orderId}`);
    if (onPaymentComplete) {
      onPaymentComplete(orderId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la factura</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Número de factura:</span>
          <span className="font-medium">{invoiceId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cliente:</span>
          <span className="font-medium">{clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fecha de vencimiento:</span>
          <span className="font-medium">{dueDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Monto a pagar:</span>
          <span className="font-bold text-blue-600">${amount.toFixed(2)} USD</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="font-medium text-gray-900 mb-4">Métodos de pago disponibles</h4>
        
        <PayPalButton
          amount={amount}
          description={`Factura #${invoiceId} - Solar Fluidity`}
          onSuccess={handlePaymentSuccess}
          className="w-full mb-4"
        />
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Solar Fluidity - Facturación Electrónica para empresas costarricenses</p>
          <p className="mt-1">
            <Link to="/help/payments" className="text-blue-500 hover:underline">
              Ayuda con tu pago
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePaymentWidget;
