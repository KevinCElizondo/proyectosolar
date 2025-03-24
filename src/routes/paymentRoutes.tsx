import { RouteObject } from 'react-router-dom';
import CheckoutPage from '../pages/payment/CheckoutPage';
import PaymentSuccessPage from '../pages/payment/PaymentSuccessPage';
import PaymentCancelPage from '../pages/payment/PaymentCancelPage';

/**
 * Rutas para el módulo de pagos y facturación
 * Estas rutas manejan el flujo de pagos con PayPal para Solar Fluidity
 */
export const paymentRoutes: RouteObject[] = [
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/payment/success',
    element: <PaymentSuccessPage />,
  },
  {
    path: '/payment/cancel',
    element: <PaymentCancelPage />,
  }
];

export default paymentRoutes;
