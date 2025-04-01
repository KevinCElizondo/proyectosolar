import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, LayoutList, Workflow, Database, Clock, Mail } from 'lucide-react';

/**
 * Componente que muestra la sección de automatización con n8n
 * Destaca las capacidades de automatización de Solar Fluidity
 */
const AutomationSection: React.FC = () => {
  return (
    <section className="py-20 bg-dark-lighter">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Automatizaciones Poderosas con n8n</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Conecta Solar Fluidity con más de 200 servicios y automatiza tus procesos 
            de negocio con flujos de trabajo personalizados.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-dark border-gray-800">
            <div className="flex gap-4">
              <LayoutList className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Plantillas Predefinidas</h3>
                <p className="text-gray-400 mb-4">
                  Comienza rápidamente con nuestras plantillas predefinidas para los casos de uso más comunes en empresas solares.
                </p>
                <ul className="text-gray-400 list-disc list-inside">
                  <li>Notificaciones automáticas de facturas</li>
                  <li>Seguimiento de proyectos</li>
                  <li>Alertas de mantenimiento</li>
                  <li>Recordatorios de citas</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark border-gray-800">
            <div className="flex gap-4">
              <Workflow className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Constructor Visual de Flujos</h3>
                <p className="text-gray-400 mb-4">
                  Crea tus propios flujos de trabajo sin escribir código, con una interfaz visual fácil de usar.
                </p>
                <ul className="text-gray-400 list-disc list-inside">
                  <li>Interfaz drag-and-drop</li>
                  <li>Lógica condicional avanzada</li>
                  <li>Transformadores de datos</li>
                  <li>Pruebas en tiempo real</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark border-gray-800">
            <div className="flex gap-4">
              <Database className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Integraciones Ilimitadas</h3>
                <p className="text-gray-400 mb-4">
                  Conecta Solar Fluidity con tus herramientas y servicios favoritos.
                </p>
                <ul className="text-gray-400 list-disc list-inside">
                  <li>Google Workspace (Gmail, Calendar, Drive)</li>
                  <li>CRMs (HubSpot, Salesforce)</li>
                  <li>Servicios financieros</li>
                  <li>Plataformas de comunicación</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark border-gray-800">
            <div className="flex gap-4">
              <Mail className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Notificaciones Inteligentes</h3>
                <p className="text-gray-400 mb-4">
                  Mantén a todos informados con notificaciones contextuales automáticas.
                </p>
                <ul className="text-gray-400 list-disc list-inside">
                  <li>Alertas por correo electrónico</li>
                  <li>Notificaciones por SMS</li>
                  <li>Actualizaciones de estado</li>
                  <li>Recordatorios programados</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/20 to-blue-900/20 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Caso de Uso: Automatización de Servicio Post-Instalación</h3>
              <p className="text-gray-300 mb-4">
                Después de completar una instalación solar, nuestro flujo de trabajo automatizado:
              </p>
              <ol className="text-gray-300 list-decimal list-inside space-y-2">
                <li>Genera la factura electrónica final</li>
                <li>Envía un correo de agradecimiento al cliente</li>
                <li>Programa una visita de seguimiento a los 30 días</li>
                <li>Crea recordatorios de mantenimiento periódicos</li>
                <li>Activa un flujo de referidos con descuentos</li>
              </ol>
            </div>
            <div className="flex-shrink-0">
              <Clock className="w-24 h-24 text-primary" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg font-semibold">
            <Zap className="mr-2 h-5 w-5" />
            Descubre Todas las Posibilidades
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;
