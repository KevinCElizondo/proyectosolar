require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const paypal = require('@paypal/paypal-server-sdk');

const app = express();
const PORT = process.env.PORT || 4000; // Use port from .env or default to 4000

// --- CORS Configuration ---
// Allow requests only from the frontend URL specified in .env
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json()); // Parse JSON request bodies

// --- PayPal Client Setup ---
function environment() {
  const clientId = process.env.NODE_ENV === 'production' 
    ? process.env.PAYPAL_LIVE_CLIENT_ID 
    : process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.NODE_ENV === 'production' 
    ? process.env.PAYPAL_LIVE_SECRET 
    : process.env.PAYPAL_SECRET;

  if (!clientId || !clientSecret) {
    console.error('FATAL ERROR: PayPal Client ID or Secret not found in environment variables.');
    process.exit(1); // Exit if credentials are missing
  }

  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

const paypalClient = new paypal.core.PayPalHttpClient(environment());

console.log(`PayPal Environment: ${process.env.NODE_ENV || 'development'}`);
if (!process.env.PAYPAL_CLIENT_ID && process.env.NODE_ENV !== 'production') {
    console.warn('PayPal Sandbox Client ID not set in backend-api/.env');
}
if (!process.env.FRONTEND_URL) {
    console.warn('FRONTEND_URL not set in backend-api/.env. CORS might block requests.');
}


// --- API Routes ---

// Placeholder for root route
app.get('/', (req, res) => {
  res.send('Solar Fluidity Backend API is running!');
});

// Endpoint to create a PayPal order
app.post('/api/paypal/create-order', async (req, res) => {
  const { amount, currency = 'USD', description = 'Solar Fluidity Payment' } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount specified.' });
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: parseFloat(amount).toFixed(2), // Ensure correct format
      },
      description: description,
    }],
    application_context: {
      brand_name: 'Solar Fluidity',
      landing_page: 'BILLING', // Or 'LOGIN' depending on flow
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING'
    }
  });

  try {
    const response = await paypalClient.execute(request);
    console.log(`Created Order: ${response.result.id}`);
    // Return only the order ID to the frontend
    res.status(201).json({ id: response.result.id }); 
  } catch (error) {
    console.error('Error creating PayPal order:', error.message);
    // Check for specific PayPal errors if needed
    // console.error(error.statusCode);
    // console.error(JSON.stringify(error.result, null, 2));
    res.status(500).json({ message: 'Failed to create PayPal order.' });
  }
});

// Endpoint to capture a PayPal order
app.post('/api/paypal/capture-order', async (req, res) => {
  const { orderID } = req.body;

  if (!orderID) {
    return res.status(400).json({ message: 'Missing orderID in request body.' });
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.prefer("return=representation");

  try {
    const response = await paypalClient.execute(request);
    console.log(`Captured Order: ${response.result.id}, Status: ${response.result.status}`);
    
    // TODO: Add logic here to update your database (e.g., mark invoice as paid)
    // based on response.result details (like status === 'COMPLETED')

    // Return the full capture details to the frontend
    res.status(200).json(response.result); 
  } catch (error) {
    console.error('Error capturing PayPal order:', error.message);
     // Check for specific PayPal errors (e.g., order already captured)
    // console.error(error.statusCode);
    // console.error(JSON.stringify(error.result, null, 2));
    res.status(500).json({ message: 'Failed to capture PayPal order.' });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend API server listening on http://localhost:${PORT}`);
  console.log(`Accepting requests from: ${process.env.FRONTEND_URL || 'Not Set'}`);
});