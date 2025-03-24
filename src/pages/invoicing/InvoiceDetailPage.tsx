import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvoicePaymentWidget from '../../components/PaymentWidget/InvoicePaymentWidget';

// Tipo para los datos de factura
interface Invoice {
  id: string;
  clientName: string;
  clientId: string;
  invoiceNumber: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

/**
 * Página de detalle de factura electrónica
 * Muestra la información completa de una factura y permite su pago mediante PayPal
 */
const InvoiceDetailPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // En una implementación real, esta función obtendría los datos de la factura desde tu API
    const fetchInvoiceDetails = async () => {
      try {
        setLoading(true);
        // Simular una llamada a API con datos de ejemplo
        // En tu implementación real, reemplaza esto con una llamada a tu API
        setTimeout(() => {
          // Datos de ejemplo para la factura
          const mockInvoice: Invoice = {
            id: invoiceId || 'INV-001',
            clientName: 'Solar Comercial S.A.',
            clientId: 'CLIE-123',
            invoiceNumber: 'FE-2025-001',
            amount: 150.75,
            status: 'pending',
            issueDate: '2025-03-20',
            dueDate: '2025-04-20',
            items: [
              {
                description: 'Servicio de Facturación Electrónica - Plan Profesional',
                quantity: 1,
                unitPrice: 50.00,
                total: 50.00
              },
              {
                description: 'Consultoría para proyectos solares',
                quantity: 2,
                unitPrice: 45.00,
                total: 90.00
              },
              {
                description: 'Configuración de automatizaciones con n8n',
                quantity: 1,
                unitPrice: 10.75,
                total: 10.75
              }
            ]
          };
          
          setInvoice(mockInvoice);
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setError('Error al cargar los detalles de la factura');
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  const handlePaymentComplete = (orderId: string) => {
    setPaymentComplete(true);
    setPaymentId(orderId);
    
    // En una implementación real, aquí actualizarías el estado de la factura en tu base de datos
    // Por ejemplo:
    // await invoiceService.updateStatus(invoiceId, 'paid', orderId);
    
    // También podrías generar el XML de la factura electrónica
    // await invoiceService.generateInvoiceXML(invoiceId);
    
    // E incluso enviar una notificación al cliente
    // await notificationService.sendPaymentConfirmation(invoice.clientId, invoiceId);
  };

  const handleDownloadInvoice = () => {
    // En una implementación real, aquí generarías y descargarías el PDF de la factura
    alert('Descargando factura en formato PDF...');
  };
  
  const handleDownloadXML = () => {
    // En una implementación real, aquí generarías y descargarías el XML para Hacienda
    alert('Descargando archivo XML de factura electrónica...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Ha ocurrido un error</h2>
          <p className="text-gray-500 mt-2">{error || 'No se pudo encontrar la factura'}</p>
          <button 
            onClick={() => navigate('/invoices')} 
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Volver a facturas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado con información de la factura */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Factura #{invoice.invoiceNumber}
            </h1>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                invoice.status === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : invoice.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status === 'paid' 
                  ? 'Pagada' 
                  : invoice.status === 'cancelled'
                  ? 'Cancelada'
                  : 'Pendiente'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Cliente</h2>
              <p className="mt-1 text-lg font-medium text-gray-900">{invoice.clientName}</p>
              <p className="text-sm text-gray-500">ID: {invoice.clientId}</p>
            </div>
            <div className="md:text-right">
              <div className="mb-2">
                <h2 className="text-sm font-medium text-gray-500">Fecha de emisión</h2>
                <p className="mt-1 text-lg font-medium text-gray-900">{invoice.issueDate}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Fecha de vencimiento</h2>
                <p className="mt-1 text-lg font-medium text-gray-900">{invoice.dueDate}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Descargar PDF
            </button>
            <button
              onClick={handleDownloadXML}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
              Descargar XML
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Detalles de la factura */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Detalles de la factura</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio unitario
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                        Subtotal
                      </th>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        ${invoice.amount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                        Impuestos (0%)
                      </th>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        $0.00
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Total
                      </th>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-blue-600 text-right">
                        ${invoice.amount.toFixed(2)} USD
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          {/* Widget de pago */}
          <div className="md:col-span-1">
            {paymentComplete ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">¡Pago completado!</h3>
                  <p className="text-gray-600 mt-2">
                    La factura ha sido pagada exitosamente.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">ID de pago:</span>
                    <span className="font-medium">{paymentId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Monto pagado:</span>
                    <span className="font-medium">${invoice.amount.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              invoice.status === 'pending' && (
                <InvoicePaymentWidget
                  invoiceId={invoice.invoiceNumber}
                  amount={invoice.amount}
                  clientName={invoice.clientName}
                  dueDate={invoice.dueDate}
                  onPaymentComplete={handlePaymentComplete}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
