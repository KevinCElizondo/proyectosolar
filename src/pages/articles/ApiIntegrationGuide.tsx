import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import OptimizedImage from '../../components/OptimizedImage';

const codeExamples = {
  authentication: `// Autenticación con Solar Fluidity API
const axios = require('axios');

async function getToken() {
  try {
    const response = await axios.post('https://api.solarfluidity.com/auth/token', {
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET'
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error de autenticación:', error);
    throw error;
  }
}`,
  getInvoices: `// Obtener facturas electrónicas
const axios = require('axios');

async function getInvoices(token, params = {}) {
  try {
    const response = await axios.get('https://api.solarfluidity.com/v1/invoices', {
      headers: {
        'Authorization': \`Bearer \${token}\`
      },
      params: params // filtros opcionales: date_from, date_to, status, etc.
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    throw error;
  }
}`,
  getProjects: `// Obtener proyectos solares
const axios = require('axios');

async function getProjects(token, params = {}) {
  try {
    const response = await axios.get('https://api.solarfluidity.com/v1/projects', {
      headers: {
        'Authorization': \`Bearer \${token}\`
      },
      params: params // filtros opcionales: status, client_id, etc.
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
}`
};

const ApiIntegrationGuide: React.FC = () => {
  return (
    <div className="bg-dark-lighter min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navegación */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-light transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Volver al inicio</span>
          </Link>
        </div>
        
        {/* Encabezado del artículo */}
        <Card className="p-8 mb-8 bg-dark border-gray-800">
          <h1 className="text-3xl font-bold mb-4">API de Solar Fluidity: Integra Tus Sistemas</h1>
          <div className="text-gray-400 mb-6">
            <span className="text-primary">Publicado el 23 de marzo de 2025</span>
            <span className="mx-2">•</span>
            <span>12 minutos de lectura</span>
          </div>
          
          <div className="w-full h-72 overflow-hidden rounded-lg mb-6">
            <OptimizedImage 
              src="/images/api-integration.jpg" 
              alt="Integración de API" 
              className="w-full h-full object-cover"
              width={800}
              height={400}
            />
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="lead text-xl text-gray-300">
              Solar Fluidity ofrece una API completa que permite a las empresas integrar su facturación electrónica y gestión de proyectos solares directamente con sus sistemas existentes. En este artículo, exploraremos cómo conectarse a la API y aprovechar sus capacidades.
            </p>
          </div>
        </Card>
        
        {/* Contenido del artículo */}
        <Card className="p-8 mb-8 bg-dark border-gray-800">
          <div className="prose prose-invert max-w-none">
            <h2>¿Por qué utilizar la API de Solar Fluidity?</h2>
            <p>
              La integración con API permite a su empresa automatizar procesos, sincronizar datos en tiempo real y crear experiencias personalizadas. Algunas ventajas clave incluyen:
            </p>
            
            <ul>
              <li><strong>Automatización de procesos</strong>: Sincronice automáticamente facturas, proyectos y clientes entre sistemas.</li>
              <li><strong>Datos en tiempo real</strong>: Acceda a información actualizada sobre facturación y proyectos directamente desde sus aplicaciones.</li>
              <li><strong>Experiencias personalizadas</strong>: Cree paneles e informes personalizados según las necesidades específicas de su empresa.</li>
              <li><strong>Eficiencia operativa</strong>: Reduzca la entrada manual de datos y los errores humanos al conectar sus sistemas.</li>
            </ul>
            
            <h2>Primeros pasos con la API</h2>
            <p>
              Para comenzar a utilizar la API de Solar Fluidity, siga estos pasos:
            </p>
            
            <h3>1. Solicite sus credenciales de API</h3>
            <p>
              Antes de realizar cualquier solicitud, necesitará obtener sus credenciales de API. Estas credenciales son específicas para su cuenta y deben mantenerse seguras en todo momento.
            </p>
            <p>
              Para obtener sus credenciales, vaya a su panel de control de Solar Fluidity, acceda a la sección "Configuración" y luego a "Integraciones API". Haga clic en "Crear nueva clave API" para generar su Client ID y Client Secret.
            </p>
            
            <h3>2. Autentíquese con la API</h3>
            <p>
              La API de Solar Fluidity utiliza OAuth 2.0 para la autenticación. Debe obtener un token de acceso antes de poder hacer solicitudes a los endpoints protegidos.
            </p>
            
            <div className="bg-black rounded-md p-4 my-6 overflow-auto">
              <pre className="text-gray-300 text-sm">
                <code>{codeExamples.authentication}</code>
              </pre>
            </div>
            
            <p>
              El token de acceso es válido durante 24 horas. Deberá solicitar un nuevo token cuando expire el anterior.
            </p>
            
            <h3>3. Realice solicitudes a la API</h3>
            <p>
              Una vez que tenga su token de acceso, puede comenzar a realizar solicitudes a los diferentes endpoints de la API.
            </p>
            
            <h4>Obtener facturas electrónicas</h4>
            <div className="bg-black rounded-md p-4 my-6 overflow-auto">
              <pre className="text-gray-300 text-sm">
                <code>{codeExamples.getInvoices}</code>
              </pre>
            </div>
            
            <h4>Obtener proyectos solares</h4>
            <div className="bg-black rounded-md p-4 my-6 overflow-auto">
              <pre className="text-gray-300 text-sm">
                <code>{codeExamples.getProjects}</code>
              </pre>
            </div>
            
            <h2>Endpoints disponibles</h2>
            <p>
              La API de Solar Fluidity ofrece una amplia gama de endpoints para acceder y gestionar sus datos:
            </p>
            
            <h3>Facturación electrónica</h3>
            <ul>
              <li><code>GET /v1/invoices</code> - Listar facturas</li>
              <li><code>GET /v1/invoices/{id}</code> - Obtener detalles de una factura específica</li>
              <li><code>GET /v1/invoices/{id}/pdf</code> - Obtener PDF de factura</li>
              <li><code>GET /v1/invoices/{id}/xml</code> - Obtener XML de factura para Hacienda</li>
              <li><code>POST /v1/invoices</code> - Crear nueva factura</li>
              <li><code>PUT /v1/invoices/{id}</code> - Actualizar factura existente</li>
            </ul>
            
            <h3>Proyectos solares</h3>
            <ul>
              <li><code>GET /v1/projects</code> - Listar proyectos</li>
              <li><code>GET /v1/projects/{id}</code> - Obtener detalles de un proyecto específico</li>
              <li><code>GET /v1/projects/{id}/tasks</code> - Listar tareas de un proyecto</li>
              <li><code>POST /v1/projects</code> - Crear nuevo proyecto</li>
              <li><code>PUT /v1/projects/{id}</code> - Actualizar proyecto existente</li>
            </ul>
            
            <h3>Clientes</h3>
            <ul>
              <li><code>GET /v1/clients</code> - Listar clientes</li>
              <li><code>GET /v1/clients/{id}</code> - Obtener detalles de un cliente específico</li>
              <li><code>POST /v1/clients</code> - Crear nuevo cliente</li>
              <li><code>PUT /v1/clients/{id}</code> - Actualizar cliente existente</li>
            </ul>
            
            <h2>Buenas prácticas y limitaciones</h2>
            <p>
              Para garantizar un uso eficiente y seguro de la API, tenga en cuenta las siguientes recomendaciones:
            </p>
            
            <h3>Limitaciones de tasa</h3>
            <p>
              La API de Solar Fluidity tiene límites de tasa para garantizar un rendimiento óptimo para todos los usuarios:
            </p>
            <ul>
              <li>Plan Básico: 100 solicitudes por minuto</li>
              <li>Plan Profesional: 500 solicitudes por minuto</li>
            </ul>
            
            <h3>Seguridad</h3>
            <p>
              Asegúrese de seguir estas prácticas de seguridad:
            </p>
            <ul>
              <li>Nunca comparta sus credenciales de API</li>
              <li>Almacene sus claves de forma segura, preferiblemente en variables de entorno</li>
              <li>Rote sus claves periódicamente</li>
              <li>Use HTTPS para todas las solicitudes</li>
            </ul>
            
            <h3>Manejo de errores</h3>
            <p>
              La API devuelve códigos de estado HTTP estándar junto con mensajes de error descriptivos. Siempre maneje los errores adecuadamente en su aplicación.
            </p>
            
            <h2>Conclusión</h2>
            <p>
              La API de Solar Fluidity proporciona una forma poderosa de integrar la facturación electrónica offline y la gestión de proyectos solares con sus sistemas existentes. Al seguir esta guía, puede comenzar a aprovechar rápidamente estas capacidades para optimizar sus operaciones y mejorar la eficiencia de su empresa.
            </p>
            
            <p>
              Para obtener más información y documentación detallada, visite nuestro <a href="#" className="text-primary hover:text-primary-light">Portal para Desarrolladores</a>.
            </p>
          </div>
        </Card>
        
        {/* Call to Action */}
        <Card className="p-8 bg-dark border-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para integrar sus sistemas?</h2>
          <p className="text-gray-400 mb-6">
            Comience hoy mismo con la API de Solar Fluidity y lleve su facturación electrónica y gestión de proyectos al siguiente nivel.
          </p>
          <Button className="px-6 py-3">Solicitar acceso a la API</Button>
        </Card>
      </div>
    </div>
  );
};

export default ApiIntegrationGuide;
