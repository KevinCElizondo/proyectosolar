
// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Treasury Integration
export const TREASURY_API_URL = 'https://api.hacienda.go.cr/fe/ae';
export const TREASURY_API_VERSION = 'v1';

// Payment Integration
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_NOTIFICATIONS = import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true';

// System Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_CERTIFICATE_TYPES = ['.p12'];
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_LOCALE = 'es-CR';

// Cache Duration
export const CACHE_DURATION = {
    CERTIFICATES: 60 * 60 * 1000, // 1 hour
    INVOICE_STATUS: 5 * 60 * 1000, // 5 minutes
    PAYMENT_STATUS: 5 * 60 * 1000, // 5 minutes
};

// Error Messages
export const ERROR_MESSAGES = {
    CERTIFICATE_UPLOAD: 'Error uploading certificate. Please try again.',
    INVOICE_GENERATION: 'Error generating invoice. Please verify your data and try again.',
    PAYMENT_PROCESS: 'Error processing payment. Please try again later.',
    UNAUTHORIZED: 'Please log in to continue.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
};
