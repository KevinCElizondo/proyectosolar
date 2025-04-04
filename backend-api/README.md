# Solar Fluidity - Backend API

This directory contains the Node.js/Express backend service responsible for handling secure interactions with external services, primarily PayPal for payment processing.

## Features

*   Provides endpoints for creating and capturing PayPal orders.
*   Handles PayPal API credentials securely using environment variables.
*   Configured for deployment on Render.

## Prerequisites

*   Node.js (v16 or later recommended)
*   npm
*   Access to the project's PayPal Developer account (for API credentials)
*   A Render account (for deployment)

## Local Setup

1.  **Navigate to the directory:**
    ```bash
    cd backend-api
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:** Copy the `.env.example` (if one exists) or create a new `.env` file in this directory (`backend-api/.env`) with the following content:
    ```dotenv
    # PayPal Credentials (Use Sandbox for local development)
    NODE_ENV=development
    PAYPAL_CLIENT_ID=YOUR_PAYPAL_SANDBOX_CLIENT_ID
    PAYPAL_SECRET=YOUR_PAYPAL_SANDBOX_SECRET

    # Server Configuration
    PORT=4000
    FRONTEND_URL=http://localhost:5173 # Adjust if your frontend runs elsewhere
    ```
    *   Replace placeholders with your actual PayPal **Sandbox** credentials.
    *   Ensure `FRONTEND_URL` matches the URL where your frontend application runs locally (needed for CORS).
4.  **Start the server:**
    ```bash
    npm start
    ```
    The API should now be running on `http://localhost:4000` (or the port specified in `.env`).

## Deployment to Render

This service is configured for deployment using Render's "Blueprint" feature via the `render.yaml` file.

1.  **Connect Repository:** Connect your GitHub/GitLab repository containing this project to Render.
2.  **Create Blueprint Service:**
    *   Go to "Blueprints" in your Render dashboard and click "New Blueprint".
    *   Select your repository. Render should automatically detect the `render.yaml` file.
    *   Review the service details (`solar-fluidity-backend`).
3.  **Configure Environment Variables (Secrets):**
    *   Before the first deployment (or in the service's "Environment" settings), you **must** add the following environment variables as **Secrets**:
        *   `PAYPAL_CLIENT_ID`: Your **Live** PayPal Client ID.
        *   `PAYPAL_SECRET`: Your **Live** PayPal Secret.
        *   `PAYPAL_LIVE_CLIENT_ID`: Your **Live** PayPal Client ID (if using explicit live vars).
        *   `PAYPAL_LIVE_SECRET`: Your **Live** PayPal Secret (if using explicit live vars).
    *   Add the following as a regular environment variable:
        *   `FRONTEND_URL`: The **public URL** of your deployed frontend application (e.g., `https://your-frontend.onrender.com`).
4.  **Deploy:** Approve the Blueprint creation or trigger a manual deploy. Render will build and deploy the service based on `render.yaml`.
5.  **Update Frontend Configuration:** Ensure the `VITE_API_URL` in your main project's `.env` file (and deployed frontend environment) points to the public URL provided by Render for this backend service (e.g., `https://solar-fluidity-backend.onrender.com`).

## API Endpoints

*   `POST /api/paypal/create-order`: Creates a PayPal order.
    *   Body: `{ "amount": number, "currency": string (optional, default 'USD'), "description": string (optional) }`
    *   Returns: `{ "id": string }` (PayPal Order ID)
*   `POST /api/paypal/capture-order`: Captures a previously created PayPal order.
    *   Body: `{ "orderID": string }`
    *   Returns: PayPal capture details object.

## Notes

*   The server uses the `NODE_ENV` variable to switch between PayPal Sandbox (`development`) and Live (`production`) environments. `render.yaml` sets this to `production` automatically.
*   CORS is configured to only allow requests from the `FRONTEND_URL` specified in the environment variables.