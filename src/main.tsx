import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { env } from './config/environment'; // Import centralized env config

// Determine PayPal Client ID based on environment
const paypalClientId = env.NODE_ENV === 'development'
  ? env.PAYPAL_SANDBOX_CLIENT_ID
  : env.PAYPAL_LIVE_CLIENT_ID;

const initialOptions = {
    clientId: paypalClientId || "test", // Use configured ID or fallback to "test"
    currency: "USD", // Default currency
    intent: "capture", // Default intent
};

createRoot(document.getElementById("root")!).render(
    <PayPalScriptProvider options={initialOptions}>
        <App />
    </PayPalScriptProvider>
);
