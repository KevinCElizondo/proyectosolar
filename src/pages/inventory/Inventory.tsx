import { useState } from 'react';

interface InventoryItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    category: string;
    supplier: string;
    lastUpdated: string;
}

export default function Inventory() {
    const [inventory] = useState<InventoryItem[]>([
        {
            id: '1',
            name: 'Panel Solar 400W',
            description: 'Panel solar monocristalino de alta eficiencia',
            quantity: 50,
            unitPrice: 250000,
            category: 'Paneles',
            supplier: 'SolarTech Inc.',
            lastUpdated: '2024-02-10',
        },
        {
            id: '2',
            name: 'Inversor 5kW',
            description: 'Inversor híbrido para sistemas residenciales',
            quantity: 15,
            unitPrice: 850000,
            category: 'Inversores',
            supplier: 'PowerMax',
            lastUpdated: '2024-02-09',
        },
        {
            id: '3',
            name: 'Batería Litio 10kWh',
            description: 'Batería de litio para almacenamiento',
            quantity: 8,
            unitPrice: 1500000,
            category: 'Baterías',
            supplier: 'EnergyStore',
            lastUpdated: '2024-02-08',
        },
    ]);

    const getLowStockStatus = (quantity: number) => {
        if (quantity <= 5) {
            return 'bg-red-100 text-red-800';
        } else if (quantity <= 10) {
            return 'bg-yellow-100 text-yellow-800';
        }
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Inventario</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Lista de todos los productos y equipos disponibles en inventario.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Agregar Producto
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
                                                Producto
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Descripción
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Cantidad
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Precio Unitario
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Categoría
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Proveedor
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Última Actualización
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {inventory.map((item) => (
                                            <tr key={item.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {item.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {item.description}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getLowStockStatus(item.quantity)}`}>
                                                        {item.quantity} unidades
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ₡{item.unitPrice.toLocaleString()}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {item.category}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {item.supplier}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(item.lastUpdated).toLocaleDateString()}
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
