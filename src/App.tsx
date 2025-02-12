import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROUTES } from './config/constants';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import Quotations from './pages/quotations/Quotations';
import QuotationDetail from './pages/quotations/QuotationDetail';
import Inventory from './pages/inventory/Inventory';
import Invoices from './pages/invoices/Invoices';
import InvoiceDetail from './pages/invoices/InvoiceDetail';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} />;
    }

    return <MainLayout>{children}</MainLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (user) {
        return <Navigate to={ROUTES.DASHBOARD} />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path={ROUTES.LOGIN}
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path={ROUTES.REGISTER}
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Private Routes */}
                        <Route
                            path={ROUTES.DASHBOARD}
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.PROJECTS}
                            element={
                                <PrivateRoute>
                                    <Projects />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.PROJECT_DETAIL}
                            element={
                                <PrivateRoute>
                                    <ProjectDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.QUOTATIONS}
                            element={
                                <PrivateRoute>
                                    <Quotations />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.QUOTATION_DETAIL}
                            element={
                                <PrivateRoute>
                                    <QuotationDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.INVENTORY}
                            element={
                                <PrivateRoute>
                                    <Inventory />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.INVOICES}
                            element={
                                <PrivateRoute>
                                    <Invoices />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.INVOICE_DETAIL}
                            element={
                                <PrivateRoute>
                                    <InvoiceDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.SETTINGS}
                            element={
                                <PrivateRoute>
                                    <Settings />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path={ROUTES.PROFILE}
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />

                        {/* Default Route */}
                        <Route
                            path="/"
                            element={<Navigate to={ROUTES.DASHBOARD} replace />}
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
