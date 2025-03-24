import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Zap, LineChart, Building2 } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import OptimizedBackground from '@/components/OptimizedBackground';
import Logo from '@/components/Logo';
import { useRef, memo } from 'react';
import LazySection from '@/components/lazy-section';
import { OptimizedImage } from '@/components/ui/optimized-image';
import AmazonAffiliateSection from '@/components/AmazonAffiliateSection';

// Sección de características memoizada para mejorar el rendimiento
const MemoizedFeatureSection = memo(() => (
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
                                Flujos de trabajo automatizados para recordatorios de pago, generación de reportes 
                                y notificaciones programadas. Ahorra tiempo y mantén todo bajo control.
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
));

MemoizedFeatureSection.displayName = 'MemoizedFeatureSection';

// Función principal memoizada para evitar re-renders innecesarios
function Index() {
    // Referencia al contenedor de la sección hero
    const heroSectionRef = useRef<HTMLDivElement>(null);
    
    return (
        <div className="min-h-screen bg-dark text-white">
            {/* Hero Section */}
            <section 
                ref={heroSectionRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ position: 'relative' }}
            >
                {/* Fondo optimizado con elementos estáticos */}
                <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    <OptimizedBackground 
                        backgroundColor="bg-dark" 
                        containerRef={heroSectionRef} 
                    />
                </div>
                
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center justify-center"
                    >
                        {/* Logo animado */}
                        <div className="flex justify-center mb-8">
                            <Logo />
                        </div>
                        
                        {/* Contenido principal centrado */}
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            Solar Fluidity
                        </motion.h1>
                        
                        <motion.h2 
                            className="text-xl md:text-2xl text-primary mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Gestiona tus Proyectos y Facturas Electrónicas Offline en un Solo Lugar
                        </motion.h2>
                        
                        <motion.p 
                            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            Plataforma especializada para empresas de proyectos solares y servicios electromecánicos. 
                            Facturación electrónica offline, automatizaciones inteligentes y gestión completa de proyectos.
                        </motion.p>
                        
                        {/* Botones de llamada a la acción */}
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <Button 
                                size="lg" 
                                className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                            >
                                Inicia tu Prueba
                            </Button>
                            
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="w-full sm:w-auto px-8 text-base border-gray-500 hover:bg-gray-800 transition-all duration-300"
                            >
                                Descubre más funcionalidades
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section - Lazy Loaded */}
            <LazySection delay={0.2} className="w-full">
                <MemoizedFeatureSection />
            </LazySection>
            
            {/* How It Works - Lazy Loaded */}
            <LazySection delay={0.2} className="w-full">
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
                                    La plataforma genera automáticamente los documentos electrónicos en formato XML y PDF
                                    sin necesidad de conexión a internet.
                                </p>
                            </Card>
                            <Card className="p-6 bg-dark border-gray-800 relative overflow-hidden">
                                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl font-bold">3</div>
                                <h3 className="text-xl font-semibold mb-4 mt-4">Envía cuando quieras</h3>
                                <p className="text-gray-400">
                                    Cuando dispongas de conexión, envía los documentos previamente generados a Hacienda y
                                    a tus clientes con un solo clic.
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>
            </LazySection>

            {/* Pricing Section - Lazy Loaded */}
            <LazySection delay={0.2} className="w-full">
                <section className="py-20 bg-dark-lighter">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Planes y Precios</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="p-8 bg-dark border-gray-800 transition-transform hover:translate-y-[-10px]">
                                <div className="absolute top-0 right-0 bg-green-500 text-dark px-4 py-1 rounded-bl-md font-semibold text-sm">
                                    Gratuito
                                </div>
                                <h3 className="text-xl font-bold mb-2">Plan Freemium</h3>
                                <p className="text-sm text-gray-400 mb-4">Para emprendedores o técnicos independientes</p>
                                <div className="text-3xl font-bold text-primary mb-6">$0<span className="text-lg text-gray-400">/mes</span></div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> 15 facturas electrónicas/mes (XML/PDF)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> 3 proyectos activos
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> 1 usuario + soporte por correo (48h)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> Reportes básicos (solo PDF)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-red-500">✗</span> API para integraciones
                                    </li>
                                </ul>
                                <Button variant="outline" className="w-full hover:bg-primary hover:text-white">Comenzar Gratis</Button>
                            </Card>
                            <Card className="p-8 bg-dark border-gray-800 transform scale-105 shadow-xl relative transition-transform hover:translate-y-[-10px]">
                                <div className="absolute top-0 right-0 bg-blue-500 text-dark px-4 py-1 rounded-bl-md font-semibold">Más Popular</div>
                                <h3 className="text-xl font-bold mb-2">Plan Profesional</h3>
                                <p className="text-sm text-gray-400 mb-4">Para empresas con proyectos industriales o contratos gubernamentales</p>
                                <div className="text-3xl font-bold text-primary mb-6">$89<span className="text-lg text-gray-400">/mes</span></div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> Facturas y proyectos ilimitados
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> API premium (20 llamadas/minuto + webhooks)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> 10 usuarios + permisos jerárquicos
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> Automatizaciones avanzadas
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> Soporte 24/7 con técnicos especializados
                                    </li>
                                </ul>
                                <Button className="w-full bg-primary hover:bg-primary/90">Agendar Demo + Mes Gratis</Button>
                            </Card>
                            <Card className="p-8 bg-dark border-gray-800 transition-transform hover:translate-y-[-10px] relative">
                                <div className="absolute top-0 right-0 bg-orange-500 text-dark px-4 py-1 rounded-bl-md font-semibold text-sm">
                                    Ahorro
                                </div>
                                <h3 className="text-xl font-bold mb-2">Plan Básico</h3>
                                <p className="text-sm text-gray-400 mb-4">Para PYMES con proyectos comerciales</p>
                                <div className="text-3xl font-bold text-primary mb-6">$39<span className="text-lg text-gray-400">/mes</span></div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> 50 facturas/mes (+$0.30 por adicional)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> 10 proyectos activos
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> 3 usuarios + roles básicos
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> API básica (integración con software local)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="mr-2 text-green-500">✓</span> Automatizaciones internas
                                    </li>
                                </ul>
                                <Button variant="outline" className="w-full hover:bg-primary hover:text-white">Prueba 7 Días Gratis</Button>
                            </Card>
                        </div>
                    </div>
                </section>
            </LazySection>

            {/* Resources Section - Lazy Loaded */}
            <LazySection delay={0.3} className="w-full">
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Recursos y Artículos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-dark border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="/images/article-invoicing.jpg"
                                        alt="Facturación Electrónica"
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        width={400}
                                        height={225}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">Guía Completa de Facturación Electrónica en Costa Rica</h3>
                                    <p className="text-gray-400 mb-4">
                                        Todo lo que necesitas saber sobre requisitos, procesos y mejores prácticas para cumplir con las normas
                                        tributarias.
                                    </p>
                                    <Button variant="link" className="text-primary p-0">Leer artículo →</Button>
                                </div>
                            </Card>
                            <Card className="bg-dark border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="/images/article-solar.jpg"
                                        alt="Proyectos Solares"
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        width={400}
                                        height={225}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">5 Claves para Gestionar Proyectos Solares Exitosos</h3>
                                    <p className="text-gray-400 mb-4">
                                        Estrategias y herramientas para optimizar la planificación, ejecución y seguimiento de proyectos
                                        solares.
                                    </p>
                                    <Button variant="link" className="text-primary p-0">Leer artículo →</Button>
                                </div>
                            </Card>
                            <Card className="bg-dark border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 overflow-hidden">
                                    <OptimizedImage
                                        src="/images/article-automation.jpg"
                                        alt="Automatización"
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        width={400}
                                        height={225}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">API de Solar Fluidity: Integra Tus Sistemas</h3>
                                    <p className="text-gray-400 mb-4">
                                        Guía completa para conectar tus sistemas empresariales con nuestra API y acceder
                                        a datos de facturación y proyectos en tiempo real.
                                    </p>
                                    <Button variant="link" className="text-primary p-0">Leer artículo →</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
            </LazySection>

            {/* Contact Section - Lazy Loaded */}
            <LazySection delay={0.4} className="w-full">
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
                                        Correo Electrónico
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
            </LazySection>
            
            {/* Amazon Affiliate Section - Lazy loaded */}
            <LazySection delay={0.3} className="w-full">
                <AmazonAffiliateSection />
            </LazySection>

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

// Exportamos el componente memoizado para evitar re-renders innecesarios
export default memo(Index);
