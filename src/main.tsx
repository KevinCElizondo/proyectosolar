import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Retrieve the Sandbox Client ID from environment variables
const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", // Use "test" as fallback if not found
    currency: "USD", // You can change this to your desired currency
    intent: "capture",
};

createRoot(document.getElementById("root")!).render(
    <PayPalScriptProvider options={initialOptions}>
        <App />
    </PayPalScriptProvider>
);
