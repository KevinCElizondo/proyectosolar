// Tipos para Usuario
export interface User {
    id: string;
    email: string;
    fullName: string;
    companyName?: string;
    role: 'admin' | 'user' | 'technician';
    createdAt: Date;
    updatedAt: Date;
}

// Tipos para Proyecto
export interface Project {
    id: string;
    userId: string;
    name: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos para Cotización
export interface Quotation {
    id: string;
    projectId: string;
    totalAmount: number;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    validUntil: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos para Inventario
export interface InventoryItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos para Factura
export interface Invoice {
    id: string;
    projectId: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    dueDate: Date;
    xmlUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// New types for the expanded system
export interface Certificate {
    id: string;
    name: string;
    file: Uint8Array;
    createdAt: Date;
}

export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    paymentMethod: 'paypal' | 'credit_card' | 'bank_transfer';
    status: 'pending' | 'completed' | 'failed';
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface InvoiceDetails {
    key: string;
    signedXml: string;
    status: 'pending' | 'accepted' | 'rejected';
    userId: string;
    issuedAt: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface TreasuryIntegrationConfig {
    certificateId: string;
    branch: string;
    terminal: string;
    documentType: string;
    situation: string;
}
