import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';

interface Project {
    id: string;
    name: string;
    client: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    startDate: string;
    budget: number;
}

export default function Projects() {
    const [projects] = useState<Project[]>([
        {
            id: '1',
            name: 'Instalación Residencial Solar',
            client: 'Juan Pérez',
            status: 'in_progress',
            startDate: '2024-02-01',
            budget: 5000000,
        },
        {
            id: '2',
            name: 'Mantenimiento Paneles Comerciales',
            client: 'Comercial SA',
            status: 'pending',
            startDate: '2024-02-15',
            budget: 1500000,
        },
        {
            id: '3',
            name: 'Ampliación Sistema Industrial',
            client: 'Industrias XYZ',
            status: 'completed',
            startDate: '2024-01-20',
            budget: 12000000,
        },
    ]);

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Project['status']) => {
        switch (status) {
            case 'completed':
                return 'Completado';
            case 'in_progress':
                return 'En Progreso';
            case 'pending':
                return 'Pendiente';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Lista de todos los proyectos solares activos y completados.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Nuevo Proyecto
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
                                                Nombre
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Cliente
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Estado
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Fecha Inicio
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Presupuesto
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Acciones</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {projects.map((project) => (
                                            <tr key={project.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {project.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {project.client}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(project.status)}`}>
                                                        {getStatusText(project.status)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(project.startDate).toLocaleDateString()}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ₡{project.budget.toLocaleString()}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        to={`${ROUTES.PROJECTS}/${project.id}`}
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
