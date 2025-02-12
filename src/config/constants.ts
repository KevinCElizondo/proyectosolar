export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    PROJECT_DETAIL: '/projects/:id',
    QUOTATIONS: '/quotations',
    QUOTATION_DETAIL: '/quotations/:id',
    INVENTORY: '/inventory',
    INVOICES: '/invoices',
    INVOICE_DETAIL: '/invoices/:id',
    SETTINGS: '/settings',
    PROFILE: '/profile',
} as const;

export const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
} as const;

export const PAGE_SIZES = [10, 20, 50, 100] as const;

export const DATE_FORMAT = 'dd/MM/yyyy';
export const CURRENCY = 'CRC';
export const TIMEZONE = 'America/Costa_Rica';
