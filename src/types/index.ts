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
