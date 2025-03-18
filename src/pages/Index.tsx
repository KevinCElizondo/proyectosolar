
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Zap, ShieldCheck, LineChart, Building2, Bolt, Cpu, FileOutput } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import ParticleBackground from '@/components/ParticleBackground';
import Logo from '@/components/Logo';

export default function Index() {
    return (
        <div className="min-h-screen bg-dark text-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <ParticleBackground />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center mb-8">
                            <Logo />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Solar Fluidity</h1>
                        <h2 className="text-xl text-primary mb-2">Gestiona tus Proyectos y Facturas Electrónicas Offline en un Solo Lugar</h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Plataforma especializada para empresas de proyectos solares y servicios electromecánicos. 
                            Facturación electrónica offline, automatizaciones inteligentes y gestión completa de proyectos.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Inicia tu Prueba
                            </Button>
                            <Button size="lg" variant="outline">
                                Ver Planes
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-dark-lighter">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Características Principales de Solar Fluidity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <FileText className="w-12 h-12 text-primary" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Facturación Electrónica Offline</h3>
                                    <p className="text-gray-400">
                                        Genera facturas electrónicas XML/PDF válidas sin necesidad de conexión directa 
                                        con la autoridad tributaria. Mantén el control total de tu proceso fiscal.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <Building2 className="w-12 h-12 text-primary" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Gestión de Proyectos Especializada</h3>
                                    <p className="text-gray-400">
                                        Planificación y seguimiento de proyectos solares y electromecánicos. Control de costos, 
                                        hitos y calendario de actividades en una interfaz intuitiva.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <Zap className="w-12 h-12 text-primary" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Automatizaciones Inteligentes</h3>
                                    <p className="text-gray-400">
                                        Flujos de trabajo automatizados con n8n para recordatorios de pago, reportes 
                                        y notificaciones. Ahorra tiempo y mantén todo bajo control.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <LineChart className="w-12 h-12 text-primary" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Reportes Financieros</h3>
                                    <p className="text-gray-400">
                                        Análisis detallados de ingresos, facturas pendientes de cobro y 
                                        rentabilidad por proyecto. Toma decisiones basadas en datos reales.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
            
            {/* How It Works */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Cómo Funciona la Facturación Offline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <Card className="p-6 bg-dark border-gray-800 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl font-bold">1</div>
                            <h3 className="text-xl font-semibold mb-4 mt-4">Crea tu Factura</h3>
                            <p className="text-gray-400">
                                Completa los datos del cliente, servicios o productos, impuestos y totales en la
                                interfaz intuitiva.
                            </p>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl font-bold">2</div>
                            <h3 className="text-xl font-semibold mb-4 mt-4">Genera XML/PDF</h3>
                            <p className="text-gray-400">
                                Solar Fluidity valida y genera los documentos fiscales de acuerdo a la normativa
                                vigente, sin conexión directa con Hacienda.
                            </p>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl font-bold">3</div>
                            <h3 className="text-xl font-semibold mb-4 mt-4">Descarga y Envía</h3>
                            <p className="text-gray-400">
                                Descarga los archivos generados y envíalos a la autoridad tributaria usando
                                tu método preferido. Mantén el control de tu proceso fiscal.
                            </p>
                        </Card>
                    </div>
                    <div className="text-center">
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            Ver Demostración
                        </Button>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-dark-lighter">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Planes y Precios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 bg-dark border-gray-800">
                            <h3 className="text-xl font-bold mb-4">Plan Básico</h3>
                            <div className="text-3xl font-bold text-primary mb-6">$99<span className="text-lg text-gray-400">/mes</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Hasta 50 facturas mensuales
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    5 proyectos activos
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Reportes básicos
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    1 usuario
                                </li>
                            </ul>
                            <Button className="w-full">Seleccionar Plan</Button>
                        </Card>
                        
                        <Card className="p-8 bg-dark border-gray-800 transform scale-105 shadow-xl">
                            <h3 className="text-xl font-bold mb-4">Plan Profesional</h3>
                            <div className="text-3xl font-bold text-primary mb-6">$199<span className="text-lg text-gray-400">/mes</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Facturas ilimitadas
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    20 proyectos activos
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Automatizaciones avanzadas
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Hasta 5 usuarios
                                </li>
                            </ul>
                            <Button className="w-full bg-primary hover:bg-primary/90">Seleccionar Plan</Button>
                        </Card>

                        <Card className="p-8 bg-dark border-gray-800">
                            <h3 className="text-xl font-bold mb-4">Plan Empresarial</h3>
                            <div className="text-3xl font-bold text-primary mb-6">Personalizado</div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Módulos especializados
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Proyectos ilimitados
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Soporte prioritario
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Usuarios ilimitados
                                </li>
                            </ul>
                            <Button className="w-full">Contactar</Button>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Recursos y Artículos</h2>
                    <p className="text-center text-gray-400 mb-12">
                        Información útil sobre facturación electrónica offline y gestión de proyectos
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-dark border-gray-800">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Facturación Electrónica en Costa Rica</h3>
                                <p className="text-gray-400 mb-4">
                                    Todo lo que necesitas saber sobre normativa fiscal y obligaciones tributarias.
                                </p>
                                <Link to={ROUTES.HOME} className="text-primary hover:underline">
                                    Leer más
                                </Link>
                            </div>
                        </Card>
                        <Card className="bg-dark border-gray-800">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Automatizaciones con n8n</h3>
                                <p className="text-gray-400 mb-4">
                                    Cómo aprovechar la potencia de los flujos de trabajo automatizados para tu negocio.
                                </p>
                                <Link to={ROUTES.HOME} className="text-primary hover:underline">
                                    Leer más
                                </Link>
                            </div>
                        </Card>
                        <Card className="bg-dark border-gray-800">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Proyectos Solares y Electromecánicos</h3>
                                <p className="text-gray-400 mb-4">
                                    Mejores prácticas para la gestión eficiente de proyectos técnicos.
                                </p>
                                <Link to={ROUTES.HOME} className="text-primary hover:underline">
                                    Leer más
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-dark-lighter">
                <div className="container mx-auto px-4 max-w-xl">
                    <Card className="p-8 bg-dark border-gray-800">
                        <h2 className="text-3xl font-bold text-center mb-8">Contacto</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Nombre
                                </label>
                                <Input id="name" type="text" className="bg-dark-lighter" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <Input id="email" type="email" className="bg-dark-lighter" />
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium mb-2">
                                    Empresa
                                </label>
                                <Input id="company" type="text" className="bg-dark-lighter" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Mensaje
                                </label>
                                <Textarea id="message" className="bg-dark-lighter" rows={4} />
                            </div>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                Enviar Mensaje
                            </Button>
                        </form>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-dark text-center">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center mb-8">
                        <Logo />
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        <Link to={ROUTES.HOME} className="text-gray-400 hover:text-primary">
                            Inicio
                        </Link>
                        <Link to={ROUTES.HOME} className="text-gray-400 hover:text-primary">
                            Características
                        </Link>
                        <Link to={ROUTES.HOME} className="text-gray-400 hover:text-primary">
                            Planes
                        </Link>
                        <Link to={ROUTES.HOME} className="text-gray-400 hover:text-primary">
                            Recursos
                        </Link>
                        <Link to={ROUTES.HOME} className="text-gray-400 hover:text-primary">
                            Contacto
                        </Link>
                    </div>
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} Solar Fluidity. Todos los derechos reservados.
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Link to={ROUTES.HOME} className="text-gray-400 hover:text-primary">
                            Términos de Servicio
                        </Link>
                        <Link to={ROUTES.HOME} className="text-gray-400 hover:text-primary">
                            Política de Privacidad
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
