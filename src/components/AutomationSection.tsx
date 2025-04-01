import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, LayoutList, Workflow, Database, Clock, Mail, Brain, Bot, Cpu } from 'lucide-react';

/**
 * Componente que muestra la sección de automatización con agentes IA
 * Destaca las capacidades de automatización inteligente de Solar Fluidity
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
          <h2 className="text-3xl font-bold mb-6">Automatizaciones Inteligentes con Agentes IA</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Optimiza tus procesos de negocio con agentes de inteligencia artificial basados en
            LangGraph y Pydantic, capaces de entender y ejecutar instrucciones en lenguaje natural.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-dark border-gray-800">
            <div className="flex gap-4">
              <LayoutList className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Agentes Especializados</h3>
                <p className="text-gray-400 mb-4">
                  Nuestros agentes de IA especializados entienden las necesidades específicas del sector solar y electromecánico para automatizar tareas complejas.
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
                <h3 className="text-xl font-semibold mb-2">Procesamiento de Lenguaje Natural</h3>
                <p className="text-gray-400 mb-4">
                  Interactúa con el sistema mediante instrucciones en lenguaje conversacional, sin necesidad de interfaces complejas.
                </p>
                <ul className="text-gray-400 list-disc list-inside">
                  <li>Comprensión contextual de peticiones</li>
                  <li>Ejecución de acciones complejas</li>
                  <li>Aprendizaje continuo</li>
                  <li>Procesamiento de datos estructurados</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark border-gray-800">
            <div className="flex gap-4">
              <Database className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Integraciones MCP</h3>
                <p className="text-gray-400 mb-4">
                  Conexión estandarizada con servicios externos mediante Model Context Protocol (MCP).
                </p>
                <ul className="text-gray-400 list-disc list-inside">
                  <li>Google Workspace (Gmail, Calendar, Drive)</li>
                  <li>CRMs (HubSpot, Salesforce)</li>
                  <li>Validación de datos con Pydantic</li>
                  <li>Comunicación bidireccional segura</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark border-gray-800">
            <div className="flex gap-4">
              <Cpu className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Ejecución Paralela</h3>
                <p className="text-gray-400 mb-4">
                  Procesamiento simultáneo de tareas mediante grafos de agentes que colaboran entre sí.
                </p>
                <ul className="text-gray-400 list-disc list-inside">
                  <li>Grafos de agentes con LangGraph</li>
                  <li>Sincronización automática entre agentes</li>
                  <li>Escalabilidad con cargas variables</li>
                  <li>Manejo inteligente de errores</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/20 to-blue-900/20 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Caso de Uso: Automatización Inteligente Post-Instalación</h3>
              <p className="text-gray-300 mb-4">
                Después de completar una instalación solar, nuestros agentes IA colaborativos:
              </p>
              <ol className="text-gray-300 list-decimal list-inside space-y-2">
                <li>Generan la factura electrónica validada con Pydantic</li>
                <li>Componen un correo personalizado según perfil del cliente</li>
                <li>Analizan la mejor fecha para seguimiento basado en patrones históricos</li>
                <li>Crean un plan de mantenimiento adaptativo según condiciones climáticas</li>
                <li>Elaboran propuestas personalizadas para referidos usando análisis contextual</li>
              </ol>
            </div>
            <div className="flex-shrink-0">
              <Clock className="w-24 h-24 text-primary" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg font-semibold">
            <Brain className="mr-2 h-5 w-5" />
            Descubre los Agentes IA
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;
