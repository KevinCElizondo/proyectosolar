
import axios from 'axios';
import { API_URL } from '../config/constants';
import type { ApiResponse, InvoiceDetails, Payment, Certificate } from '../types';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Treasury API endpoints
export const treasuryApi = {
    generateInvoice: async (data: Partial<InvoiceDetails>): Promise<ApiResponse<InvoiceDetails>> => {
        try {
            const response = await api.post('/invoices/generate', data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error generating invoice:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error generating invoice' 
            };
        }
    },

    checkInvoiceStatus: async (key: string): Promise<ApiResponse<string>> => {
        try {
            const response = await api.get(`/invoices/status/${key}`);
            return { success: true, data: response.data.status };
        } catch (error) {
            console.error('Error checking invoice status:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error checking status' 
            };
        }
    }
};

// Payment API endpoints
export const paymentApi = {
    createPayment: async (data: Partial<Payment>): Promise<ApiResponse<Payment>> => {
        try {
            const response = await api.post('/payments', data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating payment:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error creating payment' 
            };
        }
    },

    getPaymentStatus: async (paymentId: string): Promise<ApiResponse<string>> => {
        try {
            const response = await api.get(`/payments/${paymentId}/status`);
            return { success: true, data: response.data.status };
        } catch (error) {
            console.error('Error getting payment status:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error checking payment status' 
            };
        }
    }
};

// Certificate management
export const certificateApi = {
    uploadCertificate: async (file: File): Promise<ApiResponse<Certificate>> => {
        try {
            const formData = new FormData();
            formData.append('certificate', file);
            const response = await api.post('/certificates/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error uploading certificate:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error uploading certificate' 
            };
        }
    },

    listCertificates: async (): Promise<ApiResponse<Certificate[]>> => {
        try {
            const response = await api.get('/certificates');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error listing certificates:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error listing certificates' 
            };
        }
    }
};

export default api;
