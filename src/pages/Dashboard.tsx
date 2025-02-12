import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';

export default function Dashboard() {
    const { user } = useAuth();

    const stats = [
        { name: 'Proyectos Activos', value: '12' },
        { name: 'Cotizaciones Pendientes', value: '4' },
        { name: 'Facturas por Cobrar', value: '3' },
        { name: 'Inventario Bajo', value: '5' },
    ];

    const recentProjects = [
        {
            id: '1',
            name: 'Instalación Residencial Solar',
            status: 'in_progress',
            date: '2024-02-10',
        },
        {
            id: '2',
            name: 'Mantenimiento Paneles Comerciales',
            status: 'pending',
            date: '2024-02-09',
        },
        {
            id: '3',
            name: 'Ampliación Sistema Industrial',
            status: 'completed',
            date: '2024-02-08',
        },
    ];

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Bienvenido, {user?.fullName}
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Stats */}
                <div className="mt-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.name}
                                className="bg-white overflow-hidden shadow rounded-lg"
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-1">
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {stat.name}
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                {stat.value}
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Proyectos Recientes
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul role="list" className="divide-y divide-gray-200">
                                {recentProjects.map((project) => (
                                    <li key={project.id}>
                                        <Link
                                            to={ROUTES.PROJECT_DETAIL.replace(':id', project.id)}
                                            className="block hover:bg-gray-50"
                                        >
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium text-blue-600 truncate">
                                                        {project.name}
                                                    </div>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}
                                                        >
                                                            {project.status === 'completed' ? 'Completado' :
                                                             project.status === 'in_progress' ? 'En Progreso' :
                                                             'Pendiente'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            Última actualización: {project.date}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
