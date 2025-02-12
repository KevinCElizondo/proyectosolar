import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/constants';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { user, logout } = useAuth();

    const menuItems = [
        { label: 'Dashboard', path: ROUTES.DASHBOARD },
        { label: 'Proyectos', path: ROUTES.PROJECTS },
        { label: 'Cotizaciones', path: ROUTES.QUOTATIONS },
        { label: 'Inventario', path: ROUTES.INVENTORY },
        { label: 'Facturas', path: ROUTES.INVOICES },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link to={ROUTES.HOME}>
                                    <img
                                        className="h-8 w-auto"
                                        src="/logo.svg"
                                        alt="SolarFluidity"
                                    />
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center">
                            <div className="ml-3 relative">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.fullName}
                                    </span>
                                    <button
                                        onClick={() => logout()}
                                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-sm mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} SolarFluidity. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
