import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';

interface Quotation {
    id: string;
    projectName: string;
    client: string;
    totalAmount: number;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    validUntil: string;
}

export default function Quotations() {
    const [quotations] = useState<Quotation[]>([
        {
            id: '1',
            projectName: 'Sistema Solar Residencial 5kW',
            client: 'María González',
            totalAmount: 3500000,
            status: 'sent',
            validUntil: '2024-03-15',
        },
        {
            id: '2',
            projectName: 'Instalación Comercial 15kW',
            client: 'Supermercados ABC',
            totalAmount: 8500000,
            status: 'approved',
            validUntil: '2024-03-01',
        },
        {
            id: '3',
            projectName: 'Mantenimiento Anual',
            client: 'Condominio El Sol',
            totalAmount: 1200000,
            status: 'draft',
            validUntil: '2024-03-30',
        },
    ]);

    const getStatusColor = (status: Quotation['status']) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'sent':
                return 'bg-blue-100 text-blue-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Quotation['status']) => {
        switch (status) {
            case 'approved':
                return 'Aprobada';
            case 'sent':
                return 'Enviada';
            case 'draft':
                return 'Borrador';
            case 'rejected':
                return 'Rechazada';
            default:
                return status;
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Cotizaciones</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Lista de todas las cotizaciones generadas para proyectos solares.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Nueva Cotización
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
                                                Proyecto
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Cliente
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Monto Total
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Estado
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Válido Hasta
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Acciones</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {quotations.map((quotation) => (
                                            <tr key={quotation.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {quotation.projectName}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {quotation.client}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ₡{quotation.totalAmount.toLocaleString()}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(quotation.status)}`}>
                                                        {getStatusText(quotation.status)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(quotation.validUntil).toLocaleDateString()}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        to={`${ROUTES.QUOTATIONS}/${quotation.id}`}
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
