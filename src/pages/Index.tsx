
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Box, BarChart, Shield, Headphones } from 'lucide-react';
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
                        <h2 className="text-lg text-primary mb-2">Revoluciona tu Empresa Solar</h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                            Gestión integral para proyectos solares. Simplifica tus cotizaciones, 
                            inventario y facturación en una sola plataforma.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Inicia tu Prueba
                            </Button>
                            <Button size="lg" variant="outline">
                                Ver Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-dark-lighter">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Características Principales de SolarFluidity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <Box className="w-12 h-12 text-purple-500" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Gestión de Inventario</h3>
                                    <p className="text-gray-400">
                                        Control total y en tiempo real de paneles y equipos solares. 
                                        Automatización para evitar faltantes o excesos.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <BarChart className="w-12 h-12 text-purple-500" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Cotizaciones Profesionales</h3>
                                    <p className="text-gray-400">
                                        Creación de propuestas personalizadas e integraciones de cálculos 
                                        de costos y descuentos.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <Shield className="w-12 h-12 text-purple-500" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Gestión Financiera</h3>
                                    <p className="text-gray-400">
                                        Control de transacciones y pagos desde un solo lugar. Integración 
                                        con pasarelas de pago y sistemas de facturación.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-dark border-gray-800">
                            <div className="flex gap-4">
                                <Headphones className="w-12 h-12 text-purple-500" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Soporte Premium</h3>
                                    <p className="text-gray-400">
                                        Acompañamiento especializado y dedicado. Garantía de operación 
                                        sin contratiempos.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Planes y Precios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 bg-dark border-gray-800">
                            <h3 className="text-xl font-bold mb-4">Plan Básico</h3>
                            <div className="text-3xl font-bold text-primary mb-6">$99<span className="text-lg text-gray-400">/mes</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Gestión de inventario básico
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Cotizaciones ilimitadas
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Soporte por email
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
                                    Inventario avanzado
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Cotizaciones personalizadas
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Soporte prioritario
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
                                    Características a medida
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Integración con ERP
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Soporte 24/7
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
            <section className="py-20 bg-dark-lighter">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Recursos y Artículos</h2>
                    <p className="text-center text-gray-400 mb-12">
                        Mantente al día con las últimas tendencias en energía solar
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-dark border-gray-800">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Energía Solar en Costa Rica</h3>
                                <p className="text-gray-400 mb-4">
                                    Datos sobre oportunidades del mercado solar en 2024.
                                </p>
                                <Link to={ROUTES.HOME} className="text-primary hover:underline">
                                    Leer más
                                </Link>
                            </div>
                        </Card>
                        <Card className="bg-dark border-gray-800">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Optimiza tu Negocio Solar</h3>
                                <p className="text-gray-400 mb-4">
                                    Estrategias para mejorar la eficiencia operativa.
                                </p>
                                <Link to={ROUTES.HOME} className="text-primary hover:underline">
                                    Leer más
                                </Link>
                            </div>
                        </Card>
                        <Card className="bg-dark border-gray-800">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Guía de Instalación Solar</h3>
                                <p className="text-gray-400 mb-4">
                                    Mejores prácticas para instalaciones solares.
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
            <section className="py-20">
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
            <footer className="py-8 text-center text-gray-400">
                <p>© 2025 SolarFluidity. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
