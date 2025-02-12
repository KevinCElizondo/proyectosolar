import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';

interface Invoice {
    id: string;
    projectName: string;
    client: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    dueDate: string;
    invoiceNumber: string;
}

export default function Invoices() {
    const [invoices] = useState<Invoice[]>([
        {
            id: '1',
            projectName: 'Instalación Solar Residencial',
            client: 'Roberto Sánchez',
            amount: 4500000,
            status: 'pending',
            dueDate: '2024-02-28',
            invoiceNumber: 'INV-2024-001',
        },
        {
            id: '2',
            projectName: 'Mantenimiento Sistema Comercial',
            client: 'Oficinas XYZ',
            amount: 850000,
            status: 'paid',
            dueDate: '2024-02-15',
            invoiceNumber: 'INV-2024-002',
        },
        {
            id: '3',
            projectName: 'Ampliación Sistema Industrial',
            client: 'Fábrica ABC',
            amount: 12500000,
            status: 'overdue',
            dueDate: '2024-02-01',
            invoiceNumber: 'INV-2024-003',
        },
    ]);

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Invoice['status']) => {
        switch (status) {
            case 'paid':
                return 'Pagada';
            case 'pending':
                return 'Pendiente';
            case 'overdue':
                return 'Vencida';
            case 'cancelled':
                return 'Cancelada';
            default:
                return status;
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Facturas</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Lista de todas las facturas emitidas a clientes.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Nueva Factura
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Número de Factura
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Proyecto
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Cliente
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Monto
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Estado
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Fecha Vencimiento
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Acciones</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {invoice.invoiceNumber}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {invoice.projectName}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {invoice.client}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ₡{invoice.amount.toLocaleString()}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(invoice.status)}`}>
                                                        {getStatusText(invoice.status)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        to={`${ROUTES.INVOICES}/${invoice.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Ver detalles
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
